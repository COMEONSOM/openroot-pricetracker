import requests
from app.config import SERP_API_KEY

BASE_URL = "https://serpapi.com/search"


def serp_search(params: dict):
    params["api_key"] = SERP_API_KEY

    try:
        response = requests.get(BASE_URL, params=params, timeout=25)
        response.raise_for_status()
        return response.json()

    except Exception as e:
        print("❌ SERP REQUEST FAILED:", str(e))
        return {}
