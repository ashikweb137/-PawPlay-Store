from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

# Product Models
class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str
    category_id: int
    price: float
    original_price: Optional[float] = None
    image: str
    rating: float
    reviews: int
    description: str
    features: List[str]
    health_benefits: str
    in_stock: bool
    best_seller: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ProductCreate(BaseModel):
    name: str
    category: str
    category_id: int
    price: float
    original_price: Optional[float] = None
    image: str
    rating: float = 4.5
    reviews: int = 0
    description: str
    features: List[str]
    health_benefits: str
    in_stock: bool = True
    best_seller: bool = False

# Category Models
class Category(BaseModel):
    id: int
    name: str
    icon: str
    count: int = 0

class CategoryCreate(BaseModel):
    id: int
    name: str
    icon: str

# Cart Models
class CartItem(BaseModel):
    product_id: str
    quantity: int

class Cart(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    items: List[CartItem]
    total: float
    item_count: int
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Order Models
class ShippingAddress(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    address: str
    city: str
    state: str
    zip_code: str
    country: str = "United States"

class OrderItem(BaseModel):
    product_id: str
    product_name: str
    product_image: str
    price: float
    quantity: int

class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_number: str = Field(default_factory=lambda: f"ORD-{str(uuid.uuid4())[:8].upper()}")
    session_id: str
    items: List[OrderItem]
    shipping_address: ShippingAddress
    subtotal: float
    shipping: float
    tax: float
    total: float
    status: str = "pending"  # pending, processing, shipped, delivered, cancelled
    payment_status: str = "pending"  # pending, paid, failed, refunded
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class OrderCreate(BaseModel):
    session_id: str
    items: List[OrderItem]
    shipping_address: ShippingAddress
    subtotal: float
    shipping: float
    tax: float
    total: float

# Health Article Models
class HealthArticle(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    excerpt: str
    content: str
    image: str
    read_time: str
    category: str
    publish_date: datetime = Field(default_factory=datetime.utcnow)
    featured: bool = False

class HealthArticleCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    image: str
    read_time: str
    category: str
    featured: bool = False

# Testimonial Models
class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    avatar: str
    rating: int
    text: str
    pet_name: str
    verified: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TestimonialCreate(BaseModel):
    name: str
    avatar: str
    rating: int
    text: str
    pet_name: str
    verified: bool = True