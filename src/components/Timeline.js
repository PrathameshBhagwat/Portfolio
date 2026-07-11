"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpeechSynthesis } from "../context/SpeechContext";
import { translations } from "../data/translations";
import styles from "./Timeline.module.css";

export default function Timeline() {
  const [activeIdx, setActiveIdx] = useState(5); // default open 4th year book
  const { settings } = useSpeechSynthesis();
  const lang = settings?.language || "en";
  const t = translations[lang];

  const booksData = [
    {
      spineTitle: t.timeline_s1_title,
      schoolName: "K.V.K. High School",
      year: "2015 - 2020",
      result: "SSC - 87.20%",
      desc: t.timeline_s1_desc,
      gradient: "linear-gradient(to right, #94a3b8, #64748b)",
    },
    {
      spineTitle: t.timeline_s2_title,
      schoolName: "G.R.P. Sabnis Junior College",
      year: "2020 - 2022",
      result: "HSC - 71.83%",
      desc: t.timeline_s2_desc,
      gradient: "linear-gradient(to right, #818cf8, #4f46e5)",
    },
    {
      spineTitle: t.timeline_s3_title,
      schoolName: "SPPU - First Year",
      year: "2022 - 2023",
      result: "CGPA - 8.32",
      desc: t.timeline_s3_desc,
      gradient: "linear-gradient(to right, #6366f1, #4338ca)",
    },
    {
      spineTitle: t.timeline_s4_title,
      schoolName: "SPPU - Second Year",
      year: "2023 - 2024",
      result: "CGPA - 9.04",
      desc: t.timeline_s4_desc,
      gradient: "linear-gradient(to right, #4f46e5, #3730a3)",
    },
    {
      spineTitle: t.timeline_s5_title,
      schoolName: "SPPU - Third Year",
      year: "2024 - 2025",
      result: "CGPA - 9.28",
      desc: t.timeline_s5_desc,
      gradient: "linear-gradient(to right, #3730a3, #312e81)",
    },
    {
      spineTitle: t.timeline_s6_title,
      schoolName: "SPPU - Fourth Year",
      year: "2025 - 2026",
      result: "CGPA - 9.30",
      desc: t.timeline_s6_desc,
      gradient: "linear-gradient(to right, #312e81, #1e1b4b)",
    },
  ];

  const activeBook = booksData[activeIdx] || booksData[5];

  return (
    <section className={styles.education} id="education">
      <div className="container">
        <h2 className="section-title">
          {lang === "en" ? (
            <>Education &amp; <span className="text-gradient">Timeline</span></>
          ) : (
            <span className="text-gradient">{t.timeline_title}</span>
          )}
        </h2>
        <p className="section-subtitle">
          {t.timeline_subtitle}
        </p>

        <div className={styles.grid}>
          {/* Left: Bookshelf stack */}
          <div className={styles.bookshelf}>
            {booksData.map((book, idx) => (
              <div
                key={idx}
                className={`${styles.bookSpine} ${
                  activeIdx === idx ? styles.activeBookSpine : ""
                }`}
                style={{ background: book.gradient }}
                onClick={() => setActiveIdx(idx)}
              >
                <span>{book.spineTitle}</span>
                <span className={styles.spineYear}>{book.year}</span>
              </div>
            ))}
          </div>

          {/* Right: Ruled Notebook Display */}
          <div className={styles.notebook}>
            {/* Spiral binder loops */}
            <div className={styles.binder}>
              {[...Array(12)].map((_, i) => (
                <div key={i} className={styles.binderRing} />
              ))}
            </div>

            {/* Red margin line */}
            <div className={styles.marginLine} />

            {/* Ruled content with 3D Page turn transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, rotateY: -80, transformOrigin: "left center" }}
                animate={{ opacity: 1, rotateY: 0, transformOrigin: "left center" }}
                exit={{ opacity: 0, rotateY: 80, transformOrigin: "left center" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className={styles.ruledContent}
              >
                <div className={styles.paperHeader}>
                  <h3 className={styles.schoolTitle}>{activeBook.schoolName}</h3>
                  <span className={styles.schoolYear}>{activeBook.year}</span>
                </div>

                <div className={styles.gradeRow}>
                  <span className={styles.grade}>{activeBook.result}</span>
                </div>

                <div className={styles.notebookDesc}>
                  <p>{activeBook.desc}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
