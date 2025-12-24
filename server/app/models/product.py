from sqlalchemy import Column, String, Text
from sqlalchemy.orm import relationship

from app.database.session import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, index=True)
    title = Column(Text, nullable=False)
    platform = Column(String, nullable=False)
    url = Column(Text, nullable=False)
    image = Column(Text, nullable=True)

    # Relationship → prices
    prices = relationship(
        "Price",
        back_populates="product",
        cascade="all, delete-orphan"
    )
