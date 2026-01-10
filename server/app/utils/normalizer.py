import re
from urllib.parse import urlparse


def normalize_product(item: dict, platform: str):
    return {
        "platform": platform,
        "title": item.get("title") or item.get("snippet"),
        "price": extract_price(item),
        "rating": item.get("rating"),
        "image": extract_image(item),
        "url": item.get("link"),
    }


def extract_price(item: dict):
    text = (
        item.get("price") or
        item.get("snippet") or
        item.get("title") or
        ""
    )

    matches = re.findall(r"\₹?\s?([\d,]{3,})", str(text))
    if matches:
        return int(matches[0].replace(",", ""))
    return None



def extract_image(item: dict):
    return (
        item.get("thumbnail") or
        item.get("image") or
        item.get("favicon") or
        None
    )



def detect_platform(url: str):
    domain = urlparse(url).netloc.lower()
    if "amazon" in domain:
        return "amazon"
    if "flipkart" in domain:
        return "flipkart"
    if "meesho" in domain:
        return "meesho"
    return "unknown"


def extract_title_from_url(url: str):
    parts = url.split("/")
    for p in parts:
        if "-" in p and len(p) > 10:
            return p.replace("-", " ")
    return ""
