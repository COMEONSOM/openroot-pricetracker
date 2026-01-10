from app.services.serp.serp_client import serp_search
from app.utils.normalizer import normalize_product


def search_amazon(query: str):
    data = serp_search({
        "engine": "google",
        "q": f"{query} amazon",
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

    print("🛒 Amazon count:", len(results))
    return results
