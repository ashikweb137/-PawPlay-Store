from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from ..models import HealthArticle, HealthArticleCreate, Testimonial, TestimonialCreate
from ..database import health_articles_collection, testimonials_collection
from datetime import datetime
import logging

router = APIRouter(prefix="/health", tags=["health"])
logger = logging.getLogger(__name__)

# Health Articles endpoints
@router.get("/articles", response_model=List[HealthArticle])
async def get_health_articles(
    category: Optional[str] = Query(None, description="Filter by category"),
    featured_only: Optional[bool] = Query(False, description="Get only featured articles"),
    limit: Optional[int] = Query(10, description="Maximum number of articles to return"),
    skip: Optional[int] = Query(0, description="Number of articles to skip")
):
    """Get health articles with optional filtering"""
    try:
        filter_query = {}
        
        if category:
            filter_query["category"] = {"$regex": category, "$options": "i"}
            
        if featured_only:
            filter_query["featured"] = True
        
        cursor = health_articles_collection.find(filter_query).sort("publish_date", -1).skip(skip).limit(limit)
        articles = await cursor.to_list(length=limit)
        
        for article in articles:
            if "_id" in article:
                del article["_id"]
        
        return [HealthArticle(**article) for article in articles]
        
    except Exception as e:
        logger.error(f"Error fetching health articles: {e}")
        raise HTTPException(status_code=500, detail="Error fetching health articles")

@router.get("/articles/{article_id}", response_model=HealthArticle)
async def get_health_article(article_id: str):
    """Get a single health article by ID"""
    try:
        article = await health_articles_collection.find_one({"id": article_id})
        if not article:
            raise HTTPException(status_code=404, detail="Article not found")
        
        if "_id" in article:
            del article["_id"]
        
        return HealthArticle(**article)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching health article {article_id}: {e}")
        raise HTTPException(status_code=500, detail="Error fetching health article")

@router.post("/articles", response_model=HealthArticle)
async def create_health_article(article: HealthArticleCreate):
    """Create a new health article"""
    try:
        article_dict = article.dict()
        
        # Generate ID if not provided
        if "id" not in article_dict:
            import uuid
            article_dict["id"] = str(uuid.uuid4())
        
        article_dict["publish_date"] = article_dict.get("publish_date", datetime.utcnow())
        
        await health_articles_collection.insert_one(article_dict)
        
        if "_id" in article_dict:
            del article_dict["_id"]
        
        return HealthArticle(**article_dict)
        
    except Exception as e:
        logger.error(f"Error creating health article: {e}")
        raise HTTPException(status_code=500, detail="Error creating health article")

@router.get("/articles/category/{category}", response_model=List[HealthArticle])
async def get_articles_by_category(category: str):
    """Get all articles in a specific category"""
    try:
        articles = await health_articles_collection.find(
            {"category": {"$regex": category, "$options": "i"}}
        ).sort("publish_date", -1).to_list(length=50)
        
        for article in articles:
            if "_id" in article:
                del article["_id"]
        
        return [HealthArticle(**article) for article in articles]
        
    except Exception as e:
        logger.error(f"Error fetching articles for category {category}: {e}")
        raise HTTPException(status_code=500, detail="Error fetching articles")

# Testimonials endpoints
@router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials(
    verified_only: Optional[bool] = Query(True, description="Get only verified testimonials"),
    limit: Optional[int] = Query(10, description="Maximum number of testimonials to return")
):
    """Get testimonials"""
    try:
        filter_query = {}
        
        if verified_only:
            filter_query["verified"] = True
        
        cursor = testimonials_collection.find(filter_query).sort("created_at", -1).limit(limit)
        testimonials = await cursor.to_list(length=limit)
        
        for testimonial in testimonials:
            if "_id" in testimonial:
                del testimonial["_id"]
        
        return [Testimonial(**testimonial) for testimonial in testimonials]
        
    except Exception as e:
        logger.error(f"Error fetching testimonials: {e}")
        raise HTTPException(status_code=500, detail="Error fetching testimonials")

@router.post("/testimonials", response_model=Testimonial)
async def create_testimonial(testimonial: TestimonialCreate):
    """Create a new testimonial"""
    try:
        testimonial_dict = testimonial.dict()
        
        # Generate ID if not provided
        if "id" not in testimonial_dict:
            import uuid
            testimonial_dict["id"] = str(uuid.uuid4())
        
        testimonial_dict["created_at"] = datetime.utcnow()
        
        await testimonials_collection.insert_one(testimonial_dict)
        
        if "_id" in testimonial_dict:
            del testimonial_dict["_id"]
        
        return Testimonial(**testimonial_dict)
        
    except Exception as e:
        logger.error(f"Error creating testimonial: {e}")
        raise HTTPException(status_code=500, detail="Error creating testimonial")

@router.get("/benefits")
async def get_health_benefits():
    """Get health benefits information"""
    try:
        benefits = [
            {
                "icon": "🧠",
                "title": "Mental Stimulation",
                "description": "Our toys are designed to challenge your pets mentally, preventing boredom and destructive behavior."
            },
            {
                "icon": "💪",
                "title": "Physical Exercise",
                "description": "Promote healthy activity levels with toys that encourage movement and play."
            },
            {
                "icon": "❤️",
                "title": "Emotional Wellbeing",
                "description": "Reduce stress and anxiety through engaging, species-appropriate enrichment activities."
            },
            {
                "icon": "🏥",
                "title": "Health Benefits",
                "description": "Many of our toys support dental health, weight management, and natural behaviors."
            }
        ]
        
        return {"benefits": benefits}
        
    except Exception as e:
        logger.error(f"Error fetching health benefits: {e}")
        raise HTTPException(status_code=500, detail="Error fetching health benefits")

@router.get("/categories")
async def get_health_categories():
    """Get available health article categories"""
    try:
        # Get distinct categories from articles
        pipeline = [
            {"$group": {"_id": "$category", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        
        categories = await health_articles_collection.aggregate(pipeline).to_list(length=50)
        
        result = []
        for cat in categories:
            if cat["_id"]:  # Skip null categories
                result.append({
                    "name": cat["_id"],
                    "count": cat["count"]
                })
        
        return {"categories": result}
        
    except Exception as e:
        logger.error(f"Error fetching health categories: {e}")
        raise HTTPException(status_code=500, detail="Error fetching health categories")