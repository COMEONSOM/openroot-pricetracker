"""
Price Recording Service

Records product prices to the database for historical tracking.
Called automatically when products are searched/compared.
"""

from sqlalchemy.orm import Session
from datetime import date
import uuid

from app.models.price import Price
from app.models.product import Product
from typing import Optional


def record_price(
    db: Session,
    product_id: str,
    title: str,
    price: float,
    platform: str,
    url: str,
    image: Optional[str] = None
) -> bool:
    """
    Record a price point for a product.
    Creates the product if it doesn't exist.
    
    Args:
        db: Database session
        product_id: Unique product identifier
        title: Product title
        price: Current price
        platform: Platform name (amazon, flipkart, meesho)
        url: Product URL
        image: Product image URL (optional)
    
    Returns:
        True if recorded successfully, False otherwise
    """
    try:
        # Check if product exists, create if not
        product = db.query(Product).filter(Product.id == product_id).first()
        
        if not product:
            product = Product(
                id=product_id,
                title=title,
                platform=platform,
                url=url,
                image=image
            )
            db.add(product)
            db.flush()
        
        # Check if we already have a price for today
        today = date.today()
        existing_price = (
            db.query(Price)
            .filter(Price.product_id == product_id)
            .filter(Price.platform == platform)
            .filter(Price.date == today)
            .first()
        )
        
        if existing_price:
            # Update existing price if different
            if existing_price.price != price:
                existing_price.price = price
        else:
            # Create new price record
            new_price = Price(
                id=str(uuid.uuid4()),
                product_id=product_id,
                price=price,
                platform=platform,
                date=today
            )
            db.add(new_price)
        
        db.commit()
        return True
        
    except Exception as e:
        db.rollback()
        print(f"Error recording price: {e}")
        return False


def record_search_results(db: Session, results: list, platform: Optional[str] = None) -> int:
    """
    Record prices for multiple products from search results.
    
    Args:
        db: Database session
        results: List of product dictionaries
        platform: Override platform name (optional)
    
    Returns:
        Number of prices successfully recorded
    """
    recorded: int = 0
    
    for product in results:
        if not product:
            continue
            
        # Extract product data
        product_id = product.get("product_id")
        title = product.get("title", "Unknown")
        price = product.get("price")
        prod_platform: str = str(platform or product.get("platform") or "unknown")
        url = product.get("url", "")
        image = product.get("image")
        
        # Skip if no price or ID
        if not product_id or price is None:
            continue
        
        if record_price(db, product_id, title, price, prod_platform, url, image):
            recorded = recorded + 1  # type: ignore
    
    return recorded
