import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/slug/${slug}`);
      const productData = response.data;
      setProduct(productData);

      // Fetch related products from the same category
      const relatedResponse = await axios.get(`${API}/products?category_id=${productData.category_id}&limit=4`);
      const filtered = relatedResponse.data.filter(p => p.id !== productData.id);
      setRelatedProducts(filtered.slice(0, 3));
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Product not found");
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Link to="/products" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <Link to="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <span className="text-gray-900">{product.name}</span>
            </li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div>
              <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                {product.image_base64 ? (
                  <img 
                    src={`data:image/jpeg;base64,${product.image_base64}`}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-8xl text-gray-400">📦</span>
                )}
              </div>
              
              {/* Additional Images */}
              {product.additional_images && product.additional_images.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.additional_images.map((image, index) => (
                    <div key={index} className="h-20 bg-gray-200 rounded flex items-center justify-center">
                      <img 
                        src={`data:image/jpeg;base64,${image}`}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="text-sm text-green-600 font-medium mb-2">
                {product.category_name}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              {/* Rating */}
              {product.rating > 0 && (
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 text-lg">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(product.rating) ? "★" : "☆"}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-600 ml-2">
                    {product.rating.toFixed(1)} ({product.review_count} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-4xl font-bold text-green-600">
                  ${product.price}
                </span>
                {product.original_price && (
                  <span className="text-2xl text-gray-500 line-through">
                    ${product.original_price}
                  </span>
                )}
                {product.original_price && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                    Save ${(product.original_price - product.price).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-lg text-gray-700 mb-6">
                {product.short_description}
              </p>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features:</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex space-x-4 mb-6">
                <a 
                  href={product.affiliate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center py-3 px-6 rounded-lg text-lg font-semibold transition"
                >
                  Buy on Amazon
                </a>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-semibold transition">
                  Save for Later
                </button>
              </div>

              {/* Amazon ASIN */}
              {product.amazon_asin && (
                <div className="text-sm text-gray-600">
                  Amazon ASIN: {product.amazon_asin}
                </div>
              )}

              {/* Badges */}
              <div className="flex space-x-2 mt-4">
                {product.is_featured && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    Featured Product
                  </span>
                )}
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Amazon Affiliate
                </span>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="border-t border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h2>
            <div className="prose max-w-none text-gray-700">
              {product.description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link 
                  key={relatedProduct.id}
                  to={`/products/${relatedProduct.slug}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {relatedProduct.image_base64 ? (
                      <img 
                        src={`data:image/jpeg;base64,${relatedProduct.image_base64}`}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl text-gray-400">📦</span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-green-600 font-medium mb-1">
                      {relatedProduct.category_name}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-green-600">
                        ${relatedProduct.price}
                      </span>
                      <span className="text-green-600 font-medium">View Details →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Affiliate Disclosure:</strong> As an Amazon Associate, we earn from qualifying purchases. 
            This doesn't affect the price you pay, but it helps us maintain this website and continue providing 
            valuable product recommendations for farm animal care.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;