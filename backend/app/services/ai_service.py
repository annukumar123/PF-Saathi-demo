from __future__ import annotations
import os
import re
try:
    from openai import OpenAI
except ImportError:  # The deterministic fallback keeps the prototype usable without the optional SDK.
    OpenAI = None

SENSITIVE = re.compile(r"\b(?:\d[ -]?){8,}\b|\b(?:otp|password|pan|aadhaar|uan)\b", re.I)
SYSTEM = """You are PF Saathi Assistant, an independent informational prototype for Indian PF claim readiness. Give concise, simple, cautious guidance. Never request credentials, IDs, bank details, OTPs, passwords, or personal data. Never guarantee approval or invent EPFO rules. Direct users to official EPFO resources for current procedures. You may translate to Hindi or Telugu when asked."""

def fallback(message: str, language: str = "en") -> str:
    if SENSITIVE.search(message):
        return "Never share passwords, OTPs, Aadhaar, PAN, UAN, or bank numbers. PF Saathi does not need them."
    text = message.lower()
    if "approve" in text or "guarantee" in text:
        return "No tool can guarantee approval. PF Saathi only highlights common readiness issues based on the information provided; EPFO performs its own verification."
    if "exit" in text or "employer" in text or "company" in text:
        return "Your next step may be to contact your employer in writing and ask them to review the Date of Exit. If the issue remains unresolved, check the official EPFO grievance guidance."
    if "name" in text or "aadhaar" in text:
        return "Compare the two names for initials, spaces, and spelling. A difference may be formatting or may need an official correction. Do not share an Aadhaar number."
    if "kyc" in text or "bank" in text:
        return "Check the status in the official member service. PF Saathi does not need account numbers or login details."
    return "PF Saathi can explain common readiness checks. Please verify current eligibility and procedures through an official EPFO resource."

def assistant_reply(message: str, language: str) -> tuple[str, str]:
    if not os.getenv("OPENAI_API_KEY") or OpenAI is None:
        return fallback(message, language), "fallback"
    try:
        client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
        result = client.chat.completions.create(model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"), messages=[{"role": "system", "content": SYSTEM}, {"role": "user", "content": message}], temperature=0.2, max_tokens=260)
        return result.choices[0].message.content or fallback(message, language), "openai"
    except Exception:
        return fallback(message, language), "fallback"

def employer_message(topic: str, language: str) -> str:
    labels = {"exit": "updating my Date of Exit", "kyc": "reviewing my KYC status", "name": "reviewing my demographic details", "other": "reviewing my PF-related record"}
    return f"Subject: Request for assistance with EPFO record\n\nHello,\n\nI am requesting your assistance with {labels[topic]} in the EPFO records so that I can proceed with my PF-related process.\n\nPlease let me know if any supporting information is required.\n\nThank you."
