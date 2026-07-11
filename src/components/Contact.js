"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhoneCall, FiMapPin, FiSend } from "react-icons/fi";
import { useSpeechSynthesis } from "../context/SpeechContext";
import { translations } from "../data/translations";
import styles from "./Contact.module.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const { settings } = useSpeechSynthesis();
  const lang = settings?.language || "en";
  const t = translations[lang];

  const [status, setStatus] = useState({
    submitting: false,
    success: null,
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus({
          submitting: false,
          success: true,
          message: t.contact_success,
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        setStatus({
          submitting: false,
          success: false,
          message: result.message || t.contact_error,
        });
      }
    } catch (error) {
      setStatus({
        submitting: false,
        success: false,
        message: t.contact_error,
      });
    }
  };

  return (
    <section className={styles.contact} id="contact">
      <div className="container">
        <h2 className="section-title">
          {lang === "en" ? (
            <>Contact <span className="text-gradient">Me!</span></>
          ) : (
            <span className="text-gradient">{t.contact_title}</span>
          )}
        </h2>
        <p className="section-subtitle">
          {t.contact_subtitle}
        </p>

        <div className={styles.grid}>
          {/* Left Column: Contact details */}
          <div className={styles.infoColumn}>
            <div className={styles.infoCard}>
              <div className={styles.iconWrapper}>
                <FiMail />
              </div>
              <div className={styles.infoContent}>
                <h4>{lang === "en" ? "Email Me" : lang === "hi" ? "मुझे ईमेल करें" : "मला ईमेल करा"}</h4>
                <p>bhagwatprathamesh2626@gmail.com</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.iconWrapper}>
                <FiPhoneCall />
              </div>
              <div className={styles.infoContent}>
                <h4>{lang === "en" ? "Call Me" : lang === "hi" ? "मुझे कॉल करें" : "मला कॉल करा"}</h4>
                <p>+91 9834820606</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.iconWrapper}>
                <FiMapPin />
              </div>
              <div className={styles.infoContent}>
                <h4>{lang === "en" ? "Location" : lang === "hi" ? "स्थान" : "स्थान"}</h4>
                <p>Pune, Maharashtra, India</p>
              </div>
            </div>
          </div>

          {/* Right Column: Submission Form */}
          <motion.div
            className={styles.formCard}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form
              onSubmit={handleSubmit}
              className={styles.form}
            >
              
              <div className={styles.inputRow}>
                <div className={styles.field}>
                  <label htmlFor="name">{lang === "en" ? "Full Name" : lang === "hi" ? "पूरा नाम" : "पूर्ण नाव"}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t.contact_name}
                    required
                    className={styles.input}
                  />
                </div>
                
                <div className={styles.field}>
                  <label htmlFor="email">{lang === "en" ? "Email Address" : lang === "hi" ? "ईमेल पता" : "ईमेल पत्ता"}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t.contact_email}
                    required
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.field}>
                  <label htmlFor="phone">{lang === "en" ? "Mobile Number" : lang === "hi" ? "मोबाइल नंबर" : "मोबाईल क्रमांक"}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9834820606"
                    required
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="subject">{lang === "en" ? "Email Subject" : lang === "hi" ? "ईमेल का विषय" : "ईमेल विषय"}</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={t.contact_subject}
                    required
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="message">{lang === "en" ? "Your Message" : lang === "hi" ? "आपका संदेश" : "तुमचा संदेश"}</label>
                <textarea
                  id="message"
                  name="message"
                  cols="30"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t.contact_msg}
                  required
                  className={styles.textarea}
                />
              </div>

              {/* Netlify Recaptcha hook */}
              <div data-netlify-recaptcha="true"></div>

              {status.message && (
                <div
                  className={`${styles.statusMessage} ${
                    status.success ? styles.success : styles.error
                  }`}
                >
                  {status.message}
                </div>
              )}

              <div style={{ marginTop: "1rem" }}>
                <button
                  type="submit"
                  disabled={status.submitting}
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                >
                  {status.submitting ? t.contact_sending : t.contact_send}
                  <FiSend style={{ marginLeft: "4px" }} />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
