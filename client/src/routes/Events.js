import axios from "axios";
import React from "react";
import InfoCard from "../components/InfoCard";
import Nav from "../components/Nav";
import logo from "../FinalLogo.png";

class Events extends React.Component {
    constructor(props) {
        super(props);
        this.state = {events: []};
    }

    async componentDidMount() {
        try {
            const response = await axios.post('/api/events', {id: localStorage.getItem('id'), token: localStorage.getItem('token')});
            this.setState({events: response.data});
        } catch (err) {
            alert('Something went wrong!');
        }
    }

    render() {
        const eventsComponents = this.state.events.map(event => (<Event data={event} />));

        return (
            <div className="App container">
                <img src={logo} className="img-fluid col-2"></img>
                <h1 className="pt-2 robotech-color">My Robotech</h1>
                <hr></hr>
                <Nav />
                {eventsComponents}
            </div>
        )
    }
}

function Event(props) {
    return (
        <div className="card w-75 mx-auto mt-3 pt-2 pb-2" style={{backgroundColor: "#EAEAEA"}}>
            <div className="card-body justify-content-center">
            <h2 className="card-title p-1">{props.data.title}</h2>
                <div>
                    <p>{props.data.description}</p>
                    <p>{props.data.time + ' - ' + props.data.location}</p>
                    {props.data.link && 
                        <a href={props.data.link}>{props.data.link}</a>
                    }
                </div>
            </div>
      </div>
    )
}

export default Events;