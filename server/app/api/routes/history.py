from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
from datetime import date, timedelta

from app.database.session import get_db
from app.models.price import Price
from app.models.product import Product

router = APIRouter()


@router.get("/{product_id}")
def get_price_history(
    product_id: str,
    days: int = 30,
    db: Session = Depends(get_db)
):
    """
    Get price history for a product.
    
    Args:
        product_id: The product ID to get history for
        days: Number of days of history to return (default: 30)
        db: Database session
    
    Returns:
        List of price points with date, price, and platform
    """
    # Calculate date range
    start_date = date.today() - timedelta(days=days)
    
    # Query prices from database
    prices = (
        db.query(Price)
        .filter(Price.product_id == product_id)
        .filter(Price.date >= start_date)
        .order_by(desc(Price.date))
        .all()
    )
    
    if not prices:
        # Return empty array if no history exists
        return []
    
    # Format response
    return [
        {
            "date": price.date.isoformat(),
            "price": price.price,
            "platform": price.platform
        }
        for price in prices
    ]


@router.get("/product/{product_id}/summary")
def get_price_summary(
    product_id: str,
    db: Session = Depends(get_db)
):
    """
    Get price summary including min, max, average prices.
    """
    prices = (
        db.query(Price)
        .filter(Price.product_id == product_id)
        .all()
    )
    
    if not prices:
        return {
            "product_id": product_id,
            "has_history": False,
            "min_price": None,
            "max_price": None,
            "avg_price": None,
            "data_points": 0
        }
    
    price_values = [p.price for p in prices]
    
    return {
        "product_id": product_id,
        "has_history": True,
        "min_price": min(price_values),
        "max_price": max(price_values),
        "avg_price": sum(price_values) / len(price_values),
        "data_points": len(prices),
        "first_recorded": min(p.date for p in prices).isoformat(),
        "last_recorded": max(p.date for p in prices).isoformat()
    }
