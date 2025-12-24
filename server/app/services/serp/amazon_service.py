from app.services.serp.serp_client import serp_search
from app.utils.normalizer import normalize_product


def search_amazon(query: str):
    data = serp_search({
        "engine": "amazon",
        "amazon_domain": "amazon.in",
        "k": query
    })

    results = []
    for item in data.get("organic_results", []):
        results.append(normalize_product(item, "amazon"))

    return results
