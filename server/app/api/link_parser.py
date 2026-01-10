import re

def parse_product_link(url: str):
    url = url.lower()

    if "amazon" in url:
        product_id = extract_amazon_id(url)
        return mock_product("amazon", product_id)

    if "flipkart" in url:
        product_id = extract_flipkart_id(url)
        return mock_product("flipkart", product_id)

    if "meesho" in url:
        product_id = extract_meesho_id(url)
        return mock_product("meesho", product_id)

    return None


def extract_amazon_id(url: str):
    match = re.search(r"/dp/([A-Z0-9]{6,12})", url.upper())
    return match.group(1) if match else "UNKNOWN"


def extract_flipkart_id(url: str):
    match = re.search(r"pid=([A-Z0-9]+)", url.upper())
    return match.group(1) if match else "UNKNOWN"


def extract_meesho_id(url: str):
    return "MSH-" + str(abs(hash(url)) % 100000)


# 🔥 Mock data (Phase 1 only)
def mock_product(platform: str, product_id: str):
    return {
        "platform": platform,
        "product_id": product_id,
        "title": f"Sample {platform.title()} Product",
        "brand": "DemoBrand",
        "price": 999,
        "image": "https://via.placeholder.com/300",
        "availability": True
    }
