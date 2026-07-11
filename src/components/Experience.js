"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCalendar, FiMapPin } from "react-icons/fi";
import { useSpeechSynthesis } from "../context/SpeechContext";
import { translations } from "../data/translations";
import styles from "./Experience.module.css";

export default function Experience() {
  const [activeExp, setActiveExp] = useState(null);
  const { settings } = useSpeechSynthesis();
  const lang = settings?.language || "en";
  const t = translations[lang];

  // Handle closing modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveExp(null);
      }
    };
    if (activeExp) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeExp]);

  const experiences = [
    {
      id: "neuai",
      role: t.exp_neuai_role,
      company: "NeuAI Labs",
      type: "Remote",
      date: "Dec 2024 - Feb 2025",
      location: "Pune, India",
      logo: "/assets/logos/neuai_labs.jpg",
      logoBg: "#ffffff",
      points: t.exp_neuai_points,
    },
    {
      id: "future",
      role: t.exp_future_role,
      company: "Future Interns",
      type: "Remote",
      date: "Mar 2025 - May 2025",
      location: "Pune, India",
      logo: "/assets/logos/future_interns.jpg",
      logoBg: "#0a0a0a",
      points: t.exp_future_points,
    },
    {
      id: "tata",
      role: t.exp_tata_role,
      company: "Tata Virtual Internship",
      type: "Remote",
      date: "",
      location: "Pune, India",
      logo: "/assets/logos/tata_v2.png",
      logoBg: "#ffffff",
      points: t.exp_tata_points,
    },
    {
      id: "willpower",
      role: t.exp_willpower_role,
      company: "Willpower",
      type: "Remote",
      date: "Dec 2022 - May 2023",
      location: "Pune, India",
      logo: "/assets/logos/willpower_v2.png",
      logoBg: "#ffffff",
      points: t.exp_willpower_points,
    },
  ];

  return (
    <section className={styles.experience} id="experience">
      <div className="container">
        <h2 className="section-title">
          {lang === "en" ? (
            <>Professional <span className="text-gradient">Experience</span></>
          ) : (
            <span className="text-gradient">{t.exp_title}</span>
          )}
        </h2>
        <p className="section-subtitle">
          {t.exp_subtitle}
        </p>

        {/* Floating Cubes Grid */}
        <div className={styles.grid}>
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className={styles.cubeContainer}
              onClick={() => setActiveExp(exp)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveExp(exp);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View details for ${exp.company}`}
            >
              {/* 3D Glassmorphic Translucent Cube */}
              <div className={styles.cubeWrapper}>
                {/* Front face with logo */}
                <div className={`${styles.face} ${styles.faceFront}`}>
                  <div className={styles.logoPlaceholder} style={{ backgroundColor: exp.logoBg }}>
                    <Image src={exp.logo} alt={exp.company} width={136} height={136} className={styles.logoImage} />
                  </div>
                </div>
                {/* Side faces */}
                <div className={`${styles.face} ${styles.faceBack}`}>
                  <div className={styles.logoPlaceholder} style={{ backgroundColor: exp.logoBg }}>
                    <Image src={exp.logo} alt={exp.company} width={136} height={136} className={styles.logoImage} />
                  </div>
                </div>
                <div className={`${styles.face} ${styles.faceLeft}`}>
                  <div className={styles.logoPlaceholder} style={{ backgroundColor: exp.logoBg }}>
                    <Image src={exp.logo} alt={exp.company} width={136} height={136} className={styles.logoImage} />
                  </div>
                </div>
                <div className={`${styles.face} ${styles.faceRight}`}>
                  <div className={styles.logoPlaceholder} style={{ backgroundColor: exp.logoBg }}>
                    <Image src={exp.logo} alt={exp.company} width={136} height={136} className={styles.logoImage} />
                  </div>
                </div>
                <div className={`${styles.face} ${styles.faceTop}`} />
                <div className={`${styles.face} ${styles.faceBottom}`} />
              </div>

               {/* Labels under the cube */}
              <div className={styles.textBlock}>
                <h3 className={styles.company}>{exp.company}</h3>
                <p className={styles.role}>{exp.role}</p>
                {exp.date && <div className={styles.date}>{exp.date}</div>}
                <span className={styles.hint}>{t.exp_click_hint}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Experience Details Modal Dialog */}
        <AnimatePresence>
          {activeExp && (
            <motion.div
              className="modalBackdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveExp(null)}
            >
              <motion.div
                className={styles.modalCard}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()} // stop close on card click
              >
                <div className={styles.modalHeader}>
                  <div className={styles.modalTitleArea}>
                    <h3 className={styles.modalRole}>{activeExp.role}</h3>
                    <div className={styles.modalCompanyRow}>
                      <span className={styles.modalCompany}>{activeExp.company}</span>
                      <span className={styles.modalChip}>{activeExp.type}</span>
                    </div>
                  </div>

                  <div className={styles.modalMeta}>
                    {activeExp.date && (
                      <span className={styles.modalDate}>
                        <FiCalendar /> {activeExp.date}
                      </span>
                    )}
                    <span className={styles.modalLocation}>
                      <FiMapPin /> {activeExp.location}
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveExp(null)}
                    className={styles.closeBtn}
                    aria-label={t.exp_close}
                  >
                    <FiX />
                  </button>
                </div>

                <ul className={styles.modalList}>
                  {activeExp.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
