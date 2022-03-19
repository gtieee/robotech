import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import logo from '../FinalLogo.png';
import validator from 'validator';
import NavBar from '../components/NavBar';
import axios from 'axios';

class RequestReset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {failed: false, emailVal: '', confirmVal: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        if (event.target.id === 'emailForm') {
            this.setState({emailVal: event.target.value});
        } else {
            this.setState({confirmVal: event.target.value});
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        const toEmail = this.state.emailVal
        if (!validator.isEmail(this.state.emailVal)) {
            alert('Please enter a valid email!');
        }
        else if (!(this.state.emailVal && this.state.confirmVal)) {
            alert('Please enter all fields!');
        }
        else if (this.state.emailVal != this.state.confirmVal) {
            alert('Emails must match!');
        }
        else {
            try {
                const check = await axios.post('/api/users/exists', {email: toEmail});
                if (!check.data.exists) {
                    alert('Could not find a user with this email!');
                    return;
                }
            }
            catch {
                alert('Could not find a user with this email!');
                return;
            }
            try {
                const response = await axios.post('/api/register/requestUpdate', {email: toEmail});
                if (response.data.success) {
                    alert('A password reset has been sent to ' + toEmail +
                    '. If you cannot find the email, please make sure to check your spam folder');
                }
                else {
                    alert('Error sending password reset!');
                }
            }
            catch {
                alert('Error sending password reset!');
            }      
        }   
    }

    render() {
        return (
            <div>
            <NavBar/>
            <div className="app-container container mt-5 w-75-m h-100 align-items-center" >
                <div className = "row">
                    <div className="col-xs-12 col-md-6">
                        <h1 className="pt-2 robotech-color">RESET PASSWORD</h1>

                        <form onSubmit={this.handleSubmit}>
                            <div>
                                <label className="form-label">Email</label>
                                <input className="form-rt form-control mb-2" type="text" name="email" id="emailForm" placeholder="Enter Email" value={this.state.emailVal} onChange={this.handleChange}/>
                            </div>
                            <div>
                                <label className="form-label">Confirm Email</label>
                                <input className="form-rt form-control mb-2" type="text" name="confirm" id="confirmForm" placeholder="Confirm Email" value={this.state.passVal} onChange={this.handleChange}/>
                            </div>
                        <p className="p-rt">
                           <Link to='/login' className="link">Return to Log In</Link>
                        </p>
                        <button type="submit" className="button-rt btn robotech-bg">SEND</button>
                            {this.context.authed && <Navigate to="/home" replace />}
                        </form>
                    </div>
                    <div className="col-xs-12 col-md-6 App">
                        <img src={logo} className="floating img-fluid col-2"></img>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}

export default RequestReset;