from difflib import SequenceMatcher


def similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def pick_best_match(results: list, min_score: float = 0.25):
    """
    Picks the most relevant product based on title similarity and price availability.
    """

    if not results:
        return None

    scored = []

    for item in results:
        title = item.get("title") or ""
        price = item.get("price")

        if not title or price is None:
            continue

        score = similarity(title, results[0]["title"])

        scored.append((score, item))

    if not scored:
        return None

    scored.sort(key=lambda x: x[0], reverse=True)
    best_score, best_item = scored[0]

    if best_score < min_score:
        return None

    return best_item
