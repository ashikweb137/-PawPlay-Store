import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append("category_id", selectedCategory);
      params.append("limit", "50");

      const response = await axios.get(`${API}/products?${params}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchProducts();
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API}/products/search?q=${encodeURIComponent(searchQuery)}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Farm Animal Products</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse our comprehensive collection of farm animal supplies and products
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-r-lg transition"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Category Filter */}
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
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
                <div className="text-sm text-green-600 font-medium mb-1">
                  {product.category_name}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.short_description}
                </p>
                
                {/* Rating */}
                {product.rating > 0 && (
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(product.rating) ? "★" : "☆"}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      ({product.review_count} reviews)
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
                    View Details
                  </Link>
                  <a 
                    href={product.affiliate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition"
                  >
                    Buy on Amazon
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl text-gray-300 mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or browse all categories.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;