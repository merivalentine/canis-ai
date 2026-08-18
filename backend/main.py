import os
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse, HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from auth import get_flow
from gmail_service import list_recent_emails, get_email_details
from rule_engine import run_rule_engine
from ai_service import get_ai_explanation
from virustotal_service import check_links
from database import init_db, save_analysis, get_stats, save_triage_action, get_triage_history

load_dotenv()
app = FastAPI(title="Canis AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5500"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

init_db()

user_sessions = {}
flow_sessions = {}

ALLOWED_TRIAGE_ACTIONS = {"Report as Phishing", "Mark as Safe", "Delete"}


@app.exception_handler(Exception)
async def generic_error_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": "Something went wrong. Please try again."},
    )


@app.get("/auth/login")
def login():
    flow = get_flow()
    auth_url, state = flow.authorization_url(prompt="consent")
    flow_sessions[state] = flow
    return RedirectResponse(auth_url)

@app.get("/auth/callback")
def callback(request: Request):
    state = request.query_params.get("state")
    flow = flow_sessions.get(state)
    if not flow:
        flow = get_flow()
    flow.fetch_token(authorization_response=str(request.url))
    creds = flow.credentials
    user_sessions["current_user"] = creds
    return RedirectResponse("http://localhost:8000/frontend-redirect")

@app.get("/frontend-redirect")
def frontend_redirect():
    return HTMLResponse("""
    <html>
    <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600&family=Inter:wght@400;600&display=swap" rel="stylesheet">
        <style>
            body { font-family: 'Inter', sans-serif; background: #faf8f5; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .box { background: #ffffff; border: 1px solid #ece7e0; border-radius: 14px; padding: 44px; text-align: center; box-shadow: 0 2px 8px rgba(60,50,40,0.06); }
            h2 { font-family: 'Source Serif 4', serif; color: #2b2621; margin: 0 0 8px; font-size: 22px; }
            p { color: #8a8072; font-size: 14px; margin: 0 0 20px; }
            a { display: inline-block; background: #2b2621; color: #faf8f5; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 13.5px; }
        </style>
    </head>
    <body>
        <div class="box">
            <h2>You're logged in</h2>
            <p>Click below to go to your inbox.</p>
            <a href="http://localhost:5500/inbox.html">Go to Inbox</a>
        </div>
    </body>
    </html>
    """)

@app.get("/api/emails")
def get_emails(page_token: str = None):
    creds = user_sessions.get("current_user")
    if not creds:
        return {"error": "Not logged in. Visit /auth/login first."}
    return list_recent_emails(creds, page_token=page_token)

@app.get("/api/emails/{email_id}")
def get_email(email_id: str):
    creds = user_sessions.get("current_user")
    if not creds:
        return {"error": "Not logged in."}
    return get_email_details(creds, email_id)

@app.get("/api/analyze/{email_id}")
def analyze_email(email_id: str, language: str = "English"):
    creds = user_sessions.get("current_user")
    if not creds:
        return {"error": "Not logged in."}

    email = get_email_details(creds, email_id)
    vt_results = check_links(email.get("links", []))
    rule_result = run_rule_engine(email, vt_results)
    ai_result = get_ai_explanation(email, rule_result, language)

    save_analysis(
        email_id=email_id,
        sender=email["from"],
        subject=email["subject"],
        risk_score=rule_result["risk_score"],
        severity=rule_result["severity"],
        indicators=rule_result["indicators"],
        ai_explanation=ai_result["explanation"],
        recommended_action=ai_result["recommended_action"],
    )

    return {
        "email_id": email_id,
        "subject": email["subject"],
        "from": email["from"],
        "risk_score": rule_result["risk_score"],
        "severity": rule_result["severity"],
        "indicators": rule_result["indicators"],
        "ai_explanation": ai_result["explanation"],
        "recommended_action": ai_result["recommended_action"],
        "virustotal_results": vt_results,
    }

@app.get("/api/history")
def history():
    return get_stats()

@app.post("/api/triage")
def triage_action(email_id: str, sender: str, subject: str, action: str):
    if action not in ALLOWED_TRIAGE_ACTIONS:
        return {"error": "Invalid action"}
    save_triage_action(email_id, sender, subject, action)
    return {"status": "recorded"}

@app.get("/api/triage-history")
def triage_history():
    return get_triage_history()

@app.get("/auth/logout")
def logout():
    user_sessions.pop("current_user", None)
    return RedirectResponse("http://localhost:5500/index.html")