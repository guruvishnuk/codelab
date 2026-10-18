"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  INDIAN_LANGUAGES,
  type IndianLanguage,
  type Level,
  LEVEL_INFO,
} from "@/lib/curriculumData";

// Translations for exercise prompts and socratic hints
const EXERCISE_TRANSLATIONS: Record<
  number,
  Record<
    IndianLanguage,
    {
      title: string;
      prompt: string;
      hint: string;
      inputExample: string;
      outputExample: string;
    }
  >
> = {
  1: {
    en: {
      title: "Add two numbers",
      prompt: "Read two integers (one per line) from the standard input and print their sum.",
      hint: "Remember that `input()` returns a string. Convert both inputs using `int()` before adding them with `+`.",
      inputExample: "5\n7",
      outputExample: "12",
    },
    hi: {
      title: "दो संख्याओं का जोड़ (Add two numbers)",
      prompt: "यूजर से दो पूर्णांक (प्रत्येक अलग लाइन पर) इनपुट लें और उनका जोड़ (Sum) प्रिंट करें।",
      hint: "`input()` हमेशा टेक्स्ट लौटाता है। जोड़ने से पहले दोनों इनपुट्स को `int()` में बदलें: `a = int(input())`।",
      inputExample: "5\n7",
      outputExample: "12",
    },
    te: {
      title: "రెండు సంఖ్యల కూడిక (Add two numbers)",
      prompt: "రెండు పూర్ణాంకాలను (ఒక్కో లైనులో ఒకటి) ఇన్‌పుట్‌గా తీసుకుని వాటి మొత్తాన్ని ముద్రించండి.",
      hint: "`input()` స్ట్రింగ్ ఇస్తుంది కాబట్టి, కూడే ముందు `int()` ఉపయోగించి సంఖ్యలుగా మార్చండి.",
      inputExample: "5\n7",
      outputExample: "12",
    },
    ta: {
      title: "இரண்டு எண்களின் கூடுதல் (Add two numbers)",
      prompt: "இரண்டு முழு எண்களை உள்ளீடாகப் பெற்று அவற்றின் கூட்டுத்தொகையை அச்சிடவும்.",
      hint: "`input()` உரை தரும். `int()` கொண்டு எண்களாக மாற்றி பின்னர் கூட்டவும்.",
      inputExample: "5\n7",
      outputExample: "12",
    },
    kn: {
      title: "ಎರಡು ಸಂಖ್ಯೆಗಳ ಮೊತ್ತ (Add two numbers)",
      prompt: "ಎರಡು ಪೂರ್ಣಾಂಕಗಳನ್ನು ಇನ್‌ಪುಟ್ ಆಗಿ ಪಡೆದು ಅವುಗಳ ಮೊತ್ತವನ್ನು ಪ್ರಿಂಟ್ ಮಾಡಿ.",
      hint: "`input()` ಸ್ಟ್ರಿಂಗ್ ಆಗಿರುವುದರಿಂದ, `int()` ಬಳಸಿ ಸಂಖ್ಯೆಯಾಗಿ ಪರಿವರ್ತಿಸಿ.",
      inputExample: "5\n7",
      outputExample: "12",
    },
    ml: {
      title: "രണ്ട് സംഖ്യകളുടെ തുക (Add two numbers)",
      prompt: "രണ്ട് സംഖ്യകൾ ഇൻപുട്ടായി സ്വീകരിച്ച് അവയുടെ തുക പ്രിന്റ് ചെയ്യുക.",
      hint: "`input()` സ്ട്രിംഗ് ആണ് തരുന്നത്, `int()` ഉപയോഗിച്ച് മാറ്റുക.",
      inputExample: "5\n7",
      outputExample: "12",
    },
    bn: {
      title: "দুটি সংখ্যার যোগফল (Add two numbers)",
      prompt: "দুটি পূর্ণসংখ্যা ইনপুট নিন এবং তাদের যোগফল প্রিন্ট করুন।",
      hint: "`input()` সর্বদা স্ট্রিং দেয়, তাই যোগ করার আগে `int()` ব্যবহার করুন।",
      inputExample: "5\n7",
      outputExample: "12",
    },
    mr: {
      title: "दोन संख्यांची बेरीज (Add two numbers)",
      prompt: "दोन पूर्णांक इनपुट म्हणून घ्या आणि त्यांची बेरीज प्रिंट करा.",
      hint: "`input()` स्ट्रिंग देतो, म्हणून बेरीज करण्यापूर्वी `int()` वापरा.",
      inputExample: "5\n7",
      outputExample: "12",
    },
    gu: {
      title: "બે સંખ્યાઓનો સરવાળો (Add two numbers)",
      prompt: "બે પૂર્ણાંકો ઇનપુટ તરીકે લો અને તેમનો સરવાળો પ્રિન્ટ કરો.",
      hint: "`input()` સ્ટ્રિંગ આપે છે, તેથી સરવાળો કરતાં પહેલાં `int()` વાપરો.",
      inputExample: "5\n7",
      outputExample: "12",
    },
    pa: {
      title: "ਦੋ ਨੰਬਰਾਂ ਦਾ ਜੋੜ (Add two numbers)",
      prompt: "ਦੋ ਪੂਰਨ ਅੰਕ ਇਨਪੁਟ ਲਵੋ ਅਤੇ ਉਹਨਾਂ ਦਾ ਜੋੜ ਪ੍ਰਿੰਟ ਕਰੋ।",
      hint: "`input()` ਹਮੇਸ਼ਾ ਸਟ੍ਰਿੰਗ ਦਿੰਦਾ ਹੈ, ਜੋੜਨ ਤੋਂ ਪਹਿਲਾਂ `int()` ਵਰਤੋ।",
      inputExample: "5\n7",
      outputExample: "12",
    },
  },
  2: {
    en: {
      title: "Greet someone",
      prompt: "Read a person's name from standard input and print `Hello, <name>!`.",
      hint: "Use Python f-string: `print(f'Hello, {name}!')`.",
      inputExample: "Asha",
      outputExample: "Hello, Asha!",
    },
    hi: {
      title: "अभिवादन करें (Greet someone)",
      prompt: "यूजर से नाम इनपुट लें और `Hello, <name>!` प्रिंट करें।",
      hint: "f-string का उपयोग करें: `name = input()` और `print(f'Hello, {name}!')`।",
      inputExample: "Asha",
      outputExample: "Hello, Asha!",
    },
    te: {
      title: "అభివాదం చేయండి (Greet someone)",
      prompt: "వ్యక్తి పేరును ఇన్‌పుట్‌గా తీసుకుని `Hello, <name>!` అని ముద్రించండి.",
      hint: "f-string వాడండి: `name = input()` మరియు `print(f'Hello, {name}!')`.",
      inputExample: "Asha",
      outputExample: "Hello, Asha!",
    },
    ta: {
      title: "வாழ்த்து தெரிவிக்கவும் (Greet someone)",
      prompt: "பெயரை உள்ளீடாகப் பெற்று `Hello, <name>!` என அச்சிடவும்.",
      hint: "f-string பயன்படுத்தவும்: `print(f'Hello, {name}!')`.",
      inputExample: "Asha",
      outputExample: "Hello, Asha!",
    },
    kn: {
      title: "ಶುಭಾಶಯ ಕೋರಿ (Greet someone)",
      prompt: "ಹೆಸರನ್ನು ಇನ್‌ಪುಟ್ ಆಗಿ ಪಡೆದು `Hello, <name>!` ಎಂದು ಪ್ರಿಂಟ್ ಮಾಡಿ.",
      hint: "f-string ಬಳಸಿ: `print(f'Hello, {name}!')`.",
      inputExample: "Asha",
      outputExample: "Hello, Asha!",
    },
    ml: {
      title: "അഭിവാദ്യം ചെയ്യുക (Greet someone)",
      prompt: "പേര് ഇൻപുട്ടായി സ്വീകരിച്ച് `Hello, <name>!` എന്ന് പ്രിന്റ് ചെയ്യുക.",
      hint: "f-string ഉപയോഗിക്കുക: `print(f'Hello, {name}!')`.",
      inputExample: "Asha",
      outputExample: "Hello, Asha!",
    },
    bn: {
      title: "অভিবাদন জানান (Greet someone)",
      prompt: "নাম ইনপুট নিন এবং `Hello, <name>!` প্রিন্ট করুন।",
      hint: "f-string ব্যবহার করুন: `print(f'Hello, {name}!')`।",
      inputExample: "Asha",
      outputExample: "Hello, Asha!",
    },
    mr: {
      title: "अभिवादन करा (Greet someone)",
      prompt: "नाव इनपुट म्हणून घ्या आणि `Hello, <name>!` प्रिंट करा.",
      hint: "f-string वापरा: `print(f'Hello, {name}!')`.",
      inputExample: "Asha",
      outputExample: "Hello, Asha!",
    },
    gu: {
      title: "શુભેચ્છા આપો (Greet someone)",
      prompt: "નામ ઇનપુટ તરીકે લો અને `Hello, <name>!` પ્રિન્ટ કરો.",
      hint: "f-string નો ઉપયોગ કરો: `print(f'Hello, {name}!')`.",
      inputExample: "Asha",
      outputExample: "Hello, Asha!",
    },
    pa: {
      title: "ਸ਼ੁਭਕਾਮਨਾਵਾਂ ਦਿਓ (Greet someone)",
      prompt: "ਨਾਮ ਇਨਪੁਟ ਲਵੋ ਅਤੇ `Hello, <name>!` ਪ੍ਰਿੰਟ ਕਰੋ।",
      hint: "f-string ਵਰਤੋ: `print(f'Hello, {name}!')`.",
      inputExample: "Asha",
      outputExample: "Hello, Asha!",
    },
  },
};

export default function ExercisePrompt({
  exerciseId,
  defaultTitle,
  defaultPromptMd,
  difficulty,
}: {
  exerciseId: number;
  defaultTitle: string;
  defaultPromptMd: string;
  difficulty: string;
}) {
  const [lang, setLang] = useState<IndianLanguage>("en");
  const [level, setLevel] = useState<Level>("beginner");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("codelab_user_lang") as IndianLanguage | null;
    if (savedLang && INDIAN_LANGUAGES.some((l) => l.code === savedLang)) {
      setLang(savedLang);
    }
    const savedLevel = localStorage.getItem("codelab_user_level") as Level | null;
    if (savedLevel && (savedLevel === "beginner" || savedLevel === "intermediate" || savedLevel === "experienced")) {
      setLevel(savedLevel);
    }
  }, []);

  function handleLangChange(newLang: IndianLanguage) {
    setLang(newLang);
    localStorage.setItem("codelab_user_lang", newLang);
  }

  function handleLevelChange(newLevel: Level) {
    setLevel(newLevel);
    localStorage.setItem("codelab_user_level", newLevel);
  }

  const translated = EXERCISE_TRANSLATIONS[exerciseId]?.[lang];
  const title = translated?.title || defaultTitle;
  const prompt = translated?.prompt || defaultPromptMd;
  const hint = translated?.hint || "Read the problem carefully and test edge cases.";

  const currentLangInfo = INDIAN_LANGUAGES.find((l) => l.code === lang) || INDIAN_LANGUAGES[0];
  const currentLevelInfo = LEVEL_INFO[level];

  return (
    <div className="space-y-4">
      {/* Level & Language Preference Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl border border-line bg-surface/70 text-xs">
        {/* Level Selector */}
        <div className="flex items-center gap-1.5 font-mono">
          <span className="text-muted text-[11px]">Level:</span>
          {(["beginner", "intermediate", "experienced"] as Level[]).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => handleLevelChange(lvl)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                level === lvl
                  ? "bg-brand text-white shadow-xs"
                  : "text-muted hover:text-ink bg-surface-elevated"
              }`}
            >
              {LEVEL_INFO[lvl].icon} {LEVEL_INFO[lvl].label}
            </button>
          ))}
        </div>

        {/* Indian Language Dropdown */}
        <div className="flex items-center gap-1.5 font-mono">
          <span className="text-muted text-[11px]">Language:</span>
          <select
            value={lang}
            onChange={(e) => handleLangChange(e.target.value as IndianLanguage)}
            className="rounded-lg border border-line bg-surface-elevated px-2 py-1 text-[11px] font-mono text-ink cursor-pointer hover:border-brand/60 focus:outline-none"
          >
            {INDIAN_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} className="bg-surface text-ink">
                {l.flag} {l.nativeName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Problem Statement Card */}
      <div className="cyber-card cyber-card-accent p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between border-b border-line/60 pb-3">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
            <span>📝</span> Problem Statement ({currentLangInfo.nativeName})
          </span>
          <span className="text-[11px] text-muted font-mono bg-surface-elevated px-2 py-0.5 rounded border border-line">
            Python 3.11
          </span>
        </div>

        <div>
          <h2 className="text-lg font-bold font-display text-ink mb-2">{title}</h2>
          <div className="notes">
            <ReactMarkdown>{prompt}</ReactMarkdown>
          </div>
        </div>

        {/* Input / Output Example Box */}
        {translated?.inputExample && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl border border-line bg-[#070512] p-3">
              <span className="text-[10px] font-mono font-bold uppercase text-muted block mb-1">
                Sample Input
              </span>
              <pre className="font-mono text-xs text-brand/90 whitespace-pre">
                {translated.inputExample}
              </pre>
            </div>
            <div className="rounded-xl border border-line bg-[#070512] p-3">
              <span className="text-[10px] font-mono font-bold uppercase text-ok block mb-1">
                Sample Output
              </span>
              <pre className="font-mono text-xs text-ok whitespace-pre">
                {translated.outputExample}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Socratic Hint & Level Pro-Tip Card */}
      <div className="cyber-card p-4.5 border-brand/30 bg-surface/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-brand font-mono">
            <span>⚡</span>
            <span>{currentLevelInfo.label} Guidance & Keybindings</span>
          </div>

          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-[11px] font-mono font-bold text-amber-300 hover:text-amber-200 underline cursor-pointer"
          >
            {showHint ? "Hide Hint" : "💡 Need a hint?"}
          </button>
        </div>

        {showHint && (
          <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-200 leading-relaxed font-sans">
            <span className="font-bold font-mono block mb-1">
              💡 Hint ({currentLangInfo.nativeName}):
            </span>
            {hint}
          </div>
        )}

        <p className="text-xs text-muted leading-relaxed">
          Write your solution in the CodeMirror editor. Use{" "}
          <kbd className="rounded border border-line bg-surface-elevated px-1.5 py-0.5 font-mono text-[10px] text-brand">
            Ctrl + Enter
          </kbd>{" "}
          to run tests automatically.
        </p>
      </div>
    </div>
  );
}
