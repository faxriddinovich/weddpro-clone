import React, { useState } from 'react';
import { Search, Star, Download, TrendingUp, Zap, Users, Play, Settings, ShoppingBag, CreditCard, Package, MessageSquare, Truck, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Ma'lumotlar (kelajakda API dan keladi)
const CATEGORIES = [
  'Barchasi', 'Marketing', 'POS tizimlari', 'To\'lov tizimlari',
  'Omborxona', 'Ijtimoiy tarmoqlar', 'Marketplace', 'Yetkazib berish', 'CRM tizi'
];

const APPS_DATA = {
  Marketing: [
    {
      id: 1, name: 'Digital marketing', rating: 5, icon: '📱',
      color: 'from-purple-500 to-pink-500', category: 'Marketing',
      description: 'Raqamli marketing strategiyalari',
      features: ['SMM', 'SEO', 'Content'], price: 'Bepul'
    },
    {
      id: 2, name: 'Branding', rating: 5, icon: '🎨',
      color: 'from-blue-500 to-cyan-500', category: 'Marketing',
      description: 'Brendingiz uchun kreativ yechimlar',
      features: ['Logo', 'Design', 'Identity'], price: '50,000 so\'m'
    },
    {
      id: 3, name: 'SMM', rating: 5, icon: '📢',
      color: 'from-orange-500 to-red-500', category: 'Marketing',
      description: 'Ijtimoiy tarmoqlarda marketing',
      features: ['Post', 'Analytics', 'Ads'], price: '30,000 so\'m'
    }
  ],
  'POS tizimlari': [
    {
      id: 4, name: 'IIKO', rating: 5, icon: '🏪',
      color: 'from-red-500 to-pink-500', category: 'POS tizimlari',
      terminals: '500+ terminal', uptime: '99.9%', support: '24/7'
    },
    {
      id: 5, name: 'Rkeeper', rating: 5, icon: '💼',
      color: 'from-gray-700 to-gray-900', category: 'POS tizimlari',
      terminals: '300+ terminal', uptime: '99.8%', support: '24/7'
    },
    {
      id: 6, name: 'Poster', rating: 5, icon: '📊',
      color: 'from-yellow-500 to-orange-500', category: 'POS tizimlari',
      terminals: '200+ terminal', uptime: '99.7%', support: '9:00-18:00'
    }
  ],
  'To\'lov tizimlari': [
    {
      id: 7, name: 'Payme', rating: 5, icon: '💳',
      color: 'from-teal-500 to-green-500', category: 'To\'lov tizimlari',
      commission: '0.8%', processing: 'Bir zumda', methods: ['Karta', 'Balans']
    },
    {
      id: 8, name: 'Click', rating: 5, icon: '⚡',
      color: 'from-blue-500 to-indigo-500', category: 'To\'lov tizimlari',
      commission: '0.9%', processing: 'Bir zumda', methods: ['Karta', 'Click', 'HUMO']
    }
  ],
  'Omborxona': [
    {
      id: 9, name: 'Blitz', rating: 5, icon: '📦',
      color: 'from-blue-600 to-indigo-700', category: 'Omborxona',
      storage: '10,000 m²', locations: '5 ta filial', automation: '95%'
    },
    {
      id: 10, name: 'Smartup', rating: 5, icon: '🚀',
      color: 'from-green-500 to-teal-600', category: 'Omborxona',
      storage: '8,000 m²', locations: '3 ta filial', automation: '90%'
    },
    {
      id: 11, name: 'Bito', rating: 5, icon: '💎',
      color: 'from-purple-600 to-blue-600', category: 'Omborxona',
      storage: '12,000 m²', locations: '7 ta filial', automation: '98%'
    }
  ],
  'Ijtimoiy tarmoqlar': [
    {
      id: 12, name: 'Instagram', rating: 5, icon: '📷',
      color: 'from-pink-500 to-purple-600', category: 'Ijtimoiy tarmoqlar',
      followers: '1B+ foydalanuvchi', engagement: '4.2%', adTypes: ['Story', 'Feed', 'Reel']
    },
    {
      id: 13, name: 'Telegram', rating: 5, icon: '💬',
      color: 'from-blue-500 to-cyan-500', category: 'Ijtimoiy tarmoqlar',
      followers: '700M+ foydalanuvchi', engagement: '8.5%', adTypes: ['Channel', 'Group', 'Bot']
    },
    {
      id: 14, name: 'Facebook', rating: 5, icon: '👥',
      color: 'from-blue-600 to-indigo-600', category: 'Ijtimoiy tarmoqlar',
      followers: '2.9B+ foydalanuvchi', engagement: '3.7%', adTypes: ['Feed', 'Story', 'Video']
    }
  ],
  'Marketplace': [
    {
      id: 15, name: 'Uzum Market', rating: 5, icon: '🛒',
      color: 'from-green-500 to-emerald-600', category: 'Marketplace',
      products: '1M+ mahsulot', sellers: '50K+ sotuvchi', delivery: '1-3 kun'
    },
    {
      id: 16, name: 'Olcha', rating: 5, icon: '🍎',
      color: 'from-red-500 to-pink-500', category: 'Marketplace',
      products: '500K+ mahsulot', sellers: '25K+ sotuvchi', delivery: '2-5 kun'
    }
  ],
  'Yetkazib berish': [
    {
      id: 17, name: 'Yandex Delivery', rating: 5, icon: '🚚',
      color: 'from-yellow-500 to-orange-500', category: 'Yetkazib berish',
      coverage: 'Butun O\'zbekiston', speed: '30 daqiqa', tracking: 'Real-time'
    },
    {
      id: 18, name: 'BTS Express', rating: 5, icon: '📫',
      color: 'from-blue-500 to-purple-500', category: 'Yetkazib berish',
      coverage: '14 ta viloyat', speed: '2-24 soat', tracking: 'SMS/App'
    }
  ],
  'CRM tizi': [
    {
      id: 19, name: 'AmoCRM', rating: 5, icon: '👨‍💼',
      color: 'from-indigo-500 to-purple-600', category: 'CRM tizi',
      leads: 'Cheksiz', automation: '50+ jarayon', integrations: '200+'
    },
    {
      id: 20, name: 'Bitrix24', rating: 5, icon: '🎯',
      color: 'from-orange-500 to-red-500', category: 'CRM tizi',
      leads: '5000 ta', automation: '30+ jarayon', integrations: '100+'
    }
  ]
};

// Karta konfiguratsiyalari
const CARD_CONFIG = {
  Marketing: {
    buttonColor: 'purple',
    buttonIcon: Play,
    buttonText: 'Boshlash',
    fields: [
      { key: 'description', label: null, type: 'text' },
      { key: 'features', label: null, type: 'badges', color: 'purple' },
      { key: 'price', label: null, type: 'price' }
    ]
  },
  'POS tizimlari': {
    buttonColor: 'blue',
    buttonIcon: Settings,
    buttonText: 'Sozlash',
    fields: [
      { key: 'terminals', label: 'Terminallar:', type: 'info' },
      { key: 'uptime', label: 'Ishonchlilik:', type: 'info', color: 'green' },
      { key: 'support', label: 'Qo\'llab-quvvatlash:', type: 'info' }
    ]
  },
  'To\'lov tizimlari': {
    buttonColor: 'green',
    buttonIcon: CreditCard,
    buttonText: 'Ulash',
    fields: [
      { key: 'commission', label: 'Komissiya:', type: 'info', color: 'green' },
      { key: 'processing', label: 'Tezlik:', type: 'info' },
      { key: 'methods', label: null, type: 'badges', color: 'green' }
    ]
  },
  'Omborxona': {
    buttonColor: 'indigo',
    buttonIcon: Package,
    buttonText: 'Arenda qilish',
    fields: [
      { key: 'storage', label: 'Saqlash joyi:', type: 'info' },
      { key: 'locations', label: 'Filiallar:', type: 'info' },
      { key: 'automation', label: 'Avtomatlashtirish:', type: 'info', color: 'blue' }
    ]
  },
  'Ijtimoiy tarmoqlar': {
    buttonColor: 'pink',
    buttonIcon: MessageSquare,
    buttonText: 'Reklama berish',
    fields: [
      { key: 'followers', label: 'Auditoriya:', type: 'info' },
      { key: 'engagement', label: 'Engagement:', type: 'info', color: 'green' },
      { key: 'adTypes', label: null, type: 'badges', color: 'pink' }
    ]
  },
  'Marketplace': {
    buttonColor: 'emerald',
    buttonIcon: ShoppingBag,
    buttonText: 'Sotish boshlash',
    fields: [
      { key: 'products', label: 'Mahsulotlar:', type: 'info' },
      { key: 'sellers', label: 'Sotuvchilar:', type: 'info' },
      { key: 'delivery', label: 'Yetkazib berish:', type: 'info', color: 'green' }
    ]
  },
  'Yetkazib berish': {
    buttonColor: 'orange',
    buttonIcon: Truck,
    buttonText: 'Buyurtma berish',
    fields: [
      { key: 'coverage', label: 'Qamrov:', type: 'info' },
      { key: 'speed', label: 'Tezlik:', type: 'info', color: 'orange' },
      { key: 'tracking', label: 'Kuzatuv:', type: 'info' }
    ]
  },
  'CRM tizi': {
    buttonColor: 'purple',
    buttonIcon: UserCheck,
    buttonText: 'Ishlatish',
    fields: [
      { key: 'leads', label: 'Lidlar:', type: 'info' },
      { key: 'automation', label: 'Avtomatlashtirish:', type: 'info', color: 'purple' },
      { key: 'integrations', label: 'Integratsiyalar:', type: 'info' }
    ]
  }
};

const RoboMarket = () => {
  const [activeCategory, setActiveCategory] = useState('Barchasi');
  const [searchTerm, setSearchTerm] = useState('');

  // Ma'lumotlarni olish funksiyalari
  const getAllApps = () => Object.values(APPS_DATA).flat();
  
  const getFilteredApps = () => {
    let filtered = activeCategory === 'Barchasi' ? getAllApps() : APPS_DATA[activeCategory] || [];
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  };

  // Universal karta komponenti
  const UniversalCard = ({ app }) => {
    const isGeneralView = activeCategory === 'Barchasi';
    const config = CARD_CONFIG[app.category] || {};

    if (isGeneralView) {
      return (
        <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${app.color} flex items-center justify-center text-lg shadow-sm`}>
              {app.icon}
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500 fill-current" />
              <span className="text-xs font-medium text-gray-600">{app.rating}</span>
            </div>
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-3">{app.name}</h3>
          <Button variant='outline' className="w-full py-2 rounded-md text-sm font-medium transition-colors">
            O'rnatish
          </Button>
        </div>
      );
    }

    const ButtonIcon = config.buttonIcon || Settings;
    const buttonColorClass = `bg-${config.buttonColor || 'blue'}-600 hover:bg-${config.buttonColor || 'blue'}-700`;

    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-lg shadow-md`}>
            {app.icon}
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-gray-600">{app.rating}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-3">{app.name}</h3>
        
        {/* Dynamic content */}
        <div className="space-y-2 mb-4">
          {config.fields?.map((field, index) => {
            const value = app[field.key];
            if (!value) return null;

            switch (field.type) {
              case 'text':
                return <p key={index} className="text-gray-600 text-sm">{value}</p>;
              
              case 'badges':
                return (
                  <div key={index} className="flex flex-wrap gap-1">
                    {value.map((item, i) => (
                      <span 
                        key={i} 
                        className={`bg-${field.color || 'blue'}-100 text-${field.color || 'blue'}-700 px-2 py-1 rounded-full text-xs font-medium`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                );
              
              case 'price':
                return (
                  <span key={index} className="text-green-600 font-semibold text-sm">
                    {value}
                  </span>
                );
              
              case 'info':
              default:
                return (
                  <div key={index} className="flex justify-between items-center">
                    {field.label && <span className="text-gray-600 text-sm">{field.label}</span>}
                    <span className={`font-medium text-sm ${field.color ? `text-${field.color}-600` : ''}`}>
                      {value}
                    </span>
                  </div>
                );
            }
          })}
        </div>
        
        {/* Button */}
        <button className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors text-white ${buttonColorClass}`}>
          <ButtonIcon className="h-4 w-4 inline mr-1" />
          {config.buttonText || 'O\'rnatish'}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Robo market</h1>
          <p className="text-gray-600 text-sm">Biznesingiz uchun eng yaxshi ilovalar va integratsiyalar</p>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Qidirish"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Apps Grid */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {activeCategory === 'Barchasi' ? 'Barcha ilovalar' : activeCategory}
            </h2>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">
              {getFilteredApps().length} ta ilova
            </span>
          </div>

          {getFilteredApps().length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hech narsa topilmadi</h3>
              <p className="text-gray-600 text-sm">Boshqa kategoriyani tanlang yoki qidiruv so'zini o'zgartiring</p>
            </div>
          ) : (
            <div className={`grid gap-4 ${
              activeCategory === 'Barchasi' 
                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {getFilteredApps().map((app) => (
                <UniversalCard key={app.id} app={app} />
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Download className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">50K+</h3>
              <p className="text-gray-600 text-sm">O'rnatishlar</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-600 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">98%</h3>
              <p className="text-gray-600 text-sm">Mamnunlik darajasi</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-600 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">24/7</h3>
              <p className="text-gray-600 text-sm">Texnik yordam</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-600 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">10K+</h3>
              <p className="text-gray-600 text-sm">Faol foydalanuvchilar</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-blue-600 rounded-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-2">
            O'z biznesingizni keyingi darajaga olib chiqing!
          </h2>
          <p className="text-blue-100 mb-4 text-sm">
            Eng yaxshi integratsiyalar va ilovalar bilan ishlashni boshlang
          </p>
          <button className="bg-white text-blue-600 px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors duration-200">
            Batafsil ma'lumot olish
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoboMarket;