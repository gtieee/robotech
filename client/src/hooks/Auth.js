import axios from 'axios';
import React from 'react';

const authContext = React.createContext();

function useAuth() {
    const [authed, setAuthed] = React.useState(false);
    const [user, setUser] = React.useState(null);

    return {
        authed,
        user,
        login(user, pass) {
            const response = await axios.post('/login', {email: user, password: pass});
            if (response.data.token == null) {
                setAuthed(false);
                setUser(null);
            } else {
                setAuthed(true);
                setUser(response.data.user);
                localStorage.setItem('token', response.data.token);
            }
        }
    }
}

export function AuthProvide({children}) {
    const auth = useAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export default function AuthConsumer() {
    return React.useContext(authContext);
}