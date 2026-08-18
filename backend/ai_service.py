import os
import json
import time
from dotenv import load_dotenv
from google import genai
from google.genai.errors import ServerError, ClientError

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL_NAME = "gemini-3.5-flash"


def get_ai_explanation(email, rule_result, language="English"):
    risk_score = rule_result.get("risk_score", 0)
    severity = rule_result.get("severity", "Low")
    indicators = rule_result.get("indicators", [])

    prompt = f"""
You are a cybersecurity analyst assistant.

Analyze the email using ONLY the evidence provided below.

IMPORTANT:
- The rule engine score is the primary risk assessment.
- Do not automatically classify an email as phishing just because a URL uses a
  tracking, redirect, or marketing domain.
- A domain mismatch is a warning signal, not proof that the email is malicious.
- VirusTotal findings are important evidence, but they must be interpreted in
  context.
- Do not claim that an email will infect a computer or steal information unless
  the evidence actually supports that conclusion.
- Do not exaggerate the severity.
- Your explanation must be consistent with the rule engine score and severity.

Risk score: {risk_score}/100
Severity: {severity}

Indicators:
{', '.join(indicators) if indicators else 'None'}

Sender: {email.get('from', '')}
Subject: {email.get('subject', '')}

Give a short explanation in 3-4 sentences for a non-technical user.

Choose ONE recommended action from these options:

['Delete immediately',
 'Do not click links, verify sender first',
 'Likely safe, but stay cautious',
 'Safe']

Use these guidelines:

- 75-100 (Critical): normally recommend 'Delete immediately'
- 50-74 (High): normally recommend 'Do not click links, verify sender first'
- 25-49 (Medium): normally recommend 'Likely safe, but stay cautious'
- 0-24 (Low): normally recommend 'Safe'

If the indicators contain a genuinely malicious or suspicious link, you may
recommend 'Do not click links, verify sender first' even when the score is below
50, but do not automatically call the entire email phishing.

Respond entirely in {language}.
The recommended_action value must also be translated into {language}.

Respond ONLY as JSON with these keys:
explanation
recommended_action
"""

    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
            )

            text = response.text.strip().strip("`").replace("json", "", 1).strip()

            try:
                result = json.loads(text)

                if "explanation" not in result:
                    result["explanation"] = "Please review the email carefully."

                if "recommended_action" not in result:
                    result["recommended_action"] = "Review manually"

                return result

            except json.JSONDecodeError:
                return {
                    "explanation": response.text,
                    "recommended_action": "Review manually"
                }

        except ServerError:
            time.sleep(2 * (attempt + 1))

        except ClientError as e:
            if "RESOURCE_EXHAUSTED" in str(e) or "429" in str(e):
                return {
                    "explanation": (
                        "The AI service has reached its usage limit for now. "
                        "The rule-based risk score above is still available. "
                        "Please try again shortly for the AI explanation."
                    ),
                    "recommended_action": "Review manually",
                }
            raise

    return {
        "explanation": (
            "The AI service is temporarily unavailable after multiple attempts. "
            "Please try again shortly."
        ),
        "recommended_action": "Review manually",
    }