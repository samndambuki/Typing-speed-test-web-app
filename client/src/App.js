/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [words, setWords] = useState([]);
  const [typedWords, setTypedWords] = useState("");
  const [timer, setTimer] = useState(60);
  const [wpm, setWpm] = useState(null);
  const [username, setUsername] = useState("");
  const [scores, setScores] = useState([]);

  // Generate random words
  useEffect(() => {
    const simpleWords = [
      "apple",
      "banana",
      "orange",
      "grape",
      "cherry",
      "pear",
      "peach",
      "lemon",
      "lime",
      "melon",
      "plum",
      "berry",
      "kiwi",
      "mango",
      "fig",
    ];
    setWords(simpleWords.sort(() => 0.5 - Math.random()).slice(0, 10));
  }, []);

  // Timer logic
  useEffect(() => {
    if (timer > 0 && wpm === null) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && wpm === null) {
      calculateWPM();
    }
  }, [timer, wpm]);

  // Calculate WPM
  const calculateWPM = () => {
    const typedArray = typedWords.trim().split(/\s+/);
    const correctWords = typedArray.filter(
      (word, index) => word === words[index]
    );
    setWpm(correctWords.length);
  };

  // Save score
  const saveScore = async () => {
    if (!username) {
      alert("Please enter your username!");
      return;
    }
    try {
      await axios.post("http://localhost:5000/scores", { username, wpm });
      fetchScores();
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  // Fetch scores
  const fetchScores = async () => {
    try {
      const response = await axios.get("http://localhost:5000/scores");
      setScores(response.data);
    } catch (error) {
      console.error("Error fetching scores:", error);
    }
  };

  // Reset game
  const resetGame = () => {
    setTypedWords("");
    setTimer(60);
    setWpm(null);
    const simpleWords = [
      "apple",
      "banana",
      "orange",
      "grape",
      "cherry",
      "pear",
      "peach",
      "lemon",
      "lime",
      "melon",
      "plum",
      "berry",
      "kiwi",
      "mango",
      "fig",
    ];
    setWords(simpleWords.sort(() => 0.5 - Math.random()).slice(0, 10));
  };

  return (
    <div className="App">
      <h1>Typing Practice</h1>
      <div>
        <p>Type the words below:</p>
        <div className="word-display">{words.join(" ")}</div>
      </div>
      <textarea
        disabled={timer === 0}
        value={typedWords}
        onChange={(e) => setTypedWords(e.target.value)}
        placeholder="Start typing here..."
      ></textarea>
      <div>
        <p>Time left: {timer}s</p>
        {wpm !== null && (
          <>
            <p>Your WPM: {wpm}</p>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
            <button onClick={saveScore}>Save Score</button>
          </>
        )}
      </div>
      <div>
        <button onClick={resetGame}>Reset</button>
      </div>
      <div>
        <h2>Top Scores</h2>
        <ul>
          {scores.map((score) => (
            <li key={score.id}>
              {score.username}: {score.wpm} WPM
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
