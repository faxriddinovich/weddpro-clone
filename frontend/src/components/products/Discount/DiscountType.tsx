import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Grid3x3, Package, ArrowRight, 
  Layers, ShoppingBag, Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function DiscountType() {
  const navigate = useNavigate(); // Kelajakda implement qilinadi

  const handleGoBack = () => {
    console.log("Navigate back to /discounts");
    navigate('/dashboard/products/discounts');
    // navigate("/discounts");
  };

  const handleSelectCategories = () => {
    console.log("Navigate to /discounts/add/categories");
    navigate("/dashboard/products/discounts/add/category");
    // navigate("/discounts/add/categories");
  };

  const handleSelectProducts = () => {
    console.log("Navigate to /discounts/add/products");
    navigate("/dashboard/products/discounts/add/products");
    // navigate("/discounts/add/products");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.6,
      type: "spring",
      stiffness: 100
    }
  },
  hover: { 
    scale: 1.02,
    y: -5,
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    transition: { duration: 0.2 }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-12"
          variants={itemVariants}
        >
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="mb-6 bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white/90 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Orqaga qaytish
          </Button>

          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Chegirma Yaratish
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Mahsulotlarga chegirma qo'shish uchun quyidagi usullardan birini tanlang
            </p>
          </div>
        </motion.div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Categories Option */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50 cursor-pointer group"
            onClick={handleSelectCategories}
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 p-6 mb-6">
              <div className="absolute top-4 right-4 w-16 h-16 bg-white/50 rounded-2xl flex items-center justify-center">
                <Grid3x3 className="w-8 h-8 text-purple-600" />
              </div>
              
              <div className="flex flex-col space-y-4">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                
                {/* Mini category icons */}
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-purple-200 rounded-lg flex items-center justify-center">
                    <span className="text-xs">📱</span>
                  </div>
                  <div className="w-8 h-8 bg-pink-200 rounded-lg flex items-center justify-center">
                    <span className="text-xs">👕</span>
                  </div>
                  <div className="w-8 h-8 bg-purple-200 rounded-lg flex items-center justify-center">
                    <span className="text-xs">🍕</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors duration-200">
                Kategoriyalar orqali
              </h3>
              
              <p className="text-slate-600 text-lg leading-relaxed">
                Birinchi kategoriyani tanlang, so'ngra o'sha kategoriya ichidagi mahsulotlardan birini tanlab unga chegirma bering
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Kategoriyalarni ko'rish</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Mahsulotlarni tanlash</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Chegirma berish</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <span className="text-purple-600 font-medium">Boshlash</span>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-600 transition-all duration-200">
                  <ArrowRight className="w-5 h-5 text-purple-600 group-hover:text-white" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Direct Products Option */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50 cursor-pointer group"
            onClick={handleSelectProducts}
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 p-6 mb-6">
              <div className="absolute top-4 right-4 w-16 h-16 bg-white/50 rounded-2xl flex items-center justify-center">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              
              <div className="flex flex-col space-y-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                
                {/* Mini product icons */}
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center">
                    <span className="text-xs">📱</span>
                  </div>
                  <div className="w-8 h-8 bg-cyan-200 rounded-lg flex items-center justify-center">
                    <span className="text-xs">💻</span>
                  </div>
                  <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center">
                    <span className="text-xs">⌚</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
                To'g'ridan-to'g'ri mahsulotlar
              </h3>
              
              <p className="text-slate-600 text-lg leading-relaxed">
                Barcha mahsulotlar ro'yxatini ko'ring va istalgan mahsulotni tanlab unga chegirma qo'shing
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Barcha mahsulotlar</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Qidirish va filterlash</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Tezkor chegirma</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <span className="text-blue-600 font-medium">Boshlash</span>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-all duration-200">
                  <ArrowRight className="w-5 h-5 text-blue-600 group-hover:text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Info */}
        <motion.div 
          className="text-center"
          variants={itemVariants}
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
            <p className="text-slate-600 text-lg">
              💡 <strong>Maslahat:</strong> Agar siz ma'lum kategoriya mahsulotlariga chegirma bermoqchi bo'lsangiz, 
              kategoriyalar usulini tanlang. Aks holda, to'g'ridan-to'g'ri mahsulotlar usulini ishlatishingiz mumkin.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl"></div>
      </div>

      {/* 
      TODO: Kelajakda qo'shiladigan funksiyalar:
      1. Animation lar uchun qo'shimcha micro-interactions
      2. Keyboard navigation support (Tab, Enter)
      3. Loading states navigation paytida
      4. Breadcrumb navigation
      5. Recent selections tracking
      6. Quick shortcuts (Ctrl+K kombinatsiyalari)
      */}
    </motion.div>
  );
}