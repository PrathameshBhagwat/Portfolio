"use client";

import React from "react";
import styles from "./VoiceIntroduction.module.css";

export default function AudioProgress({ currentTime, duration, onSeek }) {
  const formatTime = (time) => {
    if (isNaN(time) || time === Infinity) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const displayDuration = duration && duration > 0 ? duration : 45; // Default 45 seconds if not loaded
  const percentage = (currentTime / displayDuration) * 100;

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressTrack}>
        <div
          className={styles.progressBarFill}
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          min="0"
          max={displayDuration}
          step="0.1"
          value={currentTime}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className={styles.progressInput}
          aria-label="Audio progress slider"
        />
      </div>
      <div className={timeRowStyle(percentage)}>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(displayDuration)}</span>
      </div>
    </div>
  );
}

// Simple internal helper to avoid css module complexity inside template literals
function timeRowStyle(percentage) {
  return styles.timeRow;
}
