import React from "react";
import logo from '../FinalLogo.png';
import InfoCard from '../components/InfoCard';
import Nav from '../components/Nav'
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";
import { Link } from 'react-router-dom';

class Apply extends React.Component {
  constructor(props) {
    super(props);
    this.state = {first: '', last: '', age: '', school: '', other: '', diet: false, restrictions: '', design: false, mech: false, elec: false, soft: false, skills: '', interest: '', mlh: false, error: false};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
  }

  static contextType = AuthContext;

  async componentDidMount() {
    if (!this.context.applied) {
      this.context.hasApplied();
    }
  }

  handleChange(event) {
    switch(event.target.name) {
      case 'first':
        this.setState({first: event.target.value});
        break;
      case 'last':
        this.setState({last: event.target.value});
        break;
      case 'age':
        this.setState({age: event.target.value});
        break;
      case 'school':
        this.setState({school: event.target.value});
        break;
      case 'other':
        this.setState({other: event.target.value});
        break;
      case 'dietNo':
        this.setState({diet: false});
        break;
      case 'dietYes':
        this.setState({diet: true});
        break;
      case 'restrictions':
        this.setState({restrictions: event.target.value});
        break;
      case 'interest':
        this.setState({interest: event.target.value});
        break;
      case 'design':
        this.setState(currState => ({design: !currState.design}));
        break;
      case 'mech':
          this.setState(currState => ({mech: !currState.mech}));
          break;
      case 'elec':
        this.setState(currState => ({elec: !currState.elec}));
        break;
      case 'soft':
          this.setState(currState => ({soft: !currState.soft}));
          break;
      case 'skills':
        this.setState({skills: event.target.value})
        break;
      case 'mlh':
        this.setState(currState => ({mlh: !currState.mlh}));
        break;
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    if (!(this.state.first && this.state.last && this.state.age && this.state.school && this.state.skills && this.state.mlh 
      && this.state.interest && (this.state.design || this.state.mech || this.state.elec || this.state.soft || this.fileInput.current.files[0]))) {
      alert("Please complete all fields!");
    } else if (this.fileInput.current.files[0].type != 'application/pdf') {
      alert('Please submit resume as a pdf file!');
    } else {
        const userInfo = {token: localStorage.getItem('token'), userId: localStorage.getItem('id')};
        const data = {...this.state, ...userInfo};
        try {
          await axios.post('/api/apply/info', data);
        } catch {
          alert('Failed to submit application, please try again later!');
        }
        try {
          const data = new FormData();
          data.append('file', this.fileInput.current.files[0]);
          data.append('userId', localStorage.getItem('id'));
          data.append('first', this.state.first);
          data.append('last', this.state.last);
          const res = await axios.post('/api/apply/resume', data, {headers: 
          {
              'Content-Type': 'multipart/form-data',
              'Authorization': localStorage.getItem('token')
          }});
          this.context.setApplied({info: true});
        } catch (err) {
          alert('Failed to submit resume, please try again later');
        }
    }
  }

  render() {

    const acceptedElement = (
      <div>
        <p className="card-text p-2">Congratulations on your acceptance to RoboTech 2022! We hope to see you on April 1st!</p>
        <p className="card-text p-2">In the meantime, make sure to <a href="https://discord.gg/qWVz9ghb">join the discord</a> as well as <Link to="/rsvp">RSVP</Link></p>
      </div>
    )

    return (
      <div className="container">
        <div className="App container">
          <img src={logo} className="img-fluid col-2"></img>
          <h1 className="pt-2 robotech-color">RoboTech Application</h1>
          <hr></hr>
        </div>
        {this.state.error && 
        <h4>Failed to communicate with server, please try again later!</h4>}

        {!this.state.error && !this.context.applied &&
        <div className="container w-75">
          <form>
            <label className="form-label">First Name</label>
            <input className="form-control mb-2" type="text" name="first" value={this.state.first} onChange={this.handleChange} required/>
            <label className="form-label">Last Name</label>
            <input className="form-control mb-2" type="text" name="last" value={this.state.last} onChange={this.handleChange} required/>
            <label className="form-label">Age</label>
            <input className="form-control mb-2" type="number" name="age" value={this.state.age} onChange={this.handleChange} required/>
            <label className="form-label">{'What school do you currently attend?'}</label>
            <select className="form-select mb-2" aria-label="school" name="school" onChange={this.handleChange}>
              <option selected>School</option>
              <option value="Georgia Tech">Georgia Tech</option>
              <option value="Georgia State">Georgia State</option>
              <option value="Kennesaw State">Kennesaw State</option>
              <option value="Emory">Emory</option>
              <option value="University of Georgia">University of Georgia</option>
              <option value="Other">Other</option>
            </select>
            {(this.state.school == 'Other') && 
              <div>
                <label className="form-label">School</label>
                <input className="form-control mb-2" type="text" name="other" value={this.state.other} onChange={this.handleChange} required/>
              </div>
            }
            <label className="form-label mt-2">{'Do you have any dietary restrictions?'}</label>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" name="dietNo" checked={!this.state.diet} onChange={this.handleChange}/>
              <label class="form-check-label">
                No
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" name="dietYes" checked={this.state.diet} onChange={this.handleChange}/>
              <label class="form-check-label mb-2">
                Yes
              </label>
            </div>
            {this.state.diet && 
              <div>
                <label className="form-label">Restrictions:</label>
                <input className="form-control mb-2" type="text" name="restrictions" value={this.state.restrictions} onChange={this.handleChange} required/>
              </div>
            }
            <label className="form-label mt-2">{'Why are you interested in attending RoboTech?'}</label>
            <textarea className="form-control mb-2" rows="3" name="interest" value={this.state.interest} onChange={this.handleChange} required/>
            <label className="form-label mt-2">{'Which competition tracks are you interested in?'}</label>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" name="design" checked={this.state.design} onChange={this.handleChange}/>
              <label class="form-check-label">
                Design
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" name="mech" checked={this.state.mech} onChange={this.handleChange}/>
              <label class="form-check-label ">
                Robot Body
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" name="elec" checked={this.state.elec} onChange={this.handleChange}/>
              <label class="form-check-label">
                Electrical
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" name="soft" checked={this.state.soft} onChange={this.handleChange}/>
              <label class="form-check-label mb-2">
                Software
              </label>
            </div>
            <label className="form-label mt-2">{'What skills do you have in these areas?'}</label>
            <textarea className="form-control mb-2" rows="3" name="skills" value={this.state.skills} onChange={this.handleChange} required/>
            <div>
              <label htmlFor="formFile" class="form-label">Please submit your resume (pdf)</label>
              <input class="form-control mb-2" type="file" name="formFile" ref={this.fileInput}/>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" name="mlh" checked={this.state.mlh} onChange={this.handleChange}/>
              <label class="form-check-label mb-2">
                I agree to the <a href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf">MLH Code of Conduct</a>
              </label>
            </div>
            <button type="submit" class="btn robotech-bg my-3" onClick={this.handleSubmit} >Submit</button>
          </form>
        </div>}

        {!this.state.error && this.context.applied && !this.context.accepted && 
          <div className="container App">
            <Nav />
            <InfoCard cardTitle='Thank You!' cardText='Thank you submitting your application! Please be patient as we make our admissions decisions.' linkTo='Home' linkRoute='/home' /> 
          </div>
        }

        {!this.state.error && this.context.applied && this.context.accepted && 
          <div className="container App">
            <Nav />
            <InfoCard cardTitle='Congrats!' cardText={acceptedElement} linkTo='Home' linkRoute='/home' /> 
          </div>
        }
      </div>

    )
  }
}

export default Apply;