import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Filter, Calendar, Percent, Package, 
  DollarSign, Eye, Edit, Trash2, Clock, Tag, TrendingDown, 
  Edit2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

// Mock data - kelajakda backend API dan keladi
const mockDiscounts = [
  {
    id: 1,
    productName: "Apple iPhone 15 Pro",
    productImage: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
    category: "Elektronika",
    discountType: "percentage",
    discountValue: 15,
    originalPrice: 999,
    finalPrice: 849.15,
    expiryDate: "2024-12-31",
    isActive: true,
    createdDate: "2024-08-10",
    description: "Yangi iPhone 15 Pro ga maxsus chegirma"
  },
  {
    id: 2,
    productName: "Nike Air Jordan",
    productImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    category: "Kiyim",
    discountType: "buyXgetY",
    discountValue: { x: 2, y: 1 },
    originalPrice: 150,
    finalPrice: 100,
    expiryDate: "2024-09-15",
    isActive: true,
    createdDate: "2024-08-12",
    description: "2 ta oling, 1 tasini tekin oling"
  },
  {
    id: 3,
    productName: "Samsung Smart TV 55\"",
    productImage: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop",
    category: "Elektronika",
    discountType: "priceChange",
    discountValue: 200,
    originalPrice: 1200,
    finalPrice: 1000,
    expiryDate: "2024-10-20",
    isActive: false,
    createdDate: "2024-08-05",
    description: "Smart TV ga maxsus narx chegirmasi"
  }
];

const categories = ["Barchasi", "Elektronika", "Kiyim", "Oziq-ovqat"];
const discountTypes = ["Barchasi", "Foizli", "X oling Y yuting", "Narx o'zgartirish"];

export default function Discounts() {
  const [discounts, setDiscounts] = useState(mockDiscounts);
  const [filteredDiscounts, setFilteredDiscounts] = useState(mockDiscounts);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Barchasi");
  const [discountTypeFilter, setDiscountTypeFilter] = useState("Barchasi");
  const navigate = useNavigate();

  // Filter va search funksiyasi
  useEffect(() => {
    let filtered = discounts.filter(discount => {
      const matchesSearch = discount.productName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "Barchasi" || discount.category === categoryFilter;
      
      let matchesDiscountType = true;
      if (discountTypeFilter !== "Barchasi") {
        if (discountTypeFilter === "Foizli" && discount.discountType !== "percentage") matchesDiscountType = false;
        if (discountTypeFilter === "X oling Y yuting" && discount.discountType !== "buyXgetY") matchesDiscountType = false;
        if (discountTypeFilter === "Narx o'zgartirish" && discount.discountType !== "priceChange") matchesDiscountType = false;
      }
      
      return matchesSearch && matchesCategory && matchesDiscountType;
    });
    
    setFilteredDiscounts(filtered);
  }, [searchQuery, categoryFilter, discountTypeFilter, discounts]);

  const handleAddDiscount = () => {
    navigate('/dashboard/products/discounts/add/type')
  };

  const handleViewDiscount = (id) => {
    console.log("View discount:", id);
  };

  const handleEditDiscount = (id) => {
    console.log("Edit discount:", id);
    // navigate(`/discounts/edit/${id}`);
  };

  const handleDeleteDiscount = (id) => {
    setDiscounts(prev => prev.filter(d => d.id !== id));
  };

  const getDiscountDisplay = (discount) => {
    switch(discount.discountType) {
      case "percentage":
        return `${discount.discountValue}% OFF`;
      case "buyXgetY":
        return `${discount.discountValue.x} oling ${discount.discountValue.y} yuting`;
      case "priceChange":
        return `$${discount.discountValue} tejash`;
      default:
        return "Chegirma";
    }
  };

  const getDiscountIcon = (type) => {
    switch(type) {
      case "percentage": return <Percent className="w-4 h-4" />;
      case "buyXgetY": return <Package className="w-4 h-4" />;
      case "priceChange": return <DollarSign className="w-4 h-4" />;
      default: return <Tag className="w-4 h-4" />;
    }
  };

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
      className="min-h-screen bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6"
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 items-center justify-center hidden md:flex">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Chegirmalar</h1>
                <p className="text-slate-600">Mahsulotlarga berilgan chegirmalarni boshqaring</p>
              </div>
            </div>
            
            <Button
              onClick={handleAddDiscount}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5 mr-2" />
              Chegirma Qo'shish
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-2xl font-bold text-slate-900">{discounts.length}</span>
              </div>
              <p className="text-slate-600 text-sm">Jami Chegirmalar</p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-2xl font-bold text-slate-900">{discounts.filter(d => d.isActive).length}</span>
              </div>
              <p className="text-slate-600 text-sm">Faol Chegirmalar</p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Percent className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-2xl font-bold text-slate-900">{discounts.filter(d => d.discountType === 'percentage').length}</span>
              </div>
              <p className="text-slate-600 text-sm">Foizli Chegirmalar</p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Package className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-2xl font-bold text-slate-900">{discounts.filter(d => d.discountType === 'buyXgetY').length}</span>
              </div>
              <p className="text-slate-600 text-sm">X oling Y yuting</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8"
          variants={itemVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Mahsulot nomini qidiring..."
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

            <Select value={discountTypeFilter} onValueChange={setDiscountTypeFilter}>
              <SelectTrigger className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                <SelectValue placeholder="Chegirma turi" />
              </SelectTrigger>
              <SelectContent>
                {discountTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              className="h-12 border-slate-200 hover:bg-slate-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Batafsil Filter
            </Button>
          </div>
        </motion.div>

        {/* Discounts Grid */}
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDiscounts.map((discount, index) => (
              <motion.div
                key={discount.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group"
              >
                {/* Product Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={discount.productImage} 
                    alt={discount.productName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Status Badge */}
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${
                    discount.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {discount.isActive ? 'Faol' : 'Nofaol'}
                  </div>

                  {/* Discount Badge */}
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    {getDiscountIcon(discount.discountType)}
                    {getDiscountDisplay(discount)}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">{discount.productName}</h3>
                    <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                      {discount.category}
                    </span>
                  </div>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{discount.description}</p>

                  {/* Price Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-slate-900">${discount.finalPrice}</span>
                    <span className="text-lg text-slate-500 line-through">${discount.originalPrice}</span>
                    <span className="text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-lg">
                      ${(discount.originalPrice - discount.finalPrice).toFixed(2)} tejash
                    </span>
                  </div>

                  {/* Expiry Date */}
                  <div className="flex items-center gap-2 mb-4 text-slate-500 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Amal muddati: {new Date(discount.expiryDate).toLocaleDateString('uz-UZ')}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDiscount(discount.id)}
                      className="flex-1 border-slate-200 hover:bg-slate-50"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ko'rish
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditDiscount(discount.id)}
                      className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Tahrirlash
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteDiscount(discount.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredDiscounts.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Tag className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Chegirmalar topilmadi</h3>
            <p className="text-slate-600 mb-6">Filter shartlariga mos chegirma mavjud emas</p>
            <Button 
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("Barchasi");
                setDiscountTypeFilter("Barchasi");
              }}
              variant="outline"
              className="border-slate-200 hover:bg-slate-50"
            >
              Filterni tozalash
            </Button>
          </motion.div>
        )}
      </div>

      {/* Feedback uchun kommentlar */}
      {/* 
      TODO: Kelajakda implement qilinadigan funksiyalar:
      1. Backend API integration uchun fetch funksiyalari qo'shish
      2. React Router bilan navigate funksiyalarini to'liq implement qilish  
      3. Real-time updates uchun WebSocket yoki polling qo'shish
      4. Export/Import funkciyalari (Excel, CSV)
      5. Advanced filtering va sorting options
      6. Bulk actions (bir nechta chegirmani bir vaqtda o'chirish/tahrirlash)
      7. Analytics va reporting dashboard
      8. Notification system chegirma tugashi uchun
      9. User permissions va role-based access
      10. Audit log uchun changes tracking
      */}
    </motion.div>
  );
}