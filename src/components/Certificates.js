"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiUdemy } from "react-icons/si";
import { useSpeechSynthesis } from "../context/SpeechContext";
import { translations } from "../data/translations";
import styles from "./Certificates.module.css";

// Custom SVG logos
const OracleLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
    <path d="M12 4C5.373 4 0 7.582 0 12s5.373 8 12 8 12-3.582 12-8-5.373-8-12-8zm0 12c-4.418 0-8-1.79-8-4s3.582-4 8-4 8 1.79 8 4-3.582 4-8 4z" />
  </svg>
);

const MicrosoftLogo = () => (
  <svg viewBox="0 0 23 23" width="1.1em" height="1.1em">
    <rect x="0" y="0" width="10.5" height="10.5" fill="#f25022" />
    <rect x="12.5" y="0" width="10.5" height="10.5" fill="#7fba00" />
    <rect x="0" y="12.5" width="10.5" height="10.5" fill="#00a4ef" />
    <rect x="12.5" y="12.5" width="10.5" height="10.5" fill="#ffb900" />
  </svg>
);

const LinkedInBadge = () => (
  <svg viewBox="0 0 24 24" fill="#0a66c2" width="1em" height="1em">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export default function Certificates() {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const trackRef = useRef(null);
  const { settings } = useSpeechSynthesis();
  const lang = settings?.language || "en";
  const t = translations[lang];

  const credentials = [
    {
      title: lang === "en" ? "OCI 2025 Certified Developer Professional" : lang === "hi" ? "ओसआई २०२५ प्रमाणित डेवलपर प्रोफेशनल" : "ओसआय २०२५ प्रमाणित डेव्हलपर प्रोफेशनल",
      subtitle: "Oracle Cloud Infrastructure",
      issuer: "Oracle University",
      issuerLogo: <OracleLogo />,
      date: lang === "en" ? "September 29, 2025" : lang === "hi" ? "२९ सितंबर २०२५" : "२९ सप्टेंबर २०२५",
      validUntil: lang === "en" ? "September 29, 2027" : lang === "hi" ? "२९ सितंबर २०२७" : "२९ सप्टेंबर २०२७",
      credId: "102578289OCID25CP",
      signedBy: "Damien Carey",
      signedTitle: "Senior Vice President, Oracle University",
      theme: "oracle",
    },
    {
      title: lang === "en" ? "OCI 2025 Certified Data Science Professional" : lang === "hi" ? "ओसआई २०२५ प्रमाणित डेटा साइंस प्रोफेशनल" : "ओसआय २०२५ प्रमाणित डेटा सायन्स प्रोफेशनल",
      subtitle: "Oracle Cloud Infrastructure",
      issuer: "Oracle University",
      issuerLogo: <OracleLogo />,
      date: "September 29, 2025",
      validUntil: "September 29, 2027",
      credId: "102578289OCID25CP",
      signedBy: "Damien Carey",
      signedTitle: "Senior Vice President, Oracle University",
      theme: "oracle",
    },
    {
      title: "OCI 2025 Certified Data Science Professional",
      subtitle: "Oracle Cloud Infrastructure",
      issuer: "Oracle University",
      issuerLogo: <OracleLogo />,
      date: "September 09, 2025",
      validUntil: "September 09, 2027",
      credId: "102578289OCI25DSOCP",
      signedBy: "Damien Carey",
      signedTitle: "Senior Vice President, Oracle University",
      theme: "oracle",
    },
    {
      title: "OCI 2025 Certified Generative AI Professional",
      subtitle: "Oracle Cloud Infrastructure",
      issuer: "Oracle University",
      issuerLogo: <OracleLogo />,
      date: "September 12, 2025",
      validUntil: "September 12, 2027",
      credId: "102578289OCI25GAIOCP",
      signedBy: "Damien Carey",
      signedTitle: "Senior Vice President, Oracle University",
      theme: "oracle",
    },
    {
      title: "Career Essentials in Generative AI",
      subtitle: "by Microsoft and LinkedIn",
      issuer: "Microsoft & LinkedIn Learning",
      issuerLogo: <MicrosoftLogo />,
      date: "November 04, 2024",
      validUntil: null,
      credId: "9d3f09b33e...8ba54d1",
      signedBy: "Dan Brodnietz",
      signedTitle: "Head of Global Content, Learning",
      skills: ["Computer Ethics", "Artificial Intelligence (AI)", "Generative AI"],
      theme: "microsoft",
      badge: <LinkedInBadge />,
    },
    {
      title: "Career Essentials in Software Development",
      subtitle: "by Microsoft and LinkedIn",
      issuer: "Microsoft & LinkedIn Learning",
      issuerLogo: <MicrosoftLogo />,
      date: "October 19, 2024",
      validUntil: null,
      credId: "284cee620...d8660d93",
      signedBy: "Dan Brodnietz",
      signedTitle: "Head of Global Content, Learning",
      skills: ["Programming", "Software Development"],
      theme: "microsoft",
      badge: <LinkedInBadge />,
    },
    {
      title: "Mastering Data Structures & Algorithms using C and C++",
      subtitle: "58.5 total hours",
      issuer: "Udemy — Abdul Bari",
      issuerLogo: <SiUdemy />,
      date: "September 30, 2024",
      validUntil: null,
      credId: "UC-e239d0bc-ef30-4bf0-a231-df3fdb0de795",
      signedBy: null,
      signedTitle: null,
      theme: "udemy",
    },
  ];

  // Duplicate for seamless loop
  const duped = [...credentials, ...credentials, ...credentials];

  return (
    <section className={styles.certificates} id="certificates">
      <div className="container">
        <h2 className="section-title">
          {lang === "en" ? (
            <>Certificates &amp; <span className="text-gradient">Credentials</span></>
          ) : (
            <span className="text-gradient">{t.cert_title}</span>
          )}
        </h2>
        <p className="section-subtitle">
          {t.cert_subtitle}
        </p>

        {/* Auto-scrolling carousel */}
        <div className={styles.carouselContainer}>
          <div className={styles.track} ref={trackRef}>
            {duped.map((cert, idx) => (
              <div
                key={idx}
                className={`${styles.certCard} ${styles[`theme_${cert.theme}`]}`}
                onClick={() => setSelectedIdx(idx % credentials.length)}
              >
                {/* Decorative corner accents for Oracle */}
                {cert.theme === "oracle" && (
                  <>
                    <div className={`${styles.corner} ${styles.cornerTL}`} />
                    <div className={`${styles.corner} ${styles.cornerTR}`} />
                    <div className={`${styles.corner} ${styles.cornerBL}`} />
                    <div className={`${styles.corner} ${styles.cornerBR}`} />
                  </>
                )}

                {/* Header */}
                <div className={styles.certCardHeader}>
                  <div className={styles.certIssuerLogo}>{cert.issuerLogo}</div>
                  <span className={styles.certIssuerText}>{cert.issuer}</span>
                </div>

                {/* Body */}
                <div className={styles.certCardBody}>
                  {cert.theme === "oracle" && (
                    <p className={styles.certType}>Oracle Certified Professional</p>
                  )}
                  <h3 className={styles.certTitle}>{cert.title}</h3>
                  {cert.subtitle && (
                    <p className={styles.certSubtitle}>{cert.subtitle}</p>
                  )}
                  <p className={styles.certName}>Prathamesh Bhagwat</p>
                </div>

                {/* Skills tags (for MS/LinkedIn) */}
                {cert.skills && (
                  <div className={styles.skillTags}>
                    {cert.skills.map((s) => (
                      <span key={s} className={styles.skillTag}>{s}</span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className={styles.certCardFooter}>
                  <span className={styles.certDate}>{cert.date}</span>
                  <span className={styles.certCredId}>{cert.credId}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enlarged certificate lightbox */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <div className={styles.modalOverlay} onClick={() => setSelectedIdx(null)}>
            <motion.div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
            >
              <button className={styles.closeBtn} onClick={() => setSelectedIdx(null)}>&times;</button>

              {(() => {
                const cert = credentials[selectedIdx];
                return (
                  <div className={`${styles.certEnlarged} ${styles[`theme_${cert.theme}`]}`}>
                    {cert.theme === "oracle" && (
                      <>
                        <div className={`${styles.corner} ${styles.cornerTL}`} />
                        <div className={`${styles.corner} ${styles.cornerTR}`} />
                        <div className={`${styles.corner} ${styles.cornerBL}`} />
                        <div className={`${styles.corner} ${styles.cornerBR}`} />
                      </>
                    )}

                    <div className={styles.enlargedHeader}>
                      <div className={styles.certIssuerLogo}>{cert.issuerLogo}</div>
                      <span className={styles.certIssuerText}>{cert.issuer}</span>
                      {cert.badge && <div className={styles.enlargedBadge}>{cert.badge}</div>}
                    </div>

                    <div className={styles.enlargedBody}>
                      {cert.theme === "oracle" && (
                        <>
                          <h4 className={styles.enlargedType}>Oracle Certified Professional</h4>
                          <p className={styles.enlargedTypeSmall}>Certificate of Recognition</p>
                        </>
                      )}
                      <p className={styles.enlargedName}>Prathamesh Bhagwat</p>
                      <h2 className={styles.enlargedTitle}>{cert.title}</h2>

                      {cert.theme === "oracle" && (
                        <p className={styles.enlargedCertText}>
                          This certifies that the above named is recognized by Oracle Corporation as Oracle Certified.
                        </p>
                      )}

                      {cert.skills && (
                        <div className={styles.enlargedSkills}>
                          <p className={styles.enlargedSkillsLabel}>Top skills covered</p>
                          <div className={styles.skillTags}>
                            {cert.skills.map((s) => (
                              <span key={s} className={styles.skillTag}>{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className={styles.enlargedFooter}>
                      <div className={styles.enlargedFooterLeft}>
                        <p className={styles.enlargedDate}>{cert.date}</p>
                        {cert.signedBy && (
                          <p className={styles.enlargedSigned}>
                            <span className={styles.signature}>{cert.signedBy}</span>
                            <br />
                            <small>{cert.signedTitle}</small>
                          </p>
                        )}
                      </div>
                      <div className={styles.enlargedFooterRight}>
                        {cert.validUntil && (
                          <p className={styles.enlargedValid}>Valid until {cert.validUntil}</p>
                        )}
                        <p className={styles.enlargedCredId}>ID: {cert.credId}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
