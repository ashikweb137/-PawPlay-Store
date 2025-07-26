import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Category = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategoryData();
  }, [slug]);

  const fetchCategoryData = async () => {
    try {
      // First, find the category by slug
      const categoriesResponse = await axios.get(`${API}/categories`);
      const categoryData = categoriesResponse.data.find(cat => cat.slug === slug);
      
      if (!categoryData) {
        setError("Category not found");
        return;
      }

      setCategory(categoryData);

      // Fetch products and blog posts for this category
      const [productsRes, postsRes] = await Promise.all([
        axios.get(`${API}/products?category_id=${categoryData.id}&limit=20`),
        axios.get(`${API}/blog/posts?category_id=${categoryData.id}&limit=6`)
      ]);

      setProducts(productsRes.data);
      setBlogPosts(postsRes.data);
    } catch (error) {
      console.error("Error fetching category data:", error);
      setError("Failed to load category");
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-gray-300 mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h1>
          <p className="text-gray-600 mb-4">The category you're looking for doesn't exist.</p>
          <Link to="/products" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition">
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-800 to-blue-800 py-16">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage: category.image_base64 
              ? `url(data:image/jpeg;base64,${category.image_base64})`
              : `url('https://images.unsplash.com/photo-1454179083322-198bb4daae41?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxmYXJtJTIwYW5pbWFsc3xlbnwwfHx8fDE3NTM1NTE1Mjh8MA&ixlib=rb-4.1.0&q=85')`
          }}
        ></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {category.name} Products
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            </li>
            <li><span className="text-gray-400">/</span></li>
            <li>
              <Link to="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
            </li>
            <li><span className="text-gray-400">/</span></li>
            <li><span className="text-gray-900">{category.name}</span></li>
          </ol>
        </nav>

        {/* Products Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {category.name} Products ({products.length})
            </h2>
            <Link 
              to="/products" 
              className="text-green-600 hover:text-green-700 font-medium"
            >
              View All Products →
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {product.image_base64 ? (
                      <img 
                        src={`data:image/jpeg;base64,${product.image_base64}`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl text-gray-400">📦</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.short_description}
                    </p>
                    
                    {/* Rating */}
                    {product.rating > 0 && (
                      <div className="flex items-center mb-3">
                        <div className="flex text-yellow-400 text-sm">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < Math.floor(product.rating) ? "★" : "☆"}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-600 ml-1">
                          ({product.review_count})
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-green-600">
                          ${product.price}
                        </span>
                        {product.original_price && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.original_price}
                          </span>
                        )}
                      </div>
                      {product.is_featured && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Link 
                        to={`/products/${product.slug}`}
                        className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-sm font-medium transition"
                      >
                        Details
                      </Link>
                      <a 
                        href={product.affiliate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition"
                      >
                        Buy Now
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <div className="text-6xl text-gray-300 mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Yet</h3>
              <p className="text-gray-600">Products for this category will be added soon.</p>
            </div>
          )}
        </section>

        {/* Blog Posts Section */}
        {blogPosts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Related Guides & Articles
              </h2>
              <Link 
                to="/blog" 
                className="text-green-600 hover:text-green-700 font-medium"
              >
                View All Articles →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <Link 
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <div className="h-40 bg-gray-200">
                    {post.featured_image_base64 ? (
                      <img 
                        src={`data:image/jpeg;base64,${post.featured_image_base64}`}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                        <span className="text-2xl">📖</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-green-600 transition mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {post.excerpt.substring(0, 120)}...
                    </p>
                    <div className="text-xs text-gray-500">
                      By {post.author} • {new Date(post.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-green-600 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Need Help Choosing {category.name} Products?
          </h2>
          <p className="text-green-100 mb-6">
            Browse our complete collection or read our expert guides for more information.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/products" 
              className="bg-white text-green-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition"
            >
              Browse All Products
            </Link>
            <Link 
              to="/blog" 
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-6 py-3 rounded-lg font-semibold transition"
            >
              Read Our Guides
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;