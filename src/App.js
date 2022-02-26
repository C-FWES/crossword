import React, { useRef, useState } from "react";

function App() {

  const [newWord, setNewWord] = useState([]);
  const input = useRef();

  function addToList(e) {
    e.preventDefault();
    setNewWord([...newWord, input.current.value]);
    console.log(input.current.value);
  };
  
  return (
    <>
    <div className="App">
      <h1>Crossword Generator v0</h1>
    </div>
    <div className="container">
      <div id="crossword-generate-elements">
      <input type="text" ref={input}></input>
      <button type="submit" onClick={addToList}>Add Word</button>
      </div>
    </div>
    <h2>Words</h2>

    <ul>
    {newWord.map(function(object, i){
      return <li key={i}>{object}</li>
      })}
    </ul>

    <div id="generate">
    <button type="submit" >Generate Crossword</button>
    </div>
    <div className="container">
      <div id="crossword">

      </div>
    </div>
    </>
  );
}

export default App;
