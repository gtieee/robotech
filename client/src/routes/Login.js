import React from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import logo from '../FinalLogo.png';
import NavBar from '../components/NavBar';

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
        } catch (err) {
            console.log(err)
            alert('Incorrect login information!');
        }
    }

    render() {
        var next;
        if (this.context.admin === 'yes') {
            next = <Navigate to="/admin" replace />;
        } else if (this.context.authed) {
            next = <Navigate to="/home" replace />;
        }

        return (
            <div>
            <NavBar/>
            <div className="app-container container mt-5 w-75-m h-100 align-items-center" >
                <div className = "row">
                    <div className="col-xs-12 col-md-6">
                        <h1 className="pt-2 robotech-color">LOG IN</h1>

                        <form onSubmit={this.handleSubmit}>
                            <div>
                                <label className="form-label">Email</label>
                                <input className="form-rt form-control mb-2" type="text" name="email" id="emailForm" placeholder="Enter Username" value={this.state.emailVal} onChange={this.handleChange}/>
                            </div>
                            <div>
                                <label className="form-label">Password</label>
                                <input className="form-rt form-control mb-2" type="password" name="pass" id="passForm" placeholder="Enter Password" value={this.state.passVal} onChange={this.handleChange}/>
                            </div>
                        <p className="p-rt">
                            No Account ? <Link to='/register' className="link">Register</Link>
                        </p>
                        <p className="p-rt">
                            Forgot Password ? <Link to='/reset' className="link">Reset</Link>
                        </p>
                        <button type="submit" className="button-rt btn robotech-bg">LOGIN</button>
                            {next}
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

export default LoginForm;