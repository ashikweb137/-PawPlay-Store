import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, postsRes] = await Promise.all([
          axios.get(`${API}/products?is_featured=true&limit=6`),
          axios.get(`${API}/categories`),
          axios.get(`${API}/blog/posts?is_featured=true&limit=3`)
        ]);

        setFeaturedProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setFeaturedPosts(postsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-r from-green-800 to-blue-800">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1569858241634-5aee6e47091a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwzfHxmYXJtJTIwYW5pbWFsc3xlbnwwfHx8fDE3NTM1NTE1Mjh8MA&ixlib=rb-4.1.0&q=85')`
          }}
        ></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Premium Farm Animal Products & Supplies
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover the best products for your farm animals. From cattle to chickens, 
              we've curated the finest supplies to keep your livestock healthy and productive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/products" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition inline-block text-center"
              >
                Shop Products
              </Link>
              <Link 
                to="/blog" 
                className="border-2 border-white text-white hover:bg-white hover:text-green-800 px-8 py-4 rounded-lg text-lg font-semibold transition inline-block text-center"
              >
                Read Our Guides
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Farm Animal
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find specialized products for each type of farm animal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link 
                key={category.id}
                to={`/category/${category.slug}`}
                className="group bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <div className="h-48 bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                  {category.image_base64 ? (
                    <img 
                      src={`data:image/jpeg;base64,${category.image_base64}`}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl">🐄</span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mt-2">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our top-rated farm animal products, carefully selected for quality and value
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
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
                <div className="p-6">
                  <div className="text-sm text-green-600 font-medium mb-2">
                    {product.category_name}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {product.short_description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-600">
                        ${product.price}
                      </span>
                      {product.original_price && (
                        <span className="text-lg text-gray-500 line-through">
                          ${product.original_price}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <Link 
                        to={`/products/${product.slug}`}
                        className="text-green-600 hover:text-green-700 font-medium"
                      >
                        View Details
                      </Link>
                      <a 
                        href={product.affiliate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                      >
                        Buy on Amazon
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/products" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition inline-block"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Latest Farm Guides
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Expert advice and tips for better farm animal care
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <Link 
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition"
                >
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {post.featured_image_base64 ? (
                      <img 
                        src={`data:image/jpeg;base64,${post.featured_image_base64}`}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl text-gray-400">📖</span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 text-sm text-gray-500">
                      By {post.author} • {new Date(post.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link 
                to="/blog" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition inline-block"
              >
                Read More Guides
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Start Shopping for Your Farm Today
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of farmers who trust our product recommendations
          </p>
          <Link 
            to="/products" 
            className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition inline-block"
          >
            Browse All Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;