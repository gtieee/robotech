import logo from '../FinalLogo.png';
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

function AdminHome() {
    var auth = useContext(AuthContext);
    return (
        <div className="App container">
            <img src={logo} className="img-fluid col-2"></img>
            <h1 className="pt-2 robotech-color">Robotech Admin Portal</h1>
            <hr></hr>
            <Link to={'/admin'} className="btn robotech-bg mt-4">Admin Dashboard</Link>
            <br/>
            <Link to={'/volunteer'} className="btn robotech-bg mt-4">Volunteer Dashboard</Link>
            <br />
            <Link to={'/home'} className="btn robotech-bg mt-4">Participant Home</Link>
            <br />
            <button type="submit" className="btn robotech-bg mt-4" onClick={auth.logout}>Logout</button>
        </div>
    )
}

export default AdminHome;


