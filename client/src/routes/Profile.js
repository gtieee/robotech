import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";
import logo from '../FinalLogo.png';
//http://localhost:3000/users/01af9253-a0c7-4ea5-9378-a243a5491baf


function Profile() {
    let params = useParams();
    let token = localStorage.getItem('token');
    let authId = localStorage.getItem('user');

    let [applyState, setApplyState] = useState(false);
    let [acceptState, setAcceptState] = useState(false);

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
                const nameResponse = await axios.post('/api/users/name', {userId: params.userId, token: token});
                setUserName(nameResponse.data);
                const appResponse = await axios.post('/api/users/hasInfo', {userId: params.userId, token: token});
                if (appResponse.data.hasInfo) {
                    setApplyState(true);
                } else {
                    setApplyState(false);
                    return;
                }
            } catch (err) {
                console.log('Could not get this users info');
            }
            try {
                const response = await axios.post('/api/users/applyData', {userId: params.userId, token: token});
                setAppData(response.data);
            } catch (err) {
                console.log('Could not get this users application info');
            }
        }
        fetchData();
    }, [authId, token, params])

    return (
        <div className=' App container w-75'>
            <img src={logo} className="img-fluid col-2"></img>
            <h1 className="pt-2 robotech-color">RoboTech Application</h1>
            <hr></hr>
            <div>
                <h1>{userName.first + ' ' + userName.last}</h1>
                <h4>{'Status: ' + applyState}</h4>
            </div>
            <Application data={appData} name={userName} />
        </div>
    )

}

function Application(props) {
    const s3String = 'https://robotech-resumes.s3.us-east-2.amazonaws.com/'

    return (
        <div>
            <form>
                <label className="form-label">Age</label>
                <input className="form-control mb-2" type="number" name="age" value={props.data.age} readOnly disabled/>
                <label className="form-label">School</label>
                <input className="form-control mb-2" type="text" name="other" value={props.data.school} readOnly disabled/>
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

export default Profile;