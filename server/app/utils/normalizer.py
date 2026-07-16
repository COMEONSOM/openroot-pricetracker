import re
from urllib.parse import urlparse
from typing import Optional


def normalize_product(item: dict, platform: str):
    return {
        "product_id": generate_product_id(item.get("link") or ""),
        "platform": platform,
        "title": item.get("title") or item.get("snippet"),
        "price": extract_price(item),
        "rating": item.get("rating"),
        "image": extract_image(item),
        "url": item.get("link"),
    }


def extract_price(item: dict):
    """
    Extracts price from SERP item. 
    Handles formats like: "₹1,234", "Rs. 1,234", "INR 1234", "1,234.00"
    """
    text = (
        item.get("price") or
        item.get("extracted_price") or
        item.get("snippet") or
        item.get("title") or
        ""
    )
    
    # 1. Try to find explicit price patterns with currency symbols first
    # Matches: ₹ 1,234 | Rs. 1,234 | INR 1234
    price_pattern = r"(?:₹|Rs\.?|INR)\s?([\d,]+\.?\d*)"
    matches = re.findall(price_pattern, str(text), re.IGNORECASE)
    
    if matches:
        return _clean_price(matches[0])
        
    # 2. Fallback: Find raw numbers if it looks like a price field 
    # (avoiding if we only have title/snippet and no clear currency)
    if item.get("price") or item.get("extracted_price"):
        matches = re.findall(r"([\d,]+\.?\d*)", str(text))
        if matches:
            return _clean_price(matches[0])
            
    return None


def _clean_price(price_str: str) -> Optional[float]:
    """Helper to convert price string to float."""
    try:
        # Remove commas
        clean = price_str.replace(",", "")
        val = float(clean)
        # Basic sanity check (e.g. avoid phone numbers or model numbers like 2024)
        # Min 10 rupees, Max 10 Lakhs (adjust as needed)
        if 10 <= val <= 1000000:
            return val
    except ValueError:
        pass
    return None


def generate_product_id(url: str) -> str:
    """Generate a deterministic ID from URL."""
    import hashlib
    return hashlib.md5(url.encode()).hexdigest()[0:12]  # type: ignore



def extract_image(item: dict):
    return (
        item.get("thumbnail") or
        item.get("image") or
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
