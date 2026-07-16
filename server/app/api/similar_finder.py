from app.services.matcher.text_matcher import merge_results
from app.api.product_matcher import similarity


def find_similar_products(query_title: str, *platform_results, limit=6):
    """
    Returns top similar products across platforms.
    Filters out weak matches based on title similarity to the query.
    """
    merged = merge_results(*platform_results)

    # Compute similarity if not present
    scored_items = []
    for p in merged:
        if not p.get("title"):
            continue
            
        score = similarity(p["title"], query_title)
        p["similarity"] = score
        scored_items.append(p)

    # Filter weak matches
    filtered = [
        p for p in scored_items
        if p.get("similarity", 0) >= 0.4  # Slightly more lenient than 0.55 allowing for variations
    ]
    
    # Sort by similarity
    filtered.sort(key=lambda x: x.get("similarity", 0), reverse=True)

    return filtered[0:limit]  # type: ignore
