"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { FiCode, FiArrowRight } from "react-icons/fi";
import { useSmoothScroll } from "./SmoothScrollProvider";
import { useSpeechSynthesis } from "../context/SpeechContext";
import { translations } from "../data/translations";
import styles from "./Hero.module.css";
import VoiceIntroductionCard from "./VoiceIntroduction/VoiceIntroductionCard";

export default function Hero() {
  const smoothScrollTo = useSmoothScroll();
  const [particles, setParticles] = useState([]);
  const { settings } = useSpeechSynthesis();
  const lang = settings?.language || "en";
  const t = translations[lang];

  const triggerPop = () => {
    const newParticles = Array.from({ length: 14 }, (_, i) => ({
      id: Math.random(),
      angle: (i * 360) / 14 + (Math.random() - 0.5) * 12,
      distance: 35 + Math.random() * 45,
      color: ["#f97316", "#a855f7", "#06b6d4", "#ec4899"][Math.floor(Math.random() * 4)],
      size: 4 + Math.random() * 5
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 850);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 1, ease: "easeOut" } },
  };

  // Saturn ring items — these orbit the image
  const ringItems = [
    "React", "Python", "Java", "Node.js", "Spring Boot",
    "AI/ML", "JavaScript", "SQL",
  ];

  return (
    <section className={styles.hero} id="home">
      {/* Subtle color-shifting background */}
      <div className={styles.heroBg} />
      <div className="shape shape-1" />
      <div className="shape shape-2" />

      <div className={`${styles.container} container`}>
        {/* Left Column: Text content */}
        <motion.div
          className={styles.content}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className={styles.title} variants={itemVariants}>
            {t.hero_greeting}{" "}
            <span 
              className={styles.nameHighlight}
              onMouseEnter={triggerPop}
              style={{ position: "relative", cursor: "pointer", display: "inline-block" }}
            >
              <span className="text-gradient">Prathamesh Bhagwat</span>
              {particles.map((p) => (
                <motion.span
                  key={p.id}
                  initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1.2, 0.8],
                    x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
                    y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
                    opacity: 0
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    width: p.size,
                    height: p.size,
                    backgroundColor: p.color,
                    borderRadius: "50%",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "none",
                    zIndex: 20,
                    boxShadow: `0 0 10px ${p.color}`
                  }}
                />
              ))}
            </span>
          </motion.h1>

          <motion.p className={styles.desc} variants={itemVariants}>
            {t.hero_desc}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div className={styles.btnGroup} variants={itemVariants}>
            <a
              href="/assets/Prathamesh_Bhagwat_Resume.pdf"
              className="btn btn-primary"
              download="Prathamesh_Bhagwat_Resume.pdf"
            >
              {t.hero_cv}
            </a>
            <a
              href="#contact"
              className="btn btn-secondary"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollTo("#contact", { offset: -80 });
              }}
            >
              {t.hero_talk} <FiArrowRight />
            </a>
          </motion.div>

          {/* Social Links */}
          <motion.div className={styles.socialLinks} variants={itemVariants}>
            <a href="https://github.com/PrathameshBhagwat" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="GitHub"><FaGithub /></a>
            <a href="https://www.linkedin.com/in/prathamesh-bhagwat-52b651258/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LinkedIn"><FaLinkedinIn /></a>
            <a href="https://leetcode.com/u/Prathamesh_Bhagwat_31/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LeetCode"><FiCode /></a>
            <a href="https://www.instagram.com/prathamesh_bhagwat07?igsh=MWx5cnkwZDl6c2EzbQ==" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram"><FaInstagram /></a>
            <a href="https://www.facebook.com/share/1UcmqF9gxy/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook"><FaFacebookF /></a>
          </motion.div>
        </motion.div>

        {/* Right Column: Profile image with Saturn rings */}
        <motion.div
          className={styles.visual}
          variants={imageVariants}
          initial="hidden"
          animate="visible"
        >
          <div className={styles.planetSystem}>
            {/* Decorative sparkle stars */}
            <div className={`${styles.sparkle} ${styles.sparkle1}`}>✦</div>
            <div className={`${styles.sparkle} ${styles.sparkle2}`}>✦</div>
            <div className={`${styles.sparkle} ${styles.sparkle3}`}>✦</div>
            <div className={`${styles.sparkle} ${styles.sparkle4}`}>✦</div>

            {/* Dot grid decoration */}
            <div className={`${styles.dotGrid} ${styles.dotGridTL}`} />
            <div className={`${styles.dotGrid} ${styles.dotGridBR}`} />

            {/* The profile image — the "planet" */}
            <div className={styles.planet}>
              <Image
                src="/assets/Hero_Image.webp"
                alt="Prathamesh Bhagwat"
                width={240}
                height={240}
                priority
                loading="eager"
                className={styles.planetImage}
                sizes="(max-width: 768px) 170px, 240px"
              />
            </div>

            {/* Ground shadow */}
            <div className={styles.groundShadow} />

            {/* Saturn Ring 1 — inner fast ring */}
            <div className={styles.saturnRing}>
              {ringItems.map((label, i) => (
                <span
                  key={label}
                  className={styles.ringLabel}
                  style={{
                    "--angle": `${(360 / ringItems.length) * i}deg`,
                  }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Saturn Ring 2 — outer slower ring (decorative glow) */}
            <div className={styles.saturnRingOuter} />
          </div>

          {/* Voice Introduction Card placed directly below the Saturn animation */}
          <div className={styles.voiceCardWrapper}>
            <VoiceIntroductionCard />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
