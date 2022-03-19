import React from 'react';
import { Link } from "react-router-dom";

function Nav() {
    return (
        <ul className="nav justify-content-center p-1">
            <li class="nav-item col-sm-2">
                <h5><Link to="/apply" class="nav-link" style={{color: "grey"}}>Apply</Link></h5>
            </li>
            <li class="nav-item col-sm-2">
                <h5><Link to="/rsvp" class="nav-link" style={{color: "grey"}}>RSVP</Link></h5>
            </li>
            <li class="nav-item col-sm-2">
                <h5><Link to="/events" class="nav-link" style={{color: "grey"}}>Events</Link></h5>
            </li>
        </ul>
    )
}

export default Nav;