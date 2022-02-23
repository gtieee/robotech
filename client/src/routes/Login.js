import {React, useState} from 'react';
import {useNavigate}

function LoginForm(props) {
    constructor(props) {
        super(props);
        this.state = {failed: false, emailVal: '', passVal: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        if (event.target.id === 'emailForm') {
            this.setState({emailVal: event.target.value});
        } else {
            this.setState({passVal: event.target.value});
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state);
    }

    render() {
        return (
            <form class="container mt-5" onSubmit={this.handleSubmit}>
                <div>
                    <label className="form-label">Email</label>
                    <input className="form-control mb-2" type="text" name="email" id="emailForm" value={this.state.emailVal} onChange={this.handleChange}/>
                 </div>
                 <div>
                    <label className="form-label">Password</label>
                    <input className="form-control mb-2" type="text" name="pass" id="passForm" value={this.state.passVal} onChange={this.handleChange}/>
                 </div>
                 <button type="submit" class="btn robotech-bg">Submit</button>
            </form>
        )
    }
}

export default LoginForm;