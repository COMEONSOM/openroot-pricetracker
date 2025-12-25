from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# -------------------- DATABASE --------------------
from app.database.session import engine, Base

# Import models so SQLAlchemy registers them
from app.models import product, price, user  # noqa: F401


# -------------------- APP INIT --------------------
app = FastAPI(
    title="Openroot PriceTracker System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)


# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # tighten later in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# -------------------- STARTUP --------------------
@app.on_event("startup")
def on_startup():
    """
    Create database tables on startup.
    In production, replace with Alembic migrations.
    """
    Base.metadata.create_all(bind=engine)


# -------------------- ROUTES --------------------
from app.api.routes.search import router as search_router
from app.api.routes.image import router as image_router
from app.api.routes.history import router as history_router

app.include_router(search_router, prefix="/api/search", tags=["Search"])
app.include_router(image_router, prefix="/api/search", tags=["Image Search"])
app.include_router(history_router, prefix="/api/history", tags=["Price History"])


# -------------------- ROOT --------------------
@app.get("/", tags=["Health"])
def root():
    return {
        "status": "running",
        "service": "Openroot PriceTracker API"
    }
