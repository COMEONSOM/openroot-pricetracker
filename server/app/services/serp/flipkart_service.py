from app.services.serp.serp_client import serp_search
from app.utils.normalizer import normalize_product


def search_flipkart(query: str):
    data = serp_search({
        "engine": "google_shopping",
        "q": f"{query} site:flipkart.com",
        "gl": "in"
    })

    results = []
    for item in data.get("shopping_results", []):
        results.append(normalize_product(item, "flipkart"))

    return results
