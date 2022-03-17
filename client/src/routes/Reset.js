import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import logo from '../FinalLogo.png';
import validator from 'validator';
import axios from 'axios';

function ResetForm() {
    var [email, setEmail] = useState('');
    var [newPass, setNewPass] = useState('');
    var [confirmPass, setConfirmPass] = useState('');

    var params = useParams();

    const handleChange = (event) => {
        switch (event.target.name) {
            case 'email':
                setEmail(event.target.value);
                break;
            case 'newPass':
                setNewPass(event.target.value);
                break;
            case 'confirmPass':   
                setConfirmPass(event.target.value);
                break;
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!(email && newPass && confirmPass)) {
            alert('Please enter all fields!');
        }
        else if (!validator.isEmail(email)) {
            alert('Please enter a valid email');
        }
        else if (newPass != confirmPass) {
            alert('Passwords must match!');
        }
        else {
            try {
                const response = await axios.post('/api/register/update', {email: email, newPass: newPass, token: params.token});
                alert(response.data.message);
                if (response.data.success) {
                    setEmail('');
                    setNewPass('');
                    setConfirmPass('');
                }
            } catch (err) {
                alert('Failed to reset password!');
            }
        }
    }

    return (
        <div className="App container">
            <img src={logo} className="img-fluid col-2"></img>
            <h1 className="pt-2 robotech-color">Password Reset</h1>
            <hr></hr>
            <div className='row justify-content-center'>
                <form className='col-md-6 col-xl-3'>
                    <label className='form-label'>Email</label>
                    <input className="form-control mb-3" type="text" name="email" value={email} onChange={handleChange} placeholder="Email" required />
                    <label className='form-label'>New Password</label>
                    <input className="form-control mb-3" type="password" name="newPass" value={newPass} onChange={handleChange} placeholder="Password" required />
                    <label className='form-label'>Confirm Password</label>
                    <input className="form-control mb-3" type="password" name="confirmPass" value={confirmPass} onChange={handleChange} placeholder="Confirm Password" required />
                    <button type="submit" class="btn robotech-bg my-3" onClick={handleSubmit}>Submit</button>
                    <br/>
                    <Link to={'/login'} className="btn btn-success robotech-bg">Return to Log In</Link>
                </form>
            </div>
        </div>
    )
}

class Reset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {email: '', newPass: '', confirmPass: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        switch (event.target.name) {
            case 'email':
                this.setState({email: event.target.value});
                break;
            case 'newPass':
                this.setState({newPass: event.target.value});
                break;
            case 'confirmPass':   
                this.setState({confirmPass: event.target.value});
                break;
        }
    }

    async handleSubmit() {
        try {
            const response = await axios.post('/api/register/update', {email: this.state.email, token: 'test'})
            alert(response.data.message)
        } catch (err) {
            alert('Failed to reset password!');
        }
    }

    render() {
        return (
            <div className="App container">
                <img src={logo} className="img-fluid col-2"></img>
                <h1 className="pt-2 robotech-color">Password Reset</h1>
                <hr></hr>
                <div className='row justify-content-center'>
                    <form className='col-md-6 col-xl-3'>
                        <label className='form-label'>Email</label>
                        <input className="form-control mb-3" type="text" name="email" value={this.state.email} onChange={this.handleChange} placeholder="Email" required />
                        <label className='form-label'>New Password</label>
                        <input className="form-control mb-3" type="text" name="newPass" value={this.state.newPass} onChange={this.handleChange} placeholder="Password" required />
                        <label className='form-label'>Confirm Password</label>
                        <input className="form-control mb-3" type="text" name="confirmPass" value={this.state.confirmPass} onChange={this.handleChange} placeholder="Confirm Password" required />
                        <button type="submit" class="btn robotech-bg my-3" onClick={this.handleSubmit} >Submit</button>
                    </form>
                    
                </div>
            </div>
        )
    }
}

export default ResetForm;