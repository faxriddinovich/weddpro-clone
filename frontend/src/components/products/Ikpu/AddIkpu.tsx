import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Smartphone, Utensils, Shirt, Home, Package, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProductData {
  name: string;
  price: number;
  quantity: number;
  category: string;
  description: string;
  image: string | null;
}

interface FormErrors {
  name?: string;
  price?: string;
  quantity?: string;
  category?: string;
  description?: string;
}

const categories = [
  { id: 'electronics', name: 'Electronics', icon: Smartphone, color: 'bg-blue-100 text-blue-600' },
  { id: 'food', name: 'Food', icon: Utensils, color: 'bg-green-100 text-green-600' },
  { id: 'clothes', name: 'Clothes', icon: Shirt, color: 'bg-purple-100 text-purple-600' },
  { id: 'home', name: 'Home', icon: Home, color: 'bg-orange-100 text-orange-600' },
  { id: 'other', name: 'Other', icon: Package, color: 'bg-gray-100 text-gray-600' },
];

const AddIkpu: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductData>({
    name: '',
    price: 0,
    quantity: 1,
    category: '',
    description: '',
    image: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showToast, setShowToast] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode preference
  useEffect(() => {
    const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(darkMode);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Product name must be at least 2 characters';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be at least 1';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (formData.description.length > 200) {
      newErrors.description = 'Description must be 200 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProductData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('image', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Product data:', formData);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/dashboard/products/categories'); // Yoki boshqa sahifaga yo'naltirish
      }, 2000);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Orqaga qaytish
  };

  const isFormValid = formData.name.trim() && formData.price > 0 && formData.quantity > 0 && formData.category;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen p-4 sm:p-6 md:p-8 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      {/* Header */}
      <div className={`rounded-2xl shadow-md px-6 py-3 mb-8 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCancel}
              className={`p-2 rounded-lg shadow-lg hover:shadow-xl transition-all ${
                isDarkMode ? 'bg-gray-700 text-gray-300 hover:text-white' : 'bg-white text-gray-600 hover:text-gray-800'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="space-y-1">
              <h2 className="text-md sm:text-xl md:text-2xl font-medium">
                Add New Product
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Create and manage your product inventory
              </p>
            </div>
          </div>
          <button
            type="submit"
            form="product-form"
            disabled={!isFormValid}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm sm:text-base font-medium py-2 px-4 rounded-lg shadow-md transition-colors"
          >
            Add Product
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`max-w-4xl mx-auto rounded-xl shadow-md p-4 sm:p-6 md:p-8 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h1 className="text-md sm:text-lg md:text-xl font-medium mb-2">
          Product Information
        </h1>
        <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Fill in the details below to add a new product
        </p>

        {/* Form */}
        <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : `border-gray-300 dark:border-gray-600 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-white'
                    }`
              }`}
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Price and Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-2">
                Price *
              </label>
              <div className="relative">
                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  UZS
                </span>
                <input
                  type="number"
                  id="price"
                  min="0"
                  step="0.01"
                  value={formData.price || ''}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.price
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : `border-gray-300 dark:border-gray-600 ${
                          isDarkMode ? 'bg-gray-700' : 'bg-white'
                        }`
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>
              )}
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium mb-2">
                Quantity *
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.quantity
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : `border-gray-300 dark:border-gray-600 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-white'
                      }`
                }`}
                placeholder="1"
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.quantity}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = formData.category === category.id;
                
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleInputChange('category', category.id)}
                    className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : `border-gray-200 dark:border-gray-600 hover:border-gray-300 ${
                            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                          }`
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${category.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium">{category.name}</span>
                  </button>
                );
              })}
            </div>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
              <span className={`ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                ({formData.description.length}/200)
              </span>
            </label>
            <textarea
              id="description"
              rows={4}
              maxLength={200}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                errors.description
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : `border-gray-300 dark:border-gray-600 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-white'
                    }`
              }`}
              placeholder="Enter product description (optional)"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Product Image</label>
            <div className={`border-2 border-dashed rounded-lg p-6 relative ${
              isDarkMode ? 'border-gray-600' : 'border-gray-300'
            }`}>
              {formData.image ? (
                <div className="relative">
                  <img
                    src={formData.image}
                    alt="Product preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleInputChange('image', null)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 rotate-45" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className={`w-12 h-12 mx-auto mb-4 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                  <p className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Click to upload or drag and drop
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    PNG, JPG up to 10MB
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className={`flex-1 px-6 py-3 border rounded-lg font-medium transition-colors ${
                isDarkMode 
                  ? 'border-gray-600 hover:bg-gray-700' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 z-50"
        >
          <Check className="w-5 h-5" />
          <span className="font-medium">Product added successfully!</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AddIkpu;