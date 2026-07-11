"use client";

import React from "react";
import { useSpeechSynthesis } from "../context/SpeechContext";
import SpeechButton from "./SpeechButton";
import SpeechControls from "./SpeechControls";

export default function MessageSpeechPlayer({ messageId, text }) {
  const {
    speakingMsgId,
    isSpeaking,
    isPaused,
    progress,
    speak,
    pause,
    resume,
    stop
  } = useSpeechSynthesis();

  const isCurrentSpeaking = speakingMsgId === messageId;

  const handleSpeak = () => {
    speak(messageId, text);
  };

  return (
    <div style={{ width: "100%", marginTop: "0.25rem" }}>
      {isCurrentSpeaking ? (
        <SpeechControls
          isPaused={isPaused}
          onPause={pause}
          onResume={resume}
          onStop={stop}
          progress={progress}
        />
      ) : (
        <SpeechButton onClick={handleSpeak} />
      )}
    </div>
  );
}
