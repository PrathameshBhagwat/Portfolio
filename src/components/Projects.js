"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import { 
  SiNextdotjs, SiTailwindcss, SiFirebase, 
  SiPython, SiReact, SiNodedotjs, SiGooglecloud, 
  SiSpringboot, SiPostman, SiPostgresql, 
  SiPandas, SiJupyter, SiArduino, SiTensorflow 
} from "react-icons/si";
import { FaMicrochip, FaDatabase, FaVolumeUp, FaJava, FaBrain } from "react-icons/fa";
import { FiCpu } from "react-icons/fi";
import { useSpeechSynthesis } from "../context/SpeechContext";
import { translations } from "../data/translations";
import styles from "./Projects.module.css";

// Helper function to return tech icons
function getTechIcon(tag) {
  switch (tag.toLowerCase()) {
    case "next.js": return <SiNextdotjs style={{ fontSize: "0.85rem" }} />;
    case "ai integration": return <FaBrain style={{ fontSize: "0.85rem" }} />;
    case "tailwind css": return <SiTailwindcss style={{ fontSize: "0.85rem" }} />;
    case "firebase": return <SiFirebase style={{ fontSize: "0.85rem" }} />;
    case "python": return <SiPython style={{ fontSize: "0.85rem" }} />;
    case "machine learning": return <SiTensorflow style={{ fontSize: "0.85rem" }} />;
    case "react": return <SiReact style={{ fontSize: "0.85rem" }} />;
    case "node.js": return <SiNodedotjs style={{ fontSize: "0.85rem" }} />;
    case "iot": return <FaMicrochip style={{ fontSize: "0.85rem" }} />;
    case "sensors": return <FaMicrochip style={{ fontSize: "0.85rem" }} />;
    case "cloud integration": return <SiGooglecloud style={{ fontSize: "0.85rem" }} />;
    case "data logging": return <FaDatabase style={{ fontSize: "0.85rem" }} />;
    case "java": return <FaJava style={{ fontSize: "0.85rem" }} />;
    case "spring boot": return <SiSpringboot style={{ fontSize: "0.85rem" }} />;
    case "rest api": return <SiPostman style={{ fontSize: "0.85rem" }} />;
    case "dbms": return <SiPostgresql style={{ fontSize: "0.85rem" }} />;
    case "pandas": return <SiPandas style={{ fontSize: "0.85rem" }} />;
    case "matplotlib": return <SiPython style={{ fontSize: "0.85rem" }} />;
    case "data analysis": return <SiJupyter style={{ fontSize: "0.85rem" }} />;
    case "arduino": return <SiArduino style={{ fontSize: "0.85rem" }} />;
    case "speech synthesis": return <FaVolumeUp style={{ fontSize: "0.85rem" }} />;
    case "embedded": return <FiCpu style={{ fontSize: "0.85rem" }} />;
    default: return null;
  }
}

// Separate Sub-component to manage independent active face states per project card
function ProjectCard({ project, index, t }) {
  const [activeFace, setActiveFace] = useState("front");

  // Grid entry animations
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", delay: index * 0.05 } },
  };

  return (
    <motion.div
      className={styles.cardContainer}
      variants={cardVariants}
    >
      {/* 3D Rotating Cube */}
      <div className={`${styles.cube} ${
        activeFace === "front" ? styles.showFront :
        activeFace === "back" ? styles.showBack :
        activeFace === "right" ? styles.showRight :
        styles.showLeft
      }`}>
        {/* Front Face: Title and Image */}
        <div 
          className={`${styles.face} ${styles.faceFront} ${activeFace === "front" ? styles.faceActive : ""}`}
          style={{ 
            pointerEvents: activeFace === "front" ? "auto" : "none",
            zIndex: activeFace === "front" ? 5 : 1 
          }}
        >
          <div className={styles.imgWrapper}>
            <Image
              src={project.image}
              alt={project.title}
              fill
              className={styles.img}
              sizes="290px"
            />
          </div>
          <div className={styles.frontOverlay}>
            <h3 className={styles.frontTitle}>{project.title}</h3>
            <span className={styles.frontHint}>Flip to view details</span>
          </div>
        </div>

        {/* Back Face: Description */}
        <div 
          className={`${styles.face} ${styles.faceBack} ${activeFace === "back" ? styles.faceActive : ""}`}
          style={{ 
            pointerEvents: activeFace === "back" ? "auto" : "none",
            zIndex: activeFace === "back" ? 5 : 1 
          }}
        >
          <h4 className={styles.faceTitle}>Description</h4>
          <div className={styles.desc}>
            <ul style={{ paddingLeft: "1.1rem", margin: 0, fontSize: "0.78rem", display: "flex", flexDirection: "column", gap: "0.45rem", color: "var(--muted-text)", textAlign: "left" }}>
              {Array.isArray(project.desc) ? (
                project.desc.map((pt, i) => (
                  <li key={i} style={{ listStyleType: "disc" }}>{pt}</li>
                ))
              ) : (
                <li>{project.desc}</li>
              )}
            </ul>
          </div>
        </div>

        {/* Right Face: Tech Stack */}
        <div 
          className={`${styles.face} ${styles.faceRight} ${activeFace === "right" ? styles.faceActive : ""}`}
          style={{ 
            pointerEvents: activeFace === "right" ? "auto" : "none",
            zIndex: activeFace === "right" ? 5 : 1 
          }}
        >
          <h4 className={styles.faceTitle}>Tech Stack</h4>
          <div className={styles.tags}>
            {project.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {getTechIcon(tag)} {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Left Face: Links */}
        <div 
          className={`${styles.face} ${styles.faceLeft} ${activeFace === "left" ? styles.faceActive : ""}`}
          style={{ 
            pointerEvents: activeFace === "left" ? "auto" : "none",
            zIndex: activeFace === "left" ? 5 : 1 
          }}
        >
          <h4 className={styles.faceTitle}>Project Links</h4>
          <div className={styles.links}>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkBtn}
              tabIndex={activeFace === "left" ? 0 : -1}
            >
              <FiGithub /> {t.project_view_github}
            </a>
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkBtn}
                tabIndex={activeFace === "left" ? 0 : -1}
              >
                <FiExternalLink /> {t.project_live_demo}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Shadow underneath the cube */}
      <div className={styles.shadowUnderneath} />

      {/* Manual face controls */}
      <div className={styles.controls}>
        <button
          onClick={() => setActiveFace("front")}
          className={`${styles.controlBtn} ${activeFace === "front" ? styles.activeControlBtn : ""}`}
        >
          Cover
        </button>
        <button
          onClick={() => setActiveFace("back")}
          className={`${styles.controlBtn} ${activeFace === "back" ? styles.activeControlBtn : ""}`}
        >
          Info
        </button>
        <button
          onClick={() => setActiveFace("right")}
          className={`${styles.controlBtn} ${activeFace === "right" ? styles.activeControlBtn : ""}`}
        >
          Tech
        </button>
        <button
          onClick={() => setActiveFace("left")}
          className={`${styles.controlBtn} ${activeFace === "left" ? styles.activeControlBtn : ""}`}
        >
          Links
        </button>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const { settings } = useSpeechSynthesis();
  const lang = settings?.language || "en";
  const t = translations[lang];

  const projectsData = [
    {
      title: "Smart Campaign Manager",
      desc: t.p5_desc,
      tags: ["Next.js", "AI Integration", "Tailwind CSS", "Firebase"],
      image: "/assets/smart_campaign_manager_v2.png",
      github: "https://github.com/PrathameshBhagwat/smart-campaign-manager.git",
      demo: "https://smartcampaign.duckdns.org",
    },
    {
      title: "FutureMap",
      desc: t.p1_desc,
      tags: ["Python", "Machine Learning", "React", "Node.js"],
      image: "/assets/AI Career Guidance.webp",
      github: "https://github.com/PrathameshBhagwat/Futuremap.git",
      demo: "https://futuremap-psi.vercel.app/",
    },
    {
      title: "IoT Virtual Doctor",
      desc: t.p2_desc,
      tags: ["IoT", "Sensors", "Cloud Integration", "Data Logging"],
      image: "/assets/iot.jpg",
      github: "https://github.com/PrathameshBhagwat/IoT-Virtual-Doctor.git",
      demo: "https://drive.google.com/drive/folders/13tAolZj9d590GxEEW0C96zicgX8Ri5Lj?usp=drive_link",
    },
    {
      title: "Employee Management System",
      desc: t.p3_desc,
      tags: ["Java", "Spring Boot", "REST API", "DBMS"],
      image: "/assets/employee_management.jpg",
      github: "https://github.com/PrathameshBhagwat/Employee_Management.git",
      demo: null,
    },
    {
      title: "Uber Ride Data Analysis",
      desc: t.p4_desc,
      tags: ["Python", "Pandas", "Matplotlib", "Data Analysis"],
      image: "/assets/uber_ride_analysis.webp",
      github: "https://github.com/PrathameshBhagwat/Uber_Ride_Analysis.git",
      demo: null,
    },
    {
      title: "NavEye",
      desc: t.p6_desc,
      tags: ["Arduino", "Sensors", "Speech Synthesis", "Embedded"],
      image: "/assets/naveye.png",
      github: "https://github.com/PrathameshBhagwat/NavEye.git",
      demo: null,
    },
  ];

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  return (
    <section className={styles.projects} id="project">
      <div className="container">
        <h2 className="section-title">
          {lang === "en" ? (
            <>My <span className="text-gradient">Projects</span></>
          ) : (
            <span className="text-gradient">{t.project_title}</span>
          )}
        </h2>
        <p className="section-subtitle">
          {t.project_subtitle}
        </p>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {projectsData.map((project, index) => (
            <ProjectCard
              key={index}
              project={project}
              index={index}
              t={t}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
