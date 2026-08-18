import os
import base64
import time
import requests

VT_API_KEY = os.getenv("VIRUSTOTAL_API_KEY")
VT_BASE_URL = "https://www.virustotal.com/api/v3"


def check_url(url):
    if not VT_API_KEY:
        return {
            "status": "error",
            "malicious": 0,
            "suspicious": 0,
            "message": "VirusTotal API key not configured"
        }

    headers = {"x-apikey": VT_API_KEY}
    url_id = base64.urlsafe_b64encode(url.encode()).decode().strip("=")

    try:
        response = requests.get(
            f"{VT_BASE_URL}/urls/{url_id}",
            headers=headers,
            timeout=10
        )

        # URL is not already in VirusTotal
        if response.status_code == 404:
            submit_response = requests.post(
                f"{VT_BASE_URL}/urls",
                headers=headers,
                data={"url": url},
                timeout=10
            )

            if submit_response.status_code in (200, 201):
                return {
                    "status": "pending",
                    "malicious": 0,
                    "suspicious": 0,
                    "message": "Submitted to VirusTotal for scanning"
                }

            return {
                "status": "error",
                "malicious": 0,
                "suspicious": 0,
                "message": f"VirusTotal submission failed ({submit_response.status_code})"
            }

        # Any other unsuccessful response
        if response.status_code != 200:
            return {
                "status": "error",
                "malicious": 0,
                "suspicious": 0,
                "message": f"VirusTotal request failed ({response.status_code})"
            }

        data = response.json()

        stats = data["data"]["attributes"].get(
            "last_analysis_stats",
            {}
        )

        malicious = stats.get("malicious", 0)
        suspicious = stats.get("suspicious", 0)

        if malicious > 0:
            status = "malicious"
        elif suspicious > 0:
            status = "suspicious"
        else:
            status = "clean"

        return {
            "status": status,
            "malicious": malicious,
            "suspicious": suspicious,
        }

    except requests.RequestException as e:
        return {
            "status": "error",
            "malicious": 0,
            "suspicious": 0,
            "message": f"VirusTotal connection error: {str(e)}"
        }


def check_links(links, max_links=2):
    results = []

    for link in links[:max_links]:
        result = check_url(link)

        if result:
            results.append({
                "url": link,
                **result
            })

        time.sleep(1)

    return results