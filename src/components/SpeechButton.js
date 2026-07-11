"use client";

import React from "react";
import { FiVolume2 } from "react-icons/fi";
import styles from "./AIAssistant.module.css";

export default function SpeechButton({ onClick, isDisabled }) {
  return (
    <button
      type="button"
      className={styles.speechActionBtn}
      onClick={onClick}
      disabled={isDisabled}
      aria-label="Listen to this message"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.35rem",
        background: "none",
        border: "none",
        color: "var(--muted-text)",
        fontSize: "0.8rem",
        fontWeight: "600",
        cursor: "pointer",
        padding: "0.2rem 0.5rem",
        borderRadius: "6px",
        transition: "all 0.2s ease"
      }}
    >
      <FiVolume2 size={15} />
      <span>Listen</span>
    </button>
  );
}
