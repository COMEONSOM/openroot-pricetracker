from sqlalchemy import Column, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from datetime import date

from app.database.session import Base


class Price(Base):
    __tablename__ = "prices"

    id = Column(String, primary_key=True, index=True)
    product_id = Column(
        String,
        ForeignKey("products.id", ondelete="CASCADE"),
        nullable=False
    )

    price = Column(Float, nullable=False)
    platform = Column(String, nullable=False)
    date = Column(Date, default=date.today)

    product = relationship("Product", back_populates="prices")
