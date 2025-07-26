import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🐄</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FarmMart</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-green-600 transition">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-green-600 transition">
              Products
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-green-600 transition">
              Blog
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/admin" className="text-green-600 hover:text-green-700 transition">
                  Admin
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/admin/login" className="text-gray-700 hover:text-green-600 transition">
                Admin
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              <Link to="/" className="text-gray-700 hover:text-green-600 transition py-2">
                Home
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-green-600 transition py-2">
                Products
              </Link>
              <Link to="/blog" className="text-gray-700 hover:text-green-600 transition py-2">
                Blog
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/admin" className="text-green-600 hover:text-green-700 transition py-2">
                    Admin
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-600 transition py-2 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/admin/login" className="text-gray-700 hover:text-green-600 transition py-2">
                  Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;