from pydantic import BaseModel
from typing import List, Optional
from datetime import date

# ---------- PRODUCT ----------

class ProductBase(BaseModel):
    title: str
    platform: str
    url: str
    image: Optional[str] = None


class ProductResponse(ProductBase):
    id: str
    price: Optional[float]

    class Config:
        from_attributes = True


# ---------- PRICE HISTORY ----------

class PriceHistoryPoint(BaseModel):
    date: date
    price: float
    platform: str


class PriceHistoryResponse(BaseModel):
    product_id: str
    history: List[PriceHistoryPoint]


# ---------- SEARCH RESPONSE ----------

class SearchResponse(BaseModel):
    query: str
    results: List[ProductResponse]
