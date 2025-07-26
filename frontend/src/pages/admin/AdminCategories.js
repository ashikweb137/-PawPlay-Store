import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminCategories = () => {
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: ""
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
      return;
    }
    fetchCategories();
  }, [isAuthenticated, navigate]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        await axios.put(`${API}/admin/categories/${editingCategory.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API}/admin/categories`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setShowModal(false);
      setEditingCategory(null);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Error saving category: " + (error.response?.data?.detail || error.message));
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description
    });
    setShowModal(true);
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category? This will affect all products in this category.")) return;
    
    try {
      await axios.delete(`${API}/admin/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Error deleting category: " + (error.response?.data?.detail || "Cannot delete category with existing products"));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: ""
    });
  };

  const generateSlug = (name) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
              <p className="text-gray-600">Organize your products by farm animal categories</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  resetForm();
                  setEditingCategory(null);
                  setShowModal(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
              >
                Add Category
              </button>
              <button
                onClick={() => navigate("/admin")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                {category.image_base64 ? (
                  <img 
                    src={`data:image/jpeg;base64,${category.image_base64}`}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl">🐄</span>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm mb-2">Slug: /{category.slug}</p>
                <p className="text-gray-700 mb-4">{category.description}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl text-gray-300 mb-4">🏷️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories yet</h3>
            <p className="text-gray-600 mb-4">Create categories to organize your farm animal products.</p>
            <button
              onClick={() => {
                resetForm();
                setEditingCategory(null);
                setShowModal(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition"
            >
              Create Your First Category
            </button>
          </div>
        )}

        {/* Quick Setup */}
        {categories.length === 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Quick Setup: Common Farm Animal Categories</h3>
            <p className="text-blue-700 mb-4">Here are some common categories you might want to create:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { name: "Cattle", description: "Products for cattle and cows" },
                { name: "Pigs", description: "Swine and pig supplies" },
                { name: "Chickens", description: "Poultry and chicken products" },
                { name: "Goats", description: "Goat care and supplies" },
                { name: "Sheep", description: "Sheep and lamb products" },
                { name: "Horses", description: "Equine care and supplies" }
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setFormData({
                      name: suggestion.name,
                      slug: generateSlug(suggestion.name),
                      description: suggestion.description
                    });
                    setEditingCategory(null);
                    setShowModal(true);
                  }}
                  className="text-left p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition"
                >
                  <div className="font-medium text-blue-900">{suggestion.name}</div>
                  <div className="text-sm text-blue-700">{suggestion.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingCategory(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData({
                        ...formData,
                        name,
                        slug: generateSlug(name)
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Cattle"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="cattle"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This will be used in URLs: /category/{formData.slug}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe the types of products in this category..."
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingCategory(null);
                      resetForm();
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                  >
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;