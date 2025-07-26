from fastapi import APIRouter, HTTPException, Request
from typing import List
from ..models import Order, OrderCreate, OrderItem
from ..database import orders_collection, carts_collection, products_collection
import logging
from datetime import datetime

router = APIRouter(prefix="/orders", tags=["orders"])
logger = logging.getLogger(__name__)

def get_session_id(request: Request) -> str:
    """Extract session ID from request"""
    session_id = request.headers.get("x-session-id")
    if not session_id:
        import uuid
        session_id = str(uuid.uuid4())
    return session_id

@router.post("/", response_model=Order)
async def create_order(order_data: OrderCreate, request: Request):
    """Create a new order from cart"""
    try:
        session_id = get_session_id(request)
        
        # Get cart to verify items
        cart = await carts_collection.find_one({"session_id": session_id})
        if not cart or not cart.get("items"):
            raise HTTPException(status_code=400, detail="Cart is empty")
        
        # Validate all products are still available and in stock
        order_items = []
        total_calculated = 0.0
        
        for cart_item in cart["items"]:
            product = await products_collection.find_one({"id": cart_item["product_id"]})
            if not product:
                raise HTTPException(status_code=400, detail=f"Product {cart_item['product_id']} not found")
            
            if not product.get("in_stock", False):
                raise HTTPException(status_code=400, detail=f"Product {product['name']} is out of stock")
            
            order_item = OrderItem(
                product_id=product["id"],
                product_name=product["name"],
                product_image=product["image"],
                price=product["price"],
                quantity=cart_item["quantity"]
            )
            order_items.append(order_item)
            total_calculated += product["price"] * cart_item["quantity"]
        
        # Verify pricing matches
        if abs(total_calculated - order_data.subtotal) > 0.01:
            raise HTTPException(status_code=400, detail="Price mismatch detected")
        
        # Create order
        order_dict = order_data.dict()
        order_dict["items"] = [item.dict() for item in order_items]
        order_dict["session_id"] = session_id
        
        # Generate order ID if not present
        if "id" not in order_dict:
            import uuid
            order_dict["id"] = str(uuid.uuid4())
        
        # Generate order number
        if "order_number" not in order_dict:
            order_dict["order_number"] = f"ORD-{str(uuid.uuid4())[:8].upper()}"
        
        order_dict["status"] = "pending"
        order_dict["payment_status"] = "pending"
        order_dict["created_at"] = datetime.utcnow()
        order_dict["updated_at"] = datetime.utcnow()
        
        # Save order
        await orders_collection.insert_one(order_dict)
        
        # Clear cart after successful order
        await carts_collection.update_one(
            {"session_id": session_id},
            {
                "$set": {
                    "items": [],
                    "total": 0.0,
                    "item_count": 0,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if "_id" in order_dict:
            del order_dict["_id"]
        
        return Order(**order_dict)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating order: {e}")
        raise HTTPException(status_code=500, detail="Error creating order")

@router.get("/", response_model=List[Order])
async def get_orders(request: Request):
    """Get all orders for current session"""
    try:
        session_id = get_session_id(request)
        
        orders = await orders_collection.find({"session_id": session_id}).sort("created_at", -1).to_list(length=100)
        
        for order in orders:
            if "_id" in order:
                del order["_id"]
        
        return [Order(**order) for order in orders]
        
    except Exception as e:
        logger.error(f"Error fetching orders: {e}")
        raise HTTPException(status_code=500, detail="Error fetching orders")

@router.get("/{order_id}", response_model=Order)
async def get_order(order_id: str, request: Request):
    """Get a specific order by ID"""
    try:
        session_id = get_session_id(request)
        
        order = await orders_collection.find_one({"id": order_id, "session_id": session_id})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        if "_id" in order:
            del order["_id"]
        
        return Order(**order)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching order {order_id}: {e}")
        raise HTTPException(status_code=500, detail="Error fetching order")

@router.put("/{order_id}/status")
async def update_order_status(order_id: str, status: str, request: Request):
    """Update order status"""
    try:
        session_id = get_session_id(request)
        
        valid_statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
        if status not in valid_statuses:
            raise HTTPException(status_code=400, detail="Invalid status")
        
        result = await orders_collection.update_one(
            {"id": order_id, "session_id": session_id},
            {
                "$set": {
                    "status": status,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Order not found")
        
        return {"message": f"Order status updated to {status}"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating order status: {e}")
        raise HTTPException(status_code=500, detail="Error updating order status")

@router.put("/{order_id}/payment-status")
async def update_payment_status(order_id: str, payment_status: str, request: Request):
    """Update payment status"""
    try:
        session_id = get_session_id(request)
        
        valid_statuses = ["pending", "paid", "failed", "refunded"]
        if payment_status not in valid_statuses:
            raise HTTPException(status_code=400, detail="Invalid payment status")
        
        result = await orders_collection.update_one(
            {"id": order_id, "session_id": session_id},
            {
                "$set": {
                    "payment_status": payment_status,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Order not found")
        
        return {"message": f"Payment status updated to {payment_status}"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating payment status: {e}")
        raise HTTPException(status_code=500, detail="Error updating payment status")

@router.get("/by-number/{order_number}", response_model=Order)
async def get_order_by_number(order_number: str):
    """Get order by order number (for customer service)"""
    try:
        order = await orders_collection.find_one({"order_number": order_number})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        if "_id" in order:
            del order["_id"]
        
        return Order(**order)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching order by number {order_number}: {e}")
        raise HTTPException(status_code=500, detail="Error fetching order")