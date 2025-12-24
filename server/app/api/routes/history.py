from fastapi import APIRouter

router = APIRouter()

@router.get("/{product_id}")
def get_price_history(product_id: str):
    return [
        {
            "date": "2025-01-01",
            "price": 69999,
            "platform": "amazon"
        },
        {
            "date": "2025-01-05",
            "price": 67999,
            "platform": "flipkart"
        }
    ]
