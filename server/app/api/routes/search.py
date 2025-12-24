from fastapi import APIRouter, Body
from app.services.serp.amazon_service import search_amazon
from app.services.serp.flipkart_service import search_flipkart
from app.services.serp.meesho_service import search_meesho
from app.services.matcher.text_matcher import merge_results
from app.utils.normalizer import detect_platform, extract_title_from_url

router = APIRouter()


@router.post("/text")
def text_search(payload: dict = Body(...)):
    query = payload.get("query")
    if not query:
        return {"error": "Query is required"}

    amazon = search_amazon(query)
    flipkart = search_flipkart(query)
    meesho = search_meesho(query)

    merged = merge_results(amazon, flipkart, meesho)
    return {"query": query, "results": merged}


@router.post("/link")
def link_search(payload: dict = Body(...)):
    url = payload.get("url")
    if not url:
        return {"error": "URL is required"}

    platform = detect_platform(url)
    title = extract_title_from_url(url)

    amazon = search_amazon(title)
    flipkart = search_flipkart(title)
    meesho = search_meesho(title)

    merged = merge_results(amazon, flipkart, meesho)
    return {
        "platform": platform,
        "source_url": url,
        "results": merged
    }
