import React, { useState } from 'react';
import { Edit, Trash2, Search, Filter, Plus, Grid, List, Calendar, Eye, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BannerGrid = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleAddBanner = () => {
    navigate('/dashboard/marketing/banner/add-banner');
  };

  // Static data - kelajakda backend dan keladi
  const bannersData = [
    {
      id: 1,
      title: "BUYURTMA BERISH ENDI YANADA OSONROQ",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop&auto=format",
      status: "active",
      lastModified: "13.08.2025, 18:28",
      views: 1240
    },
    {
      id: 2,
      title: "YANGI MAHSULOTLAR KATALOGI",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=200&fit=crop&auto=format",
      status: "inactive",
      lastModified: "12.08.2025, 14:15",
      views: 856
    },
    {
      id: 3,
      title: "MAXSUS CHEGIRMALAR VA AKSIYALAR",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=200&fit=crop&auto=format",
      status: "active",
      lastModified: "11.08.2025, 09:30",
      views: 2104
    },
    {
      id: 4,
      title: "BEPUL YETKAZIB BERISH XIZMATI",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop&auto=format",
      status: "active",
      lastModified: "10.08.2025, 16:45",
      views: 1673
    },
    {
      id: 5,
      title: "24/7 MIJOZLAR XIZMATI",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=200&fit=crop&auto=format",
      status: "inactive",
      lastModified: "09.08.2025, 11:20",
      views: 945
    },
    {
      id: 6,
      title: "MOBIL ILOVAMIZNI YUKLAB OLING",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop&auto=format",
      status: "active",
      lastModified: "08.08.2025, 13:10",
      views: 3421
    }
  ];

  const BannerCard = ({ banner }) => (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={banner.image}
          alt={banner.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${banner.status === 'active'
              ? 'bg-green-500 text-white'
              : 'bg-gray-500 text-white'
            }`}>
            {banner.status === 'active' ? 'Faol' : 'Faol emas'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 shadow-sm">
            <Edit2 size={16} />
          </button>
          <button className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200 shadow-sm">
            <Trash2 size={16} />
          </button>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2">
            {banner.title}
          </h3>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{banner.lastModified}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={12} />
            <span>{banner.views.toLocaleString()}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div
            className={`h-1 rounded-full transition-all duration-500 ${banner.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
              }`}
            style={{ width: `${Math.min(banner.views / 50, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 backdrop-blur-sm bg-white/80">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

              {/* Title and Stats */}
              <div className="flex items-center gap-6">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Asosiy banner
                  </h1>
                  <p className="text-gray-600 mt-1">Jami {bannersData.length} ta banner</p>
                </div>

                <div className="hidden md:flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {bannersData.filter(b => b.status === 'active').length}
                    </div>
                    <div className="text-xs text-gray-600">Faol</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-500">
                      {bannersData.filter(b => b.status === 'inactive').length}
                    </div>
                    <div className="text-xs text-gray-600">Nofaol</div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Banner qidirish..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>

                {/* Filter Button */}
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <Filter size={18} className="text-gray-600" />
                </button>

                {/* Add Button */}
                <button
                  onClick={handleAddBanner}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <Plus size={18} />
                  <span className="hidden sm:inline">Banner qo'shish</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Banners Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bannersData
            .filter(banner =>
              banner.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((banner) => (
              <BannerCard key={banner.id} banner={banner} />
            ))
          }
        </div>

        {/* Empty State */}
        {bannersData.filter(banner =>
          banner.title.toLowerCase().includes(searchTerm.toLowerCase())
        ).length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Banner topilmadi</h3>
              <p className="text-gray-500">Qidiruv so'zingizni o'zgartiring yoki yangi banner qo'shing</p>
            </div>
          )}

        {/* Footer Stats */}
        {/* <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {bannersData.reduce((sum, banner) => sum + banner.views, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Jami ko'rishlar</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {Math.round(bannersData.reduce((sum, banner) => sum + banner.views, 0) / bannersData.length).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">O'rtacha ko'rishlar</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {bannersData.filter(b => b.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Faol bannerlar</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {Math.round((bannersData.filter(b => b.status === 'active').length / bannersData.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Faollik darajasi</div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default BannerGrid;