from app.services.serp.serp_client import serp_search
from app.utils.normalizer import normalize_product


def search_amazon(query: str):
    # Use google_shopping for better price accuracy
    data = serp_search({
        "engine": "google_shopping",
        "q": f"{query} site:amazon.in",
        "gl": "in",
        "hl": "en",
        "num": 10
    })

    results = []

    for item in data.get("shopping_results", []):
        results.append(
            normalize_product(item, "amazon")
        )
    
    # Fallback to web search if shopping result is empty
    if not results:
        return _search_amazon_web(query)

    print("🛒 Amazon count:", len(results))
    return results


def _search_amazon_web(query: str):
    """Fallback using standard web search."""
    data = serp_search({
        "engine": "google",
        "q": f"{query} site:amazon.in",
        "gl": "in",
        "hl": "en",
        "num": 10
    })
    
    results = []
    for item in data.get("organic_results", []):
        link = (item.get("link") or "").lower()
        if "amazon" in link:
            results.append(
                normalize_product(item, "amazon")
            )
    return results
