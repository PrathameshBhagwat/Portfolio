"use client";

import React from "react";
import styles from "./AIAssistant.module.css";

export default function VoiceSelector({ voices, selectedVoiceName, onChange, language }) {
  // Filter voices by language code (en, hi, mr) to show relevant items
  const filteredVoices = voices.filter((voice) => {
    const lang = voice.lang.toLowerCase().replace("_", "-");
    return lang.startsWith(language.toLowerCase());
  });

  // Fallback to all voices if no matching language voices are available
  const listToRender = filteredVoices.length > 0 ? filteredVoices : voices;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      <label htmlFor="voice-select" style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--muted-text)" }}>
        {language === "en" ? "Select Voice" : language === "hi" ? "आवाज चुनें" : "आवाज निवडा"}
      </label>
      <select
        id="voice-select"
        value={selectedVoiceName}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "0.45rem",
          borderRadius: "8px",
          border: "1px solid var(--card-border)",
          backgroundColor: "var(--input-bg)",
          color: "var(--foreground)",
          fontSize: "0.85rem",
          outline: "none",
          cursor: "pointer"
        }}
        aria-label="Voice synthesizer select dropdown"
      >
        {listToRender.length === 0 ? (
          <option value="">
            {language === "en" ? "Default browser voice" : language === "hi" ? "डिफ़ॉल्ट ब्राउज़र आवाज" : "डीफॉल्ट ब्राउझर आवाज"}
          </option>
        ) : (
          <>
            <option value="">
              {language === "en" ? "Default matching voice" : language === "hi" ? "डिफ़ॉल्ट मिलान आवाज" : "डीफॉल्ट जुळणारा आवाज"}
            </option>
            {listToRender.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </>
        )}
      </select>
    </div>
  );
}
