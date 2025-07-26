from fastapi import APIRouter, HTTPException
from typing import List
from ..models import Category, CategoryCreate
from ..database import categories_collection, products_collection
import logging

router = APIRouter(prefix="/categories", tags=["categories"])
logger = logging.getLogger(__name__)

@router.get("/", response_model=List[Category])
async def get_categories():
    """Get all product categories"""
    try:
        categories = await categories_collection.find({}).to_list(length=100)
        
        # Update product counts for each category
        for category in categories:
            if "_id" in category:
                del category["_id"]
            
            # Get actual product count
            product_count = await products_collection.count_documents({"category_id": category["id"]})
            category["count"] = product_count
        
        return [Category(**category) for category in categories]
        
    except Exception as e:
        logger.error(f"Error fetching categories: {e}")
        raise HTTPException(status_code=500, detail="Error fetching categories")

@router.get("/{category_id}", response_model=Category)
async def get_category(category_id: int):
    """Get a single category by ID"""
    try:
        category = await categories_collection.find_one({"id": category_id})
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        
        if "_id" in category:
            del category["_id"]
        
        # Get actual product count
        product_count = await products_collection.count_documents({"category_id": category_id})
        category["count"] = product_count
        
        return Category(**category)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching category {category_id}: {e}")
        raise HTTPException(status_code=500, detail="Error fetching category")

@router.post("/", response_model=Category)
async def create_category(category: CategoryCreate):
    """Create a new category"""
    try:
        # Check if category ID already exists
        existing = await categories_collection.find_one({"id": category.id})
        if existing:
            raise HTTPException(status_code=400, detail="Category ID already exists")
        
        category_dict = category.dict()
        category_dict["count"] = 0  # Start with 0 products
        
        await categories_collection.insert_one(category_dict)
        
        return Category(**category_dict)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating category: {e}")
        raise HTTPException(status_code=500, detail="Error creating category")