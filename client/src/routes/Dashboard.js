import logo from '../FinalLogo.png';
import UserRow from '../components/UserRow.js'
import React from 'react';
import axios from 'axios';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {registered: 0, applied: 0, accepted: 0, users: []};
    }

    async componentDidMount() {
        try {
            const usersResponse = await axios.post('/api/users', {token: localStorage.getItem('token'), id: localStorage.getItem('id')});
            this.setState({users: usersResponse.data})
        } catch {
            this.setState({users: []});
        }
    }

    render() {
        var userComponents;
        if (!this.state.users) {
            userComponents = <h4>Failed to fetch user data</h4>;
        } else {
            userComponents = this.state.users.map(user => <UserRow user={user} key={user.id}/>)
        }

        return (
            <div>
                <div className="App container">
                    <img src={logo} className="img-fluid col-2"></img>
                    <h1 className="pt-2 robotech-color">Robotech Admin Portal</h1>
                    <hr></hr>
                </div>
                <div className="container">
                    {userComponents}
                </div>            
            </div>
        )
    }
}

export default Dashboard;