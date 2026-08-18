import sqlite3
from datetime import datetime

DB_PATH = "canis.db"


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS analyses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email_id TEXT,
            sender TEXT,
            subject TEXT,
            risk_score INTEGER,
            severity TEXT,
            indicators TEXT,
            ai_explanation TEXT,
            recommended_action TEXT,
            created_at TEXT
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS triage_actions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email_id TEXT,
            sender TEXT,
            subject TEXT,
            action TEXT,
            created_at TEXT
        )
    """)
    conn.commit()
    conn.close()


def save_analysis(email_id, sender, subject, risk_score, severity, indicators, ai_explanation, recommended_action):
    conn = get_connection()
    conn.execute(
        """
        INSERT INTO analyses (email_id, sender, subject, risk_score, severity, indicators, ai_explanation, recommended_action, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (email_id, sender, subject, risk_score, severity, ", ".join(indicators), ai_explanation, recommended_action, datetime.utcnow().isoformat()),
    )
    conn.commit()
    conn.close()


def get_stats():
    conn = get_connection()
    total = conn.execute("SELECT COUNT(*) as c FROM analyses").fetchone()["c"]
    by_severity = conn.execute(
        "SELECT severity, COUNT(*) as c FROM analyses GROUP BY severity"
    ).fetchall()
    recent = conn.execute(
        "SELECT * FROM analyses ORDER BY created_at DESC LIMIT 10"
    ).fetchall()
    conn.close()

    severity_counts = {"Low": 0, "Medium": 0, "High": 0, "Critical": 0}
    for row in by_severity:
        severity_counts[row["severity"]] = row["c"]

    return {
        "total_scanned": total,
        "severity_counts": severity_counts,
        "recent": [dict(r) for r in recent],
    }


def save_triage_action(email_id, sender, subject, action):
    conn = get_connection()
    conn.execute(
        """
        INSERT INTO triage_actions (email_id, sender, subject, action, created_at)
        VALUES (?, ?, ?, ?, ?)
        """,
        (email_id, sender, subject, action, datetime.utcnow().isoformat()),
    )
    conn.commit()
    conn.close()


def get_triage_history():
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM triage_actions ORDER BY created_at DESC LIMIT 50"
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]