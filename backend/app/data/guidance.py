"""Cautious, static guidance. URLs are official EPFO domains only."""
OFFICIAL_EPFO = "https://www.epfindia.gov.in/"
GUIDANCE = [
    {"id": "name", "title": "Name details", "description": "Compare names carefully; PF Saathi does not verify identity.", "steps": ["Check for spaces, initials, or spelling differences.", "Use the current official correction guidance if a change is needed."], "official_resource": OFFICIAL_EPFO, "last_verified": "2026-08-29"},
    {"id": "kyc", "title": "KYC status", "description": "Check the KYC status in the official member service.", "steps": ["Review the status without sharing numbers here.", "Follow current official instructions for updates."], "official_resource": OFFICIAL_EPFO, "last_verified": "2026-08-29"},
    {"id": "bank", "title": "Bank verification", "description": "Bank KYC can be reviewed in the official service.", "steps": ["Never share your account number with PF Saathi.", "Use official guidance if verification is pending."], "official_resource": OFFICIAL_EPFO, "last_verified": "2026-08-29"},
    {"id": "exit", "title": "Date of Exit", "description": "An employment record may need an updated Date of Exit.", "steps": ["Review your employment details.", "Ask the employer for assistance if applicable.", "Check official grievance guidance if the issue remains unresolved."], "official_resource": OFFICIAL_EPFO, "last_verified": "2026-08-29"},
    {"id": "uan", "title": "Multiple UAN awareness", "description": "Multiple UAN situations may need official-record review.", "steps": ["Review your EPFO records.", "Verify next steps through an official EPFO service."], "official_resource": OFFICIAL_EPFO, "last_verified": "2026-08-29"},
]
