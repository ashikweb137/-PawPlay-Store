from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from ..models import Product, ProductCreate
from ..database import products_collection, categories_collection
import logging

router = APIRouter(prefix="/products", tags=["products"])
logger = logging.getLogger(__name__)

@router.get("/", response_model=List[Product])
async def get_products(
    category_id: Optional[int] = Query(None, description="Filter by category ID"),
    search: Optional[str] = Query(None, description="Search products by name or description"),
    min_price: Optional[float] = Query(None, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, description="Maximum price filter"),
    in_stock_only: Optional[bool] = Query(False, description="Filter only in-stock products"),
    best_sellers_only: Optional[bool] = Query(False, description="Filter only best sellers"),
    sort_by: Optional[str] = Query("featured", description="Sort by: featured, price_low, price_high, rating, name, newest"),
    limit: Optional[int] = Query(50, description="Maximum number of products to return"),
    skip: Optional[int] = Query(0, description="Number of products to skip")
):
    """Get products with optional filtering and sorting"""
    try:
        # Build filter query
        filter_query = {}
        
        if category_id:
            filter_query["category_id"] = category_id
            
        if search:
            filter_query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}},
                {"category": {"$regex": search, "$options": "i"}}
            ]
            
        if min_price is not None or max_price is not None:
            price_filter = {}
            if min_price is not None:
                price_filter["$gte"] = min_price
            if max_price is not None:
                price_filter["$lte"] = max_price
            filter_query["price"] = price_filter
            
        if in_stock_only:
            filter_query["in_stock"] = True
            
        if best_sellers_only:
            filter_query["best_seller"] = True
        
        # Build sort query
        sort_query = []
        if sort_by == "price_low":
            sort_query = [("price", 1)]
        elif sort_by == "price_high":
            sort_query = [("price", -1)]
        elif sort_by == "rating":
            sort_query = [("rating", -1)]
        elif sort_by == "name":
            sort_query = [("name", 1)]
        elif sort_by == "newest":
            sort_query = [("created_at", -1)]
        else:  # featured
            sort_query = [("best_seller", -1), ("rating", -1)]
        
        # Execute query
        cursor = products_collection.find(filter_query)
        if sort_query:
            cursor = cursor.sort(sort_query)
        cursor = cursor.skip(skip).limit(limit)
        
        products = await cursor.to_list(length=limit)
        
        # Convert ObjectId to string and return
        for product in products:
            if "_id" in product:
                del product["_id"]
                
        return [Product(**product) for product in products]
        
    except Exception as e:
        logger.error(f"Error fetching products: {e}")
        raise HTTPException(status_code=500, detail="Error fetching products")

@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Get a single product by ID"""
    try:
        product = await products_collection.find_one({"id": product_id})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        if "_id" in product:
            del product["_id"]
            
        return Product(**product)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching product {product_id}: {e}")
        raise HTTPException(status_code=500, detail="Error fetching product")

@router.post("/", response_model=Product)
async def create_product(product: ProductCreate):
    """Create a new product"""
    try:
        product_dict = product.dict()
        
        # Generate ID if not provided
        if "id" not in product_dict:
            import uuid
            product_dict["id"] = str(uuid.uuid4())
        
        # Insert product
        await products_collection.insert_one(product_dict)
        
        # Update category count
        await categories_collection.update_one(
            {"id": product.category_id},
            {"$inc": {"count": 1}}
        )
        
        return Product(**product_dict)
        
    except Exception as e:
        logger.error(f"Error creating product: {e}")
        raise HTTPException(status_code=500, detail="Error creating product")

@router.get("/category/{category_id}", response_model=List[Product])
async def get_products_by_category(category_id: int):
    """Get all products in a specific category"""
    try:
        products = await products_collection.find({"category_id": category_id}).to_list(length=100)
        
        for product in products:
            if "_id" in product:
                del product["_id"]
                
        return [Product(**product) for product in products]
        
    except Exception as e:
        logger.error(f"Error fetching products for category {category_id}: {e}")
        raise HTTPException(status_code=500, detail="Error fetching products")

@router.get("/featured/bestsellers", response_model=List[Product])
async def get_bestsellers():
    """Get all best-selling products"""
    try:
        products = await products_collection.find({"best_seller": True}).to_list(length=20)
        
        for product in products:
            if "_id" in product:
                del product["_id"]
                
        return [Product(**product) for product in products]
        
    except Exception as e:
        logger.error(f"Error fetching bestsellers: {e}")
        raise HTTPException(status_code=500, detail="Error fetching bestsellers")