from pydantic import BaseModel
from typing import Optional, List


class ChatMessage(BaseModel):
    text: str
    sender: str  # 'user' or 'ai'


class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[ChatMessage]] = None


class ChatResponse(BaseModel):
    response: str
    reminder_suggestion: Optional[dict] = None

