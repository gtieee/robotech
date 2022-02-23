import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import InfoCard from '../components/InfoCard';
import Nav from '../components/Nav';
import logo from '../Finalicon2.png';
import {AuthContext} from '../context/AuthContext.js';

function getCardText(applied) {
  if (applied) {
    return "Thank you submitting your application! Please be patient as we make our admissions decisions.";
  }
  else {
    return "RoboTech is now accepting applications! Follow the link below to submit your application to participate!";
  }
}

function getCardTitle(applied) {
  return applied ? "Thank you!" : "Apply Now!";
}

function Home() {
  return (
    <div className="App container">
      <img src={logo} className="img-fluid col-2"></img>
      <h1 className="pt-2 robotech-color">My Robotech</h1>
      <hr></hr>

      <Nav />

      <InfoCard cardTitle={getCardTitle(false)} cardText={getCardText(false)} />

      <AuthContext.Consumer>
        {({logout}) => (
          <button type="submit" className="btn robotech-bg" onClick={logout}>Logout</button>
        )}
      </AuthContext.Consumer>
      
    </div>
  );
}

export default Home;