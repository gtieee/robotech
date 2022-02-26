import React from 'react';
import axios from 'axios';

export const AuthContext = React.createContext({
    user: null,
    authed: false,
    login: () => {},
    logout: () => {},
    isAuthed: () => {}
})

export class AuthProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {user: null, authed: false, login: () => {}, isAuthed: () => {}, logout: () => {},
            isAuthed: async () => {
                const currToken = localStorage.getItem('token');
                const currUser = localStorage.getItem('user');
                if (!currToken) {
                    this.setState({user: null, authed: false});
                } else {
                    try {
                        const response = await axios.get('/api/users/checkAuth', {headers: {authorization: currToken}});
                        if (response.data.authed) {
                            this.setState({user: currUser, authed: true});
                        } else {
                            this.setState({user: null, authed: false});
                        }
                    } catch (err) {
                        this.setState({user: null, authed: false});
                    }
                }
            }     
        };
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    async login(user, password) {
        const response = await axios.post('/api/login', {email: user, pass: password});
        if (response.data.token == null) {
            this.setState({user: null, authed: false});
            return false
        } else {
            this.setState({user: response.data.user, authed: true});
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', response.data.user);
            localStorage.setItem('id', response.data.id);
            return true;
        }
    }

    logout() {
        this.setState({user: null, authed: false});
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('id');
    }

    componentDidMount() {
        this.setState({login: this.login, logout: this.logout});
    }

    render() {
        return <AuthContext.Provider value={this.state}>{this.props.children}</AuthContext.Provider>
    }

}