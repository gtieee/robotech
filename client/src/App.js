import logo from './Finalicon2.png';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Link } from "react-router-dom";

function App() {
  return (
    <div className="App container">
      <img src={logo} className="img-fluid col-2"></img>
      <h1 className="pt-2 robotech-color">My Robotech</h1>
      <hr></hr>

      <Link to="/login" class="btn btn-success robotech-bg">Log In</Link>
    </div>
  );
}

export default App;
