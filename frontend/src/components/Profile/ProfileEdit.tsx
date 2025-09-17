import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserIcon,
  LockClosedIcon,
  LanguageIcon,
  DeviceTabletIcon,
  CreditCardIcon,
  PencilIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import {
  UserIcon as UserIconSolid,
  LockClosedIcon as LockIconSolid,
  LanguageIcon as LanguageIconSolid,
  DeviceTabletIcon as TabletIconSolid,
  CreditCardIcon as CreditIconSolid
} from '@heroicons/react/24/solid';

// Types
interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  activeIcon: React.ComponentType<any>;
  path: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

// Mock original user data - TODO: Replace with backend data
const originalUserData: UserProfile = {
  name: 'Assalom',
  email: 'assalom@example.com',
  phone: '+998901234567',
  avatar: undefined
};

const ProfileEdit: React.FC = () => {
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = useState<UserProfile>(originalUserData);
  const [originalData] = useState<UserProfile>(originalUserData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(originalUserData.avatar);

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

  // Get active sidebar item
  const getActiveItem = () => {
    return sidebarItems.find(item => item.path === location.pathname) || sidebarItems[0];
  };

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+998\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Ism kiritilishi majburiy';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email manzil kiritilishi majburiy';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email manzil noto\'g\'ri formatda';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon raqam kiritilishi majburiy';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Telefon raqam +998 bilan boshlanishi va 13 ta raqamdan iborat bo\'lishi kerak';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Handle avatar upload
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (6MB max)
    if (file.size > 6 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        avatar: 'Rasmning hajmi 6MB dan oshmasligi kerak'
      }));
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({
        ...prev,
        avatar: 'Faqat rasm fayllari yuklash mumkin'
      }));
      return;
    }

    // Clear avatar error
    setErrors(prev => ({
      ...prev,
      avatar: undefined
    }));

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setAvatarPreview(result);
      setFormData(prev => ({
        ...prev,
        avatar: result
      }));
    };
    reader.readAsDataURL(file);
  };

  // Handle avatar click
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Profile updated:', formData);
      // Show success message or redirect
      
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData(originalData);
    setAvatarPreview(originalData.avatar);
    setErrors({});
  };

  // Check if form has changes
  const hasChanges = () => {
    return (
      formData.name !== originalData.name ||
      formData.email !== originalData.email ||
      formData.phone !== originalData.phone ||
      formData.avatar !== originalData.avatar
    );
  };

  // Uzbekistan flag component
  const UzbekistanFlag = () => (
    <div className="w-6 h-4 rounded-sm overflow-hidden border border-gray-200">
      <div className="h-1/3 bg-blue-500"></div>
      <div className="h-1/3 bg-white"></div>
      <div className="h-1/3 bg-green-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar - Hidden on mobile */}
        <aside className="hidden lg:block w-80 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6 border-b border-gray-100">
            {/* User info */}
            <div className="flex items-center space-x-3">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={formData.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <UserIcon className="w-7 h-7 text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-gray-900 truncate">
                  {formData.name || 'Assalom'}
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
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
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

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-2xl mx-auto">
            {/* Page header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Profilni tahrirlash</h1>
              <p className="text-gray-600 mt-1">Shaxsiy ma'lumotlaringizni yangilang</p>
            </div>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6 lg:p-8">
                {/* Avatar upload section */}
                <div className="flex flex-col items-center mb-8">
                  <div className="relative group">
                    <div className="relative">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-gray-200 flex items-center justify-center">
                          <UserIcon className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Edit overlay */}
                      <button
                        type="button"
                        onClick={handleAvatarClick}
                        className="absolute inset-0 rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                      >
                        <PencilIcon className="w-6 h-6 text-white" />
                      </button>
                    </div>

                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={handleAvatarClick}
                      className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-200 shadow-lg"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {errors.avatar && (
                    <p className="text-red-600 text-sm mt-2">{errors.avatar}</p>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />

                {/* Form fields */}
                <div className="space-y-6">
                  {/* Name field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Foydalanuvchi ismi
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Ismingizni kiriting"
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email manzil
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Email'ni kiriting"
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon raqami
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                        <UzbekistanFlag />
                        {/* <span className="text-gray-600 font-medium">+998</span> */}
                      </div>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          let value = e.target.value;
                          // if (!value.startsWith('')) {
                          //   value = '+998' + value.replace(/^\+998/, '');
                          // }
                          handleInputChange('phone', value);
                        }}
                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                          errors.phone ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Telefon raqamini kiriting"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Form actions */}
              <div className="px-6 lg:px-8 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={!hasChanges() || isLoading}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={!hasChanges() || isLoading}
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saqlanmoqda...
                    </>
                  ) : (
                    'O\'zgarishlarni saqlash'
                  )}
                </button>
              </div>
            </motion.form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfileEdit;