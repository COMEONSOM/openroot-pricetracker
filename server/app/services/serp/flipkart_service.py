from app.services.serp.serp_client import serp_search
from app.utils.normalizer import normalize_product


def search_flipkart(query: str):
    # Flipkart is often blocked on Google Shopping, so we use refined web search
    data = serp_search({
        "engine": "google",
        "q": f"{query} site:flipkart.com",
        "gl": "in",
        "hl": "en",
        "num": 10
    })

    results = []

    for item in data.get("organic_results", []):
        link = (item.get("link") or "").lower()
        if "flipkart.com" in link:
            # Check for rich snippet price first
            rich_snippet = item.get("rich_snippet", {})
            extracted_price = None
            
            if rich_snippet and "top" in rich_snippet:
                extensions = rich_snippet.get("top", {}).get("extensions", [])
                for ext in extensions:
                    if "₹" in ext or "Rs." in ext:
                        extracted_price = ext
                        break
            
            item["extracted_price"] = extracted_price
            results.append(normalize_product(item, "flipkart"))

    print("🛒 Flipkart count:", len(results))
    return results
