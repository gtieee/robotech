import React from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import validator from 'validator';
import axios from 'axios';
import logo from '../FinalLogo.png';
import NavBar from '../components/NavBar';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {first: '', last: '', email: '', pass: '', confirm: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    static contextType = AuthContext;

    handleChange(event) {
        switch (event.target.name) {
            case 'first':
                this.setState({first: event.target.value});
                break;
            case 'last':
                this.setState({last: event.target.value});
                break;
            case 'email':
                this.setState({email: event.target.value});
                break;
            case 'pass':
                this.setState({pass: event.target.value})
                break;
            case 'confirm':
                this.setState({confirm: event.target.value});
                break;
            default:
                break;
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        try {
            if (!(this.state.first && this.state.last && this.state.email && this.state.pass && this.state.confirm)) {
                alert('Please enter all fields!');
            }
            else if (!validator.isEmail(this.state.email)) {
                alert('Please enter a valid email!');
            }
            else if (this.state.pass != this.state.confirm) {
                alert('Passwords do not match!');
            }
            else {
                const register = await axios.post('/api/register/new', this.state);
                if (!register.data.result) {
                    alert('An account is already associated with this email');
                }
                else {
                    await this.context.login(this.state.email, this.state.pass);
                }
            }
        } catch {
            alert('Failed to register!');
        }
    }

    render() {
        return (
            <div>
                <NavBar/>
                <div className="app-container container mt-5 w-75-m h-100 align-items-center" >
                    <div className = "row">
                        <div className="col-xs-12 col-md-6">
                            <h1 className="pt-2 robotech-color">REGISTER</h1>
                            <form onSubmit={this.handleSubmit}>
                                <label className="form-label">Name</label>
                                <div className="row mb-2">
                                    <div className='col'>
                                        <input type='text' name='first' placeholder="First Name" className="form-rt form-control" value={this.state.first} onChange={this.handleChange}/>
                                    </div>
                                    <div className='col'>
                                        <input type='text' name='last' placeholder="Last Name" className="form-rt form-control" value={this.state.last} onChange={this.handleChange}/>
                                    </div>
                                </div>
                                <div>
                                    <label className="form-label">Email</label>
                                    <input className="form-rt form-control mb-2" type="text" name="email" placeholder="Email" value={this.state.email} onChange={this.handleChange}/>
                                </div>
                                <div>
                                    <label className="form-label">Password</label>
                                    <input className="form-rt form-control mb-2" type="password" name="pass" placeholder="Password" value={this.state.pass} onChange={this.handleChange}/>
                                </div>
                                <div>
                                    <label className="form-label">Confirm Password</label>
                                    <input className="form-rt form-control mb-2" type="password" name="confirm" placeholder="Password" value={this.state.confirm} onChange={this.handleChange}/>
                                </div>
                                <p className="p-rt">
                                    Already Registered ? <Link to='/login' className="link">Login</Link>
                                </p>
                                <button type="submit" className="button-rt btn robotech-bg">REGISTER</button>
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

export default Register;