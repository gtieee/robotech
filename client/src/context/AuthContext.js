import React from 'react';
import axios from 'axios';

export const AuthContext = React.createContext({
    user: null,
    authed: false,
    login: () => {},
    logout: () => {}
})

export class AuthProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {user: null, authed: false, login: () => {}};
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    async login(user, password) {
        const response = await axios.post('/login', {email: user, pass: password});
        if (response.data.token == null) {
            this.setState({user: null, authed: false});
            return false
        } else {
            this.setState({user: response.data.user, authed: true});
            localStorage.setItem('token', response.data.token);
            return true;
        }
    }

    logout() {
        this.setState({user: null, authed: false});
        localStorage.removeItem('token');
    }

    componentDidMount() {
        this.setState({login: this.login, logout: this.logout});
    }

    render() {
        return <AuthContext.Provider value={this.state}>{this.props.children}</AuthContext.Provider>
    }

}