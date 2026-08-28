from __future__ import annotations
from app.services.name_matcher import compare_names

LAST_VERIFIED = "2026-08-29"

def _check(id: str, title: str, status: str, severity: str, explanation: str, action: str) -> dict:
    return {"id": id, "title": title, "status": status, "severity": severity, "explanation": explanation, "action": action, "last_verified": LAST_VERIFIED}

def _pathway(purpose: str, situation: str) -> dict:
    paths = {
        "withdrawal": ("Form 19", "Final settlement may be relevant after leaving a job." if situation == "left" else "A final-settlement pathway may not match your current situation."),
        "advance": ("Form 31", "A PF advance pathway may be relevant for your stated situation."),
        "transfer": ("PF transfer", "A PF transfer pathway may be relevant when changing jobs."),
        "pension": ("Form 10C", "A pension-related pathway may be relevant."),
        "unsure": ("Verify your pathway", "Choose the closest situation and verify the appropriate pathway on an official EPFO service."),
    }
    title, explanation = paths[purpose]
    return {"title": title, "explanation": f"Based on the information you provided, {explanation} Please verify current eligibility requirements on the official EPFO service.", "official_resource": "https://www.epfindia.gov.in/"}

def diagnose(data) -> dict:
    name = compare_names(data.epfo_name, data.aadhaar_name)
    name_status = "PASS" if name.status == "EXACT_MATCH" else "ACTION_REQUIRED" if name.status == "POSSIBLE_MISMATCH" else "REVIEW"
    checks = [
        _check("name", "Name consistency", name_status, "HIGH" if name_status == "ACTION_REQUIRED" else "MEDIUM", name.explanation, "Check whether this is formatting only or needs correction through an applicable official process."),
        _check("kyc", "KYC status", "PASS" if data.kyc == "yes" else "ACTION_REQUIRED" if data.kyc == "no" else "REVIEW", "LOW" if data.kyc == "yes" else "HIGH", "You indicated your KYC is verified." if data.kyc == "yes" else "KYC details need review based on the information you provided.", "Check KYC status in the official EPFO service."),
        _check("bank", "Bank verification", "PASS" if data.bank_kyc == "yes" else "ACTION_REQUIRED" if data.bank_kyc == "no" else "REVIEW", "LOW" if data.bank_kyc == "yes" else "HIGH" if data.bank_kyc == "no" else "MEDIUM", "You indicated your bank KYC is verified." if data.bank_kyc == "yes" else "Bank verification needs attention.", "Verify bank-KYC status in your EPFO record; do not share account details here."),
        _check("exit", "Date of Exit", "PASS" if data.exit_date in ("yes", "na") else "ACTION_REQUIRED" if data.exit_date == "no" else "REVIEW", "LOW" if data.exit_date in ("yes", "na") else "HIGH" if data.exit_date == "no" else "MEDIUM", "Your employment record may need an updated Date of Exit before certain claim processes can proceed." if data.exit_date == "no" else "Date of Exit status needs review." if data.exit_date == "unknown" else "You indicated the Date of Exit is updated or not applicable.", "Review the employment record or ask your employer for help."),
        _check("uan", "Multiple UAN awareness", "PASS" if data.multiple_uan == "no" else "REVIEW", "LOW" if data.multiple_uan == "no" else "MEDIUM", "No multiple-UAN concern was reported." if data.multiple_uan == "no" else "Multiple UAN situations may require checking your EPFO records before proceeding.", "Review your EPFO records if you have had more than one UAN."),
    ]
    points = sum(20 if item["status"] == "PASS" else 10 if item["status"] == "REVIEW" else 0 for item in checks)
    # Each of the five readiness checks contributes 0, 10, or 20 points;
    # the total is already on a transparent 0–100 scale.
    score = points
    status = "ready" if score == 100 else "needs_attention" if score >= 60 else "action_required"
    issues = [item for item in checks if item["status"] != "PASS"]
    attention = len(issues)
    return {"score": score, "status": status, "summary": "No common readiness issues were identified." if not attention else f"{attention} thing{'s' if attention != 1 else ''} need your attention.", "checks": checks, "issues": issues, "claim_pathway": _pathway(data.purpose, data.situation), "disclaimer": "Readiness score based on the information you provided. It is not a probability or guarantee of claim approval."}
