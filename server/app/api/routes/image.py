from fastapi import APIRouter, UploadFile, File
import os
import tempfile
from typing import Optional

from app.services.serp.amazon_service import search_amazon
from app.services.serp.flipkart_service import search_flipkart
from app.services.serp.meesho_service import search_meesho
from app.services.matcher.text_matcher import merge_results

router = APIRouter()


def extract_search_query(filename: str) -> str:
    """
    Extract a search query from the image filename.
    Removes extensions, replaces separators with spaces, and cleans up.
    """
    # Remove file extension
    name = os.path.splitext(filename)[0]
    
    # Replace common separators with spaces
    for sep in ["-", "_", ".", "+", "%20"]:
        name = name.replace(sep, " ")
    
    # Remove common image prefixes/suffixes
    remove_words = ["img", "image", "photo", "pic", "screenshot", "screen"]
    words = name.split()
    words = [w for w in words if w.lower() not in remove_words]
    
    # Clean up and return
    query = " ".join(words).strip()
    
    # If query is empty or too short, return a generic fallback
    if len(query) < 2:
        return ""
    
    return query


@router.post("/image")
async def image_search(
    image: UploadFile = File(...),
    query: Optional[str] = None
):
    """
    Search for products using an uploaded image.
    
    The search works in two modes:
    1. If a query parameter is provided, use it directly
    2. Otherwise, extract search terms from the filename
    
    For more advanced image recognition, integrate with 
    Google Vision API or similar services.
    """
    # Determine search query
    search_query = query
    
    if not search_query:
        # Extract from filename
        search_query = extract_search_query(image.filename or "")
    
    if not search_query:
        return {
            "error": "Could not determine product to search. Please provide a query parameter or use a descriptive filename.",
            "filename": image.filename,
            "results": []
        }
    
    # Save image temporarily (for future AI/OCR integration)
    temp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(image.filename or ".jpg")[1], mode='wb') as tmp:
            content = await image.read()
            tmp.write(content) # type: ignore
            temp_path = tmp.name
    except Exception as e:
        print(f"Warning: Could not save temp image: {e}")
    
    # Search across platforms
    print(f"🖼️ Image search query: {search_query}")
    
    amazon_results = search_amazon(search_query)
    flipkart_results = search_flipkart(search_query)
    meesho_results = search_meesho(search_query)
    
    # Merge results
    merged = merge_results(amazon_results, flipkart_results, meesho_results)
    
    # Cleanup temp file
    if temp_path and os.path.exists(temp_path):
        try:
            os.unlink(temp_path)
        except Exception:
            pass
    
    return {
        "query": search_query,
        "source": "image",
        "filename": image.filename,
        "results": merged,
        "count": len(merged)
    }
