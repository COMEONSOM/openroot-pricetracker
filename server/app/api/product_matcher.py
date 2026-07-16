from difflib import SequenceMatcher


def similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


from typing import Optional

def pick_best_match(results: list, min_score: float = 0.25, target_title: Optional[str] = None):
    """
    Picks the most relevant product based on title similarity and price availability.
    If target_title is provided, compares against that. Otherwise uses the first result's title.
    """

    if not results:
        return None

    # Determine reference title
    reference_title = target_title if target_title else (results[0].get("title") or "")
    
    if not reference_title:
        return results[0] if results and results[0].get("price") else None

    scored = []

    for item in results:
        title = item.get("title") or ""
        price = item.get("price")

        if not title or price is None:
            continue

        score = similarity(title, reference_title)

        scored.append((score, item))

    if not scored:
        return None

    scored.sort(key=lambda x: x[0], reverse=True)
    best_score, best_item = scored[0]

    if best_score < min_score:
        return None

    return best_item
