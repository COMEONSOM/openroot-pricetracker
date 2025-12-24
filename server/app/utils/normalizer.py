import re
from urllib.parse import urlparse


def normalize_product(item: dict, platform: str):
    return {
        "platform": platform,
        "title": item.get("title"),
        "price": extract_price(item),
        "rating": item.get("rating"),
        "image": item.get("thumbnail"),
        "url": item.get("link")
    }


def extract_price(item: dict):
    price = item.get("price")
    if isinstance(price, str):
        digits = re.sub(r"[^\d]", "", price)
        return int(digits) if digits else None
    return price


def detect_platform(url: str):
    domain = urlparse(url).netloc
    if "amazon" in domain:
        return "amazon"
    if "flipkart" in domain:
        return "flipkart"
    if "meesho" in domain:
        return "meesho"
    return "unknown"


def extract_title_from_url(url: str):
    # simple fallback → SERP handles accuracy
    parts = url.split("/")
    for p in parts:
        if "-" in p and len(p) > 10:
            return p.replace("-", " ")
    return ""
