import React from "react";
import logo from "../Finalicon2.png";
import Question from "../components/Question"
import axios from 'axios';

class Apply extends React.Component {
  constructor(props) {
    super(props);
    this.state = {questions: []};
  }

  async componentDidMount() {
    try {
      const participantQuestions = await (await axios.get('questions/participant')).data.questions;
      console.log(participantQuestions);
      this.setState({questions: participantQuestions});
    }
    catch(error) {
      console.log(error);
    }
  }

  render() {
    const questionComponents = this.state.questions.map((entry) => 
       <Question questionText={entry.label} key={entry.name}/>
    )

    return (
      <div>
        <div className="App container">
          <img src={logo} className="img-fluid col-2"></img>
          <h1 className="pt-2 robotech-color">RoboTech Application</h1>
          <hr></hr>
        </div>

        <div className="container w-75">
          <form>
            {questionComponents}
            <button type="submit" class="btn robotech-bg">Submit</button>
          </form>
        </div>
      </div>
    )
  }
}

export default Apply;