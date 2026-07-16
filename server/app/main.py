from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# -------------------- DATABASE --------------------
from app.database.session import engine, Base
from app.models import product, price, user  # noqa: F401

# -------------------- LIFESPAN (MODERN STARTUP) --------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application startup & shutdown lifecycle.
    In production, replace table creation with Alembic migrations.
    """
    print("🚀 Openroot PriceTracker starting...")

    # Create DB tables
    Base.metadata.create_all(bind=engine)

    yield

    print("🛑 Openroot PriceTracker shutting down...")


# -------------------- APP INIT --------------------
app = FastAPI(
    title="Openroot PriceTracker System",
    version="1.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# -------------------- CORS (STABLE DEV MODE) --------------------
# Credentials disabled → allows wildcard origin safely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- ROUTES --------------------
from app.api.routes.product import router as product_router
from app.api.routes.search import router as search_router
from app.api.routes.image import router as image_router
from app.api.routes.history import router as history_router
from app.api.routes.aiRoutes import router as ai_router   

app.include_router(product_router)
app.include_router(search_router, prefix="/api/search", tags=["Search"])
app.include_router(image_router, prefix="/api/search", tags=["Image Search"])
app.include_router(history_router, prefix="/api/history", tags=["Price History"])
app.include_router(ai_router)   #  AI ENABLED


# -------------------- ROOT --------------------
@app.get("/", tags=["Health"])
def root():
    return {
        "status": "running",
        "service": "Openroot PriceTracker API",
        "version": "1.1.0"
    }
