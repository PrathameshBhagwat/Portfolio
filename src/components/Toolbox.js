"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaHtml5, FaCss3Alt, FaJava, FaPython, FaDatabase, FaGithub, FaReact, FaBrain, 
  FaGitAlt, FaNodeJs, FaChartLine, FaCode, FaDocker, FaAws
} from "react-icons/fa";
import { 
  SiSpringboot, SiCplusplus, SiTailwindcss, SiPostgresql, SiMongodb, 
  SiKaggle, SiPandas, SiNumpy, SiScikitlearn, SiStreamlit, SiSupabase, SiPrisma, SiFigma
} from "react-icons/si";
import { DiJavascript1 } from "react-icons/di";
import { BiNetworkChart } from "react-icons/bi";
import { TbChartDots } from "react-icons/tb";
import { useSpeechSynthesis } from "../context/SpeechContext";
import { translations } from "../data/translations";
import styles from "./Toolbox.module.css";

export default function Toolbox() {
  const [activeTab, setActiveTab] = useState("langs");
  const { settings } = useSpeechSynthesis();
  const lang = settings?.language || "en";
  const t = translations[lang];

  const categories = [
    { id: "langs", label: lang === "en" ? "Langs & Fullstack" : lang === "hi" ? "भाषाएं और वेब" : "भाषा आणि वेब" },
    { id: "data", label: lang === "en" ? "Data & AI" : lang === "hi" ? "डेटा और एआई" : "डेटा आणि एआय" },
    { id: "cloud", label: lang === "en" ? "Cloud & DevOps" : lang === "hi" ? "क्लाउड और डेवऑप्स" : "क्लाउड आणि डेव्हऑप्स" },
    { id: "db", label: lang === "en" ? "Database" : lang === "hi" ? "डेटाबेस" : "डेटाबेस" },
    { id: "tools", label: lang === "en" ? "Tools & Methods" : lang === "hi" ? "उपकरण और तरीके" : "साधने आणि पद्धती" },
  ];

  const skillsData = [
    // Langs & Fullstack
    { name: "Python", category: "langs", icon: <FaPython />, iconClass: styles.iconPython },
    { name: "Java", category: "langs", icon: <FaJava />, iconClass: styles.iconJava },
    { name: "NodeJS", category: "langs", icon: <FaNodeJs />, iconClass: styles.iconNodejs },
    { name: "React", category: "langs", icon: <FaReact />, iconClass: styles.iconReact },
    { name: "C++", category: "langs", icon: <SiCplusplus />, iconClass: styles.iconCplusplus },
    { name: "SpringBoot", category: "langs", icon: <SiSpringboot />, iconClass: styles.iconSpringboot },
    { name: "Tailwind", category: "langs", icon: <SiTailwindcss />, iconClass: styles.iconTailwind },
    { name: "HTML", category: "langs", icon: <FaHtml5 />, iconClass: styles.iconHtml },
    { name: "CSS", category: "langs", icon: <FaCss3Alt />, iconClass: styles.iconCss },
    { name: "Javascript", category: "langs", icon: <DiJavascript1 />, iconClass: styles.iconJs },
    { name: "REST API", category: "langs", icon: <BiNetworkChart />, iconClass: styles.iconNetwork },

    // Data & AI
    { name: "Pandas", category: "data", icon: <SiPandas />, iconClass: styles.iconPandas },
    { name: "NumPy", category: "data", icon: <SiNumpy />, iconClass: styles.iconNumpy },
    { name: "Scikit-Learn", category: "data", icon: <SiScikitlearn />, iconClass: styles.iconScikitlearn },
    { name: "Streamlit", category: "data", icon: <SiStreamlit />, iconClass: styles.iconStreamlit },
    { name: "Matplotlib", category: "data", icon: <FaChartLine />, iconClass: styles.iconMatplotlib },
    { name: "Seaborn", category: "data", icon: <TbChartDots />, iconClass: styles.iconSeaborn },
    { name: "Exploratory Data Analysis", category: "data", icon: <FaChartLine />, iconClass: styles.iconChart },

    // Cloud & DevOps
    { name: "Git", category: "cloud", icon: <FaGitAlt />, iconClass: styles.iconGit },
    { name: "GitHub", category: "cloud", icon: <FaGithub />, iconClass: styles.iconGit },
    { name: "AWS", category: "cloud", icon: <FaAws />, iconClass: styles.iconAws },
    { name: "Docker", category: "cloud", icon: <FaDocker />, iconClass: styles.iconDocker },

    // Database
    { name: "SQL", category: "db", icon: <FaDatabase />, iconClass: styles.iconDatabase },
    { name: "PostgreSQL", category: "db", icon: <SiPostgresql />, iconClass: styles.iconPostgresql },
    { name: "MongoDB", category: "db", icon: <SiMongodb />, iconClass: styles.iconMongodb },
    { name: "Supabase", category: "db", icon: <SiSupabase />, iconClass: styles.iconSupabase },
    { name: "Prisma ORM", category: "db", icon: <SiPrisma />, iconClass: styles.iconPrisma },

    // Tools & Methods
    { name: "VS Code", category: "tools", icon: <FaCode />, iconClass: styles.iconCode },
    { name: "Kaggle", category: "tools", icon: <SiKaggle />, iconClass: styles.iconKaggle },
    { name: "Figma", category: "tools", icon: <SiFigma />, iconClass: styles.iconFigma },
    { name: "DSA (Problem Solving)", category: "tools", icon: <FaBrain />, iconClass: styles.iconBrain },
  ];

  const filteredSkills = skillsData.filter((skill) => skill.category === activeTab);

  const gridVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15 } },
  };

  return (
    <section className={styles.toolbox} id="skills">
      <div className="container">
        <h2 className="section-title">
          {lang === "en" ? (
            <>My <span className="text-gradient">Toolbox</span></>
          ) : (
            <span className="text-gradient">{t.toolbox_title}</span>
          )}
        </h2>
        <p className="section-subtitle">
          {t.toolbox_subtitle}
        </p>

        {/* Filter Pills */}
        <div className={styles.tabs}>
          {categories.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${styles.tabBtn} ${
                activeTab === tab.id ? styles.tabActive : ""
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Skills Capsules Grid */}
        <motion.div
          className={styles.grid}
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, idx) => (
              <motion.div
                key={skill.name}
                className={styles.pill}
                variants={cardVariants}
                layout
                initial="hidden"
                animate="show"
                exit="exit"
                style={{
                  animationDelay: `${(idx % 4) * 0.4}s`,
                }}
              >
                <div className={`${styles.icon} ${skill.iconClass}`}>
                  {skill.icon}
                </div>
                <span className={styles.text}>{skill.name}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
