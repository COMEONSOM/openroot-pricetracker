from app.services.serp.serp_client import serp_search


def search_product_images(query: str, limit: int = 8):
    """
    Fetch product images using SerpAPI Images engine.
    """
    data = serp_search({
        "engine": "google_images",
        "q": query,
        "gl": "in",
        "hl": "en",
        "num": limit,
    })

    images = []

    for item in data.get("images_results", []):
        url = item.get("original")
        if url:
            images.append(url)

    return images
