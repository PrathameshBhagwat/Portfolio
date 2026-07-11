import { useMemo, useState, useEffect } from "react";
import { useSpeechSynthesis } from "../context/SpeechContext";
import { translations } from "../data/translations";
import styles from "./LeetCodeHeatmap.module.css";

// Generate mock contribution data for the last 52 weeks
function generateMockData() {
  const data = [];
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 364);

  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Create realistic patterns: more activity on weekdays, occasional bursts
    const dayOfWeek = date.getDay();
    const weekNum = Math.floor(i / 7);
    
    let probability = 0.35;
    if (dayOfWeek === 0 || dayOfWeek === 6) probability = 0.2;
    if (weekNum > 20 && weekNum < 40) probability += 0.15; // summer burst
    
    let count = 0;
    if (Math.random() < probability) {
      const rand = Math.random();
      if (rand < 0.4) count = 1;
      else if (rand < 0.7) count = 2;
      else if (rand < 0.9) count = 3;
      else count = 4 + Math.floor(Math.random() * 3);
    }
    
    data.push({
      date: date.toISOString().split("T")[0],
      count,
    });
  }
  return data;
}

function getIntensityLevel(count) {
  if (count === 0) return 0;
  if (count <= 1) return 1;
  if (count <= 2) return 2;
  if (count <= 4) return 3;
  return 4;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["", "Mon", "", "Wed", "", "Fri", ""];

export default function LeetCodeHeatmap() {
  const [mounted, setMounted] = useState(false);
  const { settings } = useSpeechSynthesis();
  const lang = settings?.language || "en";
  const t = translations[lang];

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  const data = useMemo(() => generateMockData(), []);
  
  const totalSolved = useMemo(() => data.reduce((sum, d) => sum + d.count, 0), [data]);
  const activeDays = useMemo(() => data.filter(d => d.count > 0).length, [data]);
  
  // Calculate current streak
  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].count > 0) streak++;
      else break;
    }
    return streak;
  }, [data]);

  // Organize data into weeks (columns)
  const weeks = useMemo(() => {
    const result = [];
    for (let i = 0; i < data.length; i += 7) {
      result.push(data.slice(i, i + 7));
    }
    return result;
  }, [data]);

  // Get month labels with their positions
  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    weeks.forEach((week, weekIdx) => {
      const firstDay = new Date(week[0].date);
      const month = firstDay.getMonth();
      if (month !== lastMonth) {
        labels.push({ month: MONTHS[month], weekIdx });
        lastMonth = month;
      }
    });
    return labels;
  }, [weeks]);

  if (!mounted) {
    return (
      <div className={styles.container} style={{ minHeight: "260px", opacity: 0.1 }} />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.leetcodeIcon}>⚡</span>
          <h3 className={styles.title}>{t.lc_title}</h3>
        </div>
        <a 
          href="https://leetcode.com/u/Prathamesh_Bhagwat_31/" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.profileLink}
        >
          @Prathamesh_Bhagwat_31
        </a>
      </div>

      {/* Stats Row */}
      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{totalSolved}+</span>
          <span className={styles.statLabel}>{t.lc_solved}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{activeDays}</span>
          <span className={styles.statLabel}>{t.lc_active}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{currentStreak}</span>
          <span className={styles.statLabel}>{t.lc_streak}</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className={styles.heatmapWrapper}>
        {/* Day labels */}
        <div className={styles.dayLabels}>
          {DAYS.map((day, i) => (
            <span key={i} className={styles.dayLabel}>{day}</span>
          ))}
        </div>

        <div className={styles.gridArea}>
          {/* Month labels */}
          <div className={styles.monthLabels}>
            {monthLabels.map((m, i) => (
              <span
                key={i}
                className={styles.monthLabel}
                style={{ gridColumn: m.weekIdx + 1 }}
              >
                {m.month}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div className={styles.grid}>
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className={styles.weekCol}>
                {week.map((day, dayIdx) => (
                  <div
                    key={dayIdx}
                    className={`${styles.cell} ${styles[`level${getIntensityLevel(day.count)}`]}`}
                    title={`${day.date}: ${day.count} problem${day.count !== 1 ? "s" : ""}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <span className={styles.legendText}>{t.lc_less}</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`${styles.cell} ${styles[`level${level}`]}`}
          />
        ))}
        <span className={styles.legendText}>{t.lc_more}</span>
      </div>
    </div>
  );
}
