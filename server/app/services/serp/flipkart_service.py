from app.services.serp.serp_client import serp_search
from app.utils.normalizer import normalize_product


def search_flipkart(query: str):
    data = serp_search({
        "engine": "google",
        "q": f"{query} flipkart",
        "gl": "in",
        "hl": "en",
        "num": 10
    })

    results = []

    for item in data.get("organic_results", []):
        link = (item.get("link") or "").lower()
        if "flipkart" in link:
            results.append(
                normalize_product(item, "flipkart")
            )

    print("🛒 Flipkart count:", len(results))
    return results
