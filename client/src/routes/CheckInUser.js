import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import logo from '../FinalLogo.png'

function CheckInUser() {
    var params = useParams();
    var searchParams = useSearchParams();
    var [checkedIn, setCheckedIn] = useState(false);

    const handleClick = async () => {
        try {
            const response = await axios.post('/api/users/checkIn', {userId: params.userId, token: localStorage.getItem('token'), id: localStorage.getItem('id'), virtual: false});
            if (response.data.success) {
                setCheckedIn(true);
                alert('Success!');
            } else {
                setCheckedIn(false);
                alert('Something went wrong!');
            }
        } catch {
            setCheckedIn(false);
            alert('Something went wrong!');
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('/api/users/checkedIn', {userId: params.userId, token: localStorage.getItem('token'), id: localStorage.getItem('id')});
                setCheckedIn(response.data.checkedIn);
            } catch {
                setCheckedIn(false);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="App container">
            <img src={logo} className="img-fluid col-2"></img>
            <h1 className="pt-2 robotech-color">Robotech Volunteer Portal</h1>
            <hr></hr>
            <h2>{searchParams[0].get('first') + ' ' + searchParams[0].get('last')}</h2>
            <h3>{'Checked In: ' + (checkedIn ? 'Yes' : 'No')}</h3>
            <button type="submit" className="btn robotech-bg mt-4" onClick={handleClick}>Check In</button>
            <br/>
            <Link to={'/volunteer'} className="btn robotech-bg mt-4">Back</Link>
        </div>
    )

}

export default CheckInUser;