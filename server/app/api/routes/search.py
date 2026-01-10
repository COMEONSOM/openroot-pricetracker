from fastapi import APIRouter, Body

from app.services.serp.amazon_service import search_amazon
from app.services.serp.flipkart_service import search_flipkart
from app.services.serp.meesho_service import search_meesho
from app.services.serp.image_service import search_product_images

from app.services.matcher.text_matcher import merge_results
from app.utils.normalizer import detect_platform, extract_title_from_url

from app.api.product_matcher import pick_best_match
from app.api.similar_finder import find_similar_products
from app.api.price_intelligence import calculate_price_intelligence

router = APIRouter()


# ======================================================
# TEXT SEARCH
# ======================================================
@router.post("/text")
def text_search(payload: dict = Body(...)):
    query = payload.get("query")
    if not query:
        return {"error": "Query is required"}

    amazon = search_amazon(query)
    flipkart = search_flipkart(query)
    meesho = search_meesho(query)

    merged = merge_results(amazon, flipkart, meesho)

    return {
        "query": query,
        "results": merged
    }


# ======================================================
# SIMILAR PRODUCTS SEARCH
# ======================================================
@router.post("/similar")
def similar_search(payload: dict = Body(...)):
    title = payload.get("title")
    if not title:
        return {"error": "title is required"}

    amazon_results = search_amazon(title)
    flipkart_results = search_flipkart(title)
    meesho_results = search_meesho(title)

    similar = find_similar_products(
        amazon_results,
        flipkart_results,
        meesho_results
    )

    return {
        "query": title,
        "similar": similar
    }


# ======================================================
# LINK SEARCH (MAIN PIPELINE)
# ======================================================
@router.post("/link")
def link_search(payload: dict = Body(...)):
    url = payload.get("url")
    if not url:
        return {"error": "URL is required"}

    platform = detect_platform(url)
    title = extract_title_from_url(url)

    print("🔍 Extracted title:", title)

    # ---------------- Fetch Results ----------------
    amazon_results = search_amazon(title)
    flipkart_results = search_flipkart(title)
    meesho_results = search_meesho(title)

    print("🛒 Amazon count:", len(amazon_results))
    print("🛒 Flipkart count:", len(flipkart_results))
    print("🛒 Meesho count:", len(meesho_results))

    # ---------------- Pick Best Matches ----------------
    amazon_match = pick_best_match(amazon_results)
    flipkart_match = pick_best_match(flipkart_results)
    meesho_match = pick_best_match(meesho_results)

    matches = {
        "amazon": amazon_match,
        "flipkart": flipkart_match,
        "meesho": meesho_match,
    }

    unavailable = [
        name for name, product in matches.items()
        if product is None
    ]

    # ---------------- Fetch Product Images ----------------
    images = search_product_images(title, limit=10)

    # ---------------- Price Intelligence (FIXED) ----------------
    # ✅ Pass full matches dictionary instead of float price
    intelligence = calculate_price_intelligence(matches)

    # ---------------- Final Response ----------------
    return {
        "source_platform": platform,
        "query": title,
        "matches": matches,
        "unavailable": unavailable,
        "intelligence": intelligence,
        "images": images,
    }
