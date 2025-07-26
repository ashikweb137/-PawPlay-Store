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

# ===== CATEGORIES ROUTES =====

@api_router.get("/categories", response_model=List[Category])
async def get_categories():
    categories = await db.categories.find().to_list(1000)
    return [Category(**category) for category in categories]

@api_router.get("/categories/{category_id}", response_model=Category)
async def get_category(category_id: str):
    category = await db.categories.find_one({"id": category_id})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return Category(**category)

@api_router.post("/admin/categories", response_model=Category)
async def create_category(category_data: CategoryCreate, current_admin: AdminResponse = Depends(get_current_admin)):
    # Check if slug already exists
    existing = await db.categories.find_one({"slug": category_data.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Category slug already exists")
    
    category = Category(**category_data.dict())
    await db.categories.insert_one(category.dict())
    return category

@api_router.put("/admin/categories/{category_id}", response_model=Category)
async def update_category(category_id: str, category_data: CategoryCreate, current_admin: AdminResponse = Depends(get_current_admin)):
    category = await db.categories.find_one({"id": category_id})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Check if new slug conflicts with another category
    if category_data.slug != category["slug"]:
        existing = await db.categories.find_one({"slug": category_data.slug})
        if existing:
            raise HTTPException(status_code=400, detail="Category slug already exists")
    
    updated_category = Category(
        id=category_id,
        **category_data.dict()
    )
    
    await db.categories.update_one({"id": category_id}, {"$set": updated_category.dict()})
    return updated_category

@api_router.delete("/admin/categories/{category_id}")
async def delete_category(category_id: str, current_admin: AdminResponse = Depends(get_current_admin)):
    category = await db.categories.find_one({"id": category_id})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Check if category has products
    products_count = await db.products.count_documents({"category_id": category_id})
    if products_count > 0:
        raise HTTPException(status_code=400, detail="Cannot delete category with products")
    
    await db.categories.delete_one({"id": category_id})
    return {"message": "Category deleted successfully"}


# ===== PRODUCTS ROUTES =====

@api_router.get("/products", response_model=List[Product])
async def get_products(
    category_id: Optional[str] = None,
    is_featured: Optional[bool] = None,
    is_active: bool = True,
    limit: int = 50,
    skip: int = 0
):
    filter_dict = {"is_active": is_active}
    if category_id:
        filter_dict["category_id"] = category_id
    if is_featured is not None:
        filter_dict["is_featured"] = is_featured
    
    products = await db.products.find(filter_dict).skip(skip).limit(limit).sort("created_at", -1).to_list(limit)
    return [Product(**product) for product in products]

@api_router.get("/products/search")
async def search_products(q: str, limit: int = 20):
    filter_dict = {
        "is_active": True,
        "$or": [
            {"name": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
            {"features": {"$regex": q, "$options": "i"}}
        ]
    }
    
    products = await db.products.find(filter_dict).limit(limit).to_list(limit)
    return [Product(**product) for product in products]

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id, "is_active": True})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**product)

@api_router.get("/products/slug/{slug}", response_model=Product)
async def get_product_by_slug(slug: str):
    product = await db.products.find_one({"slug": slug, "is_active": True})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**product)

@api_router.post("/admin/products", response_model=Product)
async def create_product(product_data: ProductCreate, current_admin: AdminResponse = Depends(get_current_admin)):
    # Check if slug already exists
    existing = await db.products.find_one({"slug": product_data.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Product slug already exists")
    
    # Get category name
    category = await db.categories.find_one({"id": product_data.category_id})
    if not category:
        raise HTTPException(status_code=400, detail="Category not found")
    
    product = Product(
        **product_data.dict(),
        category_name=category["name"]
    )
    
    await db.products.insert_one(product.dict())
    return product

@api_router.put("/admin/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product_data: ProductUpdate, current_admin: AdminResponse = Depends(get_current_admin)):
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_dict = {k: v for k, v in product_data.dict().items() if v is not None}
    update_dict["updated_at"] = datetime.utcnow()
    
    # Update category name if category_id changed
    if "category_id" in update_dict:
        category = await db.categories.find_one({"id": update_dict["category_id"]})
        if not category:
            raise HTTPException(status_code=400, detail="Category not found")
        update_dict["category_name"] = category["name"]
    
    await db.products.update_one({"id": product_id}, {"$set": update_dict})
    
    updated_product = await db.products.find_one({"id": product_id})
    return Product(**updated_product)

@api_router.delete("/admin/products/{product_id}")
async def delete_product(product_id: str, current_admin: AdminResponse = Depends(get_current_admin)):
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    await db.products.delete_one({"id": product_id})
    return {"message": "Product deleted successfully"}


# ===== BLOG ROUTES =====

@api_router.get("/blog/posts", response_model=List[BlogPost])
async def get_blog_posts(
    category_id: Optional[str] = None,
    is_published: bool = True,
    is_featured: Optional[bool] = None,
    limit: int = 20,
    skip: int = 0
):
    filter_dict = {"is_published": is_published}
    if category_id:
        filter_dict["category_id"] = category_id
    if is_featured is not None:
        filter_dict["is_featured"] = is_featured
    
    posts = await db.blog_posts.find(filter_dict).skip(skip).limit(limit).sort("published_at", -1).to_list(limit)
    return [BlogPost(**post) for post in posts]

@api_router.get("/blog/posts/{post_id}", response_model=BlogPost)
async def get_blog_post(post_id: str):
    post = await db.blog_posts.find_one({"id": post_id, "is_published": True})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return BlogPost(**post)

@api_router.get("/blog/posts/slug/{slug}", response_model=BlogPost)
async def get_blog_post_by_slug(slug: str):
    post = await db.blog_posts.find_one({"slug": slug, "is_published": True})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return BlogPost(**post)

@api_router.post("/admin/blog/posts", response_model=BlogPost)
async def create_blog_post(post_data: BlogPostCreate, current_admin: AdminResponse = Depends(get_current_admin)):
    # Check if slug already exists
    existing = await db.blog_posts.find_one({"slug": post_data.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Blog post slug already exists")
    
    # Get category name if category_id provided
    category_name = None
    if post_data.category_id:
        category = await db.categories.find_one({"id": post_data.category_id})
        if category:
            category_name = category["name"]
    
    post = BlogPost(
        **post_data.dict(),
        category_name=category_name,
        published_at=datetime.utcnow() if post_data.is_published else None
    )
    
    await db.blog_posts.insert_one(post.dict())
    return post

@api_router.put("/admin/blog/posts/{post_id}", response_model=BlogPost)
async def update_blog_post(post_id: str, post_data: BlogPostCreate, current_admin: AdminResponse = Depends(get_current_admin)):
    post = await db.blog_posts.find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    # Get category name if category_id provided
    category_name = None
    if post_data.category_id:
        category = await db.categories.find_one({"id": post_data.category_id})
        if category:
            category_name = category["name"]
    
    updated_post = BlogPost(
        id=post_id,
        **post_data.dict(),
        category_name=category_name,
        created_at=post["created_at"],
        updated_at=datetime.utcnow(),
        published_at=datetime.utcnow() if post_data.is_published and not post.get("published_at") else post.get("published_at")
    )
    
    await db.blog_posts.update_one({"id": post_id}, {"$set": updated_post.dict()})
    return updated_post

@api_router.delete("/admin/blog/posts/{post_id}")
async def delete_blog_post(post_id: str, current_admin: AdminResponse = Depends(get_current_admin)):
    post = await db.blog_posts.find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    await db.blog_posts.delete_one({"id": post_id})
    return {"message": "Blog post deleted successfully"}


# ===== DASHBOARD STATS =====

@api_router.get("/admin/stats")
async def get_dashboard_stats(current_admin: AdminResponse = Depends(get_current_admin)):
    total_products = await db.products.count_documents({"is_active": True})
    total_categories = await db.categories.count_documents({})
    total_blog_posts = await db.blog_posts.count_documents({"is_published": True})
    featured_products = await db.products.count_documents({"is_featured": True, "is_active": True})
    
    return {
        "total_products": total_products,
        "total_categories": total_categories,
        "total_blog_posts": total_blog_posts,
        "featured_products": featured_products
    }


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
