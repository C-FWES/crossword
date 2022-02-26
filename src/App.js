import generateCrossword from "./GenerateCrossword";

function App() {
  return (
    <>
    <div className="App">
      <h1>Crossword Generator v0</h1>
    </div>
    <div class="container">
      <div id="crossword-generate-elements">
      <textarea rows='10'></textarea>
      </div>
      <button type="submit" onClick={generateCrossword}>Generate Crossword</button>
    </div>

    <div class="container">
      <div id="crossword">
        
      </div>
    </div>
    </>
  );
}

export default App;
