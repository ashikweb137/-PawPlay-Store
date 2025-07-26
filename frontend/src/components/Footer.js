import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">🐄</span>
              </div>
              <span className="text-xl font-bold">FarmMart</span>
            </div>
            <p className="text-gray-400 max-w-md">
              Your trusted source for quality farm animal products and supplies. 
              We help farmers and animal lovers find the best products through 
              carefully curated affiliate partnerships.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              <p>As an Amazon Associate, we earn from qualifying purchases.</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/category/cattle" className="text-gray-400 hover:text-white transition">
                  Cattle Supplies
                </Link>
              </li>
              <li>
                <Link to="/category/poultry" className="text-gray-400 hover:text-white transition">
                  Poultry Products
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition">
                  Blog & Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Farm Animals */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Farm Animals</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/category/cattle" className="text-gray-400 hover:text-white transition">
                  Cattle
                </Link>
              </li>
              <li>
                <Link to="/category/pigs" className="text-gray-400 hover:text-white transition">
                  Pigs
                </Link>
              </li>
              <li>
                <Link to="/category/chickens" className="text-gray-400 hover:text-white transition">
                  Chickens
                </Link>
              </li>
              <li>
                <Link to="/category/goats" className="text-gray-400 hover:text-white transition">
                  Goats
                </Link>
              </li>
              <li>
                <Link to="/category/sheep" className="text-gray-400 hover:text-white transition">
                  Sheep
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 FarmMart. All rights reserved. Built with affiliate marketing in mind.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;