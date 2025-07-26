from fastapi import APIRouter, HTTPException, Request
from typing import List
from ..models import Cart, CartItem, Product
from ..database import carts_collection, products_collection
import logging
from datetime import datetime

router = APIRouter(prefix="/cart", tags=["cart"])
logger = logging.getLogger(__name__)

def get_session_id(request: Request) -> str:
    """Extract or generate session ID from request"""
    session_id = request.headers.get("x-session-id")
    if not session_id:
        import uuid
        session_id = str(uuid.uuid4())
    return session_id

@router.get("/", response_model=Cart)
async def get_cart(request: Request):
    """Get current cart for session"""
    try:
        session_id = get_session_id(request)
        
        cart = await carts_collection.find_one({"session_id": session_id})
        
        if not cart:
            # Create empty cart
            empty_cart = {
                "session_id": session_id,
                "items": [],
                "total": 0.0,
                "item_count": 0
            }
            await carts_collection.insert_one(empty_cart)
            if "_id" in empty_cart:
                del empty_cart["_id"]
            return Cart(**empty_cart)
        
        if "_id" in cart:
            del cart["_id"]
            
        return Cart(**cart)
        
    except Exception as e:
        logger.error(f"Error fetching cart: {e}")
        raise HTTPException(status_code=500, detail="Error fetching cart")

@router.post("/add/{product_id}")
async def add_to_cart(product_id: str, request: Request, quantity: int = 1):
    """Add product to cart"""
    try:
        session_id = get_session_id(request)
        
        # Verify product exists
        product = await products_collection.find_one({"id": product_id})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        if not product.get("in_stock", False):
            raise HTTPException(status_code=400, detail="Product is out of stock")
        
        # Get or create cart
        cart = await carts_collection.find_one({"session_id": session_id})
        
        if not cart:
            cart = {
                "session_id": session_id,
                "items": [],
                "total": 0.0,
                "item_count": 0,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        
        # Check if product already in cart
        existing_item = None
        for item in cart["items"]:
            if item["product_id"] == product_id:
                existing_item = item
                break
        
        if existing_item:
            # Update quantity
            existing_item["quantity"] += quantity
        else:
            # Add new item
            cart["items"].append({
                "product_id": product_id,
                "quantity": quantity
            })
        
        # Recalculate totals
        total = 0.0
        item_count = 0
        
        for item in cart["items"]:
            item_product = await products_collection.find_one({"id": item["product_id"]})
            if item_product:
                total += item_product["price"] * item["quantity"]
                item_count += item["quantity"]
        
        cart["total"] = total
        cart["item_count"] = item_count
        cart["updated_at"] = datetime.utcnow()
        
        # Save cart
        await carts_collection.replace_one(
            {"session_id": session_id},
            cart,
            upsert=True
        )
        
        return {"message": "Product added to cart", "cart_total": total, "cart_items": item_count}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error adding to cart: {e}")
        raise HTTPException(status_code=500, detail="Error adding to cart")

@router.put("/update/{product_id}")
async def update_cart_item(product_id: str, quantity: int, request: Request):
    """Update quantity of item in cart"""
    try:
        session_id = get_session_id(request)
        
        cart = await carts_collection.find_one({"session_id": session_id})
        if not cart:
            raise HTTPException(status_code=404, detail="Cart not found")
        
        # Find and update item
        item_found = False
        for item in cart["items"]:
            if item["product_id"] == product_id:
                if quantity <= 0:
                    cart["items"].remove(item)
                else:
                    item["quantity"] = quantity
                item_found = True
                break
        
        if not item_found:
            raise HTTPException(status_code=404, detail="Item not found in cart")
        
        # Recalculate totals
        total = 0.0
        item_count = 0
        
        for item in cart["items"]:
            item_product = await products_collection.find_one({"id": item["product_id"]})
            if item_product:
                total += item_product["price"] * item["quantity"]
                item_count += item["quantity"]
        
        cart["total"] = total
        cart["item_count"] = item_count
        cart["updated_at"] = datetime.utcnow()
        
        # Save cart
        await carts_collection.replace_one(
            {"session_id": session_id},
            cart
        )
        
        return {"message": "Cart updated", "cart_total": total, "cart_items": item_count}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating cart: {e}")
        raise HTTPException(status_code=500, detail="Error updating cart")

@router.delete("/remove/{product_id}")
async def remove_from_cart(product_id: str, request: Request):
    """Remove item from cart"""
    try:
        session_id = get_session_id(request)
        
        cart = await carts_collection.find_one({"session_id": session_id})
        if not cart:
            raise HTTPException(status_code=404, detail="Cart not found")
        
        # Remove item
        original_length = len(cart["items"])
        cart["items"] = [item for item in cart["items"] if item["product_id"] != product_id]
        
        if len(cart["items"]) == original_length:
            raise HTTPException(status_code=404, detail="Item not found in cart")
        
        # Recalculate totals
        total = 0.0
        item_count = 0
        
        for item in cart["items"]:
            item_product = await products_collection.find_one({"id": item["product_id"]})
            if item_product:
                total += item_product["price"] * item["quantity"]
                item_count += item["quantity"]
        
        cart["total"] = total
        cart["item_count"] = item_count
        cart["updated_at"] = datetime.utcnow()
        
        # Save cart
        await carts_collection.replace_one(
            {"session_id": session_id},
            cart
        )
        
        return {"message": "Item removed from cart", "cart_total": total, "cart_items": item_count}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error removing from cart: {e}")
        raise HTTPException(status_code=500, detail="Error removing from cart")

@router.delete("/clear")
async def clear_cart(request: Request):
    """Clear all items from cart"""
    try:
        session_id = get_session_id(request)
        
        await carts_collection.update_one(
            {"session_id": session_id},
            {
                "$set": {
                    "items": [],
                    "total": 0.0,
                    "item_count": 0,
                    "updated_at": datetime.utcnow()
                }
            },
            upsert=True
        )
        
        return {"message": "Cart cleared"}
        
    except Exception as e:
        logger.error(f"Error clearing cart: {e}")
        raise HTTPException(status_code=500, detail="Error clearing cart")

@router.get("/items", response_model=List[dict])
async def get_cart_items_with_products(request: Request):
    """Get cart items with full product details"""
    try:
        session_id = get_session_id(request)
        
        cart = await carts_collection.find_one({"session_id": session_id})
        if not cart or not cart.get("items"):
            return []
        
        cart_items = []
        for item in cart["items"]:
            product = await products_collection.find_one({"id": item["product_id"]})
            if product:
                if "_id" in product:
                    del product["_id"]
                cart_item = {
                    **product,
                    "quantity": item["quantity"]
                }
                cart_items.append(cart_item)
        
        return cart_items
        
    except Exception as e:
        logger.error(f"Error fetching cart items with products: {e}")
        raise HTTPException(status_code=500, detail="Error fetching cart items")