import React from 'react';
import { Link } from "react-router-dom";

class InfoCard extends React.Component {
    render() {
        return (
        <div className="card w-75 mx-auto mt-3 pt-2 pb-4" style={{backgroundColor: "#EAEAEA"}}>
            <div className="card-body justify-content-center">
            <h2 className="card-title robotech-color p-1">{this.props.cardTitle}</h2>
            <p className="card-text p-2">{this.props.cardText}</p>
            {this.props.linkTo &&
                <Link to={this.props.linkRoute} className="btn btn-success robotech-bg">{this.props.linkTo}</Link>
            }
            </div>
      </div>
      )
    }
}

export default InfoCard;