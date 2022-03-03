import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Routes, Route, Navigate} from "react-router-dom";
import Home from './routes/Home.js';
import Apply from './routes/Apply.js';
import Login from './routes/Login.js';
import Register from './routes/Register.js';
import Coming from './routes/Coming.js';
import Dashboard from './routes/Dashboard.js';
import axios from 'axios';
import { AuthProvider, AuthContext } from './context/AuthContext';

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

          <Route path="/admin" element={<Dashboard />} />
        </Routes>
      </AuthProvider>
    )
}

export default App;
