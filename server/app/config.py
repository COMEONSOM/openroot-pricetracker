import os
from dotenv import load_dotenv

load_dotenv()

SERP_API_KEY = os.getenv("SERP_API_KEY")

if not SERP_API_KEY:
    raise RuntimeError("SERP_API_KEY not set in environment")
