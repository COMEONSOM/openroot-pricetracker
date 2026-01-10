import random
from typing import Dict, Optional


def calculate_price_intelligence(
    matches: Dict[str, dict]
) -> Optional[dict]:
    """
    Calculates price intelligence using all available platform prices.

    matches = {
        "amazon": {...},
        "flipkart": {...},
        "meesho": {...}
    }
    """

    prices = [
        p.get("price")
        for p in matches.values()
        if p and isinstance(p.get("price"), (int, float))
    ]

    if not prices:
        return None

    # Cheapest available price in market
    current = min(prices)

    # Simulated 52-week range (until DB history exists)
    low_52w = round(current * random.uniform(0.75, 0.9), 2)
    high_52w = round(current * random.uniform(1.15, 1.45), 2)

    # Deal classification
    price_position = (current - low_52w) / max(
        (high_52w - low_52w), 1
    )

    if price_position <= 0.15:
        deal = "HOT"
    elif price_position >= 0.75:
        deal = "EXPENSIVE"
    else:
        deal = "FAIR"

    return {
        "current": current,
        "low_52w": low_52w,
        "high_52w": high_52w,
        "deal": deal
    }
