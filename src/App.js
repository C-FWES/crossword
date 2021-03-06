import { render } from "@testing-library/react";
import React, { useRef, useState } from "react";

function App() {

  const [newWord, setNewWord] = useState([]);
  const input = useRef();

  function addToList(e) {
    e.preventDefault();
    setNewWord([...newWord, input.current.value]);
    console.log(input.current.value);
  };

  const oldActiveWordList = newWord;
  const wordList = oldActiveWordList.sort((a, b) => a.length - b.length);
  var activeWordList = [];

  var acrossCount = 0;
  var downCount = 0;

  function board(columns, rows) {
    // this.columns = columns;
    // this.rows = rows;
  
    var grid = new Array(columns);
    for (var i = 0; i < columns; i++) {
      grid[i] = new Array(rows);
    }

    for (var x = 0; x < columns; x++) {
      for (var y = 0; y < rows; y++) {
        grid[x][y] = {};
        grid[x][y].targetChar = '#';
        grid[x][y].indexDisplay = '';
        grid[x][y].value = '-';
      }
    }
    return grid;
  };

  function generateCrossword(wordList) {
    var gridSize = 0;
    for (var i = 0; i < wordList.length; i++) {
        gridSize += wordList[i].length;
    }
    console.log(gridSize);
    return gridSize;
  };

  function suggestCoordinates(word, gridSize, grid) {
    var c = '';
    const coordinateList = []
    var coordinateCount = 0;
    for (var i = 0; i < word.length; i++) {
      for (var x = 0; x < gridSize; x++) {
        for (var y = 0; y < gridSize; y++) {
          c = word[i];
          if (grid[x][y].targetChar == c) {
            if (x - i + 1 > 0 && x - i + word.length-1 < gridSize) {
              coordinateList[coordinateCount] = {};
              coordinateList[coordinateCount].x  = x-i;
              coordinateList[coordinateCount.y] = y;
              coordinateList[coordinateCount].score = 0;
              coordinateList[coordinateCount].vertical = true;
              coordinateCount += 1;
            }
          }
          if (y - i + 1 > 0 && y - i + word.length-1 < gridSize) {
            coordinateList[coordinateCount] = {};
            coordinateList[coordinateCount].x  = x;
            coordinateList[coordinateCount.y] = y-i;
            coordinateList[coordinateCount].score = 0;
            coordinateList[coordinateCount].vertical = false;
            coordinateCount += 1;
          }
        }
      }
    }
    return coordinateList;
  }

  function checkScore(word, x, y, vertical, grid) {
    var score = 1;
    if (vertical) {
      for (var i = 0; i < word.length; i++) {
        if (i == 0 && x > 0) {
          if (grid[x-1][y].targetChar != '#') {
            score = 0;
            break
          }
        }
        else if (i == word.length && x < grid.length) {
            if (grid[x+i+1][y].targetChar != '#') {
                score = 0;
                break;
            }
        }
        if (x + i < grid.length) {
          if (grid[x+i][y].targetChar == word[i]) {
            score += 1;
          }
          else if (grid[x+i][y].targetChar != '#') {
            score = 0;
            break;
          }
          else {
            if (y < grid.length - 1) {
                if (grid[x+i][y+1].targetChar != '#') {
                  score = 0;
                  break;
                }
            }
            if (y > 0) {
              if (grid[x+i][y-1].targetChar != '#') {
                score = 0;
                break;
              }
            }
          }
        }
      }
    }
    else { //horizontal
      for (var i = 0; i < word.length; i++) {
        if (i == 0 && y > 0) {
          if (grid[x][y-1].targetChar != '#') {
            score = 0;
            break
          }
        }
        else if (i == word.length - 1 && y + i < grid.length - 1) {
            if (grid[x][y+i-1].targetChar != '#') {
                score = 0;
                break;
            }
        }
        if (y + i < grid.length) {
          if (grid[x][y+i].targetChar == word[i]) {
            score += 1;
          }
          else if (grid[x][y+i].targetChar != '#') {
            score = 0;
            break;
          }
          else {
            if (x < grid.length) {
                if (grid[x+1][y+i].targetChar != '#') {
                  score = 0;
                  break;
                }
            }
            if (x > 0) {
              if (grid[x-1][y+i].targetChar != '#') {
                score = 0;
                break;
              }
            }
          }
        }
      }
    }
    return score;
  }

  function placeWord(word="", x, y, vertical, grid) {
    var wordPlaced = false;
    if (vertical) {
      if (word.length + x < grid.length) {
        for (var i = 0; i < word.length; i++) {
          grid[x+i][y].targetChar = word[i];
        }
        wordPlaced = true;
      }
    }
    else {
      if (word.length + y < grid.length) {
        for (var i = 0; i < word.length; i++) {
          grid[x][y+i].targetChar = word[i];
        }
        wordPlaced = true;
      }
    }
    if (wordPlaced) {
      var currentindex = newWord.length;
      activeWordList[currentindex] = {}
      activeWordList[currentindex]  = word;
      activeWordList[currentindex].x = x;
      activeWordList[currentindex].y = y;
      activeWordList[currentindex].vertical = vertical;
      if (activeWordList[currentindex].vertical) {
        downCount += 1;
        activeWordList[currentindex].number = downCount;
      }
      else {
        acrossCount += 1;
        activeWordList[currentindex].number = acrossCount;
      }
    }
  }

  function isActiveWord(word) {
    if (activeWordList.length > 0) {
        for (var i = 0; i < activeWordList.length; i++) {
          if (word == activeWordList[i]) {
            return true;
          }
        }
    }
  }

  function operateCrossword(seed=0) {
    var gridDimensions = generateCrossword(wordList);
    var crosswordGrid = board(gridDimensions, gridDimensions);
    var bestScoreIndex = 0;
    var topScore = 0;
    var fitScore = 0;
    placeWord(wordList[seed], 0, 0, false, crosswordGrid);
    for (var iy = 0; iy < 2; iy++) {
      for (var ix = 0; ix < wordList.length; ix++) {
        if (!isActiveWord(wordList[ix])) {
            topScore = 0;
            bestScoreIndex = 0;

            var coordinateList = suggestCoordinates(wordList[ix]);
            if (coordinateList[0]) {
              for (var c = 0; c < coordinateList.length; c++) {
                fitScore = checkScore(wordList[ix], coordinateList[c].x, coordinateList[c].y, coordinateList[c].vertical, crosswordGrid);
                if (fitScore > topScore) {
                  topScore = fitScore;
                  bestScoreIndex = c;
                }
              }
            }
            if (topScore > 1) {
              placeWord(wordList[ix], coordinateList[bestScoreIndex].x, coordinateList[bestScoreIndex].y, coordinateList[bestScoreIndex].vertical, crosswordGrid);
            }

        }

      } 
    }
    if (activeWordList.length < wordList.length / 2) {
      seed++;
      generateCrossword(seed);
    }

    return crosswordGrid;

  }

  function renderCrossword() {
    var htmlString = ""
    var rowStr = "";
    var grid = operateCrossword();
    for (var x = 0; x < grid.length; x++) {
      for (var y = 0; y < grid.length; y++) {
        console.log(grid[x][y])
        rowStr += "<td>" + grid[x][y].targetChar + "</td>";
        htmlString += rowStr;
      }
    }
    console.log('across ' + acrossCount);
    console.log('down ' + downCount);
    console.log(htmlString)
    return (
      // <div dangerouslySetInnerHTML={{__html: htmlString}}></div>
      htmlString
    );
  }

  class Crossword extends React.Component {
    render() {
      return (
        <div dangerouslySetInnerHTML={{__html: renderCrossword()}}></div>
      );
    }
  }

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
    <button type="submit" onClick={renderCrossword}>Generate Crossword</button>
    </div>
    <div className="container">
      <div id="crossword">
        <Crossword />
      </div>
    </div>
    </>
  );
}

export default App;
