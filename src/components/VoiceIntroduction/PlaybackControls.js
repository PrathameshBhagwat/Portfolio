"use client";

import React from "react";
import { FiPlay, FiPause, FiRotateCcw, FiVolume2, FiVolumeX } from "react-icons/fi";
import styles from "./VoiceIntroduction.module.css";

export default function PlaybackControls({
  isPlaying,
  isMuted,
  volume,
  playbackRate,
  onPlayPause,
  onReplay,
  onMuteToggle,
  onVolumeChange,
  onSpeedChange
}) {
  const handleSpeedToggle = () => {
    if (playbackRate === 1) {
      onSpeedChange(1.25);
    } else if (playbackRate === 1.25) {
      onSpeedChange(1.5);
    } else {
      onSpeedChange(1);
    }
  };

  return (
    <div className={styles.controlsRow}>
      <div className={styles.leftControls}>
        <button
          className={styles.controlBtn}
          onClick={onPlayPause}
          aria-label={isPlaying ? "Pause introduction" : "Play introduction"}
        >
          {isPlaying ? (
            <FiPause className={styles.playPauseIcon} />
          ) : (
            <FiPlay className={styles.playPauseIcon} style={{ marginLeft: "2px" }} />
          )}
        </button>

        <button
          className={styles.controlBtn}
          onClick={onReplay}
          aria-label="Replay introduction from the beginning"
        >
          <FiRotateCcw />
        </button>

        {/* Volume controls */}
        <div className={styles.volumeContainer}>
          <button
            className={styles.controlBtn}
            onClick={onMuteToggle}
            aria-label={isMuted || volume === 0 ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? <FiVolumeX /> : <FiVolume2 />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className={styles.volumeSlider}
            aria-label="Volume slider"
          />
        </div>
      </div>

      <div className={styles.rightControls}>
        <button
          className={styles.speedChip}
          onClick={handleSpeedToggle}
          aria-label={`Playback speed: currently ${playbackRate}x. Click to change.`}
        >
          {playbackRate}x
        </button>
      </div>
    </div>
  );
}
