from app.services.matcher.text_matcher import merge_results


def find_similar_products(*platform_results, limit=6):
    """
    Returns top similar products across platforms.
    """
    merged = merge_results(*platform_results)

    # Filter weak matches if similarity exists
    filtered = [
        p for p in merged
        if p.get("similarity", 1) >= 0.55
    ]

    return filtered[:limit]
