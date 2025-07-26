import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const { isAuthenticated, admin, token } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_products: 0,
    total_categories: 0,
    total_blog_posts: 0,
    featured_products: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
      return;
    }
    fetchStats();
  }, [isAuthenticated, navigate]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Products",
      value: stats.total_products,
      icon: "📦",
      color: "bg-blue-500",
      link: "/admin/products"
    },
    {
      title: "Categories",
      value: stats.total_categories,
      icon: "🏷️",
      color: "bg-green-500",
      link: "/admin/categories"
    },
    {
      title: "Blog Posts",
      value: stats.total_blog_posts,
      icon: "📝",
      color: "bg-purple-500",
      link: "/admin/blog"
    },
    {
      title: "Featured Products",
      value: stats.featured_products,
      icon: "⭐",
      color: "bg-yellow-500",
      link: "/admin/products"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {admin?.username}</p>
            </div>
            <Link 
              to="/"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
            >
              View Site
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link 
              key={index}
              to={stat.link}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex items-center">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl mr-4`}>
                  {stat.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{stat.title}</h3>
                  <p className="text-3xl font-bold text-gray-700">{stat.value}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/admin/products"
              className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg transition border border-blue-200"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">📦</span>
                <div>
                  <h3 className="font-semibold text-blue-900">Manage Products</h3>
                  <p className="text-sm text-blue-700">Add, edit, or remove products</p>
                </div>
              </div>
            </Link>
            
            <Link 
              to="/admin/categories"
              className="bg-green-50 hover:bg-green-100 p-4 rounded-lg transition border border-green-200"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">🏷️</span>
                <div>
                  <h3 className="font-semibold text-green-900">Manage Categories</h3>
                  <p className="text-sm text-green-700">Organize product categories</p>
                </div>
              </div>
            </Link>
            
            <Link 
              to="/admin/blog"
              className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg transition border border-purple-200"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">📝</span>
                <div>
                  <h3 className="font-semibold text-purple-900">Manage Blog</h3>
                  <p className="text-sm text-purple-700">Create and edit blog posts</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity / Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tips */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Affiliate Marketing Tips</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-green-600 mr-2">💡</span>
                <div>
                  <h4 className="font-medium text-gray-900">Optimize Product Descriptions</h4>
                  <p className="text-sm text-gray-600">Use relevant keywords and highlight key benefits</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 mr-2">📊</span>
                <div>
                  <h4 className="font-medium text-gray-900">Track Performance</h4>
                  <p className="text-sm text-gray-600">Monitor which products generate the most clicks</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 mr-2">✍️</span>
                <div>
                  <h4 className="font-medium text-gray-900">Create Quality Content</h4>
                  <p className="text-sm text-gray-600">Write helpful blog posts that provide value</p>
                </div>
              </div>
            </div>
          </div>

          {/* Getting Started */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Set up farm animal categories</span>
                <Link to="/admin/categories" className="text-green-600 hover:text-green-700">
                  Go →
                </Link>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Add your first products</span>
                <Link to="/admin/products" className="text-green-600 hover:text-green-700">
                  Go →
                </Link>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Write helpful blog posts</span>
                <Link to="/admin/blog" className="text-green-600 hover:text-green-700">
                  Go →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Affiliate Disclaimer */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Amazon Affiliate Program</h3>
          <p className="text-sm text-yellow-700">
            Remember to always include proper affiliate disclosures on your product pages and blog posts. 
            This helps maintain transparency with your visitors and complies with FTC guidelines.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;