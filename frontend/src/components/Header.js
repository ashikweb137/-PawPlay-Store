import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, Heart, User } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cart } = useCart();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/health', label: 'Animal Health' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' }
  ];

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-purple-100 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="hidden md:flex justify-between items-center py-2 text-sm text-gray-600 border-b border-purple-50">
          <div className="flex items-center space-x-4">
            <span>📞 1-800-PET-TOYS</span>
            <span>📧 hello@animaltoystore.com</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Free shipping on orders over $50!</span>
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">
              🐾
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                PawPlay Store
              </h1>
              <p className="text-xs text-gray-500">Premium Animal Toys</p>
            </div>
          </Link>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search for toys, brands, animals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-purple-200 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
            <Button 
              className="ml-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6"
            >
              Search
            </Button>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Account */}
            <Button variant="ghost" size="sm" className="hidden md:flex items-center space-x-1 text-gray-700 hover:text-purple-600">
              <User className="h-4 w-4" />
              <span>Account</span>
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="sm" className="hidden md:flex items-center space-x-1 text-gray-700 hover:text-purple-600 relative">
              <Heart className="h-4 w-4" />
              <span>Wishlist</span>
              <Badge variant="secondary" className="absolute -top-2 -right-2 bg-purple-100 text-purple-700 text-xs">
                3
              </Badge>
            </Button>

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="hidden md:inline">Cart</span>
                {cart.itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-purple-600 hover:bg-purple-700 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                    {cart.itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center justify-center space-x-8 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors duration-200 hover:text-purple-600 ${
                isActiveLink(link.to)
                  ? 'text-purple-600 border-b-2 border-purple-600 pb-1'
                  : 'text-gray-700'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-100">
            {/* Mobile search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search toys..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-purple-200"
                />
              </div>
            </div>

            {/* Mobile navigation */}
            <nav className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block py-2 px-4 rounded-lg transition-colors duration-200 ${
                    isActiveLink(link.to)
                      ? 'bg-purple-100 text-purple-700 font-medium'
                      : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-purple-100 space-y-3">
                <Link
                  to="/account"
                  className="flex items-center space-x-2 py-2 px-4 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>My Account</span>
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center space-x-2 py-2 px-4 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart className="h-4 w-4" />
                  <span>Wishlist</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;