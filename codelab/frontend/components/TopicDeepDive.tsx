"use client";

import { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import {
  INDIAN_LANGUAGES,
  LEVEL_INFO,
  type Level,
  type IndianLanguage,
  getDeepTopicContent,
} from "@/lib/curriculumData";

export default function TopicDeepDive({
  slug,
  fallbackNotes,
}: {
  slug: string;
  fallbackNotes: string;
}) {
  const [level, setLevel] = useState<Level>("beginner");
  const [lang, setLang] = useState<IndianLanguage>("en");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Load preferences from localStorage on client mount
  useEffect(() => {
    const savedLevel = localStorage.getItem("codelab_user_level") as Level | null;
    if (savedLevel && (savedLevel === "beginner" || savedLevel === "intermediate" || savedLevel === "experienced")) {
      setLevel(savedLevel);
    }
    const savedLang = localStorage.getItem("codelab_user_lang") as IndianLanguage | null;
    if (savedLang && INDIAN_LANGUAGES.some((l) => l.code === savedLang)) {
      setLang(savedLang);
    }
  }, []);

  // Reset quiz state when level or language or topic changes
  useEffect(() => {
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [slug, level, lang]);

  // Handle level change
  function handleLevelChange(newLevel: Level) {
    setLevel(newLevel);
    localStorage.setItem("codelab_user_level", newLevel);
  }

  // Handle language change
  function handleLangChange(newLang: IndianLanguage) {
    setLang(newLang);
    localStorage.setItem("codelab_user_lang", newLang);
  }

  // Fetch content for current level and language
  const content = useMemo(() => {
    return getDeepTopicContent(slug, level, lang, fallbackNotes);
  }, [slug, level, lang, fallbackNotes]);

  // Text to speech narration
  function toggleSpeech() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${content.levelTitle}. ${content.analogy}. ${content.deepNotesMarkdown.replace(/[#*`_]/g, "")}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);

    // Language mapping for speech synthesis
    const langVoiceMap: Record<IndianLanguage, string> = {
      en: "en-US",
      hi: "hi-IN",
      te: "te-IN",
      ta: "ta-IN",
      kn: "kn-IN",
      ml: "ml-IN",
      bn: "bn-IN",
      mr: "mr-IN",
      gu: "gu-IN",
      pa: "pa-IN",
    };
    utterance.lang = langVoiceMap[lang] || "en-US";
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }

  const currentLevelInfo = LEVEL_INFO[level];
  const currentLangInfo = INDIAN_LANGUAGES.find((l) => l.code === lang) || INDIAN_LANGUAGES[0];

  return (
    <section aria-label="Interactive Topic Deep-Dive" className="space-y-6">
      {/* Experience Level & Language Control Toolbar */}
      <div className="cyber-card p-4 sm:p-5 border-brand/40 bg-surface/90 backdrop-blur-md shadow-glow">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Level Switcher */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <span>🎯</span> Choose Experience Level:
              </span>
            </div>

            <div className="inline-flex flex-wrap p-1 rounded-xl bg-surface-elevated/90 border border-line gap-1">
              {(["beginner", "intermediate", "experienced"] as Level[]).map((lvl) => {
                const info = LEVEL_INFO[lvl];
                const isActive = level === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleLevelChange(lvl)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                      isActive
                        ? "bg-brand text-white shadow-[0_0_15px_rgba(143,123,255,0.4)]"
                        : "text-muted hover:text-ink hover:bg-surface"
                    }`}
                  >
                    <span>{info.icon}</span>
                    <span>{info.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Selector & Narration Button */}
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label htmlFor="indian-lang-select" className="sr-only">
                Select Indian Language
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">
                  🌐
                </span>
                <select
                  id="indian-lang-select"
                  value={lang}
                  onChange={(e) => handleLangChange(e.target.value as IndianLanguage)}
                  className="appearance-none rounded-xl border border-line bg-surface-elevated pl-9 pr-9 py-2 text-xs font-mono font-semibold text-ink hover:border-brand/60 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-all cursor-pointer"
                >
                  {INDIAN_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="bg-surface text-ink">
                      {l.flag} {l.nativeName} ({l.name})
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted pointer-events-none font-mono">
                  ▼
                </span>
              </div>
            </div>

            {/* Audio Narration Button */}
            <button
              type="button"
              onClick={toggleSpeech}
              title="Listen to topic explanation"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-mono font-semibold transition-all ${
                isSpeaking
                  ? "border-ok bg-ok/20 text-ok animate-pulse"
                  : "border-line bg-surface-elevated text-muted hover:text-ink hover:border-brand/60"
              }`}
            >
              <span>{isSpeaking ? "⏹️" : "🔊"}</span>
              <span className="hidden sm:inline">{isSpeaking ? "Stop Voice" : "Listen"}</span>
            </button>
          </div>
        </div>

        {/* Level Tagline Description */}
        <div className="mt-3 pt-3 border-t border-line/50 flex items-center justify-between gap-2 text-xs text-muted">
          <p className="flex items-center gap-2">
            <span className={currentLevelInfo.badgeClass}>{currentLevelInfo.label} Track</span>
            <span className="hidden md:inline text-muted/80">{currentLevelInfo.description}</span>
          </p>
          <span className="text-[11px] font-mono text-brand/90 font-semibold shrink-0">
            {currentLangInfo.nativeName} • Python 3.11
          </span>
        </div>
      </div>

      {/* Main Concept Card with Cyber Accent */}
      <div className="cyber-card cyber-card-accent p-6 md:p-8 backdrop-blur-md space-y-6">
        {/* Section Header */}
        <div className="border-b border-line/60 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl md:text-2xl font-bold font-display text-ink flex items-center gap-2">
              <span>📖</span> {content.levelTitle}
            </h2>
            <span className="text-xs font-mono text-muted bg-surface-elevated px-3 py-1 rounded-full border border-line">
              Language: {currentLangInfo.nativeName}
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted mt-1 leading-relaxed">
            {content.levelSubtitle}
          </p>
        </div>

        {/* 1. Real-World Analogy & Mental Model */}
        <div className="rounded-2xl border border-brand/30 bg-gradient-to-br from-brand/10 via-surface/60 to-surface/90 p-5 space-y-3">
          <h3 className="text-sm font-bold font-display text-brand flex items-center gap-2">
            {content.analogyTitle}
          </h3>
          <p className="text-sm text-ink/90 leading-relaxed font-sans">
            {content.analogy}
          </p>

          {/* Visual Memory Model Diagram */}
          {content.diagram && (
            <div className="pt-2">
              <span className="text-xs font-mono font-semibold text-muted block mb-1.5">
                {content.diagramTitle}
              </span>
              <pre className="overflow-x-auto rounded-xl border border-line/80 bg-[#070512] p-4 font-mono text-xs text-brand/95 shadow-inner leading-relaxed">
                {content.diagram}
              </pre>
            </div>
          )}
        </div>

        {/* 2. Detailed Technical Notes */}
        <div className="notes">
          <ReactMarkdown>{content.deepNotesMarkdown}</ReactMarkdown>
        </div>

        {/* 3. Common Traps & Pitfalls */}
        {content.pitfalls && content.pitfalls.length > 0 && (
          <div className="pt-4 border-t border-line/60 space-y-3">
            <h3 className="text-sm font-bold font-display text-amber-300 flex items-center gap-2">
              <span>{content.pitfallsTitle}</span>
            </h3>

            <div className="grid gap-3 sm:grid-cols-1">
              {content.pitfalls.map((pitfall, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 space-y-2"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 font-mono">
                    <span>⚡</span>
                    <span>{pitfall.title}</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed font-sans">
                    {pitfall.explanation}
                  </p>
                  {pitfall.code && (
                    <pre className="overflow-x-auto rounded-lg border border-line bg-[#0a0719] p-3 font-mono text-xs text-ok">
                      {pitfall.code}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Interactive Quick Knowledge Check (Quiz) */}
        {content.quiz && (
          <div className="pt-4 border-t border-line/60">
            <div className="rounded-2xl border border-line bg-surface-elevated/50 p-5 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand flex items-center gap-1.5">
                  <span>🧠</span> Quick Concept Check
                </span>
                <span className="text-[11px] font-mono text-muted">Instant Feedback</span>
              </div>

              <p className="text-sm font-semibold text-ink font-display">
                {content.quiz.question}
              </p>

              <div className="grid gap-2 sm:grid-cols-2">
                {content.quiz.options.map((opt, oIdx) => {
                  const isSelected = selectedQuizAnswer === oIdx;
                  const isCorrect = oIdx === content.quiz.correctIndex;
                  let btnStyle = "border-line bg-surface hover:border-brand/60 text-ink";

                  if (quizSubmitted) {
                    if (isCorrect) {
                      btnStyle = "border-ok bg-ok/15 text-ok shadow-[0_0_15px_rgba(75,227,195,0.25)]";
                    } else if (isSelected && !isCorrect) {
                      btnStyle = "border-bad bg-bad/15 text-bad";
                    } else {
                      btnStyle = "border-line/40 bg-surface/40 text-muted opacity-50";
                    }
                  } else if (isSelected) {
                    btnStyle = "border-brand bg-brand-soft text-brand";
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={quizSubmitted}
                      onClick={() => {
                        setSelectedQuizAnswer(oIdx);
                        setQuizSubmitted(true);
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-mono font-medium transition-all ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {quizSubmitted && isCorrect && <span className="text-ok font-bold">✓</span>}
                      {quizSubmitted && isSelected && !isCorrect && (
                        <span className="text-bad font-bold">✗</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {quizSubmitted && (
                <div
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed font-sans ${
                    selectedQuizAnswer === content.quiz.correctIndex
                      ? "border-ok/40 bg-ok/10 text-ok"
                      : "border-amber-500/40 bg-amber-500/10 text-amber-300"
                  }`}
                >
                  <span className="font-bold font-mono block mb-1">
                    {selectedQuizAnswer === content.quiz.correctIndex
                      ? "🎉 Excellent!"
                      : "💡 Explanation:"}
                  </span>
                  {content.quiz.explanation}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
