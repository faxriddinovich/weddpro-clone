import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserIcon,
  LockClosedIcon,
  LanguageIcon,
  DeviceTabletIcon,
  CreditCardIcon,
  ChevronDownIcon,
  ArrowRightEndOnRectangleIcon
} from '@heroicons/react/24/outline';
import { logout } from '../../services/authService';

// Types
interface User {
  name: string;
  email: string;
  avatar?: string;
  subscriptionDays: number;
  subscriptionStatus: 'trial' | 'premium' | 'expired';
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path?: string;
  action?: () => void;
  divider?: boolean;
}

// Mock user data - Replace with actual data from backend
const mockUser: User = {
  name: 'Assalom',
  email: 'user@example.com',
  avatar: undefined, // Set to image URL when available
  subscriptionDays: 0,
  subscriptionStatus: 'trial'
};

const Profile: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user] = useState<User>(mockUser); // TODO: Replace with actual user data from backend
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Menu items configuration
  const menuItems: MenuItem[] = [
    {
      id: 'edit-profile',
      label: 'Profilni tahrirlash',
      icon: UserIcon,
      path: '/admin/profile'
    },
    {
      id: 'change-password',
      label: 'Parolni o\'zgartirish',
      icon: LockClosedIcon,
      path: '/admin/profile/password'
    },
    {
      id: 'language-settings',
      label: 'Til sozlamalari',
      icon: LanguageIcon,
      path: '/admin/profile/language'
    },
    {
      id: 'platforms',
      label: 'Platformalar',
      icon: DeviceTabletIcon,
      path: '/admin/profile/platforms'
    },
    {
      id: 'my-cards',
      label: 'Mening kartalarim',
      icon: CreditCardIcon,
      path: '/admin/profile/cards'
    },
    {
      id: 'logout',
      label: 'Chiqish',
      icon: ArrowRightEndOnRectangleIcon,
      action: handleLogout,
      divider: true
    }
  ];

  // Handle logout functionality
  function handleLogout() {
    logout(); // Backend chaqiruvi bilan
    setIsOpen(false);
  }

  // Handle menu item click
  const handleMenuClick = (item: MenuItem) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
      setIsOpen(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  // Get subscription status display
  const getSubscriptionDisplay = () => {
    if (user.subscriptionStatus === 'premium') {
      return 'Premium';
    } else if (user.subscriptionStatus === 'expired') {
      return 'Muddati tugagan';
    } else {
      return `${user.subscriptionDays} kun qoldi`;
    }
  };

  // Get subscription status color
  const getSubscriptionColor = () => {
    if (user.subscriptionStatus === 'premium') {
      return 'text-green-600';
    } else if (user.subscriptionStatus === 'expired') {
      return 'text-red-600';
    } else {
      return user.subscriptionDays <= 7 ? 'text-orange-600' : 'text-blue-600';
    }
  };

  // Animation variants
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.2,
        ease: 'easeInOut'
      }
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: 'easeInOut'
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2,
        ease: 'easeOut'
      }
    })
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Avatar */}
        <div className="relative">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-gray-200 flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-blue-600" />
            </div>
          )}

          {/* Online status indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>

        {/* User Info */}
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {user.name}
          </p>
          <p className={`text-xs font-medium ${getSubscriptionColor()}`}>
            {getSubscriptionDisplay()}
          </p>
        </div>

        {/* Dropdown Arrow */}
        <ChevronDownIcon
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
            }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
            className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-[1000]"
          >
            {/* User Header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <UserIcon className="w-7 h-7 text-blue-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {user.email}
                  </p>
                  <p className={`text-xs font-medium ${getSubscriptionColor()}`}>
                    Bepul tarif rejasiga {getSubscriptionDisplay()}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={itemVariants}
                  className='px-3'
                >
                  {item.divider && <div className="border-t border-gray-100 my-2" />}

                  <button
                    onClick={() => handleMenuClick(item)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-gray-100 rounded-xl transition-colors duration-150 group ${item.id === 'logout' ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
                      }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${item.id === 'logout'
                          ? 'text-red-500 group-hover:text-red-600'
                          : 'text-gray-400 group-hover:text-gray-600'
                        }`}
                    />
                    <span className="text-sm font-medium">
                      {item.label}
                    </span>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;