"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiTarget, FiZap, FiCpu, FiFeather } from "react-icons/fi";
import { useSpeechSynthesis } from "../context/SpeechContext";
import { translations } from "../data/translations";
import styles from "./About.module.css";
import LeetCodeHeatmap from "./LeetCodeHeatmap";

export default function About() {
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [sheen, setSheen] = useState({ x: 50, y: 50 });
  const [opacity, setOpacity] = useState(0);

  const { settings } = useSpeechSynthesis();
  const lang = settings?.language || "en";
  const t = translations[lang];

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    const rX = -(mouseY / height) * 30;
    const rY = (mouseX / width) * 30;
    const sX = ((e.clientX - rect.left) / width) * 100;
    const sY = ((e.clientY - rect.top) / height) * 100;
    setRotate({ x: rX, y: rY });
    setSheen({ x: sX, y: sY });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setSheen({ x: 50, y: 50 });
    setOpacity(0);
  };

  return (
    <section className={styles.about} id="about">
      <div className="container">
        <h2 className="section-title">
          {lang === "en" ? (
            <>About <span className="text-gradient">Me</span></>
          ) : (
            <span className="text-gradient">{t.about_title}</span>
          )}
        </h2>
        <p className="section-subtitle">
          {t.about_subtitle}
        </p>

        <div className={styles.grid}>
          {/* Left Column: Floating holographic card with continuous subtle animation & hanging link */}
          <div className={styles.imageColumn}>
            <div className={styles.holoContainer}>
              <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={styles.holoCard}
                style={{
                  transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Image
                  src="/assets/Hero_Image.webp"
                  alt="About Prathamesh"
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, 310px"
                />
                
                {/* Dynamic sheen spot */}
                <div 
                  className={styles.sheen}
                  style={{
                    background: `radial-gradient(circle at ${sheen.x}% ${sheen.y}%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 60%)`,
                    opacity: opacity,
                  }}
                />
                
                {/* Rainbow hologram overlay */}
                <div className={styles.hologramOverlay} />
                
                {/* Glassmorphic card text */}
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>Prathamesh Bhagwat</h3>
                  <p className={styles.cardSub}>{t.vc_ai_ds}</p>
                </div>
              </motion.div>

              {/* Hanging sticky link note */}
              <motion.a
                href="https://www.linkedin.com/in/prathamesh-bhagwat-52b651258/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.aboutStickyLink}
                initial={{ y: -10, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                whileHover={{ scale: 1.05, rotate: 1 }}
              >
                <div className={styles.aboutMiniClip}>
                  <div className={styles.aboutMiniClipInner} />
                </div>
                <div className={styles.aboutStickyContent}>
                  <span className={styles.stickyLinkText}>{t.about_know_more}</span>
                </div>
              </motion.a>
            </div>
          </div>

          {/* Right Column: Realistic notepad and sticky-notes */}
          <div className={styles.notepadArea}>
            {/* Paper clip holding the notepad */}
            <div className={styles.paperClip}>
              <div className={styles.clipInner} />
            </div>

            {/* Notepad page */}
            <motion.div
              className={styles.notepad}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Ruled lines background */}
              <div className={styles.ruledLines}>
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className={styles.ruledLine} />
                ))}
              </div>

              {/* Red margin line */}
              <div className={styles.marginLine} />

              {/* Pen icon decoration */}
              <div className={styles.penDecoration}>
                <FiFeather />
              </div>

              <h3 className={styles.notepadTitle}>
                <span className={styles.handwritten}>{t.about_profile_title}</span>
              </h3>

              {/* Sticky notes pinned on the notepad */}
              <div className={styles.stickyGrid}>
                {/* Vision note - yellow */}
                <div className={`${styles.stickyNote} ${styles.noteYellow}`}>
                  <div className={styles.tapeStrip} />
                  <h4 className={styles.noteTitle}>
                    <FiTarget /> {t.about_vision_title}
                  </h4>
                  <p className={styles.noteText}>
                    {t.about_vision_desc}
                  </p>
                </div>

                {/* Strengths note - pink */}
                <div className={`${styles.stickyNote} ${styles.notePink}`}>
                  <div className={styles.tapeStrip} />
                  <h4 className={styles.noteTitle}>
                    <FiZap /> {t.about_strengths_title}
                  </h4>
                  <p className={styles.noteText}>
                    {t.about_strengths_desc}
                  </p>
                </div>

                {/* Focus note - blue */}
                <div className={`${styles.stickyNote} ${styles.noteBlue}`}>
                  <div className={styles.tapeStrip} />
                  <h4 className={styles.noteTitle}>
                    <FiCpu /> {t.about_focus_title}
                  </h4>
                  <p className={styles.noteText}>
                    {t.about_focus_desc}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* LeetCode Contribution Heatmap */}
        <LeetCodeHeatmap />
      </div>
    </section>
  );
}
