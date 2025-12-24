from app.services.serp.serp_client import serp_search
from app.utils.normalizer import normalize_product


def search_meesho(query: str):
    data = serp_search({
        "engine": "google_shopping",
        "q": f"{query} site:meesho.com",
        "gl": "in"
    })

    results = []
    for item in data.get("shopping_results", []):
        results.append(normalize_product(item, "meesho"))

    return results
