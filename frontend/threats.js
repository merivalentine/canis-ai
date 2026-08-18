const API = "http://localhost:8000";

function actionClass(action) {
  if (action === "Report as Phishing") return "critical";
  if (action === "Delete") return "high";
  return "low";
}

async function loadTriageLog() {
  const res = await fetch(`${API}/api/triage-history`);
  const data = await res.json();
  const list = document.getElementById("threatsList");
  list.innerHTML = "";

  if (!data || data.length === 0) {
    list.innerHTML = `<div class="report-empty">No actions recorded yet. Go to your inbox and use Report / Mark as Safe / Delete on an analyzed email.</div>`;
    return;
  }

  data.forEach(item => {
    const row = document.createElement("div");
    row.className = "threat-row";
    row.innerHTML = `
      <div class="threat-severity-bar ${actionClass(item.action)}"></div>
      <div class="threat-main">
        <div class="history-subject">${item.subject}</div>
        <div class="history-sender">${item.sender}</div>
      </div>
      <div class="history-score ${actionClass(item.action)}">${item.action}</div>
    `;
    list.appendChild(row);
  });
}

loadTriageLog();