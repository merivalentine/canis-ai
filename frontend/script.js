const API = "http://localhost:8000";

let lastAnalyzedId = null;
let lastAnalyzedSender = "";
let lastAnalyzedSubject = "";

let pageTokenStack = [null];
let currentPageIndex = 0;

const UI_TEXT = {
  English: {
    inbox: "Inbox",
    report: "Risk Report",
    empty: "Select an email to see its risk analysis",
    analyzing: "Analyzing...",
    indicators: "What we found",
    none: "No red flags found",
    aiSummary: "Summary",
    threatScore: "AI Threat Score",
    whatToDo: "What should you do?",
    reportBtn: "Report as Phishing",
    safeBtn: "Mark as Safe",
    deleteBtn: "Delete",
    next: "Next",
    previous: "Previous",
    checklistDelete: "Do not click any links",
    checklistReply: "Do not reply to this email",
    checklistReport: "Report this email as phishing",
    recorded: "Recorded"
  },

  Spanish: {
    inbox: "Bandeja de entrada",
    report: "Informe de riesgo",
    empty: "Selecciona un correo para ver su análisis",
    analyzing: "Analizando...",
    indicators: "Lo que encontramos",
    none: "No se encontraron señales de alerta",
    aiSummary: "Resumen",
    threatScore: "Puntaje de amenaza IA",
    whatToDo: "¿Qué deberías hacer?",
    reportBtn: "Reportar como phishing",
    safeBtn: "Marcar como seguro",
    deleteBtn: "Eliminar",
    next: "Siguiente",
    previous: "Anterior",
    checklistDelete: "No hagas clic en ningún enlace",
    checklistReply: "No respondas este correo",
    checklistReport: "Reporta este correo como phishing",
    recorded: "Registrado"
  },

  Tagalog: {
    inbox: "Inbox",
    report: "Ulat sa Panganib",
    empty: "Pumili ng email para makita ang risk analysis",
    analyzing: "Sinusuri...",
    indicators: "Ang nahanap namin",
    none: "Walang nakitang red flag",
    aiSummary: "Buod",
    threatScore: "AI Threat Score",
    whatToDo: "Ano ang dapat mong gawin?",
    reportBtn: "I-report bilang phishing",
    safeBtn: "Markahan bilang ligtas",
    deleteBtn: "Burahin",
    next: "Susunod",
    previous: "Nakaraan",
    checklistDelete: "Huwag mag-click ng anumang link",
    checklistReply: "Huwag sagutin ang email na ito",
    checklistReport: "I-report ang email na ito bilang phishing",
    recorded: "Naitala"
  },

  Cebuano: {
    inbox: "Inbox",
    report: "Taho sa Peligro",
    empty: "Pilia ang usa ka email aron makita ang risk analysis",
    analyzing: "Ginasusi...",
    indicators: "Among nakit-an",
    none: "Walay nakit-ang red flag",
    aiSummary: "Summary",
    threatScore: "AI Threat Score",
    whatToDo: "Unsa imong buhaton?",
    reportBtn: "I-report isip phishing",
    safeBtn: "Markahi nga luwas",
    deleteBtn: "Papasa",
    next: "Sunod",
    previous: "Balik",
    checklistDelete: "Ayaw pag-click sa mga link",
    checklistReply: "Ayaw pagtubag niini nga email",
    checklistReport: "I-report kini nga email isip phishing",
    recorded: "Natala"
  },

  French: {
    inbox: "Boîte de réception",
    report: "Rapport de risque",
    empty: "Sélectionnez un e-mail pour voir son analyse",
    analyzing: "Analyse en cours...",
    indicators: "Ce que nous avons trouvé",
    none: "Aucun signal détecté",
    aiSummary: "Résumé",
    threatScore: "Score de menace IA",
    whatToDo: "Que devriez-vous faire ?",
    reportBtn: "Signaler comme phishing",
    safeBtn: "Marquer comme sûr",
    deleteBtn: "Supprimer",
    next: "Suivant",
    previous: "Précédent",
    checklistDelete: "Ne cliquez sur aucun lien",
    checklistReply: "Ne répondez pas à cet e-mail",
    checklistReport: "Signalez cet e-mail comme phishing",
    recorded: "Enregistré"
  },

  Portuguese: {
    inbox: "Caixa de entrada",
    report: "Relatório de risco",
    empty: "Selecione um e-mail para ver a análise",
    analyzing: "Analisando...",
    indicators: "O que encontramos",
    none: "Nenhum sinal encontrado",
    aiSummary: "Resumo",
    threatScore: "Pontuação de ameaça IA",
    whatToDo: "O que você deve fazer?",
    reportBtn: "Denunciar como phishing",
    safeBtn: "Marcar como seguro",
    deleteBtn: "Excluir",
    next: "Próximo",
    previous: "Anterior",
    checklistDelete: "Não clique em nenhum link",
    checklistReply: "Não responda a este e-mail",
    checklistReport: "Denuncie este e-mail como phishing",
    recorded: "Registrado"
  },

  German: {
    inbox: "Posteingang",
    report: "Risikobericht",
    empty: "Wähle eine E-Mail für die Risikoanalyse",
    analyzing: "Analysiere...",
    indicators: "Was wir gefunden haben",
    none: "Keine Warnsignale gefunden",
    aiSummary: "Zusammenfassung",
    threatScore: "KI-Bedrohungswert",
    whatToDo: "Was solltest du tun?",
    reportBtn: "Als Phishing melden",
    safeBtn: "Als sicher markieren",
    deleteBtn: "Löschen",
    next: "Weiter",
    previous: "Zurück",
    checklistDelete: "Klicke auf keine Links",
    checklistReply: "Antworte nicht auf diese E-Mail",
    checklistReport: "Melde diese E-Mail als Phishing",
    recorded: "Gespeichert"
  },

  "Mandarin Chinese": {
    inbox: "收件箱",
    report: "风险报告",
    empty: "选择一封邮件以查看风险分析",
    analyzing: "分析中...",
    indicators: "发现的问题",
    none: "未发现风险信号",
    aiSummary: "摘要",
    threatScore: "AI 威胁评分",
    whatToDo: "您应该怎么做？",
    reportBtn: "举报为钓鱼邮件",
    safeBtn: "标记为安全",
    deleteBtn: "删除",
    next: "下一页",
    previous: "上一页",
    checklistDelete: "不要点击任何链接",
    checklistReply: "不要回复此邮件",
    checklistReport: "将此邮件举报为钓鱼邮件",
    recorded: "已记录"
  },

  Japanese: {
    inbox: "受信トレイ",
    report: "リスクレポート",
    empty: "メールを選択してリスク分析を確認",
    analyzing: "分析中...",
    indicators: "検出された内容",
    none: "警告サインは見つかりませんでした",
    aiSummary: "概要",
    threatScore: "AI脅威スコア",
    whatToDo: "どうすればいいですか？",
    reportBtn: "フィッシングとして報告",
    safeBtn: "安全としてマーク",
    deleteBtn: "削除",
    next: "次へ",
    previous: "前へ",
    checklistDelete: "リンクをクリックしないでください",
    checklistReply: "このメールに返信しないでください",
    checklistReport: "このメールをフィッシングとして報告してください",
    recorded: "記録済み"
  },

  Korean: {
    inbox: "받은편지함",
    report: "위험 보고서",
    empty: "이메일을 선택하여 위험 분석 보기",
    analyzing: "분석 중...",
    indicators: "발견된 사항",
    none: "위험 신호가 발견되지 않았습니다",
    aiSummary: "요약",
    threatScore: "AI 위협 점수",
    whatToDo: "어떻게 해야 하나요?",
    reportBtn: "피싱으로 신고",
    safeBtn: "안전으로 표시",
    deleteBtn: "삭제",
    next: "다음",
    previous: "이전",
    checklistDelete: "어떤 링크도 클릭하지 마세요",
    checklistReply: "이 이메일에 답장하지 마세요",
    checklistReport: "이 이메일을 피싱으로 신고하세요",
    recorded: "기록됨"
  }
};


/* =========================================================
   LANGUAGE
   ========================================================= */

function currentLang() {
  return document.getElementById("language").value;
}

function t() {
  return UI_TEXT[currentLang()] || UI_TEXT.English;
}

function populateLanguageDropdown() {
  const select = document.getElementById("language");

  select.innerHTML = "";

  Object.keys(UI_TEXT).forEach(lang => {
    const opt = document.createElement("option");
    opt.value = lang;
    opt.textContent = lang;
    select.appendChild(opt);
  });

  select.value = "English";
}


/* =========================================================
   SEVERITY
   ========================================================= */

function severityClass(severity) {
  const s = (severity || "").toLowerCase();

  if (s === "critical") return "critical";
  if (s === "high") return "high";
  if (s === "medium") return "medium";

  return "low";
}

function severityColorVar(severity) {
  const map = {
    low: "--low",
    medium: "--medium",
    high: "--high",
    critical: "--critical"
  };

  return map[severityClass(severity)];
}


/* =========================================================
   INDICATORS
   ========================================================= */

function indicatorToCard(indicatorText, severity) {
  const safeText = String(indicatorText || "");

  const title =
    safeText.length > 40
      ? safeText.slice(0, 40) + "…"
      : safeText;

  return `
    <div class="indicator-card">
      <div class="indicator-card-title">${title}</div>

      <div class="indicator-card-desc">
        ${safeText}
      </div>

      <span class="indicator-tag ${severityClass(severity)}">
        ${severity || "Low"}
      </span>
    </div>
  `;
}


/* =========================================================
   GAUGE
   ========================================================= */

function renderGauge(score, severity) {
  const radius = 62;
  const circumference = Math.PI * radius;

  const numericScore = Number(score) || 0;

  const progress =
    Math.min(Math.max(numericScore, 0), 100) / 100;

  const offset =
    circumference * (1 - progress);

  const colorVar =
    severityColorVar(severity);

  return `
    <div class="gauge-svg-wrap">

      <svg
        width="150"
        height="150"
        viewBox="0 0 150 150"
      >

        <path
          d="M 19 90 A 62 62 0 1 1 131 90"
          fill="none"
          stroke="var(--border)"
          stroke-width="12"
          stroke-linecap="round"
        />

        <path
          d="M 19 90 A 62 62 0 1 1 131 90"
          fill="none"
          stroke="var(${colorVar})"
          stroke-width="12"
          stroke-linecap="round"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${offset}"
        />

      </svg>

      <div class="gauge-number">
        <div class="gauge-score">
          ${numericScore}
        </div>

        <div class="gauge-max">
          / 100
        </div>
      </div>

    </div>

    <div class="gauge-severity ${severityClass(severity)}">
      ${severity || "Low"} Risk
    </div>
  `;
}


/* =========================================================
   CHECK ICON
   ========================================================= */

function checkIcon(color) {
  return `
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      style="color:${color}"
    >
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `;
}


/* =========================================================
   VIRUSTOTAL
   ========================================================= */

function renderVirusTotal(results) {

  if (!results || results.length === 0) {
    return "";
  }

  const malicious =
    results.filter(r => r.status === "malicious");

  const suspicious =
    results.filter(r => r.status === "suspicious");

  const clean =
    results.filter(r => r.status === "clean");

  let summary = "";

  if (malicious.length > 0) {

    summary =
      `${malicious.length} link` +
      `${malicious.length > 1 ? "s" : ""}` +
      ` flagged as malicious`;

  } else if (suspicious.length > 0) {

    summary =
      `${suspicious.length} suspicious link` +
      `${suspicious.length > 1 ? "s" : ""}` +
      ` detected`;

  } else if (clean.length === results.length) {

    summary = "All analyzed links appear clean";

  } else {

    summary =
      `${results.length} link` +
      `${results.length > 1 ? "s" : ""}` +
      ` analyzed`;
  }


  const rows = results.map(r => {

    const badgeClass =
      r.status === "malicious"
        ? "vt-malicious"
        : r.status === "suspicious"
          ? "vt-suspicious"
          : r.status === "unknown"
            ? "vt-unknown"
            : "vt-clean";

    const label =
      r.status === "malicious"
        ? "Malicious"
        : r.status === "suspicious"
          ? "Suspicious"
          : r.status === "unknown"
            ? "Not yet scanned"
            : "Clean";

    return `
      <div class="vt-row">

        <span class="vt-badge ${badgeClass}">
          ${label}
        </span>

      </div>
    `;

  }).join("");


  return `
    <div class="vt-section">

      <div class="vt-title">
        VirusTotal Link Check
      </div>

      <div class="vt-summary">
        ${summary}
      </div>

      <div class="vt-results">
        ${rows}
      </div>

    </div>
  `;
}


/* =========================================================
   LOAD EMAILS
   ========================================================= */

async function loadEmails(pageToken = null) {

  try {

    const url =
      pageToken
        ? `${API}/api/emails?page_token=${encodeURIComponent(pageToken)}`
        : `${API}/api/emails`;

    const res = await fetch(url);
    const data = await res.json();

    const container =
      document.getElementById("emails");

    container.innerHTML = "";

    if (data.error) {

      container.innerHTML = `
        <div class="report-empty">
          Unable to load emails.
        </div>
      `;

      renderPaginationControls(null);
      return;
    }


    if (!data.emails || data.emails.length === 0) {

      container.innerHTML = `
        <div class="report-empty">
          No emails found.
        </div>
      `;

      renderPaginationControls(null);
      return;
    }


    data.emails.forEach(e => {

      const div =
        document.createElement("div");

      div.className = "email-row";

      div.dataset.id = e.id;

      div.innerHTML = `
        <div class="email-row-main">

          <div class="email-from">
            ${e.from || ""}
          </div>

          <div class="email-subject">
            ${e.subject || "(No subject)"}
          </div>

        </div>
      `;


      div.onclick = () =>
        analyzeEmail(
          e.id,
          div,
          e.from,
          e.subject
        );


      container.appendChild(div);

    });


    renderPaginationControls(
      data.next_page_token
    );

  } catch (error) {

    console.error("Failed to load emails:", error);

    document.getElementById("emails").innerHTML = `
      <div class="report-empty">
        Unable to connect to the backend.
      </div>
    `;
  }
}


/* =========================================================
   PAGINATION
   ========================================================= */

function renderPaginationControls(nextToken) {

  let controls =
    document.getElementById("pagination");

  if (!controls) {

    controls =
      document.createElement("div");

    controls.id = "pagination";

    controls.className = "pagination";

    document
      .getElementById("emails")
      .insertAdjacentElement(
        "afterend",
        controls
      );
  }


  controls.innerHTML = "";

  const labels = t();


  if (currentPageIndex > 0) {

    const prevBtn =
      document.createElement("button");

    prevBtn.textContent =
      labels.previous;

    prevBtn.className =
      "page-btn";

    prevBtn.onclick = () => {

      currentPageIndex--;

      loadEmails(
        pageTokenStack[currentPageIndex]
      );

    };

    controls.appendChild(prevBtn);
  }


  if (nextToken) {

    const nextBtn =
      document.createElement("button");

    nextBtn.textContent =
      labels.next;

    nextBtn.className =
      "page-btn";

    nextBtn.onclick = () => {

      currentPageIndex++;

      if (
        pageTokenStack.length <=
        currentPageIndex
      ) {

        pageTokenStack.push(nextToken);
      }

      loadEmails(nextToken);
    };

    controls.appendChild(nextBtn);
  }
}


/* =========================================================
   TRIAGE ACTIONS
   ========================================================= */

async function recordTriage(action, btnEl) {

  if (!lastAnalyzedId) {
    return;
  }

  const labels = t();

  const originalText =
    btnEl.textContent;

  btnEl.disabled = true;

  btnEl.textContent = "…";


  try {

    const params =
      new URLSearchParams({

        email_id:
          lastAnalyzedId,

        sender:
          lastAnalyzedSender,

        subject:
          lastAnalyzedSubject,

        action:
          action

      });


    const response =
      await fetch(
        `${API}/api/triage?${params.toString()}`,
        {
          method: "POST"
        }
      );


    if (!response.ok) {
      throw new Error("Triage request failed");
    }


    btnEl.textContent =
      labels.recorded + " ✓";


  } catch (error) {

    console.error(
      "Triage error:",
      error
    );

    btnEl.textContent =
      originalText;

    btnEl.disabled = false;
  }
}


/* =========================================================
   ANALYZE EMAIL
   ========================================================= */

async function analyzeEmail(
  id,
  rowEl,
  sender,
  subject
) {

  lastAnalyzedId = id;

  lastAnalyzedSender =
    sender || "";

  lastAnalyzedSubject =
    subject || "";


  const language =
    currentLang();

  const labels =
    t();


  document
    .querySelectorAll(".email-row")
    .forEach(r =>
      r.classList.remove("active")
    );


  if (rowEl) {
    rowEl.classList.add("active");
  }


  const previewDiv =
    document.getElementById(
      "emailPreview"
    );

  const reportBody =
    document.getElementById(
      "reportBody"
    );


  previewDiv.innerHTML = `
    <div class="report-empty">
      ${labels.analyzing}
    </div>
  `;

  reportBody.innerHTML = "";


  try {

    const [
      emailRes,
      analyzeRes
    ] = await Promise.all([

      fetch(
        `${API}/api/emails/${id}`
      ),

      fetch(
        `${API}/api/analyze/${id}?language=${encodeURIComponent(language)}`
      )

    ]);


    const email =
      await emailRes.json();

    const data =
      await analyzeRes.json();


    if (data.error) {

      reportBody.innerHTML = `
        <div class="report-empty">
          ${data.error}
        </div>
      `;

      return;
    }


    /* -----------------------------------------
       EMAIL PREVIEW
       ----------------------------------------- */

    const emailText =
      email.plain_text ||
      "No text content available.";


    previewDiv.innerHTML = `

      <div class="preview-from">
        ${email.from || ""}
      </div>

      <div class="preview-subject">
        ${email.subject || ""}
      </div>

      <div class="preview-meta">
        ${email.date || ""}
      </div>

      <div class="preview-body">
        ${emailText.replace(/\n/g, "<br>")}
      </div>

    `;


    /* -----------------------------------------
       INDICATORS
       ----------------------------------------- */

    const indicators =
      data.indicators || [];


    const indicatorCards =
      indicators.length

        ? indicators
            .map(i =>
              indicatorToCard(
                i,
                data.severity
              )
            )
            .join("")

        : `
          <div class="indicator-card">

            <div class="indicator-card-desc">
              ${labels.none}
            </div>

          </div>
        `;


    /* -----------------------------------------
       VIRUSTOTAL
       ----------------------------------------- */

    const vtHtml =
      renderVirusTotal(
        data.virustotal_results
      );


    /* -----------------------------------------
       AI EXPLANATION
       ----------------------------------------- */

    const aiExplanation =
      data.ai_explanation ||
      "No AI explanation available.";


    /* -----------------------------------------
       REPORT
       ----------------------------------------- */

    reportBody.innerHTML = `

      <div class="report-grid">

        <div class="panel">

          <h2>
            ${labels.report}
          </h2>


          <div class="indicator-grid">
            ${indicatorCards}
          </div>


          ${vtHtml}


          <div class="ai-summary">

            <div class="ai-summary-title">
              ${labels.aiSummary}
            </div>

            <div class="ai-summary-text">
              ${aiExplanation}
            </div>

          </div>


          <div class="action-row">

            <button
              class="action-btn danger"
              id="btnReport"
            >
              ${labels.reportBtn}
            </button>

            <button
              class="action-btn"
              id="btnSafe"
            >
              ${labels.safeBtn}
            </button>

            <button
              class="action-btn"
              id="btnDelete"
            >
              ${labels.deleteBtn}
            </button>

          </div>

        </div>


        <div class="panel gauge-card">

          <div class="gauge-label">
            ${labels.threatScore}
          </div>

          ${renderGauge(
            data.risk_score,
            data.severity
          )}


          <div class="checklist-card">

            <div class="checklist-title">
              ${labels.whatToDo}
            </div>


            <div class="checklist-item">

              ${checkIcon("var(--accent)")}

              ${labels.checklistDelete}

            </div>


            <div class="checklist-item">

              ${checkIcon("var(--accent)")}

              ${labels.checklistReply}

            </div>


            <div class="checklist-item">

              ${checkIcon("var(--accent)")}

              ${labels.checklistReport}

            </div>

          </div>

        </div>

      </div>

    `;


    /* -----------------------------------------
       ACTION BUTTONS
       ----------------------------------------- */

    document
      .getElementById("btnReport")
      .onclick = e =>
        recordTriage(
          "Report as Phishing",
          e.target
        );


    document
      .getElementById("btnSafe")
      .onclick = e =>
        recordTriage(
          "Mark as Safe",
          e.target
        );


    document
      .getElementById("btnDelete")
      .onclick = e =>
        recordTriage(
          "Delete",
          e.target
        );


  } catch (error) {

    console.error(
      "Analysis error:",
      error
    );

    reportBody.innerHTML = `
      <div class="report-empty">
        Unable to analyze this email.
        Please check that the backend is running.
      </div>
    `;
  }
}


/* =========================================================
   LANGUAGE CHANGE
   ========================================================= */

document
  .getElementById("language")
  .addEventListener(
    "change",
    () => {

      localStorage.setItem(
        "canisLanguage",
        currentLang()
      );


      if (lastAnalyzedId) {

        const activeRow =
          document.querySelector(
            ".email-row.active"
          );


        analyzeEmail(
          lastAnalyzedId,
          activeRow,
          lastAnalyzedSender,
          lastAnalyzedSubject
        );

      } else {

        renderPaginationControls(
          null
        );

      }
    }
  );


/* =========================================================
   INITIALIZE
   ========================================================= */

populateLanguageDropdown();


const savedLang =
  localStorage.getItem(
    "canisLanguage"
  );


if (savedLang &&
    UI_TEXT[savedLang]) {

  document.getElementById(
    "language"
  ).value = savedLang;
}


loadEmails();