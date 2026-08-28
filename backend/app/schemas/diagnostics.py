from typing import Literal
from pydantic import BaseModel, Field, field_validator

Choice = Literal["yes", "no", "pending", "unknown", "na"]
Purpose = Literal["withdrawal", "advance", "transfer", "pension", "unsure"]
Situation = Literal["left", "changed", "working", "unavailable", "medical", "unsure"]

class DiagnosticRequest(BaseModel):
    purpose: Purpose
    situation: Situation
    kyc: Choice
    epfo_name: str = Field(default="", max_length=120)
    aadhaar_name: str = Field(default="", max_length=120)
    bank_kyc: Choice
    exit_date: Choice
    multiple_uan: Choice
    demo: bool = False

    @field_validator("epfo_name", "aadhaar_name")
    @classmethod
    def reject_sensitive_numbers(cls, value: str) -> str:
        if len("".join(ch for ch in value if ch.isdigit())) >= 8:
            raise ValueError("Do not enter identity, bank, or account numbers.")
        return value.strip()

class AssistantRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1200)
    language: Literal["en", "hi", "te"] = "en"

class MessageRequest(BaseModel):
    topic: Literal["exit", "kyc", "name", "other"] = "exit"
    language: Literal["en", "hi", "te"] = "en"
