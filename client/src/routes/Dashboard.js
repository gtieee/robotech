import logo from '../FinalLogo.png';
import UserRow from '../components/UserRow.js'
import React from 'react';
import axios from 'axios';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {registered: 0, applied: 0, accepted: 0, rsvp: 0, in_person: 0, virtual: 0, searchVal: '', users: []};
        this.handleChange = this.handleChange.bind(this);
    }

    async componentDidMount() {
        try {
            const usersResponse = await axios.post('/api/users', {token: localStorage.getItem('token'), id: localStorage.getItem('id')});
            this.setState({users: usersResponse.data})
            const statsResponse = await axios.post('/api/users/stats', {token: localStorage.getItem('token'), id: localStorage.getItem('id')});
            this.setState({registered: statsResponse.data.registered, applied: statsResponse.data.applied, accepted: statsResponse.data.accepted,
                            rsvp: statsResponse.data.rsvp, in_person: statsResponse.data.in_person, virtual: statsResponse.data.virtual});
        } catch {
            this.setState({users: []});
        }
    }

    handleChange(event) {
        this.setState({searchVal: event.target.value.toLowerCase()});
    }

    render() {
        var filteredUsers = this.state.users.filter(user => {
            if (!this.state.searchVal) {
                return user;
            }
            else {
                return (user.first_name + ' ' + user.last_name).toLowerCase().includes(this.state.searchVal) || (user.email).toLowerCase().includes(this.state.searchVal);
            }
        })

        var userComponents;
        if (!this.state.users) {
            userComponents = <h4>Failed to fetch user data</h4>;
        } else {
            userComponents = filteredUsers.map(user => <UserRow user={user} key={user.id}/>)
        }

        return (
            <div>
                <div className="App container">
                    <img src={logo} className="img-fluid col-2"></img>
                    <h1 className="pt-2 robotech-color">Robotech Admin Portal</h1>
                    <hr/>
                </div>
                <div className="container">
                    <div style={{textAlign: 'center'}}>
                        <h4 className='p-1'>{'Registered: ' + this.state.registered}</h4>
                        <h4 className='p-1'>{'Applied: ' + this.state.applied}</h4>
                        <h4 className='p-1'>{'Accepted: ' + this.state.accepted + '/' + this.state.applied}</h4>
                        <hr/>
                        <h4 className='p-1'>{'RSVPs: ' + this.state.rsvp}</h4>
                        <h4 className='p-1'>{'In Person: ' + this.state.in_person + '/' + this.state.rsvp}</h4>
                        <h4 className='p-1'>{'Virtual: ' + this.state.virtual + '/' + this.state.rsvp}</h4>
                        <div className="mx-auto mb-3" style={{width: '400px'}}>
                            <input type="text" name="search" className="form-control" value={this.state.searchVal} onChange={this.handleChange} placeholder={'Search'}/>
                        </div>
                    </div>
                    {userComponents}
                </div>            
            </div>
        )
    }
}

export default Dashboard;