import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Search, Filter, Grid3x3, List, Plus, 
  Star, Eye, Package, SlidersHorizontal, 
  ShoppingBag, Tag, TrendingUp, Clock,
  SortAsc
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

// Mock mahsulotlar - kelajakda backend dan keladi
const mockProducts = [
  {
    id: 101,
    name: "iPhone 15 Pro Max",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop",
    price: 999,
    rating: 4.8,
    category: "Elektronika",
    status: "active",
    hasDiscount: false,
    createdDate: "2024-08-10",
    sales: 245
  },
  {
    id: 102,
    name: "MacBook Pro M3",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop",
    price: 1999,
    rating: 4.9,
    category: "Elektronika", 
    status: "active",
    hasDiscount: true,
    createdDate: "2024-08-12",
    sales: 189
  },
  {
    id: 103,
    name: "Samsung Galaxy S24",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop",
    price: 799,
    rating: 4.7,
    category: "Elektronika",
    status: "active",
    hasDiscount: false,
    createdDate: "2024-08-05",
    sales: 167
  },
  {
    id: 201,
    name: "Nike Air Jordan",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
    price: 150,
    rating: 4.6,
    category: "Kiyim-kechak",
    status: "active",
    hasDiscount: true,
    createdDate: "2024-08-08",
    sales: 324
  },
  {
    id: 202,
    name: "Adidas Hoodie",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop",
    price: 75,
    rating: 4.4,
    category: "Kiyim-kechak",
    status: "active",
    hasDiscount: false,
    createdDate: "2024-08-11",
    sales: 198
  },
  {
    id: 301,
    name: "Premium Coffee",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop",
    price: 25,
    rating: 4.3,
    category: "Oziq-ovqat",
    status: "active",
    hasDiscount: false,
    createdDate: "2024-08-09",
    sales: 412
  },
  {
    id: 302,
    name: "Organic Honey",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop",
    price: 18,
    rating: 4.5,
    category: "Oziq-ovqat",
    status: "inactive",
    hasDiscount: false,
    createdDate: "2024-08-06",
    sales: 89
  },
  {
    id: 401,
    name: "Football",
    image: "https://images.unsplash.com/photo-1614632537190-23e4b21d1413?w=300&h=300&fit=crop",
    price: 45,
    rating: 4.2,
    category: "Sport",
    status: "active",
    hasDiscount: false,
    createdDate: "2024-08-07",
    sales: 156
  }
];

const categories = ["Barchasi", "Elektronika", "Kiyim-kechak", "Oziq-ovqat", "Sport"];
const statusOptions = ["Barchasi", "Faol", "Nofaol"];
const sortOptions = [
  { value: "name", label: "Nom bo'yicha" },
  { value: "price-high", label: "Narx (Yuqoridan pastga)" },
  { value: "price-low", label: "Narx (Pastdan yuqoriga)" },
  { value: "rating", label: "Reyting bo'yicha" },
  { value: "sales", label: "Sotilgan miqdori" },
  { value: "newest", label: "Yangi qo'shilganlar" }
];

export default function ProductsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Barchasi");
  const [statusFilter, setStatusFilter] = useState("Barchasi");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  
  const navigate = useNavigate(); // Kelajakda implement qilinadi

  const handleGoBack = () => {
    console.log("Navigate back to /discounts/add");
    navigate('/dashboard/products/discounts/add/type');
    // navigate("/discounts/add");
  };

  const handleAddDiscount = (product) => {
    console.log(`Navigate to /add_discount with product:`, product);
    navigate('/dashboard/products/discounts/add_discount', { state: { product, source: "products" } });
    // navigate("/add_discount", { state: { product, source: "products" } });
  };

  // Mahsulotlarni filterlash va saralash
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "Barchasi" || product.category === categoryFilter;
      const matchesStatus = statusFilter === "Barchasi" || 
        (statusFilter === "Faol" && product.status === "active") ||
        (statusFilter === "Nofaol" && product.status === "inactive");
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Saralash
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-high":
          return b.price - a.price;
        case "price-low":
          return a.price - b.price;
        case "rating":
          return b.rating - a.rating;
        case "sales":
          return b.sales - a.sales;
        case "newest":
          return - new Date(a.createdDate);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, categoryFilter, statusFilter, sortBy]);

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
            Orqaga qaytish
          </Button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center hidden md:flex">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Barcha Mahsulotlar</h1>
                <p className="text-slate-600">
                  Istalgan mahsulotni tanlang va unga chegirma qo'shing
                </p>
              </div>
            </div>

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
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          variants={itemVariants}
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{mockProducts.length}</span>
            </div>
            <p className="text-slate-600 text-sm">Jami Mahsulotlar</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">
                {mockProducts.filter(p => p.status === 'active').length}
              </span>
            </div>
            <p className="text-slate-600 text-sm">Faol Mahsulotlar</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <Tag className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">
                {mockProducts.filter(p => p.hasDiscount).length}
              </span>
            </div>
            <p className="text-slate-600 text-sm">Chegirmada</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">
                {Math.round(mockProducts.reduce((sum, p) => sum + p.rating, 0) / mockProducts.length * 10) / 10}
              </span>
            </div>
            <p className="text-slate-600 text-sm">O'rtacha Reyting</p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-8"
          variants={itemVariants}
        >
          <div className="p-6">
            {/* Main Filter Row */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Mahsulotni qidiring..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                  <SelectValue placeholder="Kategoriya" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                  <SelectValue placeholder="Holat" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                  <SelectValue placeholder="Saralash" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 border-slate-200 hover:bg-slate-50"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Advanced Filters (Collapsible) */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-slate-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Narx oralig'i</label>
                      <div className="flex gap-2">
                        <Input placeholder="Min" type="number" className="h-10" />
                        <Input placeholder="Max" type="number" className="h-10" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Reyting</label>
                      <Select>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Minimum reyting" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4">4+ yulduz</SelectItem>
                          <SelectItem value="3">3+ yulduz</SelectItem>
                          <SelectItem value="2">2+ yulduz</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Chegirma holati</label>
                      <Select>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="discount">Chegirmada</SelectItem>
                          <SelectItem value="no-discount">Chegirmasiz</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Products Display */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-600">
              <span className="font-medium text-slate-900">{filteredAndSortedProducts.length}</span> ta mahsulot topildi
            </p>
            
            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-600">
                {sortOptions.find(option => option.value === sortBy)?.label}
              </span>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            <AnimatePresence>
              {filteredAndSortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
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

                    <div className="absolute top-3 left-3">
                      <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        product.status === "active" 
                          ? "bg-green-500 text-white" 
                          : "bg-red-500 text-white"
                      }`}>
                        {product.status === "active" ? "Faol" : "Nofaol"}
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className={`${viewMode === "list" ? "flex items-center justify-between h-full" : ""}`}>
                      <div className={viewMode === "list" ? "" : "mb-4"}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                            {product.category}
                          </span>
                          {viewMode === "grid" && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-slate-600">{product.rating}</span>
                            </div>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-slate-900 mb-2 line-clamp-1">
                          {product.name}
                        </h3>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl font-bold text-slate-900">${product.price}</span>
                          {viewMode === "list" && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-slate-600">{product.rating}</span>
                            </div>
                          )}
                        </div>

                        <div className="text-xs text-slate-500 mb-3">
                          {product.sales} ta sotilgan
                        </div>
                      </div>

                      <div className={`flex gap-2 ${viewMode === "list" ? "flex-col" : ""}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-200 hover:bg-slate-50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          {viewMode === "list" ? "Ko'rish" : ""}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAddDiscount(product)}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          {viewMode === "list" ? "Chegirma" : ""}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredAndSortedProducts.length === 0 && (
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
                Filter shartlariga mos mahsulot mavjud emas
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("Barchasi");
                  setStatusFilter("Barchasi");
                  setSortBy("name");
                }}
                variant="outline"
                className="border-slate-200 hover:bg-slate-50"
              >
                Barcha filtrlarni tozalash
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* 
      TODO: Kelajakda qo'shiladigan funksiyalar:
      1. Virtual scrolling yoki pagination katta ma'lumotlar uchun
      2. Bulk operations (bir nechta mahsulotni tanlash va chegirma berish)
      3. Advanced search (description, SKU, tags bo'yicha)
      4. Product comparison tool
      5. Favorites/Wishlist functionality
      6. Quick edit modals
      7. Export functionality (CSV, Excel)
      8. Print view
      9. Recently viewed products sidebar
      10. Product analytics (views, clicks, conversions)
      11. Drag & drop for bulk operations
      12. Keyboard shortcuts for power users
      13. Real-time inventory updates
      14. Price history charts
      15. Similar products suggestions
      */}
    </motion.div>
  );
}