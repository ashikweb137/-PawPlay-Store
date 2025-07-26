import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Newsletter section */}
      <div className="border-b border-purple-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated on Pet Health & New Toys!</h3>
            <p className="text-gray-300 mb-6">
              Get exclusive deals, health tips, and be the first to know about new arrivals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                className="flex-1 bg-white/10 border-purple-700 text-white placeholder:text-gray-400 focus:border-purple-500"
              />
              <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-8">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center text-white font-bold">
                🐾
              </div>
              <h3 className="text-xl font-bold">PawPlay Store</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted partner in providing high-quality, safe, and engaging toys for all types of animals. 
              We're passionate about animal health and happiness.
            </p>
            <div className="flex space-x-4 pt-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-purple-800">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-purple-800">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-purple-800">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-purple-800">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/products', label: 'All Products' },
                { to: '/categories', label: 'Categories' },
                { to: '/deals', label: 'Special Deals' },
                { to: '/new-arrivals', label: 'New Arrivals' },
                { to: '/best-sellers', label: 'Best Sellers' }
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Animal health */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Animal Health</h4>
            <ul className="space-y-2">
              {[
                { to: '/health/dogs', label: 'Dog Health Tips' },
                { to: '/health/cats', label: 'Cat Wellness' },
                { to: '/health/birds', label: 'Bird Care Guide' },
                { to: '/health/small-animals', label: 'Small Animal Care' },
                { to: '/health/safety', label: 'Toy Safety Guide' }
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-purple-400" />
                <span className="text-gray-300 text-sm">1-800-PET-TOYS</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-purple-400" />
                <span className="text-gray-300 text-sm">hello@animaltoystore.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-purple-400 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  123 Pet Avenue<br />
                  Animal City, AC 12345
                </span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-purple-800/30 rounded-lg">
              <h5 className="font-medium mb-2">Customer Service Hours</h5>
              <p className="text-sm text-gray-300">
                Mon-Fri: 9AM - 8PM<br />
                Sat-Sun: 10AM - 6PM
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-purple-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2025 PawPlay Store. All rights reserved. | Made with ❤️ for animals
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/shipping" className="text-gray-400 hover:text-white transition-colors">
                Shipping Info
              </Link>
              <Link to="/returns" className="text-gray-400 hover:text-white transition-colors">
                Returns
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;