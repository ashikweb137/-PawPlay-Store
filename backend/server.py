from fastapi import FastAPI, APIRouter, HTTPException, Depends, File, UploadFile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import jwt
import hashlib
import base64


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Farm Animal Products Affiliate API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer(auto_error=False)
JWT_SECRET = "farm_animals_secret_key"  # In production, use environment variable


# ===== MODELS =====

# Category Models
class Category(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    description: str
    image_base64: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CategoryCreate(BaseModel):
    name: str
    slug: str
    description: str
    image_base64: Optional[str] = None

# Product Models
class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    description: str
    short_description: str
    category_id: str
    category_name: str
    price: float
    original_price: Optional[float] = None
    affiliate_url: str
    amazon_asin: Optional[str] = None
    image_base64: Optional[str] = None
    additional_images: List[str] = []
    features: List[str] = []
    rating: float = 0.0
    review_count: int = 0
    is_featured: bool = False
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProductCreate(BaseModel):
    name: str
    slug: str
    description: str
    short_description: str
    category_id: str
    price: float
    original_price: Optional[float] = None
    affiliate_url: str
    amazon_asin: Optional[str] = None
    image_base64: Optional[str] = None
    additional_images: List[str] = []
    features: List[str] = []
    rating: float = 0.0
    review_count: int = 0
    is_featured: bool = False

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    category_id: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    affiliate_url: Optional[str] = None
    amazon_asin: Optional[str] = None
    image_base64: Optional[str] = None
    additional_images: Optional[List[str]] = None
    features: Optional[List[str]] = None
    rating: Optional[float] = None
    review_count: Optional[int] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None

# Blog Models
class BlogPost(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    content: str
    excerpt: str
    author: str
    category_id: Optional[str] = None
    category_name: Optional[str] = None
    featured_image_base64: Optional[str] = None
    tags: List[str] = []
    is_published: bool = False
    is_featured: bool = False
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    published_at: Optional[datetime] = None

class BlogPostCreate(BaseModel):
    title: str
    slug: str
    content: str
    excerpt: str
    author: str
    category_id: Optional[str] = None
    featured_image_base64: Optional[str] = None
    tags: List[str] = []
    is_published: bool = False
    is_featured: bool = False
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None

# Admin Models
class Admin(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: str
    password_hash: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AdminCreate(BaseModel):
    username: str
    email: str
    password: str

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminResponse(BaseModel):
    id: str
    username: str
    email: str
    is_active: bool
    created_at: datetime


# ===== AUTHENTICATION =====

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

def create_jwt_token(admin_id: str) -> str:
    payload = {
        "admin_id": admin_id,
        "exp": datetime.utcnow().timestamp() + 86400  # 24 hours
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"])
        admin_id = payload.get("admin_id")
        if not admin_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        admin = await db.admins.find_one({"id": admin_id})
        if not admin or not admin.get("is_active"):
            raise HTTPException(status_code=401, detail="Admin not found or inactive")
        
        return AdminResponse(**admin)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ===== ROUTES =====

@api_router.get("/")
async def root():
    return {"message": "Farm Animal Products Affiliate API"}

# ===== ADMIN AUTHENTICATION =====

@api_router.post("/admin/register")
async def register_admin(admin_data: AdminCreate):
    # Check if admin already exists
    existing_admin = await db.admins.find_one({
        "$or": [{"username": admin_data.username}, {"email": admin_data.email}]
    })
    if existing_admin:
        raise HTTPException(status_code=400, detail="Admin already exists")
    
    # Create admin
    admin = Admin(
        username=admin_data.username,
        email=admin_data.email,
        password_hash=hash_password(admin_data.password)
    )
    
    await db.admins.insert_one(admin.dict())
    return {"message": "Admin created successfully", "admin_id": admin.id}

@api_router.post("/admin/login")
async def login_admin(login_data: AdminLogin):
    admin = await db.admins.find_one({"username": login_data.username})
    if not admin or not verify_password(login_data.password, admin["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not admin.get("is_active"):
        raise HTTPException(status_code=401, detail="Admin account is inactive")
    
    token = create_jwt_token(admin["id"])
    return {"access_token": token, "token_type": "bearer", "admin": AdminResponse(**admin)}

@api_router.get("/admin/me")
async def get_current_admin_info(current_admin: AdminResponse = Depends(get_current_admin)):
    return current_admin

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
