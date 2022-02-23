import React from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

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
            await this.context.login(this.state.emailVal, this.state.passVal);
        } catch {
            alert('Failed to log in!');
        }
    }

    render() {
        return (
            <form className="container mt-5" onSubmit={this.handleSubmit}>
                <div>
                    <label className="form-label">Email</label>
                    <input className="form-control mb-2" type="text" name="email" id="emailForm" value={this.state.emailVal} onChange={this.handleChange}/>
                 </div>
                 <div>
                    <label className="form-label">Password</label>
                    <input className="form-control mb-2" type="text" name="pass" id="passForm" value={this.state.passVal} onChange={this.handleChange}/>
                 </div>
                 <button type="submit" className="btn robotech-bg">Submit</button>
                 {this.context.authed && <Navigate to="/home" replace />}
            </form>
        )
    }
}

export default LoginForm;