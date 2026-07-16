from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.plex.aiService import AIService

router = APIRouter(prefix="/api/ai", tags=["AI"])


class AIRequest(BaseModel):
    question: str


class AIResponse(BaseModel):
    answer: str


@router.post("/analyze", response_model=AIResponse)
async def analyze_price(req: AIRequest):
    try:
        answer = await AIService.ask_ai(req.question)
        return {"answer": answer}

    except Exception as e:
        print("AI Error:", e)
        raise HTTPException(status_code=500, detail="AI service failed")
