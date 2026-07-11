"use client";

import React from "react";
import styles from "./VoiceIntroduction.module.css";

export default function Waveform({ isPlaying }) {
  // Render 15 bars for the equalizer
  const bars = Array.from({ length: 15 }, (_, i) => i);

  return (
    <div className={styles.waveformContainer} aria-hidden="true">
      {bars.map((index) => (
        <div
          key={index}
          className={`${styles.bar} ${isPlaying ? styles.animating : ""}`}
          style={{
            // Dynamic non-playing height variation for looking organic when paused
            height: isPlaying ? undefined : `${6 + (index % 4) * 3}px`,
          }}
        />
      ))}
    </div>
  );
}
