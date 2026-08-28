from typing import Optional
from pydantic import BaseModel, Field

class LoginRequest(BaseModel):
    username_or_email: str = Field(default="", max_length=150)
    password: str = Field(default="", max_length=150)
    is_demo: bool = False

class AuthUser(BaseModel):
    id: str
    name: str
    email: str
    role: str = "citizen"
    is_demo: bool = False

class AuthResponse(BaseModel):
    success: bool
    message: str
    token: Optional[str] = None
    user: Optional[AuthUser] = None
