export type Level = "beginner" | "intermediate" | "experienced";

export type IndianLanguage =
  | "en"
  | "hi"
  | "te"
  | "ta"
  | "kn"
  | "ml"
  | "bn"
  | "mr"
  | "gu"
  | "pa";

export interface LanguageInfo {
  code: IndianLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const INDIAN_LANGUAGES: LanguageInfo[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
];

export const LEVEL_INFO: Record<
  Level,
  { label: string; icon: string; badgeClass: string; description: string }
> = {
  beginner: {
    label: "Beginner",
    icon: "🟢",
    badgeClass: "pill-badge-mint",
    description: "Start from absolute zero • Everyday analogies • Step-by-step guidance",
  },
  intermediate: {
    label: "Intermediate",
    icon: "🟡",
    badgeClass: "pill-badge-amber",
    description: "Idiomatic Python • Memory references & mutability • Clean patterns",
  },
  experienced: {
    label: "Experienced",
    icon: "🔴",
    badgeClass: "pill-badge-coral",
    description: "CPython internals • Bytecode & AST • Memory layout & Optimization",
  },
};

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DeepTopicContent {
  levelTitle: string;
  levelSubtitle: string;
  analogyTitle: string;
  analogy: string;
  diagramTitle: string;
  diagram: string;
  deepNotesMarkdown: string;
  pitfallsTitle: string;
  pitfalls: Array<{ title: string; explanation: string; code?: string }>;
  quiz: QuizQuestion;
}

// Translations and deep content for Python topics
export const TOPIC_DEEP_CONTENT: Record<
  string, // topic slug
  Record<
    Level,
    Record<IndianLanguage, DeepTopicContent>
  >
> = {
  "python-basics": {
    beginner: {
      en: {
        levelTitle: "Beginner: Variables, Input & Output",
        levelSubtitle: "Building your foundational mental model of computer memory and user interaction.",
        analogyTitle: "💡 Everyday Analogy: The Sticky Note & Storage Box",
        analogy:
          "Think of computer memory as a giant warehouse with millions of empty shelves. When you write `age = 21`, Python takes the number `21`, places it on a shelf, and sticks a sticky note named `'age'` pointing right to it. When you need that value later, Python looks up the sticky note `'age'` and hands you `21`.",
        diagramTitle: "🧠 Visual Memory Model",
        diagram: `+-----------------------------------------+
|             COMPUTER RAM                |
|                                         |
|  [ 'age' ] -----> ( 21 ) [int object]   |
|  [ 'name' ] ----> ( "Asha" ) [str obj]  |
|                                         |
+-----------------------------------------+`,
        deepNotesMarkdown: `### 1. Variables and Assignment
In Python, you do **not** declare variable types like \`int\` or \`string\` explicitly. Python is dynamically typed — it inspects the value on the right-hand side of the \`=\` operator and assigns the appropriate object.

\`\`\`python
# Storing different types of data
score = 98            # Integer
temperature = 36.6    # Float (decimal)
player_name = "Kiran" # String (text)
is_active = True      # Boolean (True or False)
\`\`\`

### 2. Reading Input from User (\`input()\`)
The \`input()\` function stops the program and waits for the user to type text in the terminal and press Enter.
> ⚠️ **Key Rule**: \`input()\` **ALWAYS** returns a String (text), even if the user types digits like \`"42"\`!

\`\`\`python
# Reading user input and converting it
raw_age = input()        # Type is str, e.g. "20"
real_age = int(raw_age)  # Converted to integer: 20
print("In 5 years you will be:", real_age + 5)
\`\`\`

### 3. Printing Output with Modern F-Strings
The \`print()\` function outputs text to your screen. The most modern, clean, and fastest way to format text is using **f-strings** (formatted string literals):

\`\`\`python
item = "Laptop"
price = 45000
print(f"Product: {item} | Total Cost: ₹{price}")
\`\`\``,
        pitfallsTitle: "⚠️ Common Beginner Pitfalls",
        pitfalls: [
          {
            title: "Adding String to Number (TypeError)",
            explanation:
              "If you do `input() + 5`, Python crashes with `TypeError: can only concatenate str to str`. Always wrap with `int()` or `float()` when expecting numbers.",
            code: "x = int(input())  # Correct: converts '10' -> 10\nprint(x + 5)",
          },
          {
            title: "Variable Names Cannot Start with Numbers",
            explanation:
              "`1name = 'Ravi'` is a SyntaxError. Variable names must start with a letter (a-z) or underscore (`_`).",
          },
        ],
        quiz: {
          question: "If a user inputs '25', what is the result of type(input())?",
          options: ["int", "str", "float", "number"],
          correctIndex: 1,
          explanation:
            "In Python, input() unconditionally returns a string (str). You must explicitly convert it using int() if you want an integer.",
        },
      },
      hi: {
        levelTitle: "आरंभिक स्तर: वेरिएबल्स, इनपुट और आउटपुट",
        levelSubtitle: "कंप्यूटर मेमोरी और यूजर इंटरैक्शन की बुनियादी समझ।",
        analogyTitle: "💡 दैनिक जीवन का उदाहरण: लेबल लगा डिब्बा और पर्ची",
        analogy:
          "कंप्यूटर की मेमोरी को एक विशाल गोदाम की तरह समझें। जब आप `age = 21` लिखते हैं, तो पायथन 21 को मेमोरी में रखता है और उस पर 'age' नाम की एक पर्ची (Label) चिपका देता है। जब भी आप `age` का उपयोग करते हैं, पायथन उस पर्ची को देखकर तुरंत 21 लाकर दे देता है।",
        diagramTitle: "🧠 विजुअल मेमोरी मॉडल",
        diagram: `+-----------------------------------------+
|             कंप्यूटर मेमोरी (RAM)        |
|                                         |
|  [ 'age' ] -----> ( 21 ) [पूर्णांक/int]   |
|  [ 'name' ] ----> ( "Asha" ) [टेक्स्ट/str]|
|                                         |
+-----------------------------------------+`,
        deepNotesMarkdown: `### 1. वेरिएबल्स और मान असाइन करना
पायथन में डेटा टाइप (जैसे int, float) पहले से लिखने की जरूरत नहीं होती। पायथन खुद समझ जाता है कि दाईं ओर क्या मान दिया गया है:

\`\`\`python
score = 98            # पूर्णांक (Integer)
temperature = 36.6    # दशमलव (Float)
player_name = "Kiran" # टेक्स्ट (String)
is_active = True      # बूलियन (True या False)
\`\`\`

### 2. यूजर से इनपुट लेना (\`input()\`)
\`input()\` फंक्शन प्रोग्राम को रोकता है और यूजर के कीबोर्ड से टाइप करने का इंतज़ार करता है।
> ⚠️ **महत्वपूर्ण नियम**: \`input()\` हमेशा **स्ट्रिंग (टेक्स्ट)** ही लौटाता है, भले ही यूजर संख्या टाइप करे!

\`\`\`python
# यूजर से संख्या लेना और उसे int में बदलना
raw_age = input()        # यह टेक्स्ट है जैसे "20"
real_age = int(raw_age)  # अब यह संख्या बन गया: 20
print(f"5 साल बाद आपकी उम्र: {real_age + 5}")
\`\`\`

### 3. f-strings से आउटपुट दिखाना
स्क्रीन पर कुछ भी दिखाने के लिए \`print()\` का उपयोग होता है। f-string सबसे आसान और आधुनिक तरीका है:

\`\`\`python
item = "Laptop"
price = 45000
print(f"उत्पाद: {item} | कुल मूल्य: ₹{price}")
\`\`\``,
        pitfallsTitle: "⚠️ शुरुआती छात्रों की आम गलतियाँ",
        pitfalls: [
          {
            title: "टेक्स्ट और नंबर को सीधे जोड़ना (TypeError)",
            explanation:
              "अगर आप `input() + 5` करेंगे तो एरर आएगी। input से मिली संख्या को हमेशा `int()` में बदलें।",
            code: "x = int(input())\nprint(x + 5)  # सही तरीका",
          },
        ],
        quiz: {
          question: "अगर यूजर '25' टाइप करता है, तो type(input()) क्या होगा?",
          options: ["int", "str", "float", "number"],
          correctIndex: 1,
          explanation: "पायथन में input() हमेशा टेक्स्ट यानी str (String) ही लौटाता है।",
        },
      },
      te: {
        levelTitle: "ప్రారంభ స్థాయి: వేరియబుల్స్, ఇన్‌పుట్ మరియు అవుట్‌పుట్",
        levelSubtitle: "కంప్యూటర్ మెమరీ మరియు కోడింగ్ ప్రాథమిక సూత్రాలు.",
        analogyTitle: "💡 నిజ జీవిత ఉదాహరణ: లేబుల్ చేసిన పెట్టె",
        analogy:
          "కంప్యూటర్ మెమరీని ఒక పెద్ద గదిలా ఊహించుకోండి. మీరు `age = 21` అని రాసినప్పుడు, పైథాన్ 21 అనే సంఖ్యను మెమరీలో భద్రపరిచి, దానికి 'age' అనే పేరుతో ఒక లేబుల్ తగిలిస్తుంది. మీరు ఎప్పుడు `age` అని అడిగినా, ఆ లేబుల్ ద్వారా 21 ని అందిస్తుంది.",
        diagramTitle: "🧠 మెమరీ విజువలైజేషన్",
        diagram: `+-----------------------------------------+
|            కంప్యూటర్ ర్యామ్ (RAM)         |
|                                         |
|  [ 'age' ] -----> ( 21 ) [ఇంటిజర్]       |
|  [ 'name' ] ----> ( "Asha" ) [స్ట్రింగ్]  |
|                                         |
+-----------------------------------------+`,
        deepNotesMarkdown: `### 1. వేరియబుల్స్ అంటే ఏమిటి?
పైథాన్‌లో వేరియబుల్స్ కోసం ప్రత్యేకంగా టైప్ ప్రకటించాల్సిన అవసరం లేదు. పైథాన్ దానంతట అదే గుర్తిస్తుంది:

\`\`\`python
score = 98            # ఇంటిజర్ (పూర్ణ సంఖ్య)
temperature = 36.6    # ఫ్లోట్ (దశాంశం)
player_name = "Kiran" # స్ట్రింగ్ (టెక్స్ట్)
is_active = True      # బూలియన్ (సత్యం/అసత్యం)
\`\`\`

### 2. యూజర్ నుండి ఇన్‌పుట్ తీసుకోవడం (\`input()\`)
\`input()\` ఫంక్షన్ ద్వారా యూజర్ నుండి సమాచారం తీసుకోవచ్చు.
> ⚠️ **ముఖ్యమైన గమనిక**: యూజర్ సంఖ్యలు టైప్ చేసినా సరే, \`input()\` ఎల్లప్పుడూ **స్ట్రింగ్ (టెక్స్ట్)** రూపంలోనే ఇస్తుంది! కాబట్టి సంఖ్యల కోసం \`int()\` వాడాలి.

\`\`\`python
raw_age = input()        # "20" వలె స్ట్రింగ్ వస్తుంది
real_age = int(raw_age)  # ఇంటిజర్‌గా మార్పు
print(f"5 సంవత్సరాల తర్వాత వయస్సు: {real_age + 5}")
\`\`\`

### 3. అవుట్‌పుట్ ముద్రణ (f-strings)
\`print()\` తో పాటు f-strings వాడటం ద్వారా సులభంగా వేరియబుల్స్ కలపవచ్చు:

\`\`\`python
item = "Laptop"
price = 45000
print(f"వస్తువు: {item} | వెల: ₹{price}")
\`\`\``,
        pitfallsTitle: "⚠️ ప్రారంభకులు చేసే సాధారణ తప్పులు",
        pitfalls: [
          {
            title: "స్ట్రింగ్ మరియు నంబర్‌ను కలపడం (TypeError)",
            explanation:
              "`input() + 5` రాస్తే ఎర్రర్ వస్తుంది. గణిత కార్యకలాపాల కోసం `int(input())` వాడండి.",
            code: "x = int(input())\nprint(x + 5)",
          },
        ],
        quiz: {
          question: "యూజర్ '25' ఎంటర్ చేస్తే type(input()) ఫలితం ఏమిటి?",
          options: ["int", "str", "float", "number"],
          correctIndex: 1,
          explanation: "పైథాన్‌లో input() ఎల్లప్పుడూ str (స్ట్రింగ్) ను మాత్రమే అందిస్తుంది.",
        },
      },
      ta: {
        levelTitle: "தொடக்கநிலை: மாறிகள் (Variables), உள்ளீடு மற்றும் வெளியீடு",
        levelSubtitle: "கணினி நினைவகம் மற்றும் அடிப்படை நிரலாக்க தத்துவம்.",
        analogyTitle: "💡 அன்றாட உதாரணம்: பெயரிடப்பட்ட பெட்டி",
        analogy:
          "கணினி நினைவகத்தை ஒரு பெரிய கிடங்காக நினையுங்கள். `age = 21` என எழுதும்போது, பைதான் 21 என்ற எண்ணை சேமித்து, அதற்கு 'age' என்ற லேபிளை ஒட்டுகிறது. நீங்கள் 'age' ஐ அழைக்கும் போதெல்லாம், பைதான் 21 ஐத் தரும்.",
        diagramTitle: "🧠 நினைவக மாதிரி",
        diagram: `+-----------------------------------------+
|             கணினி நினைவகம் (RAM)         |
|                                         |
|  [ 'age' ] -----> ( 21 ) [முழு எண்/int]  |
|  [ 'name' ] ----> ( "Asha" ) [உரை/str]   |
|                                         |
+-----------------------------------------+`,
        deepNotesMarkdown: `### 1. மாறிகள் (Variables)
பைதானில் தரவு வகையை (int, float) நாம் முன்னரே அறிவிக்கத் தேவையில்லை. மதிப்புக்கு ஏற்ப பைதானே தீர்மானிக்கும்.

\`\`\`python
score = 98            # முழு எண் (Integer)
temperature = 36.6    # தசம எண் (Float)
player_name = "Kiran" # உரை (String)
is_active = True      # பூலியன் (True அல்லது False)
\`\`\`

### 2. பயனரிடமிருந்து உள்ளீடு பெறுதல் (\`input()\`)
\`input()\` எப்போதும் **உரையாகவே (String)** தகவலைப் பெறும். எண்களாகப் பயன்படுத்த \`int()\` அல்லது \`float()\` ஆக மாற்ற வேண்டும்.

\`\`\`python
raw_age = input()        # "20" என்ற உரை
real_age = int(raw_age)  # 20 என்ற முழு எண்
print(f"5 வருடங்களுக்குப் பிறகு வயது: {real_age + 5}")
\`\`\``,
        pitfallsTitle: "⚠️ தொடக்கநிலை தவறுகள்",
        pitfalls: [
          {
            title: "உரையையும் எண்ணையும் கூட்ட முயற்சித்தல் (TypeError)",
            explanation: "`input()` தரும் மதிப்பை நேரடியாக எண்களோடு கூட்ட முடியாது. `int()` கொண்டு மாற்றவும்.",
            code: "x = int(input())\nprint(x + 5)",
          },
        ],
        quiz: {
          question: "பயனர் '25' கொடுத்தால் type(input()) என்ன?",
          options: ["int", "str", "float", "number"],
          correctIndex: 1,
          explanation: "பைதானில் input() எப்போதும் str (string) ஆக மட்டுமே இருக்கும்.",
        },
      },
      kn: {
        levelTitle: "ಆರಂಭಿಕ ಹಂತ: ವೇರಿಯೇಬಲ್‌ಗಳು, ಇನ್‌ಪುಟ್ ಮತ್ತು ಔಟ್‌ಪುಟ್",
        levelSubtitle: "ಕಂಪ್ಯೂಟರ್ ಮೆಮೊರಿ ಮತ್ತು ಪ್ರೋಗ್ರಾಮಿಂಗ್‌ನ ಮೂಲ ತತ್ವಗಳು.",
        analogyTitle: "💡 ಉದಾಹರಣೆ: ಲೇಬಲ್ ಮಾಡಿದ ಪೆಟ್ಟಿಗೆ",
        analogy:
          "ಕಂಪ್ಯೂಟರ್ ಮೆಮೊರಿಯನ್ನು ಒಂದು ದೊಡ್ಡ ಕಪಾಟು ಎಂದು ಭಾವಿಸಿ. ನೀವು `age = 21` ಎಂದು ಬರೆದಾಗ, ಪೈಥಾನ್ 21 ಅನ್ನು ಮೆಮೊರಿಯಲ್ಲಿಟ್ಟು, ಅದಕ್ಕೆ 'age' ಎಂಬ ಹೆಸರಿನ ಚೀಟಿಯನ್ನು ಅಂಟಿಸುತ್ತದೆ.",
        diagramTitle: "🧠 ಮೆಮೊರಿ ಮಾದರಿ",
        diagram: `+-----------------------------------------+
|            ಕಂಪ್ಯೂಟರ್ ಮೆಮೊರಿ (RAM)        |
|                                         |
|  [ 'age' ] -----> ( 21 ) [ಇಂಟಿಜರ್]       |
|  [ 'name' ] ----> ( "Asha" ) [ಸ್ಟ್ರಿಂಗ್]  |
|                                         |
+-----------------------------------------+`,
        deepNotesMarkdown: `### 1. ವೇರಿಯೇಬಲ್‌ಗಳು
ಪೈಥಾನ್‌ನಲ್ಲಿ ಡೇಟಾ ಪ್ರಕಾರವನ್ನು ಮೊದಲೇ ನಮೂದಿಸುವ ಅಗತ್ಯವಿಲ್ಲ:

\`\`\`python
score = 98            # ಇಂಟಿಜರ್ (ಪೂರ್ಣಾಂಕ)
temperature = 36.6    # ಫ್ಲೋಟ್ (ದಶಮಾಂಶ)
player_name = "Kiran" # ಸ್ಟ್ರಿಂಗ್ (ಪಠ್ಯ)
\`\`\`

### 2. ಇನ್‌ಪುಟ್ ಪಡೆಯುವುದು (\`input()\`)
\`input()\` ಯಾವಾಗಲೂ ಸ್ಟ್ರಿಂಗ್ (ಪಠ್ಯ) ರೂಪದಲ್ಲಿಯೇ ಇರುತ್ತದೆ. ಸಂಖ್ಯೆಗಳಿಗಾಗಿ \`int()\` ಬಳಸಿ:

\`\`\`python
age = int(input())
print(f"ಮುಂದಿನ ವರ್ಷ ನಿಮ್ಮ ವಯಸ್ಸು: {age + 1}")
\`\`\``,
        pitfallsTitle: "⚠️ ಸಾಮಾನ್ಯ ತಪ್ಪುಗಳು",
        pitfalls: [
          {
            title: "ಸ್ಟ್ರಿಂಗ್ ಮತ್ತು ಸಂಖ್ಯೆ ಸಂಯೋಜನೆ",
            explanation: "`input() + 5` ಬರೆದರೆ ದೋಷ ಬರುತ್ತದೆ. ಯಾವಾಗಲೂ `int(input())` ಬಳಸಿ.",
          },
        ],
        quiz: {
          question: "ಬಳಕೆದಾರ '25' ನೀಡಿದಾಗ type(input()) ಫಲಿತಾಂಶವೇನು?",
          options: ["int", "str", "float", "number"],
          correctIndex: 1,
          explanation: "ಪೈಥಾನ್‌ನಲ್ಲಿ input() ಯಾವಾಗಲೂ str ಅನ್ನು ನೀಡುತ್ತದೆ.",
        },
      },
      ml: {
        levelTitle: "തുടക്കക്കാർക്കുള്ള പാഠം: വേരിയബിളുകൾ, ഇൻപുട്ട്, ഔട്ട്പുട്ട്",
        levelSubtitle: "കമ്പ്യൂട്ടർ മെമ്മറിയുടെ അടിസ്ഥാന കാര്യങ്ങൾ.",
        analogyTitle: "💡 നിത്യജീവിത ഉദാഹരണം: ലേബൽ ചെയ്ത പെട്ടി",
        analogy:
          "കമ്പ്യൂട്ടർ മെമ്മറിയെ ഒരു വലിയ അലമാരയായി കരുതുക. `age = 21` എന്ന് എഴുതുമ്പോൾ, പൈത്തൺ 21 എന്ന സംഖ്യ സൂക്ഷിക്കുകയും അതിലേക്ക് 'age' എന്ന പേര് നൽകുകയും ചെയ്യുന്നു.",
        diagramTitle: "🧠 മെമ്മറി ഡയഗ്രം",
        diagram: `+-----------------------------------------+
|             കമ്പ്യൂട്ടർ റാം (RAM)        |
|                                         |
|  [ 'age' ] -----> ( 21 ) [ഇന്റിജർ]       |
|  [ 'name' ] ----> ( "Asha" ) [സ്ട്രിംഗ്]  |
|                                         |
+-----------------------------------------+`,
        deepNotesMarkdown: `### 1. വേരിയബിളുകൾ
പൈത്തണിൽ ഡാറ്റ തരം മുൻകൂട്ടി പറയേണ്ടതില്ല. പൈത്തൺ സ്വയം മനസ്സിലാക്കുന്നു:

\`\`\`python
score = 98            # സംഖ്യ (Integer)
temperature = 36.6    # ദശാംശം (Float)
player_name = "Kiran" # അക്ഷരങ്ങൾ (String)
\`\`\`

### 2. ഇൻപുട്ട് എടുക്കൽ (\`input()\`)
\`input()\` എപ്പോഴും **സ്ട്രിംഗ് (String)** ആയിരിക്കും നൽകുക. സംഖ്യകൾക്കായി \`int()\` ഉപയോഗിക്കുക:

\`\`\`python
age = int(input())
print(f"അടുത്ത വർഷം പ്രായം: {age + 1}")
\`\`\``,
        pitfallsTitle: "⚠️ തുടക്കക്കാർ വരുത്തുന്ന പിഴവുകൾ",
        pitfalls: [
          {
            title: "സ്ട്രിംഗും നമ്പറും കൂട്ടാൻ ശ്രമിക്കുന്നത്",
            explanation: "`input() + 5` എറർ ഉണ്ടാക്കും. `int(input())` ഉപയോഗിക്കുക.",
          },
        ],
        quiz: {
          question: "യൂസർ '25' ടൈപ്പ് ചെയ്താൽ type(input()) എന്താണ്?",
          options: ["int", "str", "float", "number"],
          correctIndex: 1,
          explanation: "പൈത്തണിൽ input() എപ്പോഴും str (സ്ട്രിംഗ്) ആയിരിക്കും.",
        },
      },
      bn: {
        levelTitle: "শিক্ষানবিস স্তর: ভেরিয়েবল, ইনপুট ও আউটপুট",
        levelSubtitle: "কম্পিউটার মেমোরি ও কোডিংয়ের প্রাথমিক মানসিক মডেল।",
        analogyTitle: "💡 দৈনন্দিন জীবনের উদাহরণ: লেবেলযুক্ত বাক্স",
        analogy:
          "কম্পিউটার মেমোরিকে একটি বড় গুদাম ভাবুন। যখন আপনি `age = 21` লেখেন, পাইথন মেমোরিতে 21 রাখে এবং তার ওপর 'age' নামের একটি লেবেল সেঁটে দেয়।",
        diagramTitle: "🧠 মেমোরি চিত্র",
        diagram: `+-----------------------------------------+
|            কম্পিউটার মেমোরি (RAM)        |
|                                         |
|  [ 'age' ] -----> ( 21 ) [পূর্ণসংখ্যা]   |
|  [ 'name' ] ----> ( "Asha" ) [টেক্সট]    |
|                                         |
+-----------------------------------------+`,
        deepNotesMarkdown: `### ১. ভেরিয়েবল
পাইথনে ভেরিয়েবলের ধরন (type) আগে থেকে ঘোষণা করতে হয় না:

\`\`\`python
score = 98            # পূর্ণসংখ্যা (Integer)
temperature = 36.6    # দশমিক (Float)
player_name = "Kiran" # টেক্সট (String)
\`\`\`

### ২. ইনপুট নেওয়া (\`input()\`)
\`input()\` সর্বদা টেক্সট (String) হিসেবে মান ফেরত দেয়। সংখ্যার জন্য \`int()\` ব্যবহার করুন:

\`\`\`python
age = int(input())
print(f"পরের বছর আপনার বয়স হবে: {age + 1}")
\`\`\``,
        pitfallsTitle: "⚠️ প্রাথমিক ভুলভ্রান্তি",
        pitfalls: [
          {
            title: "টেক্সট ও সংখ্যার যোগফল",
            explanation: "`input() + 5` ক্র্যাশ করবে। সবসময় `int(input())` লিখুন।",
          },
        ],
        quiz: {
          question: "ব্যবহারকারী '25' ইনপুট দিলে type(input()) কী হবে?",
          options: ["int", "str", "float", "number"],
          correctIndex: 1,
          explanation: "পাইথনে input() সর্বদা str রিটার্ন করে।",
        },
      },
      mr: {
        levelTitle: "नवशिक्या स्तर: व्हेरिएबल्स, इनपुट आणि आउटपुट",
        levelSubtitle: "संगणक मेमरी आणि कोडिंगची मूलभूत तत्त्वे.",
        analogyTitle: "💡 रोजच्या जीवनातील उदाहरण: लेबल लावलेला डबा",
        analogy:
          "संगणकाची मेमरी एका मोठ्या गोदामासारखी असते. जेव्हा तुम्ही `age = 21` लिहिता, तेव्हा पायथन मेमरीमध्ये 21 ठेवतो आणि त्याला 'age' नावाची पावती जोडतो.",
        diagramTitle: "🧠 मेमरी मॉडेल",
        diagram: `+-----------------------------------------+
|            संगणक मेमरी (RAM)             |
|                                         |
|  [ 'age' ] -----> ( 21 ) [पूर्णांक]      |
|  [ 'name' ] ----> ( "Asha" ) [मजकूर]     |
|                                         |
+-----------------------------------------+`,
        deepNotesMarkdown: `### १. व्हेरिएबल्स
पायथनमध्ये डेटा प्रकार आधी घोषित करण्याची गरज नसते:

\`\`\`python
score = 98            # पूर्णांक (Integer)
temperature = 36.6    # दशांश (Float)
player_name = "Kiran" # मजकूर (String)
\`\`\`

### २. इनपुट घेणे (\`input()\`)
\`input()\` नेहमी **स्ट्रिंग (मजकूर)** म्हणूनच माहिती घेतो. गणितासाठी \`int()\` वापरा:

\`\`\`python
age = int(input())
print(f"पुढील वर्षी तुमचे वय: {age + 1}")
\`\`\``,
        pitfallsTitle: "⚠️ सुरुवातीच्या चुका",
        pitfalls: [
          {
            title: "स्ट्रिंग आणि नंबर एकत्र जोडणे",
            explanation: "`input() + 5` मुळे TypeError येतो. `int(input())` वापरा.",
          },
        ],
        quiz: {
          question: "वापरकर्त्याने '25' दिल्यास type(input()) काय असेल?",
          options: ["int", "str", "float", "number"],
          correctIndex: 1,
          explanation: "पायथनमध्ये input() नेहमी str (स्ट्रिंग) परत करतो.",
        },
      },
      gu: {
        levelTitle: "પ્રારંભિક સ્તર: વેરિયેબલ્સ, ઇનપુટ અને આઉટપુટ",
        levelSubtitle: "કમ્પ્યુટર મેમરી અને કોડિંગના પાયાના સિદ્ધાંતો.",
        analogyTitle: "💡 વ્યવહારુ ઉદાહરણ: લેબલ લગાવેલ બોક્સ",
        analogy:
          "કમ્પ્યુટર મેમરીને એક મોટા વેરહાઉસ તરીકે વિચારો. `age = 21` લખતી વખતે, પાયથન 21 ને મેમરીમાં મૂકે છે અને તેના પર 'age' નામનું લેબલ ચોંટાડે છે.",
        diagramTitle: "🧠 મેમરી મોડલ",
        diagram: `+-----------------------------------------+
|            કમ્પ્યુટર રેમ (RAM)           |
|                                         |
|  [ 'age' ] -----> ( 21 ) [ઇન્ટીજર]       |
|  [ 'name' ] ----> ( "Asha" ) [સ્ટ્રિંગ]   |
|                                         |
+-----------------------------------------+`,
        deepNotesMarkdown: `### ૧. વેરિયેબલ્સ
પાયથનમાં ડેટા ટાઈપ અગાઉથી લખવાની જરૂર નથી:

\`\`\`python
score = 98            # પૂર્ણાંક (Integer)
temperature = 36.6    # દશાંશ (Float)
player_name = "Kiran" # ટેક્સ્ટ (String)
\`\`\`

### ૨. ઇનપુટ લેવું (\`input()\`)
\`input()\` હંમેશાં **સ્ટ્રિંગ** આપે છે. ગણતરી માટે \`int()\` નો ઉપયોગ કરો:

\`\`\`python
age = int(input())
print(f"આવતા વર્ષે તમારી ઉંમર: {age + 1}")
\`\`\``,
        pitfallsTitle: "⚠️ શરૂઆતની સામાન્ય ભૂલો",
        pitfalls: [
          {
            title: "ટેક્સ્ટ અને નંબરનો સરવાળો",
            explanation: "`input() + 5` કરવાથી એરર આવે છે. `int(input())` વાપરો.",
          },
        ],
        quiz: {
          question: "વપરાશકર્તા '25' દાખલ કરે ત્યારે type(input()) શું હોય છે?",
          options: ["int", "str", "float", "number"],
          correctIndex: 1,
          explanation: "પાયથનમાં input() હંમેશા str આપે છે.",
        },
      },
      pa: {
        levelTitle: "ਸ਼ੁਰੂਆਤੀ ਪੱਧਰ: ਵੇਰੀਏਬਲ, ਇਨਪੁਟ ਅਤੇ ਆਉਟਪੁਟ",
        levelSubtitle: "ਕੰਪਿਊਟਰ ਮੈਮੋਰੀ ਅਤੇ ਪ੍ਰੋਗਰਾਮਿੰਗ ਦੇ ਬੁਨਿਆਦੀ ਅਸੂਲ।",
        analogyTitle: "💡 ਉਦਾਹਰਣ: ਲੇਬਲ ਵਾਲਾ ਡੱਬਾ",
        analogy:
          "ਕੰਪਿਊਟਰ ਮੈਮੋਰੀ ਨੂੰ ਇੱਕ ਵੱਡੀ ਅਲਮਾਰੀ ਸਮਝੋ। ਜਦੋਂ ਤੁਸੀਂ `age = 21` ਲਿਖਦੇ ਹੋ, ਤਾਂ ਪਾਈਥਨ 21 ਨੂੰ ਮੈਮੋਰੀ ਵਿੱਚ ਰੱਖ ਕੇ ਉਸ ਉੱਤੇ 'age' ਨਾਂਅ ਦਾ ਟੈਗ ਲਗਾ ਦਿੰਦਾ ਹੈ।",
        diagramTitle: "🧠 ਮੈਮੋਰੀ ਡਾਇਗਰਾਮ",
        diagram: `+-----------------------------------------+
|             ਕੰਪਿਊਟਰ ਮੈਮੋਰੀ (RAM)        |
|                                         |
|  [ 'age' ] -----> ( 21 ) [ਪੂਰਨ ਅੰਕ]     |
|  [ 'name' ] ----> ( "Asha" ) [ਟੈਕਸਟ]     |
|                                         |
+-----------------------------------------+`,
        deepNotesMarkdown: `### 1. ਵੇਰੀਏਬਲ
ਪਾਈਥਨ ਵਿੱਚ ਡਾਟਾ ਕਿਸਮ ਪਹਿਲਾਂ ਤੋਂ ਦੱਸਣ ਦੀ ਲੋੜ ਨਹੀਂ ਹੁੰਦੀ:

\`\`\`python
score = 98            # ਇੰਟੀਜਰ (ਪੂਰਨ ਅੰਕ)
temperature = 36.6    # ਫਲੋਟ (ਦਸ਼ਮਲਵ)
player_name = "Kiran" # ਸਟ੍ਰਿੰਗ (ਟੈਕਸਟ)
\`\`\`

### 2. ਇਨਪੁਟ ਲੈਣਾ (\`input()\`)
\`input()\` ਹਮੇਸ਼ਾ **ਸਟ੍ਰਿੰਗ (ਟੈਕਸਟ)** ਹੀ ਵਾਪਸ ਕਰਦਾ ਹੈ। ਗਣਿਤ ਲਈ \`int()\` ਵਰਤੋ:

\`\`\`python
age = int(input())
print(f"ਅਗਲੇ ਸਾਲ ਤੁਹਾਡੀ ਉਮਰ: {age + 1}")
\`\`\``,
        pitfallsTitle: "⚠️ ਆਮ ਗਲਤੀਆਂ",
        pitfalls: [
          {
            title: "ਸਟ੍ਰਿੰਗ ਅਤੇ ਨੰਬਰ ਦਾ ਜੋੜ",
            explanation: "`input() + 5` ਐਰਰ ਦੇਵੇਗਾ। `int(input())` ਵਰਤੋ।",
          },
        ],
        quiz: {
          question: "ਜੇਕਰ ਯੂਜ਼ਰ '25' ਲਿਖਦਾ ਹੈ ਤਾਂ type(input()) ਕੀ ਹੋਵੇਗਾ?",
          options: ["int", "str", "float", "number"],
          correctIndex: 1,
          explanation: "ਪਾਈਥਨ ਵਿੱਚ input() ਹਮੇਸ਼ਾ str ਹੀ ਹੁੰਦਾ ਹੈ।",
        },
      },
    },
    intermediate: {
      en: {
        levelTitle: "Intermediate: Memory References & Mutability",
        levelSubtitle: "Deep dive into object identity, references, and idiomatic Python patterns.",
        analogyTitle: "💡 Mental Model: Pass-by-Object-Reference",
        analogy:
          "In Python, variables are NOT buckets that hold data. Variables are POINTERS (references) bound to objects in the heap. When you write `b = a`, Python does not duplicate memory; it creates a second pointer pointing to the exact same memory address. Check with `id(a) == id(b)` or `a is b`.",
        diagramTitle: "🧠 Memory Pointer Graph",
        diagram: `   Variable Name            Memory Heap Object
   +------------+           +-----------------------+
   |     a      | --------> | id: 0x7fa920          |
   +------------+           | type: list            |
                            | value: [1, 2, 3]      |
   +------------+           +-----------------------+
   |     b      | ------------/
   +------------+`,
        deepNotesMarkdown: `### 1. Object Identity vs Value Equality
- \`==\` checks if the **values** of two objects are equal.
- \`is\` checks if two variables point to the **exact same memory address** in RAM.

\`\`\`python
a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(a == b)  # True (identical contents)
print(a is b)  # False (different objects in memory!)
print(a is c)  # True (both point to same memory address)
\`\`\`

### 2. The Walrus Operator (\`:=\`)
Introduced in Python 3.8, assignment expressions let you calculate and assign a value inside an expression:

\`\`\`python
# Reading lines until empty without repeating input()
while (line := input()) != "END":
    print(f"Processing: {line.upper()}")
\`\`\`

### 3. F-String Precision Specifiers & Debugging
Modern f-strings offer direct formatting and debugging expressions using \`=\`:

\`\`\`python
pi = 3.14159265
price = 1250.5
print(f"{pi:.2f}")       # 3.14 (fixed 2 decimals)
print(f"₹{price:,.2f}")   # ₹1,250.50 (comma thousands separator)
x = 42
print(f"{x=}")           # Prints 'x=42' (fast debugging!)
\`\`\``,
        pitfallsTitle: "⚠️ Intermediate Traps & Gotchas",
        pitfalls: [
          {
            title: "Default Mutable Arguments Trap",
            explanation:
              "Default function arguments are evaluated ONCE at function definition time, NOT at every call! Using `def append_to(val, lst=[])` creates a shared list across all function calls.",
            code: "def append_to(val, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(val)\n    return lst",
          },
        ],
        quiz: {
          question: "Given x = [1, 2] and y = [1, 2], what does (x is y) evaluate to?",
          options: ["True", "False", "None", "TypeError"],
          correctIndex: 1,
          explanation:
            "x and y have identical values so x == y is True, but they are two distinct list objects allocated at different memory addresses, so x is y is False.",
        },
      },
      hi: {
        levelTitle: "मध्यम स्तर: मेमोरी रेफरेंस और म्यूटेबिलिटी",
        levelSubtitle: "ऑब्जेक्ट पहचान, मेमोरी रेफरेंस और पायथन के बेहतरीन पैटर्न्स।",
        analogyTitle: "💡 मेमोरी मॉडल: नेम बाइंडिंग (Name Binding)",
        analogy:
          "पायथन में वेरिएबल्स कोई डिब्बा नहीं होते जिसमें डेटा बंद हो। वेरिएबल्स केवल 'पॉइंटर्स' (इशारा करने वाले नाम) होते हैं जो मेमोरी में मौजूद ऑब्जेक्ट की तरफ इशारा करते हैं। जब आप `b = a` करते हैं, तो कोई नया डेटा नहीं बनता; दोनों नाम एक ही मेमोरी पते की ओर इशारा करते हैं।",
        diagramTitle: "🧠 पॉइंटर डायग्राम",
        diagram: `   वेरिएबल नाम                 मेमोरी में ऑब्जेक्ट
   +------------+           +-----------------------+
   |     a      | --------> | पता: 0x7fa920         |
   +------------+           | प्रकार: list          |
                            | मान: [1, 2, 3]        |
   +------------+           +-----------------------+
   |     b      | ------------/
   +------------+`,
        deepNotesMarkdown: `### 1. \`==\` बनाम \`is\` का अंतर
- \`==\` चेक करता है कि दोनों ऑब्जेक्ट्स के **मान (Values)** समान हैं या नहीं।
- \`is\` चेक करता है कि क्या दोनों वेरिएबल्स **एक ही मेमोरी लोकेशन** पर मौजूद हैं।

\`\`\`python
a = [1, 2, 3]
b = [1, 2, 3]
print(a == b)  # True (क्योंकि मान समान हैं)
print(a is b)  # False (क्योंकि मेमोरी में दो अलग-अलग सूचियां हैं)
\`\`\`

### 2. वालरस ऑपरेटर (\`:=\`)
पायथन 3.8+ में \`:=\` की मदद से आप एक्सप्रेशन के अंदर ही मान असाइन कर सकते हैं:

\`\`\`python
while (val := input()) != "exit":
    print(f"दर्ज किया: {val}")
\`\`\``,
        pitfallsTitle: "⚠️ मध्यम स्तर के खतरे",
        pitfalls: [
          {
            title: "डिफ़ॉल्ट म्यूटेबल आर्ग्युमेंट्स की गलती",
            explanation: "फंक्शन में `lst=[]` कभी डिफ़ॉल्ट न रखें, हमेशा `lst=None` का प्रयोग करें।",
          },
        ],
        quiz: {
          question: "यदि x = [1, 2] और y = [1, 2] हो, तो (x is y) क्या होगा?",
          options: ["True", "False", "None", "Error"],
          correctIndex: 1,
          explanation: "मान समान होने पर भी मेमोरी में अलग ऑब्जेक्ट्स होने के कारण x is y False होगा।",
        },
      },
      te: {
        levelTitle: "మధ్యస్థ స్థాయి: మెమరీ రిఫరెన్సులు మరియు మ్యూటబిలిటీ",
        levelSubtitle: "పైథాన్ మెమరీ ఆర్కిటెక్చర్ మరియు ఐడియోమాటిక్ కోడింగ్.",
        analogyTitle: "💡 మెమరీ సూత్రం: నేమ్ బైండింగ్",
        analogy:
          "పైథాన్‌లో వేరియబుల్స్ అనేవి మెమరీలోని ఆబ్జెక్టులకు దారి చూపే పాయింటర్లు మాత్రమే. `b = a` అన్నప్పుడు కొత్త ఆబ్జెక్ట్ సృష్టించబడదు; రెండూ ఒకే మెమరీ అడ్రస్‌ను సూచిస్తాయి.",
        diagramTitle: "🧠 మెమరీ పాయింటర్ గ్రాఫ్",
        diagram: `   వేరియబుల్ పేరు              మెమరీలోని ఆబ్జెక్ట్
   +------------+           +-----------------------+
   |     a      | --------> | అడ్రస్: 0x7fa920     |
   |     b      | --------> | విలువ: [1, 2, 3]      |
   +------------+           +-----------------------+`,
        deepNotesMarkdown: `### 1. \`==\` vs \`is\` తేడా
- \`==\` ఆబ్జెక్టుల విలువలు సమానమా అని తనిఖీ చేస్తుంది.
- \`is\` రెండూ ఒకే మెమరీ లొకేషన్ కలిగి ఉన్నాయా అని పరీక్షిస్తుంది.`,
        pitfallsTitle: "⚠️ ముఖ్యమైన జాగ్రత్తలు",
        pitfalls: [
          {
            title: "మ్యూటబుల్ డిఫాల్ట్ ఆర్గ్యుమెంట్స్",
            explanation: "ఫంక్షన్‌లో `def add(item, lst=[])` వాడకూడదు; `lst=None` వాడాలి.",
          },
        ],
        quiz: {
          question: "x = [1, 2] మరియు y = [1, 2] అయితే (x is y) ఫలితం ఏమిటి?",
          options: ["True", "False", "None", "Error"],
          correctIndex: 1,
          explanation: "విలువలు ఒకటైనా మెమరీ లొకేషన్లు వేరైనందున x is y అనేది False అవుతుంది.",
        },
      },
      ta: {
        levelTitle: "இடைநிலை: நினைவக மாதிரியும் ஆப்ஜெக்ட் குறியீடுகளும்",
        levelSubtitle: "மெமரி அடையாளங்கள் மற்றும் உகந்த பைதான் முறைகள்.",
        analogyTitle: "💡 மெமரி தத்துவம்: பாயிண்டர்கள்",
        analogy: "பைதானில் மாறிகள் என்பது மெமரியில் உள்ள ஆப்ஜெக்ட்களை சுட்டிக்காட்டும் சுட்டிகள் (Pointers) மட்டுமே.",
        diagramTitle: "🧠 பாயிண்டர் வரைபடம்",
        diagram: `   மாறி பெயர்                   நினைவக ஆப்ஜெக்ட்
   +------------+           +-----------------------+
   |     a      | --------> | address: 0x7fa920     |
   |     b      | --------> | value: [1, 2, 3]      |
   +------------+           +-----------------------+`,
        deepNotesMarkdown: `### 1. \`==\` மற்றும் \`is\` வேறுபாடு
- \`==\` மதிப்பை ஒப்பிடுகிறது.
- \`is\` நினைவக முகவரியை ஒப்பிடுகிறது.`,
        pitfallsTitle: "⚠️ முக்கிய தவறுகள்",
        pitfalls: [{ title: "இயல்புநிலை பட்டியல் பிழை", explanation: "`lst=[]` பதிலாக `lst=None` பயன்படுத்துங்கள்." }],
        quiz: {
          question: "x = [1, 2] மற்றும் y = [1, 2] எனில் (x is y) மதிப்பு என்ன?",
          options: ["True", "False", "None", "Error"],
          correctIndex: 1,
          explanation: "வெவ்வேறு நினைவக முகவரிகள் என்பதால் False.",
        },
      },
      kn: {
        levelTitle: "ಮಧ್ಯಂತರ ಹಂತ: ಮೆಮೊರಿ ರೆಫರೆನ್ಸ್‌ಗಳು",
        levelSubtitle: "ಪೈಥಾನ್ ಮೆಮೊರಿ ಮಾಡೆಲ್ ಮತ್ತು ನಿಯಮಗಳು.",
        analogyTitle: "💡 ಪರಿಕಲ್ಪನೆ: ಪಾಯಿಂಟರ್‌ಗಳು",
        analogy: "ಪೈಥಾನ್‌ನಲ್ಲಿ ವೇರಿಯೇಬಲ್‌ಗಳು ಮೆಮೊರಿಯ ಆಬ್ಜೆಕ್ಟ್‌ಗಳಿಗೆ ಪಾಯಿಂಟ್ ಮಾಡುವ ಪಾಯಿಂಟರ್‌ಗಳು ಮಾತ್ರ.",
        diagramTitle: "🧠 ಮೆಮೊರಿ ಮಾದರಿ",
        diagram: `   ವೇರಿಯೇಬಲ್                   ಮೆಮೊರಿ ಆಬ್ಜೆಕ್ಟ್
   +------------+           +-----------------------+
   |  a, b      | --------> | [1, 2, 3]             |
   +------------+           +-----------------------+`,
        deepNotesMarkdown: `### \`==\` vs \`is\`
\`==\` ಮೌಲ್ಯವನ್ನು ಹೋಲಿಸಿದರೆ, \`is\` ಮೆಮೊರಿ ವಿಳಾಸವನ್ನು ಪರಿಶೀಲಿಸುತ್ತದೆ.`,
        pitfallsTitle: "⚠️ ಜಾಗ್ರತೆ",
        pitfalls: [{ title: "ಮ್ಯೂಟೇಬಲ್ ಡಿಫಾಲ್ಟ್", explanation: "ಯಾವಾಗಲೂ `lst=None` ಬಳಸಿ." }],
        quiz: {
          question: "x = [1, 2] ಮತ್ತು y = [1, 2] ಆದರೆ (x is y) ಏನು?",
          options: ["True", "False", "None", "Error"],
          correctIndex: 1,
          explanation: "ವಿಭಿನ್ನ ಮೆಮೊರಿ ವಿಳಾಸಗಳ ಕಾರಣದಿಂದ False.",
        },
      },
      ml: {
        levelTitle: "ഇന്റർമീഡിയറ്റ്: മെമ്മറി റഫറൻസുകൾ",
        levelSubtitle: "പൈത്തൺ മെമ്മറി ആർക്കിടെക്ചർ.",
        analogyTitle: "💡 മെമ്മറി തത്വം",
        analogy: "പൈത്തണിൽ വേരിയബിളുകൾ മെമ്മറി ഒബ്‌ജക്റ്റുകളിലേക്കുള്ള പോയിന്ററുകളാണ്.",
        diagramTitle: "🧠 പോയിന്റർ ഡയഗ്രം",
        diagram: `   വേരിയബിൾ                   മെമ്മറി ഒബ്ജക്റ്റ്
   +------------+           +-----------------------+
   |  a, b      | --------> | [1, 2, 3]             |
   +------------+           +-----------------------+`,
        deepNotesMarkdown: `### \`==\` vs \`is\`
\`==\` മൂല്യം പരിശോധിക്കുമ്പോൾ \`is\` മെമ്മറി വിലാസം പരിശോധിക്കുന്നു.`,
        pitfallsTitle: "⚠️ തെറ്റുകൾ",
        pitfalls: [{ title: "ലിസ്റ്റ് ഡിഫോൾട്ട്", explanation: "`lst=None` ഉപയോഗിക്കുക." }],
        quiz: {
          question: "x = [1, 2] ഉം y = [1, 2] ഉം ആയാൽ (x is y) എന്താണ്?",
          options: ["True", "False", "None", "Error"],
          correctIndex: 1,
          explanation: "രണ്ട് വ്യത്യസ്ത മെമ്മറി ലൊക്കേഷനുകൾ ആയതിനാൽ False.",
        },
      },
      bn: {
        levelTitle: "মধ্যবর্তী স্তর: মেমোরি রেফারেন্স",
        levelSubtitle: "পাইথন মেমোরি মডেল ও পয়েন্টার কনসেপ্ট।",
        analogyTitle: "💡 মেমোরি মডেল",
        analogy: "পাইথনে ভেরিয়েবল হলো অবজেক্টের দিকে নির্দেশকারী পয়েন্টার।",
        diagramTitle: "🧠 মেমোরি ডায়াগ্রাম",
        diagram: `   ভেরিয়েবল                   মেমোরি অবজেক্ট
   +------------+           +-----------------------+
   |  a, b      | --------> | [1, 2, 3]             |
   +------------+           +-----------------------+`,
        deepNotesMarkdown: `### \`==\` বনাম \`is\`
\`==\` মান তুলনা করে, কিন্তু \`is\` মেমোরি ঠিকানা তুলনা করে।`,
        pitfallsTitle: "⚠️ সাবধানতা",
        pitfalls: [{ title: "ডিফল্ট লিস্ট", explanation: "ফাংশনে `lst=None` ব্যবহার করুন।" }],
        quiz: {
          question: "x = [1, 2] এবং y = [1, 2] হলে (x is y) কী হবে?",
          options: ["True", "False", "None", "Error"],
          correctIndex: 1,
          explanation: "মেমোরি লোকেশন ভিন্ন হওয়ায় False হবে।",
        },
      },
      mr: {
        levelTitle: "मध्यम स्तर: मेमरी रेफरन्स आणि म्युटेबिलिटी",
        levelSubtitle: "ऑब्जेक्ट ओळख आणि मेमरी पॉईंटर्स.",
        analogyTitle: "💡 संकल्पना",
        analogy: "पायथनमध्ये व्हेरिएबल्स हे मेमरीमधील ऑब्जेक्ट्सकडे निर्देश करणारे पॉईंटर्स असतात.",
        diagramTitle: "🧠 पॉईंटर आकृती",
        diagram: `   व्हेरिएबल                   मेमरी ऑब्जेक्ट
   +------------+           +-----------------------+
   |  a, b      | --------> | [1, 2, 3]             |
   +------------+           +-----------------------+`,
        deepNotesMarkdown: `### \`==\` विरुद्ध \`is\`
\`==\` मूल्य तपासते आणि \`is\` मेमरी पत्ता तपासते.`,
        pitfallsTitle: "⚠️ महत्त्वाचे",
        pitfalls: [{ title: "म्युटेबल डिफॉल्ट", explanation: "`lst=None` वापरा." }],
        quiz: {
          question: "x = [1, 2] आणि y = [1, 2] असल्यास (x is y) काय येईल?",
          options: ["True", "False", "None", "Error"],
          correctIndex: 1,
          explanation: "मेमरी पत्ते वेगळे असल्याने False येईल.",
        },
      },
      gu: {
        levelTitle: "મધ્યમ સ્તર: મેમરી રેફરન્સ",
        levelSubtitle: "પાયથન મેમરી મોડલ અને ઓબ્જેક્ટ પોઇન્ટર્સ.",
        analogyTitle: "💡 સંકલ્પના",
        analogy: "પાયથનમાં વેરિયેબલ્સ એ મેમરી ઓબ્જેક્ટ્સ તરફ નિર્દેશ કરતા પોઈન્ટર છે.",
        diagramTitle: "🧠 મેમરી ડાયાગ્રામ",
        diagram: `   વેરિયેબલ                    મેમરી ઓબ્જેક્ટ
   +------------+           +-----------------------+
   |  a, b      | --------> | [1, 2, 3]             |
   +------------+           +-----------------------+`,
        deepNotesMarkdown: `### \`==\` વિરુદ્ધ \`is\`
\`==\` મૂલ્ય સરખાવે છે, જ્યારે \`is\` મેમરી એડ્રેસ સરખાવે છે.`,
        pitfallsTitle: "⚠️ સાવચેતી",
        pitfalls: [{ title: "મ્યુટેબલ ડિફોલ્ટ", explanation: "`lst=None` નો ઉપયોગ કરો." }],
        quiz: {
          question: "જો x = [1, 2] અને y = [1, 2] હોય, તો (x is y) શું થશે?",
          options: ["True", "False", "None", "Error"],
          correctIndex: 1,
          explanation: "મેમરી એડ્રેસ જુદા હોવાથી False આવશે.",
        },
      },
      pa: {
        levelTitle: "ਦਰਮਿਆਨਾ ਪੱਧਰ: ਮੈਮੋਰੀ ਰੈਫਰੈਂਸ",
        levelSubtitle: "ਪਾਈਥਨ ਮੈਮੋਰੀ ਢਾਂਚਾ ਅਤੇ ਪੁਆਇੰਟਰ।",
        analogyTitle: "💡 ਸੰਕਲਪ",
        analogy: "ਪਾਈਥਨ ਵਿੱਚ ਵੇਰੀਏਬਲ ਮੈਮੋਰੀ ਆਬਜੈਕਟਸ ਵੱਲ ਇਸ਼ਾਰਾ ਕਰਨ ਵਾਲੇ ਪੁਆਇੰਟਰ ਹਨ।",
        diagramTitle: "🧠 ਮੈਮੋਰੀ ਚਿੱਤਰ",
        diagram: `   ਵੇਰੀਏਬਲ                     ਮੈਮੋਰੀ ਆਬਜੈਕਟ
   +------------+           +-----------------------+
   |  a, b      | --------> | [1, 2, 3]             |
   +------------+           +-----------------------+`,
        deepNotesMarkdown: `### \`==\` ਬਨਾਮ \`is\`
\`==\` ਮੁੱਲ ਜਾਂਚਦਾ ਹੈ ਅਤੇ \`is\` ਮੈਮੋਰੀ ਪਤਾ ਜਾਂਚਦਾ ਹੈ।`,
        pitfallsTitle: "⚠️ ਧਿਆਨ ਦੇਣ ਯੋਗ",
        pitfalls: [{ title: "ਡਿਫਾਲਟ ਲਿਸਟ", explanation: "ਫੰਕਸ਼ਨ ਵਿੱਚ `lst=None` ਵਰਤੋ।" }],
        quiz: {
          question: "ਜੇ x = [1, 2] ਅਤੇ y = [1, 2] ਹੋਵੇ ਤਾਂ (x is y) ਕੀ ਹੋਵੇਗਾ?",
          options: ["True", "False", "None", "Error"],
          correctIndex: 1,
          explanation: "ਵੱਖਰੇ ਮੈਮੋਰੀ ਪਤੇ ਕਾਰਨ False ਹੋਵੇਗਾ।",
        },
      },
    },
    experienced: {
      en: {
        levelTitle: "Experienced: CPython Internals & Bytecode Execution",
        levelSubtitle: "Under the hood: PyObject structure, opcode disassembly, integer interning, and GC.",
        analogyTitle: "⚙️ Low-Level Architecture: Everything is a PyObject",
        analogy:
          "In CPython (the standard C implementation of Python), an integer like `42` is not a primitive 4-byte machine word on the stack. It is a heap-allocated `PyLongObject` containing a 64-bit reference counter (`ob_refcnt`), a type pointer (`ob_type`), and digit arrays, consuming at least 28 bytes of RAM!",
        diagramTitle: "🔬 CPython PyObject Memory Layout (64-bit)",
        diagram: `+-----------------------------------------------+
|               PyObject struct                 |
|                                               |
|  +-----------------------------------------+  |
|  |  uintptr_t ob_refcnt  (8 bytes: 0x01)   |  | -> Reference counter
|  +-----------------------------------------+  |
|  |  struct _typeobject *ob_type (8 bytes)  |  | -> Pointer to &PyLong_Type
|  +-----------------------------------------+  |
|  |  Py_ssize_t ob_size   (8 bytes)         |  | -> Number of digits
|  +-----------------------------------------+  |
|  |  digit ob_digit[1]    (4 bytes: 42)     |  | -> Actual payload
|  +-----------------------------------------+  |
+-----------------------------------------------+
Total memory footprint for int(42): 28 bytes!`,
        deepNotesMarkdown: `### 1. Integer Interning Cache (-5 to 256)
CPython pre-allocates an array of small integers between **-5 and 256** when the interpreter boots. Any code referencing integers in this range reuses the identical singleton in memory:

\`\`\`python
x = 256
y = 256
print(x is y)  # True (Both share CPython global singleton)

a = 257
b = 257
print(a is b)  # False in REPL (Allocated as separate PyLongObject instances)
\`\`\`

### 2. Disassembling Python to Virtual Machine Opcodes
Python source compiles down to Python Bytecode (\`.pyc\`), which the CPython evaluation loop (\`_PyEval_EvalFrameDefault\`) executes on a stack-based virtual machine:

\`\`\`python
import dis

def add(x, y):
    return x + y

dis.dis(add)
\`\`\`

Disassembly output:
\`\`\`text
  1           0 RESUME                   0
  2           2 LOAD_FAST                0 (x)
              4 LOAD_FAST                1 (y)
              6 BINARY_OP                0 (+)
             10 RETURN_VALUE
\`\`\`

### 3. Memory Optimization with \`__slots__\`
Normal Python objects store attributes in a dynamic dictionary (\`__dict__\`), taking ~150-200 bytes per instance. Using \`__slots__\` replaces the dictionary with a fixed-size C array:

\`\`\`python
class CompactPoint:
    __slots__ = ('x', 'y')  # Eliminates __dict__, saves ~60% RAM in bulk objects
    def __init__(self, x, y):
        self.x = x
        self.y = y
\`\`\``,
        pitfallsTitle: "⚡ Deep CPython Edge Cases",
        pitfalls: [
          {
            title: "Constant Folding by AST Optimizer",
            explanation:
              "In Python 3.11+, code blocks compiled together perform constant folding and code object interning, causing literals like `257` in the same module to unexpectedly return `True` for `is`.",
          },
        ],
        quiz: {
          question: "Which range of integers does CPython pre-allocate and intern globally at startup?",
          options: ["0 to 255", "-5 to 256", "-128 to 127", "1 to 100"],
          correctIndex: 1,
          explanation:
            "CPython maintains an array of singleton integer objects from -5 to 256 to accelerate frequent arithmetic and loop indexing.",
        },
      },
      hi: {
        levelTitle: "उन्नत स्तर: CPython इंटरनल्स और बाइटकोड",
        levelSubtitle: "पायथन इंजन की आंतरिक कार्यप्रणाली, PyObject संरचना और ऑप्टिमाइज़ेशन।",
        analogyTitle: "⚙️ लो-लेवल आर्किटेक्चर: सब कुछ एक PyObject है",
        analogy:
          "CPython में कोई भी साधारण नंबर (जैसे 42) सीधे मशीन का 4-बाइट नंबर नहीं होता। यह हीप मेमोरी में बना एक पूरा C-स्ट्रक्चर (PyLongObject) होता है जिसमें रेफरेंस काउंटर, टाइप पॉइंटर और डिजिट्स होते हैं, जो कम से कम 28 बाइट्स मेमोरी लेता है!",
        diagramTitle: "🔬 CPython PyObject स्ट्रक्चर",
        diagram: `+-----------------------------------------------+
|               PyObject struct                 |
|  [ ob_refcnt : 8 bytes ] -> रेफरेंस काउंट      |
|  [ ob_type   : 8 bytes ] -> टाइप का पॉइंटर    |
|  [ ob_digit  : 4 bytes ] -> वास्तविक डेटा     |
+-----------------------------------------------+
कुल मेमोरी: 28 बाइट्स!`,
        deepNotesMarkdown: `### 1. स्मॉल इंटीजर कैशिंग (-5 से 256)
CPython शुरू होते ही -5 से 256 तक के सभी पूर्णांकों को मेमोरी में पहले से बना लेता है। इस रेंज के सभी नंबर एक ही मेमोरी एड्रेस शेयर करते हैं:

\`\`\`python
x = 256
y = 256
print(x is y)  # True (सिंगलटन ऑब्जेक्ट)

a = 1000
b = 1000
print(a is b)  # False (अलग मेमोरी ऑब्जेक्ट्स)
\`\`\`

### 2. बाइटकोड डिसअसेम्बली (\`dis.dis\`)
\`\`\`python
import dis
def calc(a, b):
    return a + b
dis.dis(calc)
\`\`\``,
        pitfallsTitle: "⚡ CPython बारीकियां",
        pitfalls: [
          {
            title: "ग्लोबल इंटरप्रेटर लॉक (GIL)",
            explanation: "CPython में एक समय में केवल एक थ्रेड बाइटकोड रन कर सकता है।",
          },
        ],
        quiz: {
          question: "CPython किस रेंज के इंटीजर्स को पहले से कैश करके रखता है?",
          options: ["0 से 255", "-5 से 256", "-128 से 127", "1 से 100"],
          correctIndex: 1,
          explanation: "CPython -5 से 256 तक के नंबरों को परफॉर्मेंस के लिए ग्लोबल सिंगलटन रखता है।",
        },
      },
      te: {
        levelTitle: "అధునాతన స్థాయి: CPython ఇంటర్నల్స్ మరియు బైట్‌కోడ్",
        levelSubtitle: "పైథాన్ వర్చువల్ మెషిన్, PyObject ఆర్కిటెక్చర్ మరియు ఆప్టిమైజేషన్.",
        analogyTitle: "⚙️ C-లెవల్ ఆర్కిటెక్చర్",
        analogy:
          "CPython లో ప్రతి ఇంటిజర్ కూడా మెమరీలో 28 బైట్ల PyLongObject గా కేటాయించబడుతుంది. ఇందులో ob_refcnt మరియు ob_type అనే పాయింటర్లు ఉంటాయి.",
        diagramTitle: "🔬 CPython మెమరీ నిర్మాణం",
        diagram: `+-----------------------------------------------+
|               PyObject struct                 |
|  [ ob_refcnt : 8 bytes ] -> రిఫరెన్స్ కౌంటర్  |
|  [ ob_type   : 8 bytes ] -> టైప్ పాయింటర్     |
|  [ ob_digit  : 4 bytes ] -> డేటా              |
+-----------------------------------------------+`,
        deepNotesMarkdown: `### 1. స్మాల్ ఇంటిజర్ కాషింగ్ (-5 నుండి 256)
CPython స్టార్ట్ అయినప్పుడే -5 నుండి 256 వరకు గల పూర్ణాంకాలను మెమరీలో సింగిల్టన్లుగా కేటాయిస్తుంది.

\`\`\`python
x = 256
y = 256
print(x is y)  # True!
\`\`\``,
        pitfallsTitle: "⚡ అధునాతన విషయాలు",
        pitfalls: [{ title: "GIL (Global Interpreter Lock)", explanation: "CPython లో మల్టీ-థ్రెడింగ్ పనితీరును నియంత్రిస్తుంది." }],
        quiz: {
          question: "CPython లో ముందస్తుగా కేటాయించబడే ఇంటిజర్ శ్రేణి ఏది?",
          options: ["0 నుండి 255", "-5 నుండి 256", "-128 నుండి 127", "1 నుండి 100"],
          correctIndex: 1,
          explanation: "-5 నుండి 256 వరకు CPython గ్లోబల్ సింగిల్టన్లను నిర్వహిస్తుంది.",
        },
      },
      ta: {
        levelTitle: "மேம்பட்ட நிலை: CPython மற்றும் பைட்-கோட் இயக்கவியல்",
        levelSubtitle: "பைதான் இன்ஜின் உட்புற அமைப்பு, PyObject மற்றும் ஆப்டிமைசேஷன்.",
        analogyTitle: "⚙️ உள் கட்டமைப்பு",
        analogy: "CPython இல் ஒவ்வொரு எண்ணும் 28 பைட்டுகள் கொண்ட PyObject ஆக மெமரியில் சேமிக்கப்படுகிறது.",
        diagramTitle: "🔬 PyObject அமைப்பு",
        diagram: `+-----------------------------------------------+
|               PyObject struct                 |
|  [ ob_refcnt : 8 bytes ]                      |
|  [ ob_type   : 8 bytes ]                      |
|  [ ob_digit  : 4 bytes ]                      |
+-----------------------------------------------+`,
        deepNotesMarkdown: `### 1. முழு எண் கேச்சிங் (-5 முதல் 256)
CPython -5 முதல் 256 வரையிலான எண்களை தொடக்கத்திலேயே நினைவகத்தில் பதிய வைத்துக்கொள்கிறது.`,
        pitfallsTitle: "⚡ குறிப்புகள்",
        pitfalls: [{ title: "GIL கட்டுப்பாடு", explanation: "CPython இல் ஒரே நேரத்தில் ஒரு த்ரெட் மட்டுமே இயங்க முடியும்." }],
        quiz: {
          question: "CPython எந்த எண் வரம்பை உலகளாவிய ரீதியில் கேச் செய்கிறது?",
          options: ["0 முதல் 255", "-5 முதல் 256", "-128 முதல் 127", "1 முதல் 100"],
          correctIndex: 1,
          explanation: "-5 முதல் 256 வரையிலான எண்களை CPython சேமிக்கிறது.",
        },
      },
      kn: {
        levelTitle: "ಸುಧಾರಿತ ಹಂತ: CPython ಇಂಟರ್ನಲ್ಸ್",
        levelSubtitle: "ಪೈಥಾನ್ ಬೈಟ್‌ಕೋಡ್ ಮತ್ತು ಮೆಮೊರಿ ಆಪ್ಟಿಮೈಸೇಶನ್.",
        analogyTitle: "⚙️ CPython ಮಾದರಿ",
        analogy: "CPython ನಲ್ಲಿ ಪ್ರತಿಯೊಂದು ಸಂಖ್ಯೆಯೂ 28 ಬೈಟ್‌ಗಳ PyLongObject ಆಗಿರುತ್ತದೆ.",
        diagramTitle: "🔬 PyObject ರಚನೆ",
        diagram: `+-----------------------------------------------+
|  ob_refcnt (8B) | ob_type (8B) | ob_digit     |
+-----------------------------------------------+`,
        deepNotesMarkdown: `### ಸ್ಮಾಲ್ ಇಂಟಿಜರ್ ಕ್ಯಾಶಿಂಗ್ (-5 ರಿಂದ 256)
-5 ರಿಂದ 256 ರವರೆಗಿನ ಸಂಖ್ಯೆಗಳನ್ನು CPython ಪ್ರಾರಂಭದಲ್ಲೇ ಕ್ಯಾಶ್ ಮಾಡುತ್ತದೆ.`,
        pitfallsTitle: "⚡ ಮುನ್ನೆಚ್ಚರಿಕೆ",
        pitfalls: [{ title: "GIL", explanation: "ಗ್ಲೋಬಲ್ ಇಂಟರ್‌ಪ್ರಿಟರ್ ಲಾಕ್." }],
        quiz: {
          question: "CPython ಯಾವ ಇಂಟಿಜರ್ ಶ್ರೇಣಿಯನ್ನು ಕ್ಯಾಶ್ ಮಾಡುತ್ತದೆ?",
          options: ["0 ರಿಂದ 255", "-5 ರಿಂದ 256", "-128 ರಿಂದ 127", "1 ರಿಂದ 100"],
          correctIndex: 1,
          explanation: "-5 ರಿಂದ 256 ವರೆಗೆ.",
        },
      },
      ml: {
        levelTitle: "അഡ്വാൻസ്ഡ്: CPython ഇന്റേണലുകൾ",
        levelSubtitle: "പൈത്തൺ ബൈറ്റ് കോഡും മെമ്മറി ഘടനയും.",
        analogyTitle: "⚙️ ഘടന",
        analogy: "CPython-ൽ ഓരോ സംഖ്യയും 28 ബൈറ്റുള്ള PyObject ആണ്.",
        diagramTitle: "🔬 മെമ്മറി ഘടന",
        diagram: `+-----------------------------------------------+
|  ob_refcnt (8B) | ob_type (8B) | ob_digit     |
+-----------------------------------------------+`,
        deepNotesMarkdown: `### ഇന്റിജർ കാഷിംഗ് (-5 മുതൽ 256 വരെ)
-5 മുതൽ 256 വരെയുള്ള സംഖ്യകൾ CPython നേരത്തെ തന്നെ സേവ് ചെയ്യുന്നു.`,
        pitfallsTitle: "⚡ GIL വിവരണം",
        pitfalls: [{ title: "GIL തത്വം", explanation: "ത്രെഡിംഗ് നിയന്ത്രണം." }],
        quiz: {
          question: "CPython ഏത് സംഖ്യകൾ കാഷ് ചെയ്യുന്നു?",
          options: ["0 മുതൽ 255", "-5 മുതൽ 256", "-128 മുതൽ 127", "1 മുതൽ 100"],
          correctIndex: 1,
          explanation: "-5 മുതൽ 256 വരെയുള്ള സംഖ്യകൾ.",
        },
      },
      bn: {
        levelTitle: "উন্নত স্তর: CPython ইন্টারনালস",
        levelSubtitle: "বাইটকোড ও অবজেক্ট অপ্টিমাইজেশন।",
        analogyTitle: "⚙️ কাঠামো",
        analogy: "CPython-এ প্রতিটি সংখ্যা ২৮ বাইটের PyLongObject হিসেবে থাকে।",
        diagramTitle: "🔬 মেমোরি লেআউট",
        diagram: `+-----------------------------------------------+
|  ob_refcnt (8B) | ob_type (8B) | ob_digit     |
+-----------------------------------------------+`,
        deepNotesMarkdown: `### স্মল ইন্টিজার ক্যাশিং (-5 থেকে 256)
-5 থেকে 256 পর্যন্ত সংখ্যা সিপাইথন আগে থেকেই ক্যাশ করে রাখে।`,
        pitfallsTitle: "⚡ GIL সংক্রান্ত তথ্য",
        pitfalls: [{ title: "GIL সীমাবদ্ধতা", explanation: "একসময়ে একটি মাত্র থ্রেড চলে।" }],
        quiz: {
          question: "কোন রেঞ্জের সংখ্যা CPython গ্লোবালি ক্যাশ করে?",
          options: ["0 থেকে 255", "-5 থেকে 256", "-128 থেকে 127", "1 থেকে 100"],
          correctIndex: 1,
          explanation: "-5 থেকে 256 পর্যন্ত সংখ্যা।",
        },
      },
      mr: {
        levelTitle: "प्रगत स्तर: CPython अंतर्गत रचना",
        levelSubtitle: "बाइटकोड आणि मेमरी ऑप्टिमायझेशन.",
        analogyTitle: "⚙️ PyObject रचना",
        analogy: "CPython मध्ये प्रत्येक नंबर हा 28 बाइट्सचा PyObject असतो.",
        diagramTitle: "🔬 मेमरी रचना",
        diagram: `+-----------------------------------------------+
|  ob_refcnt (8B) | ob_type (8B) | ob_digit     |
+-----------------------------------------------+`,
        deepNotesMarkdown: `### स्मॉल इंटिजर कॅशिंग (-5 ते 256)
-5 ते 256 पर्यंतचे पूर्णांक CPython आधीच मेमरीमध्ये तयार ठेवतो.`,
        pitfallsTitle: "⚡ GIL तपशील",
        pitfalls: [{ title: "GIL", explanation: "ग्लोबल इंटरप्रिटर लॉक." }],
        quiz: {
          question: "CPython कोणती रेंज कॅश करून ठेवते?",
          options: ["0 ते 255", "-5 ते 256", "-128 ते 127", "1 ते 100"],
          correctIndex: 1,
          explanation: "-5 ते 256 पर्यंत.",
        },
      },
      gu: {
        levelTitle: "એડવાન્સ્ડ સ્તર: CPython ઇન્ટરનલ્સ",
        levelSubtitle: "બાઈટકોડ અને મેમરી આર્કિટેક્ચર.",
        analogyTitle: "⚙️ PyObject મોડેલ",
        analogy: "CPython માં દરેક ઇન્ટીજર 28 બાઇટ્સનો PyLongObject હોય છે.",
        diagramTitle: "🔬 મેમરી લેઆઉટ",
        diagram: `+-----------------------------------------------+
|  ob_refcnt (8B) | ob_type (8B) | ob_digit     |
+-----------------------------------------------+`,
        deepNotesMarkdown: `### સ્મોલ ઇન્ટીજર કેશિંગ (-5 થી 256)
-5 થી 256 સુધીના નંબરો CPython અગાઉથી કેશ કરી લે છે.`,
        pitfallsTitle: "⚡ GIL નિયમો",
        pitfalls: [{ title: "GIL", explanation: "ગ્લોબલ ઇન્ટરપ્રિટર લોક." }],
        quiz: {
          question: "CPython કઈ રેન્જના ઇન્ટીજર્સ કેશ કરે છે?",
          options: ["0 થી 255", "-5 થી 256", "-128 થી 127", "1 થી 100"],
          correctIndex: 1,
          explanation: "-5 થી 256.",
        },
      },
      pa: {
        levelTitle: "ਐਡਵਾਂਸਡ ਪੱਧਰ: CPython ਇੰਟਰਨਲਸ",
        levelSubtitle: "ਬਾਈਟਕੋਡ ਅਤੇ ਮੈਮੋਰੀ ਆਪਟੀਮਾਈਜ਼ੇਸ਼ਨ।",
        analogyTitle: "⚙️ ਬਣਤਰ",
        analogy: "CPython ਵਿੱਚ ਹਰ ਇੱਕ ਨੰਬਰ 28 ਬਾਈਟਸ ਦਾ PyLongObject ਹੁੰਦਾ ਹੈ।",
        diagramTitle: "🔬 ਮੈਮੋਰੀ ਲੇਆਉਟ",
        diagram: `+-----------------------------------------------+
|  ob_refcnt (8B) | ob_type (8B) | ob_digit     |
+-----------------------------------------------+`,
        deepNotesMarkdown: `### ਇੰਟੀਜਰ ਕੈਸ਼ਿੰਗ (-5 ਤੋਂ 256)
-5 ਤੋਂ 256 ਤੱਕ ਦੇ ਨੰਬਰ CPython ਪਹਿਲਾਂ ਹੀ ਸੇਵ ਕਰਕੇ ਰੱਖਦਾ ਹੈ।`,
        pitfallsTitle: "⚡ GIL ਜਾਣਕਾਰੀ",
        pitfalls: [{ title: "GIL ਸੀਮਾਵਾਂ", explanation: "ਇੱਕ ਸਮੇਂ ਇੱਕ ਥ੍ਰੈਡ।" }],
        quiz: {
          question: "CPython ਕਿਹੜੀ ਰੇਂਜ ਕੈਸ਼ ਕਰਦਾ ਹੈ?",
          options: ["0 ਤੋਂ 255", "-5 ਤੋਂ 256", "-128 ਤੋਂ 127", "1 ਤੋਂ 100"],
          correctIndex: 1,
          explanation: "-5 ਤੋਂ 256 ਤੱਕ।",
        },
      },
    },
  },
};

// Helper function to get deep topic content with intelligent fallback
export function getDeepTopicContent(
  slug: string,
  level: Level,
  lang: IndianLanguage,
  defaultNotes?: string
): DeepTopicContent {
  const topicData = TOPIC_DEEP_CONTENT[slug];
  if (topicData && topicData[level]) {
    if (topicData[level][lang]) {
      return topicData[level][lang];
    }
    // Fallback to English for this level if the specific language translation isn't filled yet
    if (topicData[level]["en"]) {
      return topicData[level]["en"];
    }
  }

  // Generic fallback if topic is not custom-curated yet
  const langMeta = INDIAN_LANGUAGES.find((l) => l.code === lang) || INDIAN_LANGUAGES[0];
  const levelMeta = LEVEL_INFO[level];

  return {
    levelTitle: `${levelMeta.label}: ${slug.replace(/-/g, " ").toUpperCase()}`,
    levelSubtitle: `Detailed topic breakdown tailored for ${levelMeta.label} level in ${langMeta.nativeName} (${langMeta.name}).`,
    analogyTitle: `💡 Core Intuition (${langMeta.name})`,
    analogy: `Mastering ${slug.replace(/-/g, " ")} gives you the mental building blocks for algorithmic problem solving and writing clean, scalable Python programs.`,
    diagramTitle: "🧠 Visual Architecture",
    diagram: `+---------------------------------------------+
|  Topic: ${slug.padEnd(35)} |
|  Level: ${levelMeta.label.padEnd(35)} |
|  Lang:  ${langMeta.nativeName.padEnd(35)} |
+---------------------------------------------+`,
    deepNotesMarkdown: defaultNotes || `### Key Concept Overview\n\nStudy this topic carefully before proceeding to the interactive challenges below.`,
    pitfallsTitle: "⚠️ Key Pitfalls to Watch",
    pitfalls: [
      {
        title: "Syntax & Type Discipline",
        explanation: "Always check types and indentation carefully before executing code.",
      },
    ],
    quiz: {
      question: `Are you ready to test your knowledge in ${slug.replace(/-/g, " ")}?`,
      options: ["Yes, start challenges!", "Review concept notes again", "Switch level", "Change language"],
      correctIndex: 0,
      explanation: "Practice makes perfect. Jump into the hands-on coding tests below!",
    },
  };
}
