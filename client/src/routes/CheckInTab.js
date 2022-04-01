import React from "react";
import { AuthContext } from "../context/AuthContext";
import logo from '../FinalLogo.png';
import Nav from '../components/Nav';
import { Link } from "react-router-dom";
import QRCode from 'react-qr-code';
import axios from "axios";

class CheckInTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {checkedIn: false, firstName: '', lastName: '', fetched: false};
        this.virtualCheckIn = this.virtualCheckIn.bind(this);
    }

     static contextType = AuthContext;

     async componentDidMount() {
         if (this.context.rsvp === 'none') {
             await this.context.getRSVPState();
         }
         const checkInResponse = await axios.post('/api/users/checkedIn', {userId: localStorage.getItem('id'), token: localStorage.getItem('token')});
         const nameResponse = await axios.post('/api/users/name', {userId: localStorage.getItem('id'), token: localStorage.getItem('token')});
         this.setState({checkedIn: checkInResponse.data.checkedIn, firstName: nameResponse.data.first, lastName: nameResponse.data.last, fetched: true});
     }

     async virtualCheckIn() {
        try {
            await axios.post('/api/users/checkIn', {userId: localStorage.getItem('id'), token: localStorage.getItem('token'), virtual: true});
            this.setState({checkedIn: true});
            alert('Checked In!');
        } catch {
            alert('Something went wrong!');
        }
     }

     render() {
         var checkInElement = null;
         if (this.state.fetched && this.context.rsvp === 'in-person') {
            checkInElement = <QRCode value={"hack.gt-robotech.com/volunteer/" + localStorage.getItem('id') + '?first=' + this.state.firstName + '&last=' + this.state.lastName} />;
         }
         else if (this.state.fetched && this.context.rsvp === 'virtual') {
             checkInElement = <button type="submit" className="btn robotech-bg mt-3" onClick={this.virtualCheckIn}>Check In</button>
         }

         return (
            <div className="App container">
                <img src={logo} className="img-fluid col-2"></img>
                <h1 className="pt-2 robotech-color">My Robotech</h1>
                <hr></hr>
                <Nav />
                {this.state.fetched && (
                    <div>
                        <h1>{this.state.firstName + ' ' + this.state.lastName}</h1>
                        <h2>{'Checked In: ' + (this.state.checkedIn ? 'Yes' : 'No')}</h2>
                        <div>
                            {checkInElement}
                        </div>
                    </div>
                )}
                

                <Link to={'/home'} className="btn robotech-bg my-4">Home</Link>
            </div>
         )
     }
}

export default CheckInTab;