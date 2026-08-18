import re
from urllib.parse import urlparse

URGENCY_WORDS = [
    "urgent", "verify now", "account suspended", "act immediately",
    "confirm your identity", "click here immediately", "limited time"
]

SUSPICIOUS_EXT = [".exe", ".scr", ".bat", ".js", ".vbs"]

SHORTENERS = ["bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd"]


def extract_domain(address):
    match = re.search(r'@([\w.-]+)', address)
    return match.group(1).lower() if match else ""


def run_rule_engine(email, vt_results=None):
    indicators = []
    score = 0

    from_domain = extract_domain(email.get("from", ""))
    reply_domain = extract_domain(email.get("reply_to", ""))

    if reply_domain and reply_domain != from_domain:
        score += 20
        indicators.append("Reply-To domain does not match sender domain")

    body_lower = (
        email.get("plain_text", "") +
        email.get("subject", "")
    ).lower()

    for word in URGENCY_WORDS:
        if word in body_lower:
            score += 10
            indicators.append(f"Urgency language detected: '{word}'")
            break

    # Track link-based findings ONCE per email, not once per link
    found_shortener = False
    found_domain_mismatch = False
    mismatched_domains = set()

    for link in email.get("links", []):
        domain = urlparse(link).netloc.lower()

        if any(s in domain for s in SHORTENERS):
            found_shortener = True

        if domain and domain != from_domain and from_domain not in domain:
            found_domain_mismatch = True
            mismatched_domains.add(domain)

    if found_shortener:
        score += 10
        indicators.append("Email contains one or more shortened URLs")

    if found_domain_mismatch:
        score += 10
        domains_list = ", ".join(list(mismatched_domains)[:3])
        indicators.append(
            f"Links point to a different domain than the sender ({domains_list})"
        )

    for att in email.get("attachments", []):
        if any(att.lower().endswith(ext) for ext in SUSPICIOUS_EXT):
            score += 15
            indicators.append(f"Suspicious attachment type: {att}")

    if any(
        w in body_lower
        for w in ["password", "ssn", "social security", "wire transfer", "gift card"]
    ):
        score += 15
        indicators.append("Requests sensitive info or payment")

    if "dear customer" in body_lower or "dear user" in body_lower:
        score += 5
        indicators.append(
            "Generic greeting used instead of your name"
        )

    # VirusTotal findings
    # VT is an important signal, but multiple flagged links
    # should not overwhelm the entire rule-based analysis.
    if vt_results:
        malicious_results = [
            result for result in vt_results
            if result.get("status") == "malicious"
        ]

        suspicious_results = [
            result for result in vt_results
            if result.get("status") == "suspicious"
        ]

        if malicious_results:
            score += 25

            for result in malicious_results[:2]:
                indicators.append(
                    f"VirusTotal flagged link as malicious: {result['url']}"
                )

        elif suspicious_results:
            score += 10

            for result in suspicious_results[:2]:
                indicators.append(
                    f"VirusTotal flagged link as suspicious: {result['url']}"
                )

    score = min(score, 100)

    if score >= 75:
        severity = "Critical"
    elif score >= 50:
        severity = "High"
    elif score >= 25:
        severity = "Medium"
    else:
        severity = "Low"

    return {
        "risk_score": score,
        "severity": severity,
        "indicators": indicators
    }