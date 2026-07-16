"""
Test suite for search API endpoints.

Run with: pytest tests/test_search.py -v
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import io

# Import the FastAPI app
from app.main import app

client = TestClient(app)


# ============================================
# FIXTURES
# ============================================

@pytest.fixture
def mock_serp_results():
    """Mock search results from SERP services."""
    return [
        {
            "product_id": "test-product-1",
            "title": "Test Product 1",
            "price": 999.0,
            "platform": "amazon",
            "url": "https://amazon.in/test-1",
            "image": "https://example.com/img1.jpg"
        },
        {
            "product_id": "test-product-2",
            "title": "Test Product 2",
            "price": 899.0,
            "platform": "flipkart",
            "url": "https://flipkart.com/test-2",
            "image": "https://example.com/img2.jpg"
        }
    ]


@pytest.fixture
def mock_empty_results():
    """Empty search results."""
    return []


# ============================================
# TEXT SEARCH TESTS
# ============================================

class TestTextSearch:
    """Tests for POST /api/search/text endpoint."""

    def test_text_search_missing_query(self):
        """Should return error when query is missing."""
        response = client.post("/api/search/text", json={})
        assert response.status_code == 200
        data = response.json()
        assert "error" in data

    def test_text_search_empty_query(self):
        """Should return error for empty query."""
        response = client.post("/api/search/text", json={"query": ""})
        assert response.status_code == 200
        data = response.json()
        assert "error" in data

    @patch("app.api.routes.search.search_amazon")
    @patch("app.api.routes.search.search_flipkart")
    @patch("app.api.routes.search.search_meesho")
    def test_text_search_success(
        self, mock_meesho, mock_flipkart, mock_amazon, mock_serp_results
    ):
        """Should return merged results from all platforms."""
        mock_amazon.return_value = [mock_serp_results[0]]
        mock_flipkart.return_value = [mock_serp_results[1]]
        mock_meesho.return_value = []

        response = client.post("/api/search/text", json={"query": "laptop"})
        assert response.status_code == 200
        
        data = response.json()
        assert "query" in data
        assert data["query"] == "laptop"
        assert "results" in data


# ============================================
# LINK SEARCH TESTS
# ============================================

class TestLinkSearch:
    """Tests for POST /api/search/link endpoint."""

    def test_link_search_missing_url(self):
        """Should return error when URL is missing."""
        response = client.post("/api/search/link", json={})
        assert response.status_code == 200
        data = response.json()
        assert "error" in data

    def test_link_search_empty_url(self):
        """Should return error for empty URL."""
        response = client.post("/api/search/link", json={"url": ""})
        assert response.status_code == 200
        data = response.json()
        assert "error" in data

    @patch("app.api.routes.search.search_amazon")
    @patch("app.api.routes.search.search_flipkart")
    @patch("app.api.routes.search.search_meesho")
    @patch("app.api.routes.search.pick_best_match")
    @patch("app.api.routes.search.search_product_images")
    @patch("app.api.routes.search.calculate_price_intelligence")
    def test_link_search_success(
        self,
        mock_intelligence,
        mock_images,
        mock_pick,
        mock_meesho,
        mock_flipkart,
        mock_amazon,
        mock_serp_results
    ):
        """Should return comparison data for valid URL."""
        mock_amazon.return_value = [mock_serp_results[0]]
        mock_flipkart.return_value = [mock_serp_results[1]]
        mock_meesho.return_value = []
        mock_pick.side_effect = lambda x, **kwargs: x[0] if x else None
        mock_images.return_value = ["https://example.com/img.jpg"]
        mock_intelligence.return_value = {"deal": "good", "low_52w": 800, "high_52w": 1200}

        response = client.post(
            "/api/search/link",
            json={"url": "https://amazon.in/test-product"}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "matches" in data
        assert "intelligence" in data


# ============================================
# IMAGE SEARCH TESTS
# ============================================

class TestImageSearch:
    """Tests for POST /api/search/image endpoint."""

    @patch("app.api.routes.image.search_amazon")
    @patch("app.api.routes.image.search_flipkart")
    @patch("app.api.routes.image.search_meesho")
    def test_image_search_with_descriptive_filename(
        self, mock_meesho, mock_flipkart, mock_amazon, mock_serp_results
    ):
        """Should extract query from filename and return results."""
        mock_amazon.return_value = [mock_serp_results[0]]
        mock_flipkart.return_value = [mock_serp_results[1]]
        mock_meesho.return_value = []

        # Create a test image file
        file_content = b"fake image content"
        files = {
            "image": ("wireless-bluetooth-headphones.jpg", io.BytesIO(file_content), "image/jpeg")
        }
        
        response = client.post("/api/search/image", files=files)
        assert response.status_code == 200
        
        data = response.json()
        assert "query" in data
        assert "results" in data
        # Query should be extracted from filename
        assert "wireless" in data["query"].lower() or "bluetooth" in data["query"].lower()

    def test_image_search_with_query_param(self):
        """Should use explicit query parameter if provided."""
        file_content = b"fake image content"
        files = {
            "image": ("random123.jpg", io.BytesIO(file_content), "image/jpeg")
        }
        
        response = client.post(
            "/api/search/image?query=iphone%2015",
            files=files
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data.get("query") == "iphone 15"

    def test_image_search_non_descriptive_filename(self):
        """Should return error for non-descriptive filename without query param."""
        file_content = b"fake image content"
        files = {
            "image": ("IMG_001.jpg", io.BytesIO(file_content), "image/jpeg")
        }
        
        response = client.post("/api/search/image", files=files)
        assert response.status_code == 200
        
        data = response.json()
        # Should have error or empty results
        assert "error" in data or data.get("count", 0) == 0


# ============================================
# HEALTH CHECK TESTS
# ============================================

class TestHealthCheck:
    """Tests for health check endpoint."""

    def test_root_endpoint(self):
        """Should return running status."""
        response = client.get("/")
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "running"
        assert "version" in data


# ============================================
# PRICE HISTORY TESTS
# ============================================

class TestPriceHistory:
    """Tests for price history endpoints."""

    def test_get_history_empty(self):
        """Should return empty array for non-existent product."""
        response = client.get("/api/history/nonexistent-product-id")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 0

    def test_get_price_summary_empty(self):
        """Should return has_history=False for non-existent product."""
        response = client.get("/api/history/product/nonexistent-product-id/summary")
        assert response.status_code == 200
        
        data = response.json()
        assert data["has_history"] is False
