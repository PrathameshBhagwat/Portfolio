"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./VoiceIntroduction.module.css";

export default function TranscriptPanel({ isOpen }) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: "auto",
            opacity: 1,
            transition: { height: { duration: 0.35, ease: "easeOut" }, opacity: { duration: 0.25, delay: 0.1 } }
          }}
          exit={{
            height: 0,
            opacity: 0,
            transition: { height: { duration: 0.3, ease: "easeIn" }, opacity: { duration: 0.15 } }
          }}
          className={styles.transcriptPanel}
          data-lenis-prevent
        >
          <p>
            &ldquo;Hi, I&apos;m Prathamesh Bhagwat. I am an AI and Data Science Engineer passionate about building intelligent, scalable digital products. Over the years, I&apos;ve specialized in full-stack development, Python, React, and database systems. Whether it&apos;s training machine learning models or crafting premium, interactive web interfaces, I strive to turn ideas into clean, production-ready software. Thanks for stopping by, feel free to play the introduction or ask my AI assistant any questions!&rdquo;
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
