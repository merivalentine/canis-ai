# CANIS AI

AI-powered phishing detection and analysis platform.

CANIS combines rule-based phishing indicators with AI-assisted analysis and threat-intelligence lookups to help identify suspicious emails and links.

## Features

- Phishing-focused email analysis
- Rule-based detection engine
- AI-assisted threat assessment
- VirusTotal integration
- Gmail integration
- Dashboard and threat views
- Local authentication and database support

## Project structure

```text
canis-ai/
├── backend/
│   ├── ai_service.py
│   ├── auth.py
│   ├── database.py
│   ├── gmail_service.py
│   ├── main.py
│   ├── rule_engine.py
│   ├── virustotal_service.py
│   └── requirements.txt
├── frontend/
│   ├── assets/
│   ├── dashboard.html
│   ├── inbox.html
│   ├── index.html
│   ├── threats.html
│   └── ...
├── .env.example
└── .gitignore
```

## Configuration

Create a local `.env` file from `.env.example` and add your own credentials.

**Never commit `.env` or real API keys to GitHub.**

## Running locally

Install the backend dependencies:

```bash
cd backend
pip install -r requirements.txt
```

Then configure the environment variables and start the backend using the project's application entry point.

The frontend can be served as static files according to your local development setup.

## Security note

This repository intentionally excludes local secrets, databases, virtual environments, caches, and other machine-specific files. Credentials should be supplied through environment variables.

## Purpose

CANIS was developed as a cybersecurity engineering project focused on practical phishing detection, threat analysis, and secure application design.
