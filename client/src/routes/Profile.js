import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";
import logo from '../FinalLogo.png';
//http://localhost:3000/users/01af9253-a0c7-4ea5-9378-a243a5491baf


function Profile() {
    let params = useParams();
    let token = localStorage.getItem('token');
    let authId = localStorage.getItem('id');

    let [applyState, setApplyState] = useState('init');
    let [acceptState, setAcceptState] = useState(false);
    let [rejectState, setRejectState] = useState(false);
    let [error, setError] = useState(false);

    let [userName, setUserName] = useState({
        first: '',
        last: ''
    });

    let [appData, setAppData] = useState({
        dietary: '',
        age: '',
        school: '',
        design: false,
        mechanical: false,
        electrical: false,
        software: false,
        skills: '',
        interest: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const nameResponse = await axios.post('/api/users/name', {userId: params.userId, token: token, id: authId});
                setUserName(nameResponse.data);
                const appResponse = await axios.post('/api/users/hasInfo', {userId: params.userId, token: token, id: authId});
                if (appResponse.data.hasInfo) {
                    setApplyState('yes');
                } else {
                    setApplyState('no');
                    return;
                }
                const acceptResponse = await axios.post('/api/users/checkAccept', {userId: params.userId, token: token, id: authId});
                if (acceptResponse.data.accepted) {
                    setAcceptState(true);
                } else if (acceptResponse.data.rejected) {
                    setRejectState(true);
                }
            } catch (err) {
                setError(true);
            }
            try {
                const response = await axios.post('/api/users/applyData', {userId: params.userId, token: token, id: authId});
                setAppData(response.data);
            } catch (err) {
                setError(true);
            }
        }
        fetchData();
    }, [authId, token, params])

    let handleAccept = async () => {
        try {
            await axios.post('/api/users/accept', {userId: params.userId, token: token, id: authId});
            setAcceptState(true);
        } catch {
            alert('Error accepting this participant');
        }
    }

    let handleReject = async () => {
        if (acceptState) {
            alert('This user has already been accepted!');
            return;
        }
        try {
            await axios.post('/api/users/reject', {userId: params.userId, token: token, id: authId});
            setRejectState(true);
        } catch {
            alert('Error rejecting this participant');
        }
    }

    var appComponent;
    if (error) {
        appComponent = <h4>Failed to get this user's application data</h4>
    }
    else if (applyState === 'init') {
        appComponent = <p></p>
    }
    else if (applyState === 'no') {
        appComponent = <h4>This user has not applied yet!</h4>
    }
    else {
        appComponent = <Application data={appData} name={userName} />
    }

    return (
        <div className=' App container w-75'>
            <img src={logo} className="img-fluid col-2"></img>
            <h1 className="pt-2 robotech-color">User Profile</h1>
            <hr></hr>
            <div>
                <h1>{userName.first + ' ' + userName.last}</h1>
                <h4 className="mb-4">{appliedState((applyState === 'yes'), acceptState, rejectState)}</h4>
            </div>
            {(applyState === 'yes') && 
            <div>
                <button type="submit" class="btn robotech-bg my-3" onClick={handleAccept} >Accept</button> <br/>
                <button type="submit" class="btn robotech-bg my-3" onClick={handleReject} >Reject</button>
            </div>
            }
            {appComponent}
        </div>
    )

}

function Application(props) {
    const s3String = 'https://robotech-resumes.s3.us-east-2.amazonaws.com/'

    return (
        <div>
            <form>
                <label className="form-label">School</label>
                <input className="form-control mb-2" type="text" name="other" value={props.data.school} readOnly disabled/>
                <label className="form-label">Age</label>
                <input className="form-control mb-2" type="number" name="age" value={props.data.age} readOnly disabled/>
                <label className="form-label">Dietary Restrictions:</label>
                <input className="form-control mb-2" type="text" name="restrictions" value={props.data.dietary || 'None'} readOnly disabled/>
                <label className="form-label mt-2">Interest</label>
                <textarea className="form-control mb-2" rows="3" name="interest" value={props.data.interest} readOnly disabled/>
                <label className="form-label mt-2">{'Tracks'}</label>
                <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" name="design" checked={props.data.design} readOnly/>
                <label class="form-check-label">
                    Design
                </label>
                </div>
                <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" name="mech" checked={props.data.mechanical} readOnly/>
                <label class="form-check-label ">
                    Robot Body
                </label>
                </div>
                <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" name="elec" checked={props.data.electrical} readOnly/>
                <label class="form-check-label">
                    Electrical
                </label>
                </div>
                <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" name="soft" checked={props.data.software} readOnly/>
                <label class="form-check-label mb-2">
                    Software
                </label>
                </div>
                <label className="form-label mt-2">Skills</label>
                <textarea className="form-control mb-2" rows="3" name="skills" value={props.data.skills} readOnly disabled/>
                <div>
                <a class='btn btn-secondary my-2 w-25' href={s3String + props.name.first + '_' + props.name.last + '_RoboTech_Resume.pdf'}>Resume</a>
                </div>
            </form>
        </div>
    )
}

function dotStyle(color) {
    return {
        height: '22px',
        width: '20px',
        backgroundColor: color,
        borderRadius: '50%',
        display: 'inline-block',
        marginTop: '3.5px'
    }
}

function appliedState(applied, accepted, rejected) {
    if (!applied) {
        return (
            <div className='row justify-content-center' style={{paddingTop: '7px', height: '24px'}}>
                <span style={dotStyle('grey')}/>
                <p className='col-2'>Registered</p>
            </div>
        )
    }
    else if (!(accepted || rejected)) {
        return (
            <div className='row justify-content-center' style={{paddingTop: '7px', height: '24px'}}>
                <span style={dotStyle('yellow')}/>
                <p className='col-2'>Applied</p>
            </div>
        )
    }
    else if (rejected) {
        return (
            <div className='row justify-content-center' style={{paddingTop: '7px', height: '24px'}}>
                <span style={dotStyle('red')}/>
                <p className='col-2'>Rejected</p>
            </div>
        )
    }
    else {
        return (
            <div className='row justify-content-center' style={{paddingTop: '7px', height: '24px'}}>
                <span style={dotStyle('green')}/>
                <p className='col-2'>Accepted</p>
            </div>
        )
    }
}

export default Profile;