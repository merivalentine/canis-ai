const API = "http://localhost:8000";

function severityClass(severity) {
  const s = (severity || "").toLowerCase();
  if (s === "critical") return "critical";
  if (s === "high") return "high";
  if (s === "medium") return "medium";
  return "low";
}

async function loadDashboard() {
  const res = await fetch(`${API}/api/history`);
  const data = await res.json();

  document.getElementById("totalScanned").textContent = data.total_scanned;
  document.getElementById("lowCount").textContent = data.severity_counts.Low || 0;
  document.getElementById("mediumCount").textContent = data.severity_counts.Medium || 0;
  document.getElementById("highCount").textContent = data.severity_counts.High || 0;
  document.getElementById("criticalCount").textContent = data.severity_counts.Critical || 0;

  const list = document.getElementById("historyList");
  list.innerHTML = "";

  if (!data.recent || data.recent.length === 0) {
    list.innerHTML = `<div class="report-empty">No scans yet. Go analyze some emails first.</div>`;
    return;
  }

  data.recent.forEach(item => {
    const row = document.createElement("div");
    row.className = "history-row";
    row.innerHTML = `
      <div class="history-main">
        <div class="history-subject">${item.subject}</div>
        <div class="history-sender">${item.sender}</div>
      </div>
      <div class="history-score ${severityClass(item.severity)}">${item.risk_score}/100</div>
    `;
    list.appendChild(row);
  });
}

loadDashboard();