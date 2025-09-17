import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, UserIcon } from '@heroicons/react/24/solid';
import {
  LockClosedIcon,
  LanguageIcon,
  DeviceTabletIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';
import {
  UserIcon as UserIconSolid,
  LockClosedIcon as LockIconSolid,
  LanguageIcon as LanguageIconSolid,
  DeviceTabletIcon as TabletIconSolid,
  CreditCardIcon as CreditIconSolid
} from '@heroicons/react/24/solid';

// Types
interface Language {
  id: string;
  name: string;
  nativeName: string;
  code: string;
  flagUrl: string;
  isSelected: boolean;
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
    icon: CreditCardIcon,
    activeIcon: CreditIconSolid,
    path: '/admin/profile/cards'
  }
];

// Mock language data - Replace with actual data from backend
const mockLanguages: Language[] = [
  {
    id: '1',
    name: 'Uzbek',
    nativeName: 'O\'zbek',
    code: 'uz',
    flagUrl: 'https://img.icons8.com/color/48/uzbekistan.png',
    isSelected: true
  },
  {
    id: '2',
    name: 'Russian',
    nativeName: 'Русский',
    code: 'ru',
    flagUrl: 'https://img.icons8.com/color/48/russian-federation.png',
    isSelected: false
  },
  {
    id: '3',
    name: 'English',
    nativeName: 'English',
    code: 'en',
    flagUrl: 'https://img.icons8.com/color/48/usa.png',
    isSelected: false
  },
  {
    id: '4',
    name: 'Turkish',
    nativeName: 'Türkçe',
    code: 'tr',
    flagUrl: 'https://img.icons8.com/color/48/turkey.png',
    isSelected: false
  }
];

const ProfileLanguage: React.FC = () => {
  const [languages, setLanguages] = useState<Language[]>(mockLanguages);

  // Handle language selection
  const handleLanguageSelect = (selectedId: string) => {
    setLanguages(prevLanguages =>
      prevLanguages.map(lang => ({
        ...lang,
        isSelected: lang.id === selectedId
      }))
    );

    // TODO: Add backend API call to save language preference
    // TODO: Implement i18n language change
    console.log('Language changed to:', selectedId);
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

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className='flex'>
        {/* Sidebar - Hidden on mobile */}
        <aside className="hidden lg:block w-80 bg-white rounded-md border-r border-gray-200 min-h-screen">
          <div className="p-6 border-b border-gray-100">
            {/* User info */}
            <div className="flex items-center space-x-3">
              {/* {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={formData.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : ( */}
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <UserIcon className="w-7 h-7 text-gray-400" />
              </div>
              {/* )} */}
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-gray-900 truncate">
                  {'Assalom'}
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
                const isActive = item.path === location.pathname;
                const Icon = isActive ? item.activeIcon : item.icon;

                return (
                  <motion.a
                    key={item.id}
                    href={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    whileHover={{ x: isActive ? 0 : 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </motion.a>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Header */}
        <div className='px-10'>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Til sozlamalari
            </h1>
            <p className="text-gray-600">
              Ilovada ishlatiladigan tilni tanlang
            </p>
          </motion.div>

          {/* Language List */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3 relative z-10"
          >
            {languages.map((language) => (
              <motion.div
                key={language.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <button
                  onClick={() => handleLanguageSelect(language.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${language.isSelected
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Flag */}
                    <div className="flex-shrink-0">
                      <img
                        src={language.flagUrl}
                        alt={`${language.name} flag`}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        onError={(e) => {
                          // Fallback if flag image fails to load
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>

                    {/* Language Info */}
                    <div className="text-left">
                      <h3 className={`font-semibold ${language.isSelected ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                        {language.nativeName}
                      </h3>
                      <p className={`text-sm ${language.isSelected ? 'text-blue-700' : 'text-gray-500'
                        }`}>
                        {language.name}
                      </p>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  <div className={`flex-shrink-0 transition-all duration-200 ${language.isSelected ? 'opacity-100' : 'opacity-0'
                    }`}>
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckIcon className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Radio button visual */}
                  <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full border-2 transition-all duration-200 ${language.isSelected
                    ? 'opacity-0'
                    : 'border-gray-300 opacity-100'
                    }`}>
                    <div className="w-full h-full rounded-full bg-white"></div>
                  </div>
                </button>
              </motion.div>
            ))}
          </motion.div>


          {/* Info Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Eslatma:</span> Tilni o'zgartirgandan so'ng ilovani qayta yuklash talab qilinishi mumkin.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLanguage;