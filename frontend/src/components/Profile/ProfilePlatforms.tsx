import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GlobeAltIcon,
    ChatBubbleLeftRightIcon,
    TrashIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
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
import { UserIcon } from '@heroicons/react/24/solid';

// Types
interface Platform {
    id: string;
    name: string;
    url: string;
    type: 'website' | 'telegram';
    status: 'active' | 'inactive';
    createdAt: Date;
}

interface ConfirmationDialogProps {
    isOpen: boolean;
    platform: Platform | null;
    onConfirm: () => void;
    onCancel: () => void;
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

// Mock data
const mockPlatforms: Platform[] = [
    {
        id: '1',
        name: 'Founder',
        url: 'founder.robosite.uz',
        type: 'website',
        status: 'active',
        createdAt: new Date('2024-01-15')
    },
    {
        id: '2',
        name: 'Business Bot',
        url: '@business_helper_bot',
        type: 'telegram',
        status: 'active',
        createdAt: new Date('2024-02-10')
    },
    {
        id: '3',
        name: 'Portfolio Site',
        url: 'myportfolio.robosite.uz',
        type: 'website',
        status: 'inactive',
        createdAt: new Date('2024-01-20')
    }
];

// Confirmation Dialog Component
const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    isOpen,
    platform,
    onConfirm,
    onCancel
}) => {
    if (!isOpen || !platform) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={onCancel}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Icon */}
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                        <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                        Platformani o'chirish
                    </h3>

                    {/* Message */}
                    <p className="text-gray-600 text-center mb-6">
                        <span className="font-medium">"{platform.name}"</span> platformasini o'chirishni xohlaysizmi?
                        Bu amalni bekor qilib bo'lmaydi.
                    </p>

                    {/* Buttons */}
                    <div className="flex space-x-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150 font-medium"
                        >
                            Bekor qilish
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-150 font-medium"
                        >
                            O'chirish
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Empty State Component
const EmptyState: React.FC = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center py-16 px-4"
    >
        <div className="w-32 h-32 mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <GlobeAltIcon className="w-16 h-16 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Hozir platformalaringiz yo'q
        </h3>
        <p className="text-gray-500 text-center max-w-md">
            Birinchi web saytingiz yoki telegram botingizni yaratib,
            bu yerda ko'rishingiz mumkin bo'ladi.
        </p>
    </motion.div>
);

// Platform Card Component
const PlatformCard: React.FC<{
    platform: Platform;
    onDelete: (platform: Platform) => void;
}> = ({ platform, onDelete }) => {
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('uz-UZ', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    };

    const getPlatformIcon = () => {
        switch (platform.type) {
            case 'website':
                return <GlobeAltIcon className="w-6 h-6" />;
            case 'telegram':
                return <ChatBubbleLeftRightIcon className="w-6 h-6" />;
            default:
                return <GlobeAltIcon className="w-6 h-6" />;
        }
    };

    const getPlatformTypeLabel = () => {
        switch (platform.type) {
            case 'website':
                return 'Web sayt';
            case 'telegram':
                return 'Telegram bot';
            default:
                return 'Platform';
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 group"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${platform.type === 'website'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-green-100 text-green-600'
                        }`}>
                        {getPlatformIcon()}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {platform.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {getPlatformTypeLabel()}
                        </p>
                    </div>
                </div>

                {/* Status Badge */}
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${platform.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                    {platform.status === 'active' ? (
                        <CheckCircleIcon className="w-3 h-3" />
                    ) : (
                        <XCircleIcon className="w-3 h-3" />
                    )}
                    <span>{platform.status === 'active' ? 'Faol' : 'Nofaol'}</span>
                </div>
            </div>

            {/* URL */}
            <div className="mb-4">
                <p className="text-gray-600 break-all">
                    {platform.type === 'website' ? 'https://' : ''}{platform.url}
                </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                    Yaratilgan: {formatDate(platform.createdAt)}
                </p>

                <button
                    onClick={() => onDelete(platform)}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm font-medium transition-all duration-200 hover:bg-red-50 px-2 py-1 rounded-md"
                >
                    <TrashIcon className="w-4 h-4" />
                    <span>O'chirish</span>
                </button>
            </div>
        </motion.div>
    );
};

// Main Component
const ProfilePlatforms: React.FC = () => {
    const [platforms, setPlatforms] = useState<Platform[]>(mockPlatforms);
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        platform: Platform | null;
    }>({ isOpen: false, platform: null });

    const handleDeleteClick = (platform: Platform) => {
        setConfirmDialog({ isOpen: true, platform });
    };

    const handleConfirmDelete = () => {
        if (confirmDialog.platform) {
            setPlatforms(prev =>
                prev.filter(p => p.id !== confirmDialog.platform!.id)
            );
        }
        setConfirmDialog({ isOpen: false, platform: null });
    };

    const handleCancelDelete = () => {
        setConfirmDialog({ isOpen: false, platform: null });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="flex gap-4">
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
            
            <div className='px-2 flex-1'>
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                        Platformalar
                    </h1>
                    <p className="text-gray-600">
                        Yaratilgan web saytlar va telegram botlaringizni boshqaring
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <GlobeAltIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {platforms.filter(p => p.type === 'website').length}
                                </p>
                                <p className="text-sm text-gray-600">Web saytlar</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <ChatBubbleLeftRightIcon className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {platforms.filter(p => p.type === 'telegram').length}
                                </p>
                                <p className="text-sm text-gray-600">Telegram botlar</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {platforms.filter(p => p.status === 'active').length}
                                </p>
                                <p className="text-sm text-gray-600">Faol platformalar</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Platforms Grid */}
                {platforms.length > 0 ? (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {platforms.map((platform) => (
                                <PlatformCard
                                    key={platform.id}
                                    platform={platform}
                                    onDelete={handleDeleteClick}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <EmptyState />
                )}

                {/* Confirmation Dialog */}
                <ConfirmationDialog
                    isOpen={confirmDialog.isOpen}
                    platform={confirmDialog.platform}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            </div>
            </div>
        </div>
    );
};

export default ProfilePlatforms;