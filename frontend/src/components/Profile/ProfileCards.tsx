import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckIcon, 
  UserIcon,
  XMarkIcon,
  TrashIcon,
  CreditCardIcon 
} from '@heroicons/react/24/solid';
import {
  LockClosedIcon,
  LanguageIcon,
  DeviceTabletIcon,
  CreditCardIcon as CreditCardOutline,
} from '@heroicons/react/24/outline';
import {
  UserIcon as UserIconSolid,
  LockClosedIcon as LockIconSolid,
  LanguageIcon as LanguageIconSolid,
  DeviceTabletIcon as TabletIconSolid,
  CreditCardIcon as CreditIconSolid
} from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

// Types
interface Card {
  id: string;
  cardNumber: string;
  expiryDate: string;
  cardholderName: string;
  cardType: 'uzcard' | 'humo';
  createdAt: Date;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  activeIcon: React.ComponentType<any>;
  path: string;
}

// Sidebar configuration
const sidebarItems: SidebarItem[] = [
  {
    id: 'profile',
    label: 'Profilni tahrirlash',
    icon: UserIcon,
    activeIcon: UserIconSolid,
    path: '/admin/profile'
  },
  {
    id: 'password',
    label: 'Parolni o\'zgartirish',
    icon: LockClosedIcon,
    activeIcon: LockIconSolid,
    path: '/admin/profile/password'
  },
  {
    id: 'language',
    label: 'Til sozlamalari',
    icon: LanguageIcon,
    activeIcon: LanguageIconSolid,
    path: '/admin/profile/language'
  },
  {
    id: 'platforms',
    label: 'Platformalar',
    icon: DeviceTabletIcon,
    activeIcon: TabletIconSolid,
    path: '/admin/profile/platforms'
  },
  {
    id: 'cards',
    label: 'Mening kartalarim',
    icon: CreditCardOutline,
    activeIcon: CreditIconSolid,
    path: '/admin/profile/cards'
  }
];

// Card logos mapping
const cardLogos = {
  uzcard: 'https://img.icons8.com/color/48/uzbekistan.png', // UzCard logo placeholder
  humo: 'https://img.icons8.com/color/48/uzbekistan.png' // Humo logo placeholder
};

const ProfileCards: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cardholderName: '',
    cvv: '',
    cardType: 'uzcard' as 'uzcard' | 'humo'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate

  // Load cards from localStorage on component mount
  useEffect(() => {
    const savedCards = localStorage.getItem('userCards');
    if (savedCards) {
      setCards(JSON.parse(savedCards));
    }
  }, []);

  // Save cards to localStorage whenever cards change
  useEffect(() => {
    localStorage.setItem('userCards', JSON.stringify(cards));
  }, [cards]);

  // Validate card number based on type
  const validateCardNumber = (cardNumber: string, cardType: 'uzcard' | 'humo'): boolean => {
    const cleaned = cardNumber.replace(/\s/g, '');
    
    if (cardType === 'uzcard') {
      // UzCard usually starts with 8600 and has 16 digits
      return /^8600\d{12}$/.test(cleaned);
    } else if (cardType === 'humo') {
      // Humo usually starts with 9860 and has 16 digits
      return /^9860\d{12}$/.test(cleaned);
    }
    
    return false;
  };

  // Validate expiry date
  const validateExpiryDate = (expiryDate: string): boolean => {
    const [month, year] = expiryDate.split('/');
    if (!month || !year) return false;
    
    const monthNum = parseInt(month);
    const yearNum = parseInt(`20${year}`);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    if (monthNum < 1 || monthNum > 12) return false;
    if (yearNum < currentYear || (yearNum === currentYear && monthNum <= currentMonth)) return false;
    
    return true;
  };

  // Format card number with spaces
  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };

  // Format expiry date
  const formatExpiryDate = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 2) return cleaned;
    return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
      if (formattedValue.replace(/\s/g, '').length <= 16) {
        setFormData(prev => ({ ...prev, [field]: formattedValue }));
      }
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
      if (formattedValue.length <= 5) {
        setFormData(prev => ({ ...prev, [field]: formattedValue }));
      }
    } else if (field === 'cvv') {
      if (value.length <= 3 && /^\d*$/.test(value)) {
        setFormData(prev => ({ ...prev, [field]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Karta raqami kiritilishi shart';
    } else if (!validateCardNumber(formData.cardNumber, formData.cardType)) {
      newErrors.cardNumber = `${formData.cardType.toUpperCase()} karta raqami noto'g'ri`;
    }

    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'Yaroqlilik muddati kiritilishi shart';
    } else if (!validateExpiryDate(formData.expiryDate)) {
      newErrors.expiryDate = 'Yaroqlilik muddati noto\'g\'ri yoki o\'tgan';
    }

    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Karta egasining ismi kiritilishi shart';
    }

    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV kodi kiritilishi shart';
    } else if (formData.cvv.length !== 3) {
      newErrors.cvv = 'CVV kod 3 ta raqamdan iborat bo\'lishi kerak';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newCard: Card = {
      id: Date.now().toString(),
      cardNumber: formData.cardNumber,
      expiryDate: formData.expiryDate,
      cardholderName: formData.cardholderName,
      cardType: formData.cardType,
      createdAt: new Date()
    };

    setCards(prev => [...prev, newCard]);
    
    // Reset form
    setFormData({
      cardNumber: '',
      expiryDate: '',
      cardholderName: '',
      cvv: '',
      cardType: 'uzcard'
    });
    
    setIsSheetOpen(false);
  };

  // Handle card deletion
  const handleDeleteCard = (cardId: string) => {
    setCards(prev => prev.filter(card => card.id !== cardId));
  };

  // Get last 4 digits of card
  const getLastFourDigits = (cardNumber: string): string => {
    return cardNumber.replace(/\s/g, '').slice(-4);
  };

  // Get masked card number
  const getMaskedCardNumber = (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\s/g, '');
    const lastFour = cleaned.slice(-4);
    return `•••• •••• •••• ${lastFour}`;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    }
  };

  const sheetVariants = {
    hidden: { x: '100%' },
    visible: {
      x: 0,
      transition: {
        type: 'tween',
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:block w-80 bg-white border-r border-gray-200">
        <div className="p-6 border-b border-gray-100">
          {/* User info */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <UserIcon className="w-7 h-7 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-gray-900 truncate">
                Assalom
              </p>
              <p className="text-sm text-gray-500">
                Bepul tarif rejasiga <span className="font-medium text-orange-600">0 kun qoldi</span>
              </p>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-4">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = item.id === 'cards'; // Set cards as active for this page
              const Icon = isActive ? item.activeIcon : item.icon;

              return (
                <motion.button
                  key={item.id}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  whileHover={{ x: isActive ? 0 : 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mening kartalarim
            </h1>
            <p className="text-gray-600 text-lg">
              To'lov kartalarini boshqaring
            </p>
          </motion.div>

          {/* Cards List or Empty State */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {cards.length === 0 ? (
              // Empty State
              <motion.div
                variants={cardVariants}
                className="text-center py-16"
              >
                <div className="mx-auto w-64 h-48 mb-8">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    {/* Delivery person illustration */}
                    <g>
                      {/* Background boxes */}
                      <rect x="300" y="200" width="60" height="40" rx="4" fill="#FCD34D" opacity="0.3"/>
                      <rect x="320" y="220" width="60" height="40" rx="4" fill="#FCD34D" opacity="0.5"/>
                      
                      {/* Person */}
                      <circle cx="200" cy="100" r="25" fill="#F3F4F6"/>
                      <path d="M200 125 C210 125, 220 135, 220 150 L220 200 C220 210, 210 220, 200 220 L200 220 C190 220, 180 210, 180 200 L180 150 C180 135, 190 125, 200 125" fill="#60A5FA"/>
                      <rect x="185" y="140" width="30" height="20" rx="2" fill="#FCD34D"/>
                      
                      {/* Arms */}
                      <ellipse cx="160" cy="160" rx="8" ry="25" fill="#F3F4F6" transform="rotate(-20 160 160)"/>
                      <ellipse cx="240" cy="160" rx="8" ry="25" fill="#F3F4F6" transform="rotate(20 240 160)"/>
                      
                      {/* Package in hand */}
                      <rect x="225" y="140" width="35" height="25" rx="3" fill="#FCD34D"/>
                      <path d="M225 152.5 L260 152.5" stroke="#EF4444" strokeWidth="2" strokeDasharray="2,2"/>
                      
                      {/* Question mark */}
                      <circle cx="350" cy="80" r="20" fill="#EF4444"/>
                      <text x="350" y="90" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">?</text>
                    </g>
                  </svg>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Sizning kredit kartalaringiz yo'q
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  To'lov qilish uchun kredit kartangizni qo'shing va xaridlarni osonlashtiring
                </p>
                
                <button
                  onClick={() => setIsSheetOpen(true)}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <CreditCardIcon className="w-5 h-5 mr-2" />
                  Yangi karta qo'shish
                </button>
              </motion.div>
            ) : (
              // Cards Grid
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">
                    Jami {cards.length} ta karta
                  </p>
                  <button
                    onClick={() => setIsSheetOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    <CreditCardIcon className="w-5 h-5 mr-2" />
                    Yangi karta qo'shish
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cards.map((card) => (
                    <motion.div
                      key={card.id}
                      variants={cardVariants}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="relative"
                    >
                      {/* Card */}
                      <div className="bg-gradient-to-br from-gray-900 to-gray-700 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white transform translate-x-16 -translate-y-16"></div>
                          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white transform -translate-x-12 translate-y-12"></div>
                        </div>

                        {/* Card Header */}
                        <div className="flex justify-between items-start mb-8 relative z-10">
                          <div className="flex items-center space-x-2">
                            {card.cardType === 'uzcard' && (
                              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                                <span className="text-xs font-bold">UZ</span>
                              </div>
                            )}
                            {card.cardType === 'humo' && (
                              <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                                <span className="text-xs font-bold">HU</span>
                              </div>
                            )}
                          </div>
                          
                          <button
                            onClick={() => handleDeleteCard(card.id)}
                            className="p-1 hover:bg-white/20 rounded transition-colors duration-200"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Card Number */}
                        <div className="mb-6 relative z-10">
                          <p className="text-lg font-mono tracking-wider">
                            {card.cardNumber}
                          </p>
                        </div>

                        {/* Card Footer */}
                        <div className="flex justify-between items-end relative z-10">
                          <div>
                            <p className="text-xs text-gray-300 mb-1">CARD HOLDER</p>
                            <p className="text-sm font-medium">
                              {card.cardholderName.toUpperCase()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-300 mb-1">EXPIRES</p>
                            <p className="text-sm font-medium">{card.expiryDate}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Add Card Sheet */}
      <AnimatePresence>
        {isSheetOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSheetOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Sheet */}
            <motion.div
              variants={sheetVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Sheet Header */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => setIsSheetOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-600" />
                  </button>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Orqaga
                  </h2>
                  <div className="w-9"></div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Karta raqami
                    </label>
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      placeholder="Kartani kiriting"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                        errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.cardNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                    )}
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yaroqlilik muddati
                    </label>
                    <input
                      type="text"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      placeholder="MM / YY"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                        errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.expiryDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                    )}
                  </div>

                  {/* Cardholder Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Karta egasining ismi
                    </label>
                    <input
                      type="text"
                      value={formData.cardholderName}
                      onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                      placeholder="Ismingizni kiriting"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                        errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.cardholderName && (
                      <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>
                    )}
                  </div>

                  {/* CVV */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      placeholder="123"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                        errors.cvv ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.cvv && (
                      <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                    )}
                  </div>

                  {/* Card Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Karta turi
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {['uzcard', 'humo'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, cardType: type as 'uzcard' | 'humo' }))}
                          className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                            formData.cardType === type
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <div className={`w-8 h-8 rounded flex items-center justify-center ${
                              type === 'uzcard' ? 'bg-blue-600' : 'bg-green-600'
                            }`}>
                              <span className="text-xs font-bold text-white">
                                {type === 'uzcard' ? 'UZ' : 'HU'}
                              </span>
                            </div>
                            <span className="text-sm font-medium">
                              {type === 'uzcard' ? 'UzCard' : 'Humo'}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      Men{' '}
                      <span className="text-blue-600 underline">Ommaviy taklif</span>
                      {' '}va{' '}
                      <span className="text-blue-600 underline">Maxfiylik siyosatini</span>
                      {' '}o'qib chiqdim va rozlik bildiraman
                    </label>
                  </div>

                  {/* Info */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <CheckIcon className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-green-800 font-medium">
                          Hozirda faqat ushbu kartalarini bog'lashingiz mumkin
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                              <span className="text-xs font-bold text-white">UZ</span>
                            </div>
                            <span className="text-sm text-green-700">UzCard</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
                              <span className="text-xs font-bold text-white">HU</span>
                            </div>
                            <span className="text-sm text-green-700">Humo</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-6">
                    <button
                      type="button"
                      onClick={() => setIsSheetOpen(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Qo'shish
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileCards;