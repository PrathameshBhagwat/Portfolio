"use client";

import { FiArrowUp } from "react-icons/fi";
import { useSpeechSynthesis } from "../context/SpeechContext";
import styles from "./Footer.module.css";

export default function Footer() {
  const { settings } = useSpeechSynthesis();
  const lang = settings?.language || "en";

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} container`}>
        <div className={styles.text}>
          <p>
            Copyright &copy; {new Date().getFullYear()} by Prathamesh Bhagwat | {
              lang === "en" ? "All Rights Reserved." : lang === "hi" ? "सर्वाधिकार सुरक्षित।" : "सर्व हक्क राखीव."
            }
          </p>
        </div>
        
        {/* Scroll-to-top Button */}
        <button
          onClick={scrollToTop}
          className={styles.toTop}
          aria-label={lang === "en" ? "Scroll to top" : lang === "hi" ? "ऊपर स्क्रॉल करें" : "वर स्क्रॉल करा"}
        >
          <FiArrowUp />
        </button>
      </div>
    </footer>
  );
}
