import React, { useState, useRef, useEffect } from 'react';
import { Package, Eye, Trash2, Filter, MapPin, Calendar, ChevronDown, Clock } from 'lucide-react';
import { DeleteOutlined } from '@ant-design/icons';
import { getTop10Products } from '@/services/dashboard/ProductTopService';

interface MahsulotTop10Item {
  id: number;
  nom: string;
  sotildi: number;
  narx: number;
  holat: string;
  qolgan: number;
}

const TopProducts = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Har hafta');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [products, setProducts] = useState<MahsulotTop10Item[]>([]);
  const dropdownRef = useRef(null);

  const periods = [
    { value: 'Har kun', label: 'Har kun', icon: '📅' },
    { value: 'Har hafta', label: 'Har hafta', icon: '📊' },
    { value: 'Har oy', label: 'Har oy', icon: '📈' },
    { value: 'Har yil', label: 'Har yil', icon: '🎯' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getTop10Products();
        setProducts(data);
      } catch (err) {
        console.error('Top 10 products fetch error:', err);
      }
    };
    fetchProducts();
  }, [selectedPeriod]); // Period o'zgarmasligi uchun faqat bir marta yuklash

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'faol':
        return {
          text: 'Faol',
          bgColor: 'bg-gradient-to-r from-emerald-100 to-green-100',
          textColor: 'text-emerald-700',
          dotColor: 'bg-emerald-500',
        };
      case 'inactive':
        return {
          text: 'Nofaol',
          bgColor: 'bg-gradient-to-r from-red-100 to-rose-100',
          textColor: 'text-red-700',
          dotColor: 'bg-red-500',
        };
      default:
        return {
          text: 'Oddiy',
          bgColor: 'bg-gradient-to-r from-gray-100 to-slate-100',
          textColor: 'text-gray-700',
          dotColor: 'bg-gray-500',
        };
    }
  };

  const handleView = (product: MahsulotTop10Item) => {
    console.log('Mahsulotni ko‘rish:', product);
    // Ko‘rish logikasi bu yerda qo‘shilishi mumkin
  };

  const handleDelete = (product: MahsulotTop10Item) => {
    console.log('Mahsulotni o‘chirish:', product);
    // O‘chirish logikasi (masalan, API orqali) bu yerda qo‘shilishi mumkin
    setProducts(prev => prev.filter(p => p.id !== product.id));
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden h-[406px] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 px-6 py-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-serif text-white">Eng yaxshi mahsulotlar</h2>
              <p className="text-blue-100 text-sm">{selectedPeriod} daromad bo'yicha</p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Custom Time Period Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm backdrop-blur-sm min-w-[120px] justify-between"
              >
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span className="hidden sm:inline">{selectedPeriod}</span>
                  <span className="sm:hidden">{periods.find(p => p.value === selectedPeriod)?.icon}</span>
                </div>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full mt-1 right-0 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  <div className="p-2">
                    {periods.map((period) => (
                      <button
                        key={period.value}
                        onClick={() => {
                          setSelectedPeriod(period.value);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${selectedPeriod === period.value
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-base">{period.icon}</span>
                        <span className="flex-1 text-left">{period.label}</span>
                        {selectedPeriod === period.value && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table Header - Desktop */}
      <div className="hidden lg:block bg-gray-50 px-6 py-3 border-b border-gray-200 flex-shrink-0">
        <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
          <div className="col-span-1">ID</div>
          <div className="col-span-3">Mahsulot nomi</div>
          <div className="col-span-2">Sotildi</div>
          <div className="col-span-2">Narx</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Qolgan</div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-100">
          {products.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">Mahsulotlar yuklanmadi yoki topilmadi</p>
            </div>
          ) : (
            products.map((product, index) => {
              const statusConfig = getStatusConfig(product.holat);

              return (
                <div
                  key={product.id}
                  className="p-4 hover:bg-gray-50 transition-colors duration-200"
                >
                  {/* Desktop Layout */}
                  <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center">
                    {/* ID */}
                    <div className="col-span-1">
                      <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                    </div>

                    {/* Mahsulot nomi */}
                    <div className="col-span-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(product.nom)}&background=6366f1&color=fff&size=40`}
                            alt={product.nom}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200 shadow-sm"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{product.nom}</p>
                          <p className="text-xs text-gray-500">Mahsulot</p> {/* Kategoriya backenddan kelmasa, placeholder qo‘shildi */}
                        </div>
                      </div>
                    </div>

                    {/* Sotilgan miqdor */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold text-gray-900 text-sm">{product.sotildi}</span>
                        <span className="text-xs text-gray-500">dona</span>
                      </div>
                    </div>

                    {/* Narx */}
                    <div className="col-span-2">
                      <span className="font-bold text-green-600 text-sm">${product.narx.toLocaleString()}</span>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                        <div className={`w-1.5 h-1.5 ${statusConfig.dotColor} rounded-full`}></div>
                        {statusConfig.text}
                      </span>
                    </div>

                    {/* Qolgan */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm">{product.qolgan}</span>
                        <span className="text-xs text-gray-500">dona</span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="lg:hidden">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(product.nom)}&background=6366f1&color=fff&size=48`}
                            alt={product.nom}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{product.nom}</p>
                          <p className="text-xs text-gray-500">#{index + 1} • Mahsulot</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                        <div className={`w-1.5 h-1.5 ${statusConfig.dotColor} rounded-full`}></div>
                        {statusConfig.text}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="text-xs text-gray-500">Sotildi</p>
                          <p className="font-semibold text-gray-900 text-sm">{product.sotildi} dona</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Narx</p>
                        <p className="font-bold text-green-600 text-sm">${product.narx.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(product)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Ko‘rish
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        O‘chirish
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default TopProducts;