from fastapi import APIRouter, UploadFile, File

router = APIRouter()

@router.post("/image")
async def image_search(image: UploadFile = File(...)):
    return {
        "message": "Image search backend wired",
        "filename": image.filename
    }
