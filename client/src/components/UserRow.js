import { Link } from 'react-router-dom';

function dotStyle(color) {
    return {
        height: '24px',
        width: '20px',
        backgroundColor: color,
        borderRadius: '50%',
        display: 'inline-block',
    }
}

function appliedState(applied, accepted, rejected) {
    if (!applied) {
        return (
            <div className='row justify-content-center' style={{paddingTop: '7px', height: '24px'}}>
                <span style={dotStyle('white')}/>
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
    else if (accepted) {
        return (
            <div className='row justify-content-center' style={{paddingTop: '7px', height: '24px'}}>
                <span style={dotStyle('green')}/>
                <p className='col-2'>Accepted</p>
            </div>
        )
    }
}

function schoolState(school) {
    if (school == null) {
        return (
            <p style={{paddingTop: '7px', height: '24px'}}>None</p>
        )
    }
    else {
        return (<p style={{paddingTop: '7px', height: '24px'}}>{school}</p>)
    }
    
}

function UserRow(props) {
    return (
        <div className="row my-2" style={{backgroundColor: "#EAEAEA", borderRadius: "5px"}}>
            <div className="col-3 text-center">
                <Link to={'/admin/' + props.user.id} className='nav-link' style={{color: 'black'}}>{props.user.first_name + ' ' + props.user.last_name}</Link>
            </div>
            <div className="col-3 text-center">
                <p style={{paddingTop: '7px', height: '24px'}}>{props.user.email}</p>
            </div>
            <div className="col-3 text-center">
                {appliedState(props.user.apply_id, props.user.accepted, props.user.rejected)}
            </div>
            <div className="col-3 text-center">
                {schoolState(props.user.school)}
            </div>
        </div>
    )
}

export default UserRow;