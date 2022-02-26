import React, { Component } from "react";
import GenerateCrossword from "./GenerateCrossword";
import { render } from "react-dom";

class App extends Component {
  constructor() {
    super();
    this.state = {
      givenWord: "",
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleInput.bind(this);
  }

  handleInput(event) {
    this.setState({givenWord: event.target.value})
    console.log(event.target.value)
  }

  handleSubmit(event) {
    console.log(this.state);
    event.preventDefault();
  }

  render() {
    return (
      <>
      <div className="App">
        <h1>Crossword Generator v0</h1>
      </div>
      <div className="container">
        <div id="crossword-generate-elements">
        <textarea rows='10' onChange={this.handleInput} value={this.state.givenWord} />
        </div>
        <button type="submit" onClick={GenerateCrossword} onSubmit={this.handleSubmit}>Generate Crossword</button>
      </div>
  
      <div className="container">
        <div id="crossword">
  
        </div>
      </div>
      </>
    );
  }
}

render(<App/>, document.getElementById('root'));

export default App;
