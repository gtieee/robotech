import React from "react";
import logo from '../FinalLogo.png';
import { Link } from 'react-router-dom'
import axios from "axios";

class CheckIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {searchVal: '', users: []};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({searchVal: event.target.value.toLowerCase()});
    }

    async componentDidMount() {
        try {
            const data = await axios.post('/api/users/rsvpUsers', {token: localStorage.getItem('token'), id: localStorage.getItem('id')});
            this.setState({users: data.data});
        } catch {
            this.setState({users: []});
        }
    }


    render() {
        var filteredUsers = this.state.users.filter(user => {
            if (!this.state.searchVal) {
                return user;
            }
            else {
                return (user.first_name + ' ' + user.last_name).toLowerCase().includes(this.state.searchVal);
            }
        })

        if (!this.state.users) {
            var userComponents = <h4>Failed to fetch user data</h4>;
        } else {
            var userComponents = filteredUsers.map(user => <Participant user={user} key={user.id}/>)
        }

        return (
            <div className="App container">
                <img src={logo} className="img-fluid col-2"></img>
                <h1 className="pt-2 robotech-color">Robotech Volunteer Portal</h1>
                <hr></hr>
                <div class="row align-items-center">
                    <div className="mx-auto mb-3" style={{width: '400px'}}>
                        <input type="text" name="search" className="form-control" value={this.state.searchVal} onChange={this.handleChange} placeholder={'Search'}/>
                    </div>
                </div>
                {userComponents}
            </div>
        )
    }
}

function Participant(props) {
    return (
        <div className="row my-2 w-75 mx-auto" style={{backgroundColor: "#EAEAEA", borderRadius: "5px"}}>
            <div className="col-12 text-center">
                <Link to={'/volunteer/' + props.user.id + '?first=' + props.user.first_name + '&last=' + props.user.last_name} className='nav-link' style={{color: 'black'}}>{props.user.first_name + ' ' + props.user.last_name + 
                ' - ' + ((props.user.checkin || props.user.checkin_virtual) ? 'Yes' : 'No')}</Link>
            </div>
        </div>
    )
}



export default CheckIn;