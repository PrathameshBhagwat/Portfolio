"use client";

import React from "react";
import { FiX, FiVolume2, FiActivity, FiSliders } from "react-icons/fi";
import { useSpeechSynthesis } from "../context/SpeechContext";
import { translations } from "../data/translations";
import VoiceSelector from "./VoiceSelector";
import styles from "./AIAssistant.module.css";

export default function SpeechSettings({ onClose }) {
  const { voices, settings, setSetting } = useSpeechSynthesis();
  const lang = settings?.language || "en";
  const t = translations[lang];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "var(--card-bg)",
        zIndex: 1010,
        display: "flex",
        flexDirection: "column",
        padding: "1.25rem",
        overflowY: "auto"
      }}
      className={styles.settingsOverlay}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--card-border)",
          paddingBottom: "0.75rem",
          marginBottom: "1rem"
        }}
      >
        <span style={{ fontWeight: "700", fontSize: "1rem", color: "var(--foreground)" }}>
          {lang === "en" ? "Voice Settings" : lang === "hi" ? "आवाज सेटिंग्स" : "आवाज सेटिंग्ज"}
        </span>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "var(--muted-text)",
            cursor: "pointer",
            marginLeft: "auto",
            display: "flex",
            alignItems: "center"
          }}
          aria-label="Close voice settings"
        >
          <FiX size={18} />
        </button>
      </div>

      {/* Form Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", flex: 1 }}>
        {/* Language Selection */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--muted-text)" }}>
            {lang === "en" ? "Portfolio Language" : lang === "hi" ? "पोर्टफोलियो भाषा" : "पोर्टफोलिओ भाषा"}
          </span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {[
              { code: "en", label: "English" },
              { code: "hi", label: "Hindi (हिंदी)" },
              { code: "mr", label: "Marathi (मराठी)" }
            ].map((lng) => (
              <button
                key={lng.code}
                type="button"
                onClick={() => {
                  setSetting("language", lng.code);
                  // Reset customized voice selection when language changes so it auto-picks matching local voice
                  setSetting("voiceName", "");
                }}
                style={{
                  flex: 1,
                  padding: "0.4rem 0.5rem",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: settings.language === lng.code ? "var(--accent-orange)" : "var(--card-border)",
                  backgroundColor: settings.language === lng.code ? "rgba(249, 115, 22, 0.08)" : "var(--input-bg)",
                  color: settings.language === lng.code ? "var(--accent-orange)" : "var(--foreground)",
                  transition: "all 0.2s ease"
                }}
                aria-pressed={settings.language === lng.code}
              >
                {lng.label}
              </button>
            ))}
          </div>
        </div>

        {/* Voice Selector drop down */}
        <VoiceSelector
          voices={voices}
          selectedVoiceName={settings.voiceName}
          onChange={(voiceName) => setSetting("voiceName", voiceName)}
          language={settings.language}
        />

        {/* Volume Slider */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--muted-text)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <FiVolume2 size={14} /> {lang === "en" ? "Volume" : lang === "hi" ? "आवाज की मात्रा" : "आवाज तीव्रता"}
            </span>
            <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--foreground)" }}>{Math.round(settings.volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.volume}
            onChange={(e) => setSetting("volume", parseFloat(e.target.value))}
            style={{ width: "100%", accentColor: "var(--accent-orange)" }}
            aria-label="Speech volume slider"
          />
        </div>

        {/* Speed (Rate) Slider */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--muted-text)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <FiSliders size={14} /> {lang === "en" ? "Speed" : lang === "hi" ? "गति" : "वेग"}
            </span>
            <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--foreground)" }}>{settings.rate}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={settings.rate}
            onChange={(e) => setSetting("rate", parseFloat(e.target.value))}
            style={{ width: "100%", accentColor: "var(--accent-orange)" }}
            aria-label="Speech rate speed slider"
          />
        </div>

        {/* Pitch Slider */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--muted-text)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <FiActivity size={14} /> {lang === "en" ? "Pitch" : lang === "hi" ? "पिच" : "पिच"}
            </span>
            <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--foreground)" }}>{settings.pitch}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={settings.pitch}
            onChange={(e) => setSetting("pitch", parseFloat(e.target.value))}
            style={{ width: "100%", accentColor: "var(--accent-orange)" }}
            aria-label="Speech pitch slider"
          />
        </div>

        {/* Accessibility Settings */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", borderTop: "1px solid var(--card-border)", paddingTop: "1rem", marginTop: "0.5rem" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--muted-text)" }}>
            {lang === "en" ? "Accessibility" : lang === "hi" ? "अभिगम्यता" : "प्रवेशयोग्यता"}
          </span>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--foreground)", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={settings.reduceMotion || false}
              onChange={(e) => setSetting("reduceMotion", e.target.checked)}
              style={{
                width: "16px",
                height: "16px",
                accentColor: "var(--accent-orange)",
                cursor: "pointer"
              }}
            />
            <span>
              {lang === "en" ? "Reduce UI animations and motion" : lang === "hi" ? "यूआई एनिमेशन और गति कम करें" : "यूआय ॲनिमेशन आणि गती कमी करा"}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
