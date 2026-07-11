"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiPlay, FiPause, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useSpeechSynthesis } from "../../context/SpeechContext";
import { translations } from "../../data/translations";
import Waveform from "./Waveform";
import PlaybackControls from "./PlaybackControls";
import AudioProgress from "./AudioProgress";
import TranscriptPanel from "./TranscriptPanel";
import styles from "./VoiceIntroduction.module.css";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);

  const { settings } = useSpeechSynthesis();
  const lang = settings?.language || "en";
  const t = translations[lang];

  const audioRef = useRef(null);

  const formatTime = (time) => {
    if (isNaN(time) || time === Infinity || time === 0) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Initialize and load the Audio object on component mount
  useEffect(() => {
    const audio = new Audio("/assets/intro.mp3");
    audio.volume = volume;
    audio.muted = isMuted;
    audio.playbackRate = playbackRate;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = (e) => {
      console.error("Audio error: ", e);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    audioRef.current = audio;

    // Trigger metadata load if cached or already ready
    if (audio.readyState >= 1) {
      setTimeout(() => setDuration(audio.duration), 0);
    }

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseEnter = () => {
    // No-op since loaded on mount
  };

  // Sync volume state to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Sync mute state to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Sync playback rate to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch((err) => console.log("Play interrupted: ", err));
      setIsPlaying(true);
      setIsExpanded(true);
    }
  };

  const handleReplay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
    if (!isPlaying) {
      audio.play().catch((err) => console.log("Play interrupted: ", err));
      setIsPlaying(true);
    }
  };

  const handleSeek = (newTime) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div 
      className={styles.cardContainer}
      onMouseEnter={handleMouseEnter}
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          /* Collapsed Glassmorphism Hero Introduction Card */
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={styles.headerRow}
          >
            <div className={styles.leftInfo}>
              <div className={styles.micIconWrapper}>
                🎙
              </div>
              <div className={styles.titleArea}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span className={styles.title}>{t.vc_title}</span>
                  <span className={styles.durationBadge}>
                    {duration > 0 ? formatTime(duration) : "00:45"}
                  </span>
                </div>
                <span className={styles.subtitle}>&ldquo;{t.vc_subtitle}&rdquo;</span>
              </div>
            </div>

            <button
              className={styles.playBtn}
              onClick={handlePlayPause}
              aria-label="Play introduction audio"
            >
              <FiPlay style={{ fontSize: "1.3rem", flexShrink: 0 }} />
              <span className={styles.playBtnText}>{t.vc_play}</span>
            </button>
          </motion.div>
        ) : (
          /* Expanded Player View */
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className={styles.playerView}
          >
            {/* Header info plus equalizer waveform */}
            <div className={styles.playerHeader}>
              <div className={styles.leftInfo}>
                <div className={`${styles.micIconWrapper} ${isPlaying ? styles.pulsing : ""}`}>
                  🎙
                </div>
                <div className={styles.titleArea}>
                  <span className={styles.title}>{t.vc_voice_intro}</span>
                  <span className={styles.subtitle}>{t.vc_ai_ds}</span>
                </div>
              </div>

              <Waveform isPlaying={isPlaying} />
            </div>

            {/* Custom Seek Bar progress controls */}
            <AudioProgress
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
            />

            {/* Sub-controls row (Volume, Play/Pause, Mute, Cycle rate) */}
            <PlaybackControls
              isPlaying={isPlaying}
              isMuted={isMuted}
              volume={volume}
              playbackRate={playbackRate}
              onPlayPause={handlePlayPause}
              onReplay={handleReplay}
              onMuteToggle={() => setIsMuted(!isMuted)}
              onVolumeChange={setVolume}
              onSpeedChange={setPlaybackRate}
            />

            {/* Transcript collapse drawer toggler */}
            <div className={styles.transcriptToggleRow}>
              <button
                className={styles.transcriptToggleBtn}
                onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
                aria-expanded={isTranscriptOpen}
                aria-label="Toggle transcript content"
              >
                {isTranscriptOpen ? (
                  <>
                    <span>{t.vc_hide_transcript}</span>
                    <FiChevronUp />
                  </>
                ) : (
                  <>
                    <span>{t.vc_show_transcript}</span>
                    <FiChevronDown />
                  </>
                )}
              </button>
            </div>

            {/* Slide-out transcript container */}
            <TranscriptPanel isOpen={isTranscriptOpen} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
