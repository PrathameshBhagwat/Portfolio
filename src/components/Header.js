"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { FiSun, FiMoon, FiMenu, FiX, FiSettings } from "react-icons/fi";
import { BiHome, BiInfoCircle, BiBook, BiSolidGraduation, BiReceipt, BiEnvelope, BiBriefcase, BiAward } from "react-icons/bi";
import { useSmoothScroll } from "./SmoothScrollProvider";
import { useSpeechSynthesis } from "../context/SpeechContext";
import { translations } from "../data/translations";
import styles from "./Header.module.css";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);
  const { settings, setSetting } = useSpeechSynthesis();

  // Initialize theme state and register dynamic scroll listener for active section highlighting
  useEffect(() => {
    const checkDark = document.documentElement.classList.contains("dark");
    setTimeout(() => setIsDark(checkDark), 0);

    const handleScroll = () => {
      const sections = ["home", "about", "experience", "education", "skills", "project", "certificates", "contact"];
      let currentSection = "home";

      // Loop through sections to find which one is currently in view at the top of viewport
      for (let i = 0; i < sections.length; i++) {
        const id = sections[i];
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the top of the section is near the header bar or has passed it, but the bottom is still below the header
          if (rect.top <= 120 && rect.bottom >= 80) {
            currentSection = id;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    
    // Fallback/Deferred triggers to ensure dynamically loaded Next.js components are detected after render
    const timers = [
      setTimeout(handleScroll, 100),
      setTimeout(handleScroll, 500),
      setTimeout(handleScroll, 1500),
      setTimeout(handleScroll, 3000)
    ];

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      timers.forEach(clearTimeout);
    };
  }, []);

  // Close settings dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("portfolio-theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("portfolio-theme", "dark");
      setIsDark(true);
    }
  };

  const lang = settings?.language || "en";
  const translationsObj = translations[lang] || translations.en;

  const navItems = [
    { id: "home", label: translationsObj.nav_home, icon: <BiHome /> },
    { id: "about", label: translationsObj.nav_about, icon: <BiInfoCircle /> },
    { id: "experience", label: translationsObj.nav_experience, icon: <BiBriefcase /> },
    { id: "education", label: translationsObj.nav_education, icon: <BiBook /> },
    { id: "skills", label: translationsObj.nav_skills, icon: <BiSolidGraduation /> },
    { id: "project", label: translationsObj.nav_projects, icon: <BiReceipt /> },
    { id: "certificates", label: translationsObj.nav_certificates, icon: <BiAward /> },
    { id: "contact", label: translationsObj.nav_contact, icon: <BiEnvelope /> },
  ];

  const smoothScrollTo = useSmoothScroll();

  const handleNavClick = useCallback((e, id) => {
    e.preventDefault();
    smoothScrollTo(`#${id}`, { offset: -80 });
    setIsOpen(false);
  }, [smoothScrollTo]);

  const languages = [
    { code: "en", label: "EN" },
    { code: "hi", label: "हिं" },
    { code: "mr", label: "मरा" }
  ];

  return (
    <header className={styles.header}>
      <div className={`${styles.container} container`}>
        <a
          href="#home"
          className={styles.logo}
          onClick={(e) => handleNavClick(e, "home")}
        >
          Prathamesh<span className={styles.logoDot}>.</span>
        </a>

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          <ul className={styles.navLinks}>
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`${styles.navLink} ${
                    activeSection === item.id ? styles.active : ""
                  }`}
                >
                  {/* Text only on desktop navigation links to make it clean and spacious */}
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={styles.themeToggle}
              aria-label="Toggle Theme"
            >
              {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {/* Settings Dropdown */}
            <div className={styles.settingsWrapper} ref={settingsRef}>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={styles.settingsBtn}
                aria-label="Language & Accessibility Settings"
              >
                <FiSettings size={18} />
              </button>

              {showSettings && (
                <div className={styles.settingsDropdown}>
                  {/* Language Selection */}
                  <div>
                    <span className={styles.settingsLabel}>Language</span>
                    <div className={styles.langRow} style={{ marginTop: "0.4rem" }}>
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          className={`${styles.langBtn} ${settings.language === lang.code ? styles.langBtnActive : ""}`}
                          onClick={() => {
                            setSetting("language", lang.code);
                            setSetting("voiceName", "");
                          }}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accessibility */}
                  <div>
                    <span className={styles.settingsLabel}>Accessibility</span>
                    <label className={styles.motionRow} style={{ marginTop: "0.4rem" }}>
                      <input
                        type="checkbox"
                        checked={settings.reduceMotion || false}
                        onChange={(e) => setSetting("reduceMotion", e.target.checked)}
                      />
                      <span>Reduce animations</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={styles.mobileMenuBtn}
              aria-label="Toggle Menu"
            >
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        <div
          className={`${styles.mobileNav} ${
            isOpen ? styles.mobileNavActive : ""
          }`}
        >
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
              className={`${styles.navLink} ${
                activeSection === item.id ? styles.active : ""
              }`}
            >
              {item.icon}
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
