import React from 'react';

class Question extends React.Component {
    constructor(props) {
        super(props);
        this.state = {response: ""};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({response: event.target.value});
    }

    render() {
        return (
            <div>
                <label className="form-label">{this.props.questionText}</label>
                <input className="form-control mb-2" type="text" name={this.props.questionText} value={this.state.value} onChange={this.handleChange}/>
            </div>
        )
    }
}

export default Question;