import base64
import re
from googleapiclient.discovery import build


def list_recent_emails(creds, max_results=15, page_token=None):
    service = build("gmail", "v1", credentials=creds)
    request_params = {
        "userId": "me",
        "maxResults": max_results,
        "labelIds": ["INBOX"],
    }
    if page_token:
        request_params["pageToken"] = page_token

    results = service.users().messages().list(**request_params).execute()
    messages = results.get("messages", [])
    next_page_token = results.get("nextPageToken")

    email_list = []
    for msg in messages:
        msg_data = service.users().messages().get(
            userId="me", id=msg["id"], format="metadata",
            metadataHeaders=["From", "Subject", "Date"]
        ).execute()
        headers = {h["name"]: h["value"] for h in msg_data["payload"]["headers"]}
        email_list.append({
            "id": msg["id"],
            "from": headers.get("From", ""),
            "subject": headers.get("Subject", ""),
            "date": headers.get("Date", ""),
            "snippet": msg_data.get("snippet", ""),
        })

    return {"emails": email_list, "next_page_token": next_page_token}


def get_email_details(creds, email_id):
    service = build("gmail", "v1", credentials=creds)
    msg = service.users().messages().get(
        userId="me", id=email_id, format="full"
    ).execute()

    headers = {h["name"]: h["value"] for h in msg["payload"]["headers"]}
    plain_text, html_body = "", ""
    attachments = []

    def walk_parts(parts):
        nonlocal plain_text, html_body
        for part in parts:
            mime = part.get("mimeType", "")
            body = part.get("body", {})
            if mime == "text/plain" and body.get("data"):
                plain_text += base64.urlsafe_b64decode(body["data"]).decode("utf-8", errors="ignore")
            elif mime == "text/html" and body.get("data"):
                html_body += base64.urlsafe_b64decode(body["data"]).decode("utf-8", errors="ignore")
            elif part.get("filename"):
                attachments.append(part["filename"])
            if "parts" in part:
                walk_parts(part["parts"])

    payload = msg["payload"]
    if "parts" in payload:
        walk_parts(payload["parts"])
    elif payload.get("body", {}).get("data"):
        plain_text = base64.urlsafe_b64decode(payload["body"]["data"]).decode("utf-8", errors="ignore")

    links = re.findall(r'href=["\']?([^"\'>\s]+)', html_body)

    return {
        "id": email_id,
        "from": headers.get("From", ""),
        "reply_to": headers.get("Reply-To", ""),
        "subject": headers.get("Subject", ""),
        "date": headers.get("Date", ""),
        "plain_text": plain_text,
        "html_body": html_body,
        "links": links,
        "attachments": attachments,
        "headers": headers,
    }