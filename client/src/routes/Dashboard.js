import React from 'react';
import { AuthContext } from '../context/AuthContext';
import InfoCard from '../components/InfoCard';
import { Navigate, Link } from 'react-router-dom';
import Nav from '../components/Nav';
import validator from 'validator';
import axios from 'axios';
import logo from '../FinalLogo.png';
import NavBar from '../components/NavBar';

function getCardText(data) {
  
  if (data) {
    return '' + data;
  }
  else {
    return '' + data;
  }
}

class Dashboard extends React.Component{
  constructor(props) {
    super(props);
    this.state = {registered: 0, applied: 0, accepted: 0, users: [] };
  }
  static contextType = AuthContext;
      async getStats(){
        const currToken = localStorage.getItem('token');
        try{
          const response = await axios.get('/api/users/stats', {headers: {authorization: 'rt-admin'}});
          if (response.data){
            this.setState({registered: response.data.registered, applied: response.data.applied})
          }
          else{
            this.setState({registered: 'No Data', applied: 'No Data'})
          }
        }
        catch (err){
          this.setState({registered: 'Error', applied: 'Error'})
        }
      }  
      async getUsers(){
        try{
          const response = await axios.get('/api/users/', {headers: {authorization: 'rt-admin'}});
          if (response){
            //this.setState({users: 'Success'})
            this.setState({users: response})
          }
          else{
            this.setState({users: 'No Data'})
          }
        }
        catch (err){
          this.setState({users: 'Error'})
        }
      }

      componentDidMount() {
        this.getStats();
        this.getUsers();
      }
  render() {
      return (
        <div className="App container">
          <img src={logo} className="img-fluid col-2"></img>
          <h1 className="pt-2 robotech-color">My Robotech</h1>
          <InfoCard cardTitle='Registered' cardText={getCardText(this.state.registered)} linkTo='Home' linkRoute='/home' /> 
          <InfoCard cardTitle='Applied' cardText={getCardText(this.state.applied)} linkTo='Home' linkRoute='/home' /> 
          <InfoCard cardTitle='Users' cardText={getCardText(this.state.users)} linkTo='Home' linkRoute='/home' /> 
          <hr></hr>
        </div>
      )
    }
}

export default Dashboard;