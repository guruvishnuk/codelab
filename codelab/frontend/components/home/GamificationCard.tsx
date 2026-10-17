"use client";

import { useEffect, useRef, useState } from "react";
import TiltCard from "./TiltCard";

interface GamificationProps {
  rankTitle: string;
  currentXp: number;
  nextXp: number;
  streakDays: number;
  progressPercent: number;
  isLoggedIn: boolean;
}

export default function GamificationCard({
  rankTitle,
  currentXp,
  nextXp,
  streakDays,
  progressPercent,
  isLoggedIn,
}: GamificationProps) {
  const [barWidth, setBarWidth] = useState("0%");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setBarWidth(`${Math.max(10, progressPercent)}%`);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [progressPercent]);

  return (
    <div ref={cardRef} className="game">
      <TiltCard className="card">
        <span className="mono" style={{ color: "var(--mut)", fontSize: "13px" }}>
          {isLoggedIn ? "Your active rank" : "Sample rank progress"}
        </span>
        <div className="lvl">{rankTitle}</div>
        <div className="xpb">
          <i style={{ width: barWidth }} />
        </div>
        <div className="mono" style={{ fontSize: "13px", color: "var(--mut)" }}>
          {currentXp} / {nextXp} XP · 🔥 {streakDays}-day streak
        </div>
        <div className="ranks">
          <span className={rankTitle === "Novice Coder" ? "me" : ""}>Novice Coder</span>
          <span className={rankTitle === "Python Apprentice" ? "me" : ""}>Python Apprentice</span>
          <span className={rankTitle === "Code Crafter" ? "me" : ""}>Code Crafter</span>
          <span className={rankTitle === "Logic Master" ? "me" : ""}>Logic Master</span>
          <span className={rankTitle === "Pythonista Grandmaster" ? "me" : ""}>
            Pythonista Grandmaster
          </span>
        </div>
      </TiltCard>

      <TiltCard className="card">
        <h3 style={{ fontSize: "24px", letterSpacing: "-0.02em" }}>Milestone Badges</h3>
        <p style={{ color: "var(--mut)", fontSize: "15px" }}>
          Easy challenges award +50 XP, Medium challenges award +100 XP.
        </p>
        <div className="badges">
          <div>
            <b>🎯</b>First Blood
          </div>
          <div>
            <b>⚡</b>Triple Threat
          </div>
          <div>
            <b>🔥</b>On Fire
          </div>
          <div>
            <b>🐍</b>Python Scholar
          </div>
          <div>
            <b>🏆</b>Code Champion
          </div>
        </div>
      </TiltCard>
    </div>
  );
}
