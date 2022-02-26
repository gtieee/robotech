import React from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import logo from '../Finalicon2.png';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {failed: false, emailVal: '', passVal: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    static contextType = AuthContext;

    handleChange(event) {
        if (event.target.id === 'emailForm') {
            this.setState({emailVal: event.target.value});
        } else {
            this.setState({passVal: event.target.value});
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        try {
            if (!(this.state.emailVal && this.state.passVal)) {
                alert('Please enter all fields!');
                return;
            }
            await this.context.login(this.state.emailVal, this.state.passVal);
        } catch {
            alert('Incorrect login information!');
        }
    }

    render() {
        return (
            <div className="container mt-5 w-75-m h-100 align-items-center" >
                <div className="App container">
                    <img src={logo} className="img-fluid col-2"></img>
                    <h1 className="pt-2 robotech-color">Log In</h1>
                    <hr></hr>
                </div>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <label className="form-label">Email</label>
                        <input className="form-control mb-2" type="text" name="email" id="emailForm" value={this.state.emailVal} onChange={this.handleChange}/>
                    </div>
                    <div>
                        <label className="form-label">Password</label>
                        <input className="form-control mb-2" type="password" name="pass" id="passForm" value={this.state.passVal} onChange={this.handleChange}/>
                    </div>
                    <button type="submit" className="btn robotech-bg">Submit</button>
                    {this.context.authed && <Navigate to="/home" replace />}
                </form>
                <Link to='/register' className="btn btn-success robotech-bg mt-3">Register</Link>
            </div>
        )
    }
}

export default LoginForm;