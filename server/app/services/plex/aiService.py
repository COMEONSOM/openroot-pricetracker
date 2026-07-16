import os
import httpx
from dotenv import load_dotenv

load_dotenv()

PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")
PERPLEXITY_URL = "https://api.perplexity.ai/chat/completions"


class AIService:
    @staticmethod
    async def ask_ai(prompt: str) -> str:
        headers = {
            "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": "pplx-70b-online",
            "messages": [
                {
                    "role": "system",
                    "content": "You are an expert product price analyst for an ecommerce price tracker."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
        }

        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                PERPLEXITY_URL,
                json=payload,
                headers=headers
            )

            response.raise_for_status()
            data = response.json()

            return data["choices"][0]["message"]["content"]
