import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Search, Grid3x3, List, Plus, 
  Package, Star, Eye, ShoppingBag, Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

// Mock kategoriyalar - kelajakda backend dan keladi
const mockCategories = [
  {
    id: 1,
    name: "Elektronika",
    icon: "📱",
    productCount: 124,
    color: "from-blue-500 to-purple-600",
    bgColor: "bg-blue-100"
  },
  {
    id: 2,
    name: "Kiyim-kechak",
    icon: "👕",
    productCount: 89,
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-100"
  },
  {
    id: 3,
    name: "Oziq-ovqat",
    icon: "🍕",
    productCount: 67,
    color: "from-orange-500 to-red-600",
    bgColor: "bg-orange-100"
  },
  {
    id: 4,
    name: "Sport",
    icon: "⚽",
    productCount: 45,
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-100"
  },
  {
    id: 5,
    name: "Kitoblar",
    icon: "📚",
    productCount: 78,
    color: "from-indigo-500 to-blue-600",
    bgColor: "bg-indigo-100"
  },
  {
    id: 6,
    name: "Uy-ro'zg'or",
    icon: "🏠",
    productCount: 92,
    color: "from-teal-500 to-cyan-600",
    bgColor: "bg-teal-100"
  }
];

// Mock mahsulotlar - kelajakda backend dan keladi
const mockProducts = {
  1: [ // Elektronika
    {
      id: 101,
      name: "iPhone 15 Pro Max",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop",
      price: 999,
      rating: 4.8,
      status: "active",
      hasDiscount: false
    },
    {
      id: 102,
      name: "MacBook Pro M3",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop",
      price: 1999,
      rating: 4.9,
      status: "active",
      hasDiscount: true
    },
    {
      id: 103,
      name: "Samsung Galaxy S24",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop",
      price: 799,
      rating: 4.7,
      status: "active",
      hasDiscount: false
    }
  ],
  2: [ // Kiyim-kechak
    {
      id: 201,
      name: "Nike Air Jordan",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
      price: 150,
      rating: 4.6,
      status: "active",
      hasDiscount: true
    },
    {
      id: 202,
      name: "Adidas Hoodie",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop",
      price: 75,
      rating: 4.4,
      status: "active",
      hasDiscount: false
    }
  ],
  3: [ // Oziq-ovqat
    {
      id: 301,
      name: "Premium Coffee",
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop",
      price: 25,
      rating: 4.3,
      status: "active",
      hasDiscount: false
    }
  ]
};

export default function CategoryProducts() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid yoki list
  
  const navigate = useNavigate(); // Kelajakda implement qilinadi

  const handleGoBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    } else {
      console.log("Navigate back to /discounts/add");
        navigate('/dashboard/products/discounts/add/type');
      // navigate("/discounts/add");
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchQuery(""); // Reset search when switching category
  };

  const handleAddDiscount = (product) => {
    console.log(`Navigate to /add_discount with product:`, product);
    navigate('/dashboard/products/discounts/add_discount', { state: { product, source: "categories" } });
    // navigate("/add_discount", { state: { product, source: "categories" } });
  };

  const currentProducts = selectedCategory ? mockProducts[selectedCategory.id] || [] : [];
  const filteredProducts = currentProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    },
    hover: { 
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          variants={itemVariants}
        >
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="mb-6 bg-white border-slate-200 hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {selectedCategory ? selectedCategory.name : "Orqaga qaytish"}
          </Button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center hidden md:flex">
                {selectedCategory ? (
                  <span className="text-2xl">{selectedCategory.icon}</span>
                ) : (
                  <Grid3x3 className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                  {selectedCategory ? selectedCategory.name : "Kategoriyalar"}
                </h1>
                <p className="text-slate-600">
                  {selectedCategory 
                    ? `${selectedCategory.name} kategoriyasidagi mahsulotlarga chegirma qo'shing`
                    : "Kategoriyani tanlang va mahsulotlarga chegirma bering"
                  }
                </p>
              </div>
            </div>

            {selectedCategory && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={viewMode === "grid" ? "default" : "outline"}
                  onClick={() => setViewMode("grid")}
                  className="h-10 w-10 p-0"
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "list" ? "default" : "outline"}
                  onClick={() => setViewMode("list")}
                  className="h-10 w-10 p-0"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            /* Categories Grid */
            <motion.div
              key="categories"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden cursor-pointer group"
                    onClick={() => handleCategorySelect(category)}
                  >
                    <div className={`h-24 bg-gradient-to-br ${category.color} relative overflow-hidden`}>
                      <div className="absolute top-4 right-4 text-4xl opacity-20">
                        {category.icon}
                      </div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="text-2xl mb-1">{category.icon}</div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors duration-200">
                        {category.name}
                      </h3>
                      
                      <div className="flex items-center justify-between text-slate-600">
                        <span>{category.productCount} ta mahsulot</span>
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-purple-100 transition-colors duration-200">
                          <Package className="w-4 h-4 group-hover:text-purple-600" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* Products View */
            <motion.div
              key="products"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Search Bar */}
              <motion.div 
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8"
                variants={itemVariants}
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    placeholder={`${selectedCategory.name} ichidan qidiring...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </div>
              </motion.div>

              {/* Products Grid/List */}
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group ${
                      viewMode === "list" ? "flex" : ""
                    }`}
                  >
                    <div className={`relative overflow-hidden ${
                      viewMode === "list" ? "w-32 h-32 flex-shrink-0" : "h-48"
                    }`}>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      
                      {product.hasDiscount && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                          Chegirmada
                        </div>
                      )}
                    </div>

                    <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                      <div className={`${viewMode === "list" ? "flex items-center justify-between h-full" : ""}`}>
                        <div className={viewMode === "list" ? "" : "mb-4"}>
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">{product.name}</h3>
                          
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl font-bold text-slate-900">${product.price}</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-slate-600 text-sm">{product.rating}</span>
                            </div>
                          </div>

                          <div className={`flex items-center gap-2 ${viewMode === "list" ? "" : "mb-4"}`}>
                            <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                              product.status === "active" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {product.status === "active" ? "Faol" : "Nofaol"}
                            </div>
                            
                            {product.hasDiscount && (
                              <div className="px-2 py-1 rounded-lg text-xs font-medium bg-orange-100 text-orange-800">
                                Chegirmada
                              </div>
                            )}
                          </div>
                        </div>

                        <div className={`flex gap-2 ${viewMode === "list" ? "flex-col" : ""}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-200 hover:bg-slate-50"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ko'rish
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAddDiscount(product)}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Chegirma
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Empty State */}
              {filteredProducts.length === 0 && (
                <motion.div 
                  className="text-center py-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Mahsulot topilmadi</h3>
                  <p className="text-slate-600 mb-6">
                    {searchQuery 
                      ? `"${searchQuery}" bo'yicha natija topilmadi`
                      : `${selectedCategory.name} kategoriyasida mahsulot mavjud emas`
                    }
                  </p>
                  {searchQuery && (
                    <Button 
                      onClick={() => setSearchQuery("")}
                      variant="outline"
                      className="border-slate-200 hover:bg-slate-50"
                    >
                      Qidiruvni tozalash
                    </Button>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 
      TODO: Kelajakda qo'shiladigan funksiyalar:
      1. Infinite scroll yoki pagination mahsulotlar uchun
      2. Advanced filtering (narx oralig'i, reyting, holat)
      3. Bulk selection va bulk discount operations  
      4. Drag & drop categoriyalarni reorder qilish uchun
      5. Category management (CRUD operations)
      6. Real-time search suggestions
      7. Recently viewed products tracking
      8. Product comparison functionality
      9. Quick preview modal mahsulot ma'lumotlari uchun
      10. Export category/product data
      */}
    </motion.div>
  );
}