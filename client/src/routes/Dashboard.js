import logo from '../FinalLogo.png';
import UserRow from '../components/UserRow.js'

const test1 = {
    first: 'Aaron',
    last: 'Rieck',
    email: 'arieck3@gatech.edu',
    applyId: '',
    id: '1223424'
}

const test2 = {
    first: 'First',
    last: 'Last',
    email: 'test@test.com',
    applyId: 'something',
    id: '4661'
}

function Dashboard() {
    return (
        <div>
            <div className="App container">
                <img src={logo} className="img-fluid col-2"></img>
                <h1 className="pt-2 robotech-color">My Robotech</h1>
                <hr></hr>
            </div>
            <div className="container">
                    <UserRow user={test1}/>
                    <UserRow user={test2}/>
            </div>            
        </div>

    )
}

export default Dashboard;