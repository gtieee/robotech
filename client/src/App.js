import logo from './Finalicon2.png';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import InfoCard from './components/InfoCard';
import Nav from './components/Nav';

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

function App() {
  return (
    <div className="App container">
      <img src={logo} className="img-fluid col-2"></img>
      <h1 className="pt-2 robotech-color">My Robotech</h1>
      <hr></hr>

      <Nav />

      <InfoCard cardTitle={getCardTitle(false)} cardText={getCardText(false)} />
    </div>
  );
}

export default App;
