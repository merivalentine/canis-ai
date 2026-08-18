const COVER_TEXT = {
  English: {
    headline: "A calmer way to know<br>what's safe in your inbox",
    sub: "Canis AI reads your Gmail, checks every message against real phishing signals, and explains what it finds — clearly, and without the noise.",
    login: "Sign in with Google",
    rules: "Rule-based detection",
    intel: "Threat intelligence",
    ai: "Plain-language AI",
  },
  Spanish: {
    headline: "Una forma más tranquila de<br>saber qué es seguro en tu correo",
    sub: "Canis AI lee tu Gmail, revisa cada mensaje contra señales reales de phishing, y te explica lo que encuentra, con claridad y sin ruido.",
    login: "Iniciar sesión con Google",
    rules: "Detección basada en reglas",
    intel: "Inteligencia de amenazas",
    ai: "IA en lenguaje sencillo",
  },
  Tagalog: {
    headline: "Isang mas kalmadong paraan para<br>malaman kung ano ang ligtas sa inbox mo",
    sub: "Binabasa ng Canis AI ang iyong Gmail, sinusuri ang bawat mensahe laban sa tunay na senyales ng phishing, at ipinapaliwanag ang nakita nito nang malinaw.",
    login: "Mag-login gamit ang Google",
    rules: "Rule-based na pagtukoy",
    intel: "Threat intelligence",
    ai: "AI na madaling maintindihan",
  },
  Cebuano: {
    headline: "Usa ka mas kalma nga paagi aron<br>mahibalo kung unsa ang luwas sa imong inbox",
    sub: "Gibasa sa Canis AI ang imong Gmail, gisusi ang matag mensahe batok sa tinuod nga mga senyales sa phishing, ug gipatin-aw ang nakita niini.",
    login: "Pag-login gamit ang Google",
    rules: "Rule-based nga pag-ila",
    intel: "Threat intelligence",
    ai: "AI nga sayon sabton",
  },
  French: {
    headline: "Une façon plus sereine de savoir<br>ce qui est sûr dans votre boîte mail",
    sub: "Canis AI lit votre Gmail, vérifie chaque message selon de vrais signaux de phishing, et explique ce qu'il trouve clairement, sans bruit inutile.",
    login: "Se connecter avec Google",
    rules: "Détection par règles",
    intel: "Renseignement sur les menaces",
    ai: "IA en langage simple",
  },
  Portuguese: {
    headline: "Uma forma mais tranquila de saber<br>o que é seguro na sua caixa de entrada",
    sub: "O Canis AI lê seu Gmail, verifica cada mensagem com sinais reais de phishing, e explica o que encontra com clareza, sem ruído.",
    login: "Entrar com o Google",
    rules: "Detecção baseada em regras",
    intel: "Inteligência de ameaças",
    ai: "IA em linguagem simples",
  },
  German: {
    headline: "Ein ruhigerer Weg zu wissen,<br>was in deinem Posteingang sicher ist",
    sub: "Canis AI liest dein Gmail, prüft jede Nachricht anhand echter Phishing-Signale und erklärt die Ergebnisse klar und ohne unnötigen Lärm.",
    login: "Mit Google anmelden",
    rules: "Regelbasierte Erkennung",
    intel: "Bedrohungsanalyse",
    ai: "KI in einfacher Sprache",
  },
  "Mandarin Chinese": {
    headline: "以更从容的方式，<br>了解收件箱中哪些邮件是安全的",
    sub: "Canis AI 会读取您的 Gmail，根据真实的钓鱼邮件特征检查每封邮件，并清晰、简洁地解释检测结果。",
    login: "使用 Google 登录",
    rules: "基于规则的检测",
    intel: "威胁情报",
    ai: "通俗易懂的 AI 解释",
  },
  Japanese: {
    headline: "受信箱の安全性を、<br>もっと落ち着いて知る方法",
    sub: "Canis AI があなたのGmailを読み取り、実際のフィッシングの兆候と照合し、結果をわかりやすく説明します。",
    login: "Googleでログイン",
    rules: "ルールベースの検知",
    intel: "脅威インテリジェンス",
    ai: "わかりやすいAI説明",
  },
  Korean: {
    headline: "받은편지함에서 무엇이 안전한지<br>더 차분하게 아는 방법",
    sub: "Canis AI가 Gmail을 읽고 실제 피싱 신호와 비교해 각 메일을 확인한 뒤, 결과를 명확하고 간결하게 설명합니다.",
    login: "Google로 로그인",
    rules: "규칙 기반 탐지",
    intel: "위협 인텔리전스",
    ai: "쉬운 언어의 AI 설명",
  },
};

function populateLanguageDropdown() {
  const select = document.getElementById("language");
  Object.keys(COVER_TEXT).forEach(lang => {
    const opt = document.createElement("option");
    opt.value = lang;
    opt.textContent = lang;
    select.appendChild(opt);
  });
  const saved = localStorage.getItem("canisLanguage") || "English";
  select.value = saved;
}

function applyText() {
  const lang = document.getElementById("language").value;
  const text = COVER_TEXT[lang] || COVER_TEXT.English;
  document.getElementById("coverHeadline").innerHTML = text.headline;
  document.getElementById("coverSub").textContent = text.sub;
  document.getElementById("loginBtn").textContent = text.login;
  document.getElementById("footRules").textContent = text.rules;
  document.getElementById("footIntel").textContent = text.intel;
  document.getElementById("footAi").textContent = text.ai;
}

document.getElementById("language").addEventListener("change", () => {
  const lang = document.getElementById("language").value;
  localStorage.setItem("canisLanguage", lang);
  applyText();
});

populateLanguageDropdown();
applyText();