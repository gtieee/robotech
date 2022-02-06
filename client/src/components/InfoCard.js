import React from 'react';
import { Link } from "react-router-dom";

class InfoCard extends React.Component {
    render() {
        return (
        <div class="card w-75 mx-auto mt-3 pt-2 pb-4" style={{backgroundColor: "#EAEAEA"}}>
            <div class="card-body justify-content-center">
            <h2 class="card-title robotech-color p-1">{this.props.cardTitle}</h2>
            <p class="card-text p-2">{this.props.cardText}</p>
            <Link to="/apply" class="btn btn-success robotech-bg">Apply</Link>
            </div>
      </div>
      )
    }
}

export default InfoCard;