"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

const SpeechContext = createContext();

export function useSpeechSynthesis() {
  const context = useContext(SpeechContext);
  if (!context) {
    throw new Error("useSpeechSynthesis must be used within a SpeechProvider");
  }
  return context;
}

// Strip markdown tags to prevent speech synthesis from reading raw formatting tags
function stripMarkdown(text) {
  if (!text) return "";
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
    .replace(/\*([^*]+)\*/g, "$1")     // italic
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1") // link labels
    .replace(/#+\s+(.+)/g, "$1")        // headings
    .replace(/-\s+(.+)/g, "$1")        // list dashes
    .replace(/`([^`]+)`/g, "$1")       // inline code block
    .replace(/\n+/g, " ")             // replace newlines with spacing
    .trim();
}

const getBestVoiceForLanguage = (langCode, availableVoices) => {
  const filterLang = langCode.toLowerCase();
  
  // Try exact start matching (e.g. en, hi, mr)
  let match = availableVoices.find(v => v.lang.toLowerCase().replace("_", "-").startsWith(filterLang));
  
  if (!match) {
    if (filterLang === "hi") {
      match = availableVoices.find(v => v.name.toLowerCase().includes("hindi") || v.lang.toLowerCase().includes("hi"));
    } else if (filterLang === "mr") {
      match = availableVoices.find(v => v.name.toLowerCase().includes("marathi") || v.lang.toLowerCase().includes("mr"));
    } else {
      match = availableVoices.find(v => v.lang.toLowerCase().includes("en"));
    }
  }
  return match || null;
};

export function SpeechProvider({ children }) {
  const [voices, setVoices] = useState([]);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Settings loaded from localStorage (or defaults)
  const [settings, setSettings] = useState({
    voiceName: "",
    rate: 1,
    pitch: 1,
    volume: 1,
    language: "en",
    reduceMotion: false
  });

  const utteranceRef = useRef(null);

  // Fetch and sync voices list
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const updateVoicesList = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    updateVoicesList();
    window.speechSynthesis.onvoiceschanged = updateVoicesList;

    // Load settings from localStorage
    const savedSettings = localStorage.getItem("assistant_speech_settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setTimeout(() => setSettings(parsed), 0);
      } catch (e) {
        console.error("Error loading localStorage settings:", e);
      }
    }

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Save settings on changes
  const setSetting = (key, value) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem("assistant_speech_settings", JSON.stringify(updated));
      return updated;
    });
  };

  // Sync reduceMotion settings to document class list
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (settings.reduceMotion) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }
  }, [settings.reduceMotion]);

  const stop = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setSpeakingMsgId(null);
    setProgress(0);
    utteranceRef.current = null;
  };

  const pause = () => {
    if (typeof window === "undefined" || !window.speechSynthesis || !isSpeaking) return;

    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const resume = () => {
    if (typeof window === "undefined" || !window.speechSynthesis || !isSpeaking) return;

    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const speak = (msgId, rawText) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // Stop active speech first
    stop();

    const textToSpeak = stripMarkdown(rawText);
    if (!textToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;

    // Resolve voice
    const availableVoices = window.speechSynthesis.getVoices();
    let selectedVoice = null;

    if (settings.voiceName) {
      selectedVoice = availableVoices.find(v => v.name === settings.voiceName);
    }

    // Default or language fallback
    if (!selectedVoice) {
      selectedVoice = getBestVoiceForLanguage(settings.language, availableVoices);
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Apply speed, pitch, and volume adjustments
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;

    // Speech events handlers
    utterance.onstart = () => {
      setSpeakingMsgId(msgId);
      setIsSpeaking(true);
      setIsPaused(false);
      setProgress(0);
    };

    utterance.onend = () => {
      setSpeakingMsgId(null);
      setIsSpeaking(false);
      setIsPaused(false);
      setProgress(100);
      utteranceRef.current = null;
    };

    utterance.onerror = (e) => {
      if (e.error !== "interrupted") {
        console.error("SpeechSynthesis error:", e);
      }
      setSpeakingMsgId(null);
      setIsSpeaking(false);
      setIsPaused(false);
      setProgress(0);
      utteranceRef.current = null;
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    // Tracking progress based on read characters length
    utterance.onboundary = (event) => {
      if (event.name === "word") {
        const charIndex = event.charIndex;
        const calcPercent = (charIndex / textToSpeak.length) * 100;
        setProgress(Math.min(calcPercent, 100));
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const value = {
    voices,
    speakingMsgId,
    isSpeaking,
    isPaused,
    progress,
    settings,
    setSetting,
    speak,
    pause,
    resume,
    stop
  };

  return <SpeechContext.Provider value={value}>{children}</SpeechContext.Provider>;
}
