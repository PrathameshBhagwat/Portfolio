"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageSquare } from "react-icons/fi";
import { useSpeechSynthesis } from "../context/SpeechContext";
import { translations } from "../data/translations";
import styles from "./AIAssistant.module.css";

// Code-split and lazy-load the chat window dynamically
const ChatWindow = dynamic(() => import("./ChatWindow"), {
  ssr: false,
  loading: () => null,
});

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useSpeechSynthesis();
  const lang = settings?.language || "en";
  const t = translations[lang];

  return (
    <>
      {/* Floating Tooltip Label */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className={styles.chatTooltip}
            onClick={() => setIsOpen(true)}
          >
            <span>{t.ai_tooltip}</span>
            <div className={styles.tooltipArrow} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.floatingBtn} ${isOpen ? styles.floatingBtnActive : ""}`}
        aria-label="Toggle AI Portfolio Assistant"
      >
        {isOpen ? (
          <span style={{ fontSize: "1.6rem", fontWeight: "300", lineHeight: "1" }}>&times;</span>
        ) : (
          <FiMessageSquare size={24} />
        )}
      </button>

      {/* Animated Lazy Chat window wrapper */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            style={{ position: "fixed", bottom: "96px", right: "24px", zIndex: 1000 }}
          >
            <ChatWindow onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
