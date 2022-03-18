import React, { useState } from 'react';
import axios from 'axios';

export const AuthContext = React.createContext({
    user: null,
    authed: false,
    admin: 'wait',
    applied: false,
    login: async () => {},
    logout: () => {},
    isAdmin: async () => {},
    isAuthed: async () => {},
    hasApplied: async () => {},
    getSelection: async () => {}
})

export function AuthProvider({ children }) {
    var [user, setUser] = useState(null);
    var [authed, setAuthed] = useState(false);
    var [admin, setAdmin] = useState('wait');
    var [applied, setAppliedState] = useState(false);
    var [accepted, setAccepted] = useState(false);
    var [rejected, setRejected] = useState(false);

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

    }


    var contextValue = {user, authed, admin, applied, accepted, rejected, login, logout, isAuthed, isAdmin, hasApplied, setApplied, getAppState};

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}