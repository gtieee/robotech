import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Routes, Route, Navigate} from "react-router-dom";
import Home from './routes/Home.js';
import Apply from './routes/Apply.js';
import Login from './routes/Login.js';
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

          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    )
}

export default App;
