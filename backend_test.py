#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Farm Animal Products Affiliate Marketing Website
Tests all backend functionality including authentication, CRUD operations, search, and filtering.
"""

import requests
import json
import uuid
from datetime import datetime
import sys
import os

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading backend URL: {e}")
        return None

BASE_URL = get_backend_url()
if not BASE_URL:
    print("❌ Could not get backend URL from frontend/.env")
    sys.exit(1)

API_URL = f"{BASE_URL}/api"
print(f"🔗 Testing backend at: {API_URL}")

# Global variables for testing
admin_token = None
test_category_id = None
test_product_id = None
test_blog_post_id = None

def make_request(method, endpoint, data=None, headers=None, params=None):
    """Helper function to make HTTP requests with proper error handling"""
    url = f"{API_URL}{endpoint}"
    
    if headers is None:
        headers = {"Content-Type": "application/json"}
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, headers=headers, params=params, timeout=30)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, headers=headers, timeout=30)
        elif method.upper() == "PUT":
            response = requests.put(url, json=data, headers=headers, timeout=30)
        elif method.upper() == "DELETE":
            response = requests.delete(url, headers=headers, timeout=30)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")
        
        return response
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed for {method} {endpoint}: {e}")
        return None

def test_api_root():
    """Test the API root endpoint"""
    print("\n🧪 Testing API Root Endpoint...")
    
    response = make_request("GET", "/")
    if response and response.status_code == 200:
        data = response.json()
        if "message" in data:
            print("✅ API root endpoint working")
            return True
        else:
            print("❌ API root endpoint returned unexpected response")
            return False
    else:
        print(f"❌ API root endpoint failed: {response.status_code if response else 'No response'}")
        return False

def test_admin_registration():
    """Test admin registration"""
    print("\n🧪 Testing Admin Registration...")
    
    admin_data = {
        "username": f"farmadmin_{uuid.uuid4().hex[:8]}",
        "email": f"admin_{uuid.uuid4().hex[:8]}@farmanimals.com",
        "password": "SecureFarmPassword123!"
    }
    
    response = make_request("POST", "/admin/register", admin_data)
    if response and response.status_code == 200:
        data = response.json()
        if "admin_id" in data and "message" in data:
            print("✅ Admin registration successful")
            return admin_data
        else:
            print("❌ Admin registration returned unexpected response")
            return None
    else:
        print(f"❌ Admin registration failed: {response.status_code if response else 'No response'}")
        if response:
            print(f"Response: {response.text}")
        return None

def test_admin_login(admin_data):
    """Test admin login and get JWT token"""
    print("\n🧪 Testing Admin Login...")
    
    login_data = {
        "username": admin_data["username"],
        "password": admin_data["password"]
    }
    
    response = make_request("POST", "/admin/login", login_data)
    if response and response.status_code == 200:
        data = response.json()
        if "access_token" in data and "admin" in data:
            global admin_token
            admin_token = data["access_token"]
            print("✅ Admin login successful")
            print(f"🔑 JWT Token obtained: {admin_token[:20]}...")
            return True
        else:
            print("❌ Admin login returned unexpected response")
            return False
    else:
        print(f"❌ Admin login failed: {response.status_code if response else 'No response'}")
        if response:
            print(f"Response: {response.text}")
        return False

def test_protected_endpoint():
    """Test accessing a protected endpoint with JWT token"""
    print("\n🧪 Testing Protected Endpoint Access...")
    
    if not admin_token:
        print("❌ No admin token available")
        return False
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {admin_token}"
    }
    
    response = make_request("GET", "/admin/stats", headers=headers)
    if response and response.status_code == 200:
        data = response.json()
        if all(key in data for key in ["total_products", "total_categories", "total_blog_posts", "featured_products"]):
            print("✅ Protected endpoint access successful")
            print(f"📊 Dashboard stats: {data}")
            return True
        else:
            print("❌ Protected endpoint returned unexpected response")
            return False
    else:
        print(f"❌ Protected endpoint access failed: {response.status_code if response else 'No response'}")
        return False

def test_categories_crud():
    """Test Categories CRUD operations"""
    print("\n🧪 Testing Categories CRUD Operations...")
    
    if not admin_token:
        print("❌ No admin token available")
        return False
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {admin_token}"
    }
    
    # Test GET categories (public endpoint)
    print("📋 Testing GET categories...")
    response = make_request("GET", "/categories")
    if response and response.status_code == 200:
        categories = response.json()
        print(f"✅ Retrieved {len(categories)} categories")
    else:
        print("❌ Failed to get categories")
        return False
    
    # Test CREATE category (protected)
    print("📝 Testing CREATE category...")
    category_data = {
        "name": "Dairy Cattle Equipment",
        "slug": f"dairy-cattle-{uuid.uuid4().hex[:8]}",
        "description": "Essential equipment for dairy cattle farming and milk production",
        "image_base64": None
    }
    
    response = make_request("POST", "/admin/categories", category_data, headers)
    if response and response.status_code == 200:
        category = response.json()
        global test_category_id
        test_category_id = category["id"]
        print(f"✅ Category created successfully: {category['name']}")
    else:
        print(f"❌ Failed to create category: {response.status_code if response else 'No response'}")
        return False
    
    # Test GET specific category
    print("🔍 Testing GET specific category...")
    response = make_request("GET", f"/categories/{test_category_id}")
    if response and response.status_code == 200:
        category = response.json()
        print(f"✅ Retrieved category: {category['name']}")
    else:
        print("❌ Failed to get specific category")
        return False
    
    # Test UPDATE category (protected)
    print("✏️ Testing UPDATE category...")
    updated_data = {
        "name": "Premium Dairy Cattle Equipment",
        "slug": category_data["slug"],
        "description": "Premium equipment for modern dairy cattle farming operations",
        "image_base64": None
    }
    
    response = make_request("PUT", f"/admin/categories/{test_category_id}", updated_data, headers)
    if response and response.status_code == 200:
        updated_category = response.json()
        print(f"✅ Category updated successfully: {updated_category['name']}")
    else:
        print("❌ Failed to update category")
        return False
    
    print("✅ Categories CRUD operations completed successfully")
    return True

def test_products_crud():
    """Test Products CRUD operations"""
    print("\n🧪 Testing Products CRUD Operations...")
    
    if not admin_token or not test_category_id:
        print("❌ Missing admin token or test category")
        return False
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {admin_token}"
    }
    
    # Test GET products (public endpoint)
    print("📋 Testing GET products...")
    response = make_request("GET", "/products")
    if response and response.status_code == 200:
        products = response.json()
        print(f"✅ Retrieved {len(products)} products")
    else:
        print("❌ Failed to get products")
        return False
    
    # Test CREATE product (protected)
    print("📝 Testing CREATE product...")
    product_data = {
        "name": "Premium Milking Machine System",
        "slug": f"milking-machine-{uuid.uuid4().hex[:8]}",
        "description": "Advanced automated milking system for dairy farms with high-capacity processing and hygiene controls",
        "short_description": "Professional milking machine for dairy operations",
        "category_id": test_category_id,
        "price": 2499.99,
        "original_price": 2999.99,
        "affiliate_url": "https://amazon.com/dp/B08EXAMPLE123",
        "amazon_asin": "B08EXAMPLE123",
        "features": [
            "Automated milking process",
            "Stainless steel construction",
            "Easy cleaning system",
            "High-capacity pump"
        ],
        "rating": 4.7,
        "review_count": 156,
        "is_featured": True
    }
    
    response = make_request("POST", "/admin/products", product_data, headers)
    if response and response.status_code == 200:
        product = response.json()
        global test_product_id
        test_product_id = product["id"]
        print(f"✅ Product created successfully: {product['name']}")
    else:
        print(f"❌ Failed to create product: {response.status_code if response else 'No response'}")
        if response:
            print(f"Response: {response.text}")
        return False
    
    # Test GET specific product
    print("🔍 Testing GET specific product...")
    response = make_request("GET", f"/products/{test_product_id}")
    if response and response.status_code == 200:
        product = response.json()
        print(f"✅ Retrieved product: {product['name']}")
    else:
        print("❌ Failed to get specific product")
        return False
    
    # Test UPDATE product (protected)
    print("✏️ Testing UPDATE product...")
    update_data = {
        "price": 2299.99,
        "rating": 4.8,
        "review_count": 178
    }
    
    response = make_request("PUT", f"/admin/products/{test_product_id}", update_data, headers)
    if response and response.status_code == 200:
        updated_product = response.json()
        print(f"✅ Product updated successfully: Price ${updated_product['price']}")
    else:
        print("❌ Failed to update product")
        return False
    
    print("✅ Products CRUD operations completed successfully")
    return True

def test_product_search_and_filtering():
    """Test product search and filtering functionality"""
    print("\n🧪 Testing Product Search and Filtering...")
    
    # Test product search
    print("🔍 Testing product search...")
    search_params = {"q": "milking", "limit": 10}
    response = make_request("GET", "/products/search", params=search_params)
    if response and response.status_code == 200:
        search_results = response.json()
        print(f"✅ Search returned {len(search_results)} results for 'milking'")
        
        # Verify search results contain the search term
        found_relevant = False
        for product in search_results:
            if "milking" in product["name"].lower() or "milking" in product["description"].lower():
                found_relevant = True
                break
        
        if found_relevant:
            print("✅ Search results are relevant")
        else:
            print("⚠️ Search results may not be fully relevant")
    else:
        print("❌ Product search failed")
        return False
    
    # Test category filtering
    print("🏷️ Testing category filtering...")
    if test_category_id:
        filter_params = {"category_id": test_category_id, "limit": 20}
        response = make_request("GET", "/products", params=filter_params)
        if response and response.status_code == 200:
            filtered_products = response.json()
            print(f"✅ Category filter returned {len(filtered_products)} products")
            
            # Verify all products belong to the specified category
            all_correct_category = all(p["category_id"] == test_category_id for p in filtered_products)
            if all_correct_category:
                print("✅ All filtered products belong to correct category")
            else:
                print("❌ Some filtered products don't belong to specified category")
        else:
            print("❌ Category filtering failed")
            return False
    
    # Test featured products filtering
    print("⭐ Testing featured products filtering...")
    featured_params = {"is_featured": True, "limit": 10}
    response = make_request("GET", "/products", params=featured_params)
    if response and response.status_code == 200:
        featured_products = response.json()
        print(f"✅ Featured filter returned {len(featured_products)} products")
        
        # Verify all products are featured
        all_featured = all(p["is_featured"] for p in featured_products)
        if all_featured:
            print("✅ All filtered products are featured")
        else:
            print("❌ Some filtered products are not featured")
    else:
        print("❌ Featured products filtering failed")
        return False
    
    print("✅ Product search and filtering completed successfully")
    return True

def test_blog_crud():
    """Test Blog Posts CRUD operations"""
    print("\n🧪 Testing Blog Posts CRUD Operations...")
    
    if not admin_token:
        print("❌ No admin token available")
        return False
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {admin_token}"
    }
    
    # Test GET blog posts (public endpoint)
    print("📋 Testing GET blog posts...")
    response = make_request("GET", "/blog/posts")
    if response and response.status_code == 200:
        posts = response.json()
        print(f"✅ Retrieved {len(posts)} blog posts")
    else:
        print("❌ Failed to get blog posts")
        return False
    
    # Test CREATE blog post (protected)
    print("📝 Testing CREATE blog post...")
    post_data = {
        "title": "Best Practices for Dairy Cattle Nutrition",
        "slug": f"dairy-nutrition-{uuid.uuid4().hex[:8]}",
        "content": "Proper nutrition is essential for healthy dairy cattle and optimal milk production. This comprehensive guide covers feeding schedules, nutritional requirements, and supplement recommendations for dairy operations of all sizes.",
        "excerpt": "Learn essential nutrition practices for dairy cattle to maximize health and milk production.",
        "author": "Dr. Sarah Johnson",
        "category_id": test_category_id,
        "tags": ["dairy", "nutrition", "cattle", "farming"],
        "is_published": True,
        "is_featured": True,
        "meta_title": "Dairy Cattle Nutrition Guide - Best Practices",
        "meta_description": "Complete guide to dairy cattle nutrition with expert tips for optimal health and milk production."
    }
    
    response = make_request("POST", "/admin/blog/posts", post_data, headers)
    if response and response.status_code == 200:
        post = response.json()
        global test_blog_post_id
        test_blog_post_id = post["id"]
        print(f"✅ Blog post created successfully: {post['title']}")
    else:
        print(f"❌ Failed to create blog post: {response.status_code if response else 'No response'}")
        if response:
            print(f"Response: {response.text}")
        return False
    
    # Test GET specific blog post
    print("🔍 Testing GET specific blog post...")
    response = make_request("GET", f"/blog/posts/{test_blog_post_id}")
    if response and response.status_code == 200:
        post = response.json()
        print(f"✅ Retrieved blog post: {post['title']}")
    else:
        print("❌ Failed to get specific blog post")
        return False
    
    # Test UPDATE blog post (protected)
    print("✏️ Testing UPDATE blog post...")
    updated_post_data = {
        "title": "Advanced Dairy Cattle Nutrition Strategies",
        "slug": post_data["slug"],
        "content": post_data["content"] + " Updated with latest research findings.",
        "excerpt": "Advanced nutrition strategies for dairy cattle with latest research insights.",
        "author": post_data["author"],
        "category_id": test_category_id,
        "tags": ["dairy", "nutrition", "cattle", "farming", "advanced"],
        "is_published": True,
        "is_featured": True,
        "meta_title": "Advanced Dairy Cattle Nutrition - Latest Strategies",
        "meta_description": post_data["meta_description"]
    }
    
    response = make_request("PUT", f"/admin/blog/posts/{test_blog_post_id}", updated_post_data, headers)
    if response and response.status_code == 200:
        updated_post = response.json()
        print(f"✅ Blog post updated successfully: {updated_post['title']}")
    else:
        print("❌ Failed to update blog post")
        return False
    
    print("✅ Blog Posts CRUD operations completed successfully")
    return True

def test_dashboard_statistics():
    """Test dashboard statistics endpoint"""
    print("\n🧪 Testing Dashboard Statistics...")
    
    if not admin_token:
        print("❌ No admin token available")
        return False
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {admin_token}"
    }
    
    response = make_request("GET", "/admin/stats", headers=headers)
    if response and response.status_code == 200:
        stats = response.json()
        required_fields = ["total_products", "total_categories", "total_blog_posts", "featured_products"]
        
        if all(field in stats for field in required_fields):
            print("✅ Dashboard statistics retrieved successfully")
            print(f"📊 Statistics:")
            print(f"   - Total Products: {stats['total_products']}")
            print(f"   - Total Categories: {stats['total_categories']}")
            print(f"   - Total Blog Posts: {stats['total_blog_posts']}")
            print(f"   - Featured Products: {stats['featured_products']}")
            
            # Verify statistics make sense
            if (stats['total_products'] >= 0 and stats['total_categories'] >= 0 and 
                stats['total_blog_posts'] >= 0 and stats['featured_products'] >= 0):
                print("✅ Statistics values are valid")
                return True
            else:
                print("❌ Statistics contain invalid values")
                return False
        else:
            print("❌ Dashboard statistics missing required fields")
            return False
    else:
        print(f"❌ Dashboard statistics failed: {response.status_code if response else 'No response'}")
        return False

def test_error_handling():
    """Test error handling for various scenarios"""
    print("\n🧪 Testing Error Handling...")
    
    # Test accessing protected endpoint without token
    print("🔒 Testing protected endpoint without authentication...")
    response = make_request("GET", "/admin/stats")
    if response and response.status_code == 401:
        print("✅ Correctly rejected unauthenticated request")
    else:
        print("❌ Failed to reject unauthenticated request")
        return False
    
    # Test invalid login credentials
    print("🔐 Testing invalid login credentials...")
    invalid_login = {
        "username": "nonexistent_user",
        "password": "wrong_password"
    }
    response = make_request("POST", "/admin/login", invalid_login)
    if response and response.status_code == 401:
        print("✅ Correctly rejected invalid credentials")
    else:
        print("❌ Failed to reject invalid credentials")
        return False
    
    # Test getting non-existent resource
    print("🔍 Testing non-existent resource...")
    fake_id = str(uuid.uuid4())
    response = make_request("GET", f"/products/{fake_id}")
    if response and response.status_code == 404:
        print("✅ Correctly returned 404 for non-existent resource")
    else:
        print("❌ Failed to return 404 for non-existent resource")
        return False
    
    print("✅ Error handling tests completed successfully")
    return True

def cleanup_test_data():
    """Clean up test data created during testing"""
    print("\n🧹 Cleaning up test data...")
    
    if not admin_token:
        print("❌ No admin token available for cleanup")
        return
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {admin_token}"
    }
    
    # Delete test blog post
    if test_blog_post_id:
        response = make_request("DELETE", f"/admin/blog/posts/{test_blog_post_id}", headers=headers)
        if response and response.status_code == 200:
            print("✅ Test blog post deleted")
        else:
            print("⚠️ Failed to delete test blog post")
    
    # Delete test product
    if test_product_id:
        response = make_request("DELETE", f"/admin/products/{test_product_id}", headers=headers)
        if response and response.status_code == 200:
            print("✅ Test product deleted")
        else:
            print("⚠️ Failed to delete test product")
    
    # Delete test category
    if test_category_id:
        response = make_request("DELETE", f"/admin/categories/{test_category_id}", headers=headers)
        if response and response.status_code == 200:
            print("✅ Test category deleted")
        else:
            print("⚠️ Failed to delete test category")

def main():
    """Main test execution function"""
    print("🚀 Starting Comprehensive Backend API Testing")
    print("=" * 60)
    
    test_results = []
    
    # Test API root
    test_results.append(("API Root", test_api_root()))
    
    # Test admin authentication flow
    admin_data = test_admin_registration()
    if admin_data:
        test_results.append(("Admin Registration", True))
        login_success = test_admin_login(admin_data)
        test_results.append(("Admin Login", login_success))
        
        if login_success:
            test_results.append(("Protected Endpoint Access", test_protected_endpoint()))
        else:
            test_results.append(("Protected Endpoint Access", False))
    else:
        test_results.append(("Admin Registration", False))
        test_results.append(("Admin Login", False))
        test_results.append(("Protected Endpoint Access", False))
    
    # Test CRUD operations
    test_results.append(("Categories CRUD", test_categories_crud()))
    test_results.append(("Products CRUD", test_products_crud()))
    test_results.append(("Product Search & Filtering", test_product_search_and_filtering()))
    test_results.append(("Blog Posts CRUD", test_blog_crud()))
    
    # Test dashboard statistics
    test_results.append(("Dashboard Statistics", test_dashboard_statistics()))
    
    # Test error handling
    test_results.append(("Error Handling", test_error_handling()))
    
    # Clean up test data
    cleanup_test_data()
    
    # Print final results
    print("\n" + "=" * 60)
    print("🏁 FINAL TEST RESULTS")
    print("=" * 60)
    
    passed = 0
    failed = 0
    
    for test_name, result in test_results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name:<30} {status}")
        if result:
            passed += 1
        else:
            failed += 1
    
    print("-" * 60)
    print(f"Total Tests: {len(test_results)}")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    print(f"Success Rate: {(passed/len(test_results)*100):.1f}%")
    
    if failed == 0:
        print("\n🎉 ALL TESTS PASSED! Backend API is working correctly.")
        return True
    else:
        print(f"\n⚠️ {failed} test(s) failed. Please check the issues above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)