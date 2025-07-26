import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const fetchData = async () => {
    try {
      const [postsRes, featuredRes, categoriesRes] = await Promise.all([
        axios.get(`${API}/blog/posts?${selectedCategory ? `category_id=${selectedCategory}&` : ''}limit=20`),
        selectedCategory ? Promise.resolve({ data: [] }) : axios.get(`${API}/blog/posts?is_featured=true&limit=3`),
        axios.get(`${API}/categories`)
      ]);

      setPosts(postsRes.data);
      setFeaturedPosts(featuredRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Error fetching blog data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Farm Animal Care Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert guides, tips, and insights for better farm animal care and management
          </p>
        </div>

        {/* Featured Posts */}
        {!selectedCategory && featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Articles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <Link 
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className={`group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition ${
                    index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
                  }`}
                >
                  <div className={`relative ${index === 0 ? 'h-80' : 'h-48'} bg-gray-200 overflow-hidden`}>
                    {post.featured_image_base64 ? (
                      <img 
                        src={`data:image/jpeg;base64,${post.featured_image_base64}`}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                        <span className="text-6xl">📖</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-green-600 px-2 py-1 rounded text-sm">Featured</span>
                        {post.category_name && (
                          <span className="bg-blue-600 px-2 py-1 rounded text-sm">{post.category_name}</span>
                        )}
                      </div>
                      <h3 className={`font-bold group-hover:text-green-300 transition ${
                        index === 0 ? 'text-2xl' : 'text-lg'
                      }`}>
                        {post.title}
                      </h3>
                      <p className={`opacity-90 mt-2 ${index === 0 ? 'text-base' : 'text-sm'}`}>
                        {post.excerpt}
                      </p>
                      <div className="mt-3 text-sm opacity-75">
                        By {post.author} • {new Date(post.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 md:mb-0">
              {selectedCategory ? 'Filtered Articles' : 'All Articles'}
            </h2>
            <div className="flex items-center space-x-4">
              <label htmlFor="category-filter" className="text-sm font-medium text-gray-700">
                Filter by category:
              </label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link 
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="h-48 bg-gray-200 overflow-hidden">
                {post.featured_image_base64 ? (
                  <img 
                    src={`data:image/jpeg;base64,${post.featured_image_base64}`}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                    <span className="text-4xl">📖</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  {post.category_name && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      {post.category_name}
                    </span>
                  )}
                  {post.tags && post.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>By {post.author}</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Posts */}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl text-gray-300 mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">
              {selectedCategory 
                ? "No articles found in this category. Try selecting a different category."
                : "No blog posts are available at the moment. Check back soon for new content!"
              }
            </p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 bg-green-600 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-green-100 mb-6">
            Get the latest farm animal care tips and product recommendations delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-l-lg focus:ring-2 focus:ring-green-300 focus:outline-none"
            />
            <button className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-r-lg transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;