import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Routes, Route, Navigate} from "react-router-dom";
import Home from './routes/Home.js';
import Apply from './routes/Apply.js';
import Login from './routes/Login.js';
import Register from './routes/Register.js';
import Coming from './routes/Coming.js';
import Profile from './routes/Profile.js';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';

function RequireAuth({children}) {
  return <AuthContext.Consumer>
    {({authed, isAuthed}) => {
      if (!authed) {
        isAuthed();
      }
      if (!authed) {
        return <Navigate to="/login" replace />
      } else {
        return children;
      }
    }}
  </AuthContext.Consumer>
}

function RequireAdmin({children}) {
  let auth = useContext(AuthContext);
  let adminState;
  if (!auth.admin) {
    adminState = auth.isAdmin();
  }
  console.log(auth);
  if (!(auth.admin || adminState)) {
    return <Navigate to='/home' replace />
  } else {
    return children;
  }
}

function App() {
    return (
      <AuthProvider>
        <Routes> 
          <Route path="/" element={
            <RequireAuth>
              <Home />
            </RequireAuth>} />

          <Route path="/home" element={
            <RequireAuth>
              <Home /> 
            </RequireAuth>} />

          <Route path="/apply" element={
            <RequireAuth>
              <Apply /> 
            </RequireAuth>} />

          <Route path="/team" element={
            <RequireAuth>
              <Coming /> 
            </RequireAuth>} />

          <Route path="/events" element={
            <RequireAuth>
              <Coming /> 
            </RequireAuth>} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/admin">
            <Route path=":userId" element={
              <RequireAdmin>
                <Profile />
              </RequireAdmin> } />  
          </Route>
        </Routes>
      </AuthProvider>
    )
}

export default App;
