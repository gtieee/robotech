import React, { useState } from 'react';
import axios from 'axios';

export const AuthContext = React.createContext({
    user: null,
    authed: false,
    admin: 'wait',
    applied: false,
    rsvp: 'none',
    login: async () => {},
    logout: () => {},
    isAdmin: async () => {},
    isAuthed: async () => {},
    hasApplied: async () => {},
    setApplied: () => {},
    getAppState: async () => {},
    getRSVPState: async () => {},
    setRSVPState: () => {}
})

export function AuthProvider({ children }) {
    var [user, setUser] = useState(null);
    var [authed, setAuthed] = useState(false);
    var [admin, setAdmin] = useState('wait');
    var [applied, setAppliedState] = useState(false);
    var [accepted, setAccepted] = useState(false);
    var [rejected, setRejected] = useState(false);
    var [rsvp, setRSVP] = useState('none');

    const login = async (user, password) => {
        const response = await axios.post('/api/login', {email: user, pass: password});
        if (response.data.token == null) {
            setUser(null);
            setAuthed(false);
            return false
        } else {
            if (response.data.admin) {
                setAdmin('yes');
            }
            else {
                setAdmin('no');
            }
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', response.data.user);
            localStorage.setItem('id', response.data.id);
            setUser(response.data.user);
            setAuthed(true);
            return true;
        }
    }

    const logout = () => {
        setUser(null);
        setAuthed(false);
        setAdmin(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('id');
    }

    const isAuthed = async () => {
        const currToken = localStorage.getItem('token');
        const currUser = localStorage.getItem('user');
        if (!currToken) {
            setUser(null);
            setAuthed(false);
            return false;
        } else {
            try {
                const response = await axios.get('/api/users/checkAuth', {headers: {authorization: currToken}});
                if (response.data.authed) {
                    setUser(currUser);
                    setAuthed(true);
                    return true;
                } else {
                    setUser(null);
                    setAuthed(false);
                    return false;
                }
            } catch (err) {
                setUser(null);
                setAuthed(false);
                return false;
            }
        }
    }

    const isAdmin = async () => {
        const currToken = localStorage.getItem('token');
        const currUser = localStorage.getItem('id');
        if (!currToken) {
            setAdmin('no');
        } else {
            try {
                const response = await axios.post('/api/users/checkAdmin', {token: currToken, id: currUser});
                if (response.data.admin) {
                    setUser(currUser);
                    setAuthed(true);
                    setAdmin('yes');
                    return true;
                } else {
                    setAdmin('no');
                    return false;
                }
            } catch (err) {
                setAdmin('no');
            }
        }
    }
        
    const hasApplied = async () => {
        try {
            const response = await axios.post('/api/users/hasInfo', {token: localStorage.getItem('token'), userId: localStorage.getItem('id')});
            if (response.data.hasInfo) {
                setAppliedState(true);
            } else {
                setAppliedState(false);
            }
        } catch (err) {
            setAppliedState(false);
        }
    }

    const setApplied = () => {
        setAppliedState(true);
    }

    const getAppState = async () => {
        try {
            const response = await axios.post('/api/users/checkAccept', {token: localStorage.getItem('token'), userId: localStorage.getItem('id')});
            if (response.data.accepted) {
                setAccepted(true);
            }
            else if (response.data.rejected) {
                setRejected(true);
            }
        } catch {
            setRejected(false);
            setAccepted(false);
        }
        
    }

    const getRSVPState = async () => {
        try {
            const response = await axios.post('/api/users/getRsvp', {token: localStorage.getItem('token'), userId: localStorage.getItem('id')});
            if (response.data.in_person) {
                setRSVP('in-person');
            } else if (response.data.virtual) {
                setRSVP('virtual');
            } else if (response.data.not_attending) {
                setRSVP('not-attending');
            } else {
                setRSVP('none');
            }
        } catch {
            setRSVP('none');
        }
    }

    const setRSVPState = (state) => {
        switch (state) {
            case 'in-person':
                setRSVP('in-person');
                break;
            case 'virtual':
                setRSVP('virtual');
                break;
            case 'not-attending':
                setRSVP('not-attending');
                break;
            default:
                setRSVP('none');
        }
    }


    var contextValue = {user, authed, admin, applied, accepted, rejected, rsvp, login, logout, isAuthed, isAdmin, hasApplied, setApplied, getAppState, getRSVPState, setRSVPState};

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}