from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Collections
products_collection = db.products
categories_collection = db.categories
carts_collection = db.carts
orders_collection = db.orders
health_articles_collection = db.health_articles
testimonials_collection = db.testimonials

async def init_database():
    """Initialize database with sample data if collections are empty"""
    
    # Check if products collection is empty
    product_count = await products_collection.count_documents({})
    if product_count == 0:
        await seed_products()
    
    # Check if categories collection is empty
    category_count = await categories_collection.count_documents({})
    if category_count == 0:
        await seed_categories()
    
    # Check if health articles collection is empty
    article_count = await health_articles_collection.count_documents({})
    if article_count == 0:
        await seed_health_articles()
    
    # Check if testimonials collection is empty
    testimonial_count = await testimonials_collection.count_documents({})
    if testimonial_count == 0:
        await seed_testimonials()

async def seed_categories():
    """Seed categories collection with initial data"""
    categories = [
        {"id": 1, "name": "Dog Toys", "icon": "🐕", "count": 24},
        {"id": 2, "name": "Cat Toys", "icon": "🐱", "count": 18},
        {"id": 3, "name": "Bird Toys", "icon": "🦜", "count": 12},
        {"id": 4, "name": "Small Animal", "icon": "🐹", "count": 15},
        {"id": 5, "name": "Aquatic Toys", "icon": "🐠", "count": 9},
        {"id": 6, "name": "Reptile Toys", "icon": "🦎", "count": 6}
    ]
    await categories_collection.insert_many(categories)

async def seed_products():
    """Seed products collection with initial data"""
    products = [
        {
            "id": "1",
            "name": "Interactive Puzzle Feeder",
            "category": "Dog Toys",
            "category_id": 1,
            "price": 29.99,
            "original_price": 39.99,
            "image": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=500&fit=crop",
            "rating": 4.8,
            "reviews": 124,
            "description": "Slow feeding puzzle toy that challenges your dog mentally while eating. Made from durable, food-safe materials.",
            "features": ["Mental stimulation", "Slow feeding", "Durable plastic", "Easy to clean"],
            "health_benefits": "Promotes healthy eating habits and prevents bloating",
            "in_stock": True,
            "best_seller": True
        },
        {
            "id": "2",
            "name": "Laser Pointer Pro",
            "category": "Cat Toys",
            "category_id": 2,
            "price": 19.99,
            "original_price": 24.99,
            "image": "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=500&fit=crop",
            "rating": 4.6,
            "reviews": 89,
            "description": "Automatic laser pointer with multiple patterns and timer settings. Safe LED technology.",
            "features": ["Auto mode", "5 patterns", "Timer function", "USB rechargeable"],
            "health_benefits": "Encourages exercise and hunting instincts",
            "in_stock": True,
            "best_seller": False
        },
        {
            "id": "3",
            "name": "Rope Swing Perch",
            "category": "Bird Toys",
            "category_id": 3,
            "price": 15.99,
            "original_price": None,
            "image": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=500&h=500&fit=crop",
            "rating": 4.7,
            "reviews": 56,
            "description": "Natural rope swing perch for birds. Helps maintain beak and nail health.",
            "features": ["Natural materials", "Swing motion", "Multiple sizes", "Easy installation"],
            "health_benefits": "Promotes foot health and natural perching behavior",
            "in_stock": True,
            "best_seller": False
        },
        {
            "id": "4",
            "name": "Hamster Adventure Wheel",
            "category": "Small Animal",
            "category_id": 4,
            "price": 34.99,
            "original_price": 44.99,
            "image": "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=500&h=500&fit=crop",
            "rating": 4.9,
            "reviews": 143,
            "description": "Silent spinning wheel with adjustable height. Safe running surface prevents injuries.",
            "features": ["Silent operation", "Adjustable height", "Easy cleaning", "Safety design"],
            "health_benefits": "Essential for exercise and prevents obesity",
            "in_stock": True,
            "best_seller": True
        },
        {
            "id": "5",
            "name": "Floating Fish Cave",
            "category": "Aquatic Toys",
            "category_id": 5,
            "price": 22.99,
            "original_price": None,
            "image": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=500&fit=crop",
            "rating": 4.5,
            "reviews": 67,
            "description": "Decorative cave that provides hiding spots for fish. Made from aquarium-safe materials.",
            "features": ["Aquarium safe", "Natural design", "Multiple entrances", "Easy to clean"],
            "health_benefits": "Reduces stress and provides natural hiding behavior",
            "in_stock": False,
            "best_seller": False
        },
        {
            "id": "6",
            "name": "Climbing Branch Set",
            "category": "Reptile Toys",
            "category_id": 6,
            "price": 27.99,
            "original_price": 32.99,
            "image": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop",
            "rating": 4.4,
            "reviews": 34,
            "description": "Natural wood climbing branches for reptiles. Promotes natural climbing behavior.",
            "features": ["Natural wood", "Multiple branches", "Easy mounting", "Various sizes"],
            "health_benefits": "Encourages natural climbing and exploration",
            "in_stock": True,
            "best_seller": False
        },
        {
            "id": "7",
            "name": "Squeaky Duck Collection",
            "category": "Dog Toys",
            "category_id": 1,
            "price": 16.99,
            "original_price": None,
            "image": "https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&h=500&fit=crop",
            "rating": 4.3,
            "reviews": 91,
            "description": "Set of 3 squeaky rubber ducks in different sizes. Perfect for water play.",
            "features": ["Set of 3", "Water safe", "Squeaky sound", "Durable rubber"],
            "health_benefits": "Encourages play and exercise",
            "in_stock": True,
            "best_seller": False
        },
        {
            "id": "8",
            "name": "Feather Wand Deluxe",
            "category": "Cat Toys",
            "category_id": 2,
            "price": 12.99,
            "original_price": 18.99,
            "image": "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=500&h=500&fit=crop",
            "rating": 4.7,
            "reviews": 156,
            "description": "Interactive feather wand with replaceable feathers. Extends up to 3 feet.",
            "features": ["Extendable wand", "Replaceable feathers", "Natural materials", "Interactive play"],
            "health_benefits": "Promotes hunting instincts and exercise",
            "in_stock": True,
            "best_seller": True
        }
    ]
    await products_collection.insert_many(products)

async def seed_health_articles():
    """Seed health articles collection with initial data"""
    articles = [
        {
            "id": "1",
            "title": "The Importance of Mental Stimulation for Dogs",
            "excerpt": "Learn why puzzle toys and interactive feeders are essential for your dog's mental health and how they prevent behavioral issues.",
            "content": "Mental stimulation is crucial for dogs of all ages and breeds. Without adequate mental exercise, dogs can develop destructive behaviors, anxiety, and depression. Interactive puzzle toys and feeders provide the perfect solution by engaging your dog's natural problem-solving abilities while making mealtime more enriching.",
            "image": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=250&fit=crop",
            "read_time": "5 min read",
            "category": "Dog Health"
        },
        {
            "id": "2",
            "title": "Safe Toys for Small Animals: A Complete Guide",
            "excerpt": "Discover which toys are safe for hamsters, guinea pigs, and rabbits, and learn about materials to avoid.",
            "content": "Small animals have unique needs when it comes to toys and enrichment. Understanding which materials are safe and which to avoid can mean the difference between a healthy, happy pet and costly veterinary bills. This comprehensive guide covers everything from wheel selection to chew toy safety.",
            "image": "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=250&fit=crop",
            "read_time": "7 min read",
            "category": "Small Animal Health"
        },
        {
            "id": "3",
            "title": "Creating an Enriching Environment for Indoor Cats",
            "excerpt": "Tips on selecting the right toys and activities to keep your indoor cat happy, healthy, and mentally stimulated.",
            "content": "Indoor cats require special attention to their environmental enrichment needs. Without proper stimulation, they can become overweight, stressed, or develop behavioral problems. Learn how to create a stimulating environment that promotes natural behaviors and keeps your feline friend engaged.",
            "image": "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=250&fit=crop",
            "read_time": "6 min read",
            "category": "Cat Health"
        },
        {
            "id": "4",
            "title": "Bird Toy Safety: What Every Owner Should Know",
            "excerpt": "Essential safety guidelines for choosing bird toys and creating a safe, engaging environment for your feathered friends.",
            "content": "Birds are intelligent creatures that require mental and physical stimulation to thrive. However, not all toys marketed for birds are safe. Learn how to identify potential hazards and choose toys that will keep your feathered friend happy and healthy.",
            "image": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=250&fit=crop",
            "read_time": "4 min read",
            "category": "Bird Health"
        }
    ]
    await health_articles_collection.insert_many(articles)

async def seed_testimonials():
    """Seed testimonials collection with initial data"""
    testimonials = [
        {
            "id": "1",
            "name": "Sarah Johnson",
            "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
            "rating": 5,
            "text": "The puzzle feeder has been amazing for my dog Max! He loves the challenge and it's helped with his eating speed.",
            "pet_name": "Max (Golden Retriever)",
            "verified": True
        },
        {
            "id": "2",
            "name": "Mike Chen",
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            "rating": 5,
            "text": "Excellent quality toys and fast shipping. My cats absolutely love the feather wand - it's their new favorite!",
            "pet_name": "Luna & Shadow (Maine Coons)",
            "verified": True
        },
        {
            "id": "3",
            "name": "Emily Rodriguez",
            "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
            "rating": 5,
            "text": "The hamster wheel is so quiet! My little Peanut runs on it all night without disturbing anyone.",
            "pet_name": "Peanut (Syrian Hamster)",
            "verified": True
        }
    ]
    await testimonials_collection.insert_many(testimonials)