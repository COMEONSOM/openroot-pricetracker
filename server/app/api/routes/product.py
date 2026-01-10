from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.api.link_parser import parse_product_link

router = APIRouter(prefix="/api/product", tags=["product"])

class ParseLinkRequest(BaseModel):
    url: str

@router.post("/parse-link")
def parse_link(payload: ParseLinkRequest):
    result = parse_product_link(payload.url)
    if not result:
        raise HTTPException(status_code=400, detail="Unsupported or invalid link")
    return result
