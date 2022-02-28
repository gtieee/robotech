import React from 'react';
import { Link } from "react-router-dom";
import brandLogo from '../robotech-words.png';

function NavBar() {
    return (
        <ul className="robotech-top nav p-1">
            <li class="nav-item col-sm-2">
            <img src={brandLogo} className="brand"></img>
            </li>
        </ul>
    )
}

export default NavBar;