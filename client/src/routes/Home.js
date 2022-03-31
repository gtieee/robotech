import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import InfoCard from '../components/InfoCard';
import Nav from '../components/Nav';
import logo from '../FinalLogo.png';
import { Link } from 'react-router-dom';
import React from 'react';
import { AuthContext } from '../context/AuthContext';

function getCardText(applied, accepted, rejected) {
  if (accepted) {
    return (
      <div>
        <p className="card-text p-2">Congratulations on your acceptance to RoboTech 2022! We hope to see you on April 1st!</p>
        <p className="card-text p-2">In the meantime, make sure to <a href="https://discord.gg/qWVz9ghb">join the discord</a> as well as <Link to="/rsvp">RSVP</Link></p>
      </div>
    )
  }
  if (applied) {
    return <p className="card-text p-2">Thank you submitting your application! Please be patient as we make our admissions decisions.</p>
  }
  else if (true) {
    return <p className="card-text p-2">RoboTech is now accepting applications! Follow the link below to submit your application to participate!</p>
  }
  else if (false) {
    return <p>Applications for RoboTech 2022 are currently closed!</p>
  }
}

function getCardTitle(applied, accepted, rejected) {
  if (accepted) {
    return "Congrats!";
  }
  if (applied) {
    return "Thank You!"
  }
  else if (true) {
    return "Apply Now!"
  }
  else if (false) {
    return "Applications Closed"
  }
}

class Home extends React.Component {
  static contextType = AuthContext;


  async componentDidMount() {
      await this.context.hasApplied();
      await this.context.getAppState();
      await this.context.getRSVPState();
  }

  render() {
    return (
      <div className="App container">
        <img src={logo} className="img-fluid col-2"></img>
        <h1 className="pt-2 robotech-color">My Robotech</h1>
        <hr></hr>
        <Nav />
        <InfoCard cardTitle={getCardTitle(this.context.applied, this.context.accepted, this.context.rejected)} cardText={getCardText(this.context.applied, this.context.accepted, this.context.rejected)} linkRoute='/apply' /> 
        <button type="submit" className="btn robotech-bg mt-3" onClick={this.context.logout}>Logout</button>
      </div>
    )
  }
}

export default Home;