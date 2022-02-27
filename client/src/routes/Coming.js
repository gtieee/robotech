import InfoCard from '../components/InfoCard';
import logo from '../FinalLogo.png';

function Coming() {
    return (
        <div className="App container">
            <img src={logo} className="img-fluid col-2"></img>
            <h1 className="pt-2 robotech-color">My Robotech</h1>
            <hr></hr>
            <InfoCard cardTitle='Coming Soon!' cardText='This feature is currently being developed!' linkTo='Home' linkRoute='/home' /> 
        </div>
    )
}

export default Coming;

