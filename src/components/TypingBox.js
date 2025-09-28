import React, { useState, useEffect } from 'react';
import './TypingBox.css';
import ResultPopup from './ResultPopup';

const TypingBox = () => {
  const [fullText] = useState(
    "Life is a continuous journey filled with countless experiences. Typing is not only about pressing keys quickly; it is about combining accuracy, rhythm, and focus into one smooth action. When you sit down to practice typing, your hands and mind need to work together. Each letter matters, each space matters, and every error slows down progress. That is why people say speed comes with accuracy. If you learn to type slowly but with very few mistakes, your speed will eventually increase naturally."
  );

  const [remainingText, setRemainingText] = useState(fullText);
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [errors, setErrors] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    let timer;
    if (isStarted && timeLeft > 0 && !isFinished) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        updateWPM();
      }, 1000);
    } else if (timeLeft === 0) {
      setIsFinished(true);
    }
    return () => clearInterval(timer);
  }, [isStarted, timeLeft, isFinished]);

  const updateWPM = () => {
    const minutes = (60 - timeLeft) / 60;
    const words = input.length / 5;
    setWpm(Math.round(words / minutes));
  };

  const playSound = () => {
    const audio = new Audio(process.env.PUBLIC_URL + "/click.mp3");
    audio.play().catch(err => console.warn("Audio play failed:", err));
  };

  const handleInput = (e) => {
    const val = e.target.value;
    setInput(val);
    playSound();

    const expected = fullText.substring(0, val.length);
    if (val !== expected) setErrors(prev => prev + 1);

    setRemainingText(fullText.substring(val.length));
  };

  const handleStart = () => {
    setIsStarted(true);
    setInput("");
    setErrors(0);
    setTimeLeft(60);
    setIsFinished(false);
    setRemainingText(fullText);
    setWpm(0);
  };

  const handleFinish = () => {
    setIsFinished(true);
  };

  const handleRestart = () => {
    setIsStarted(false);
    setInput("");
    setErrors(0);
    setTimeLeft(60);
    setIsFinished(false);
    setRemainingText(fullText);
    setWpm(0);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const calculateStats = () => {
    const totalTyped = input.length;
    const words = input.trim().split(/\s+/).length;

    let accuracy = 0;
    if (totalTyped > 0) {
      accuracy = ((totalTyped - errors) / totalTyped) * 100;
      accuracy = Math.max(0, accuracy).toFixed(2);
    }

    return { words, accuracy, wpm, errors };
  };

  return (
    <div className={`typing-box ${darkMode ? 'dark' : 'light'}`}>
      <div className="top-bar">
        <h1>Typing Speed Test</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {darkMode ? "🌙Dark" : "☀️Light"}
        </button>
      </div>

      {!isStarted && !isFinished && (
        <button className="start-btn" onClick={handleStart}>Start Test</button>
      )}

      {isStarted && (
        <>
          <p className="timer">{timeLeft}s left</p>
          <div className={`marquee ${isFinished ? 'paused' : ''}`}>
            <p>{remainingText}</p>
          </div>
          <input
            type="text"
            value={input}
            onChange={handleInput}
            disabled={isFinished}
            placeholder="Start typing..."
          />
          <div className="wpm-meter">
            <label>WPM</label>
            <div className="wpm-bar">
              <div className="wpm-fill" style={{ width: `${Math.min(wpm, 100)}%` }}></div>
            </div>
            <span>{wpm}</span>
          </div>
          <button onClick={handleFinish} disabled={isFinished}>Finish</button>
        </>
      )}

      {isFinished && (
        <>
          <ResultPopup stats={calculateStats()} />
          <button className="restart-btn" onClick={handleRestart}>Restart</button>
        </>
      )}
    </div>
  );
};

export default TypingBox;


