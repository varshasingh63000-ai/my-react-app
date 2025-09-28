import React from 'react';
import './ResultPopup.css';

const ResultPopup = ({ stats }) => {
  return (
    <div className="result-popup">
      <h2>✅ Success</h2>
      <p><strong>WPM:</strong> {stats.wpm}</p>
      <p><strong>Errors:</strong> {stats.errors}</p>
      <p><strong>Accuracy:</strong> {stats.accuracy}%</p>
    </div>
  );
};

export default ResultPopup;
