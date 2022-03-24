import React from "react";
import logo from '../FinalLogo.png';
import Nav from '../components/Nav';
import InfoCard from "../components/InfoCard";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";

function getHeaderText(rsvpState) {
  switch (rsvpState) {
    case 'in-person':
      return 'In Person';
    case 'virtual':
      return 'Virtual';
    case 'not-attending':
      return 'Will not attend';
    case 'wait':
      return 'None';
    default:
      return 'None';
  }
}

class RSVP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {in_person: false, virtual: false, not_attending: false};
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static contextType = AuthContext

  handleClick(event) {
    switch (event.target.name) {
      case 'in-person':
        this.setState((currState) => ({in_person: !currState.in_person}));
        break;
      case 'virtual':
        this.setState((currState) => ({virtual: !currState.virtual}));
        break;
      case 'not-attending':
        this.setState((currState) => ({not_attending: !currState.not_attending}));
        break;
      default:
        break;
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    if (!(this.state.in_person || this.state.virtual || this.state.not_attending)) {
      alert('Please select an option!');
      return;
    }
    if ((this.state.in_person + this.state.virtual + this.state.not_attending) > 1) {
      alert('Please select only one option!');
      return;
    }
    try {
      await axios.post('/api/users/rsvp', {token: localStorage.getItem('token'), userId: localStorage.getItem('id'),
                                          in_person: this.state.in_person, virtual: this.state.virtual, not_attending: this.state.not_attending});
      if (this.state.in_person) {
        this.context.setRSVPState('in-person');
      }
      else if (this.state.virtual) {
        this.context.setRSVPState('virtual');
      }
      else if (this.state.not_attending) {
        this.context.setRSVPState('not-attending');
      }
      alert('Thank you for sending your RSVP!');
    } catch (err) {
      alert('Failed to record your RSVP! Please try again later!');
    }
  }

  async componentDidMount() {
    if (!this.context.applied) {
      this.context.hasApplied();
    }
    if (!this.context.accepted) {
        this.context.isAccepted();
    }
    if (this.context.rsvpState === 'none') {
        this.context.getRSVPState();
    }
  }

  render() {
    return (
      <div className='App container'>
        <img src={logo} alt={'Logo'} className="img-fluid col-2"></img>
        <h1 className="pt-2 robotech-color">My Robotech</h1>
        <hr></hr>
        <Nav />
        {!this.context.applied &&
          <div className="container App">
            <InfoCard cardTitle='Application Closed!' cardText='Applications for RoboTech 2022 are currently closed!' linkTo='Home' linkRoute='/home' /> 
          </div>
        }

        {this.context.applied && !this.context.accepted &&
          <div className="container App">
            <InfoCard cardTitle='Thank You!' cardText='Thank you submitting your application! Please be patient as we make our admissions decisions.' linkTo='Home' linkRoute='/home' /> 
          </div>
        }

        {this.context.applied && this.context.accepted &&
          <div>
            <h2 className='mb-3'>{'Your RSVP: ' + getHeaderText(this.context.rsvp)}</h2>
            <form>
              <div className="form-check mb-4 p-1">
                  <div>
                    <h5 className="form-check-label ">
                        I will attend RoboTech in person
                    </h5>
                  </div>
                    <input type="checkbox" value="" name="in-person" checked={this.state.in_person} onChange={this.handleClick}/>
              </div>
              <div class="form-check mb-4 p-1">
                  <div>
                    <h5 class="form-check-label ">
                        I will attend RoboTech virtually
                    </h5>
                  </div>
                    <input className="" type="checkbox" value="" name="virtual" checked={this.state.virtual} onChange={this.handleClick}/>
              </div>
              <div class="form-check mb-3 p-1">
                  <div>
                    <h5 class="form-check-label ">
                        I will not be attending RoboTech this year
                    </h5>
                  </div>
                    <input className="" type="checkbox" value="" name="not-attending" checked={this.state.not_attending} onChange={this.handleClick}/>
              </div>
              <button type="submit" class="btn robotech-bg mb-3" onClick={this.handleSubmit} >Submit</button>
            </form>
            <Link to={'/home'} className="btn btn-success robotech-bg mt-1 mb-5">Home</Link>
          </div>
        }
      </div>
    ) 
  }
}

export default RSVP;