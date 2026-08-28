import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.data.guidance import GUIDANCE
from app.rules.diagnostics import diagnose
from app.schemas.diagnostics import AssistantRequest, DiagnosticRequest, MessageRequest
from app.schemas.auth import LoginRequest, AuthResponse, AuthUser
from app.services.ai_service import assistant_reply, employer_message

app = FastAPI(title="PF Saathi API", version="1.0.0", description="Independent PF claim readiness prototype. No EPFO systems are connected.")
origins = [item.strip() for item in os.getenv("FRONTEND_ORIGIN", "http://localhost:3000").split(",") if item.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=False, allow_methods=["GET", "POST"], allow_headers=["Content-Type", "Authorization"])

@app.get("/api/health")
def health(): return {"status": "ok", "service": "PF Saathi API"}

@app.post("/api/login", response_model=AuthResponse)
def login(payload: LoginRequest):
    # Support quick demo login or custom credentials
    if payload.is_demo or payload.username_or_email.lower().strip() in ["demo", "rahul@example.com", "rahul"]:
        return AuthResponse(
            success=True,
            message="Logged in successfully as Demo User (Rahul K. Kumar)",
            token="demo-session-token-rahul-10023",
            user=AuthUser(
                id="usr_rahul_01",
                name="Rahul K. Kumar",
                email="rahul@example.com",
                role="citizen",
                is_demo=True
            )
        )
    
    identifier = payload.username_or_email.strip()
    if not identifier:
        raise HTTPException(status_code=400, detail="Username or email is required.")
    
    if len(payload.password) < 4:
        raise HTTPException(status_code=400, detail="Password must be at least 4 characters long.")

    display_name = identifier.split("@")[0].capitalize()
    return AuthResponse(
        success=True,
        message=f"Welcome back, {display_name}!",
        token=f"token-{hash(identifier)}",
        user=AuthUser(
            id=f"usr_{abs(hash(identifier))}",
            name=display_name,
            email=identifier if "@" in identifier else f"{identifier}@pfsaathi.local",
            role="citizen",
            is_demo=False
        )
    )

@app.get("/api/me", response_model=AuthResponse)
def me():
    return AuthResponse(
        success=True,
        message="Active session",
        token="demo-session-token-rahul-10023",
        user=AuthUser(
            id="usr_rahul_01",
            name="Rahul K. Kumar",
            email="rahul@example.com",
            role="citizen",
            is_demo=True
        )
    )

@app.post("/api/diagnose")
def diagnostic(payload: DiagnosticRequest): return diagnose(payload)

@app.post("/api/recheck")
def recheck(payload: DiagnosticRequest): return diagnose(payload)

@app.get("/api/guidance")
def guidance(): return {"items": GUIDANCE, "notice": "Guidance is informational. Verify current requirements through official EPFO resources."}

@app.post("/api/assistant")
def assistant(payload: AssistantRequest):
    reply, mode = assistant_reply(payload.message, payload.language)
    return {"reply": reply, "mode": mode, "disclaimer": "PF Saathi is independent and does not guarantee claim approval."}

@app.post("/api/generate-message")
def generate_message(payload: MessageRequest): return {"message": employer_message(payload.topic, payload.language), "mode": "template" if not os.getenv("OPENAI_API_KEY") else "openai-assisted"}

