import React from 'react';
import brandLogo from '../robotech-words.png';

function NavBar() {
    return (
        <ul className="robotech-top nav p-1">
            <li className="nav-item col-sm-2">
            <img src={brandLogo} className="brand"></img>
            </li>
        </ul>
    )
}

export default NavBar;