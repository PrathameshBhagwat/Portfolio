"use client";

import React from "react";
import { FiPlay, FiPause, FiSquare } from "react-icons/fi";
import styles from "./AIAssistant.module.css";

export default function SpeechControls({ isPaused, onPause, onResume, onStop, progress }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.4rem",
        width: "100%",
        marginTop: "0.5rem",
        padding: "0.4rem 0.5rem",
        borderRadius: "8px",
        backgroundColor: "rgba(0, 0, 0, 0.03)",
        border: "1px solid rgba(0, 0, 0, 0.05)"
      }}
      className={styles.speechControlsContainer}
    >
      {/* Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {isPaused ? (
          <button
            type="button"
            className={styles.miniSpeechBtn}
            onClick={onResume}
            aria-label="Resume reading"
            style={buttonStyle()}
          >
            <FiPlay size={13} />
            <span style={{ fontSize: "0.75rem" }}>Resume</span>
          </button>
        ) : (
          <button
            type="button"
            className={styles.miniSpeechBtn}
            onClick={onPause}
            aria-label="Pause reading"
            style={buttonStyle()}
          >
            <FiPause size={13} />
            <span style={{ fontSize: "0.75rem" }}>Pause</span>
          </button>
        )}

        <button
          type="button"
          className={styles.miniSpeechBtn}
          onClick={onStop}
          aria-label="Stop reading"
          style={buttonStyle()}
        >
          <FiSquare size={12} />
          <span style={{ fontSize: "0.75rem" }}>Stop</span>
        </button>

        {/* Pulse speaker waves */}
        <div style={{ marginLeft: "auto", display: "flex", gap: "2px", height: "10px", alignItems: "center" }} aria-hidden="true">
          <div className={`${styles.speakingDot} ${!isPaused ? styles.speakingDotAnim : ""}`} style={{ animationDelay: "0s" }} />
          <div className={`${styles.speakingDot} ${!isPaused ? styles.speakingDotAnim : ""}`} style={{ animationDelay: "0.2s" }} />
          <div className={`${styles.speakingDot} ${!isPaused ? styles.speakingDotAnim : ""}`} style={{ animationDelay: "0.4s" }} />
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: "100%",
          height: "3px",
          backgroundColor: "rgba(0, 0, 0, 0.05)",
          borderRadius: "9999px",
          overflow: "hidden"
        }}
        className={styles.miniSpeechProgressTrack}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "var(--accent-gradient)",
            transition: "width 0.2s ease"
          }}
        />
      </div>
    </div>
  );
}

function buttonStyle() {
  return {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    background: "none",
    border: "none",
    color: "var(--foreground)",
    cursor: "pointer",
    padding: "0.15rem 0.35rem",
    borderRadius: "4px",
    transition: "background 0.2s"
  };
}
