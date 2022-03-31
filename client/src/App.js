import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Routes, Route, Navigate} from "react-router-dom";
import Home from './routes/Home';
import Apply from './routes/Apply';
import Login from './routes/Login';
import Register from './routes/Register';
import Coming from './routes/Coming';
import Profile from './routes/Profile'
import Dashboard from './routes/Dashboard';
import RequestReset from './routes/RequestReset';
import ResetForm from './routes/Reset';
import RSVP from './routes/RSVP';
import CheckIn from './routes/CheckIn';
import CheckInUser from './routes/CheckInUser';
import CheckInTab from './routes/CheckInTab';
import AdminHome from './routes/AdminHome';
import Events from './routes/Events';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './context/RequireAuth';
import RequireAdmin from './context/RequireAdmin';
import RequireVolunteer from './context/RequireVolunteer';

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
              </RequireAuth>}/>

            <Route path="/apply" element={
              <RequireAuth>
                <Apply /> 
              </RequireAuth>} />

            <Route path="/team" element={
              <RequireAuth>
                <Coming /> 
              </RequireAuth>} />

              <Route path="/rsvp" element={
              <RequireAuth>
                <RSVP /> 
              </RequireAuth>} />

              <Route path="/checkInTab" element={
                <RequireAuth>
                  <CheckInTab />
                </RequireAuth>} />

            <Route path="/events" element={
              <RequireAuth>
                <Events /> 
              </RequireAuth>} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />
            
            <Route path="/reset" >
              <Route index element={<RequestReset />} />
              <Route path=":token" element={<ResetForm />} />
            </Route> 

            <Route path="/volunteer">
              <Route index element={
                <RequireVolunteer>
                  <CheckIn />
                </RequireVolunteer> }>
              </Route>
              
              <Route path=":userId" element={
                <RequireVolunteer>
                  <CheckInUser/>
                </RequireVolunteer> }>  
              </Route>    
            </Route>       

            <Route path="/adminHome" element={
              <RequireAdmin>
                  <AdminHome /> 
              </RequireAdmin>} />

            <Route path="/admin">
              <Route index element={
                <RequireAdmin>
                  <Dashboard />
                </RequireAdmin> }>
              </Route>
              
              <Route path=":userId" element={
                <RequireAdmin>
                  <Profile />
                </RequireAdmin> }>  
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
    )
}

export default App;
