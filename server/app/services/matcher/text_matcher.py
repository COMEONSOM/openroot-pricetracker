def merge_results(*platform_results):
    merged = []

    for results in platform_results:
        for product in results:
            merged.append(product)

    # Sort safely: None prices go to the end
    merged.sort(
        key=lambda x: x["price"] if isinstance(x.get("price"), (int, float)) else float("inf")
    )

    return merged
