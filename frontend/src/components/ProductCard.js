import React from 'react';
import { Star, ShoppingCart, Heart, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, showQuickView = false }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-purple-100 hover:border-purple-200">
      <div className="relative">
        {/* Image */}
        <div className="aspect-square overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.bestSeller && (
              <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                Best Seller
              </Badge>
            )}
            {product.originalPrice && (
              <Badge variant="secondary" className="bg-red-100 text-red-700">
                Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="destructive">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Quick actions */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 rounded-full bg-white/90 hover:bg-white hover:text-purple-600 shadow-lg"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Heart className="h-4 w-4" />
              </Button>
              {showQuickView && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 rounded-full bg-white/90 hover:bg-white hover:text-purple-600 shadow-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <Info className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Add to cart overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white disabled:opacity-50"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Category */}
        <div className="text-sm text-purple-600 font-medium mb-1">
          {product.category}
        </div>

        {/* Product name */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-purple-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Health benefit */}
        {product.healthBenefits && (
          <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full mb-3 inline-block">
            🏥 {product.healthBenefits}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          {/* Mobile add to cart */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="md:hidden text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>

        {/* Features preview */}
        {product.features && product.features.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap gap-1">
              {product.features.slice(0, 2).map((feature, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs bg-purple-50 text-purple-700 hover:bg-purple-100"
                >
                  {feature}
                </Badge>
              ))}
              {product.features.length > 2 && (
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                  +{product.features.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;