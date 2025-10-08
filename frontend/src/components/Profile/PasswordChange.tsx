import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {motion, AnimatePresence} from 'framer-motion';
import {
    UserIcon,
    LockClosedIcon,
    LanguageIcon,
    DeviceTabletIcon,
    CreditCardIcon,
    EyeIcon,
    EyeSlashIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import {
    UserIcon as UserIconSolid,
    LockClosedIcon as LockIconSolid,
    LanguageIcon as LanguageIconSolid,
    DeviceTabletIcon as TabletIconSolid,
    CreditCardIcon as CreditIconSolid
} from '@heroicons/react/24/solid';
import {Input} from '../ui/input';
import {useToast} from "@/hooks/use-toast.ts";

// Types
interface PasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface SidebarItem {
    id: string;
    label: string;
    icon: React.ComponentType<any>;
    activeIcon: React.ComponentType<any>;
    path: string;
}

interface FormErrors {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

interface ShowPassword {
    currentPassword: boolean;
    newPassword: boolean;
    confirmPassword: boolean;
}

// Mock user data for sidebar
const mockUser = {
    name: 'Assalom',
    email: 'user@example.com',
    avatar: undefined,
    subscriptionDays: 0
};

const PasswordChange: React.FC = () => {
    const location = useLocation();

    // Form state
    const [formData, setFormData] = useState<PasswordForm>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState<ShowPassword>({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {toast} = useToast();

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

    // Validation functions
    const validatePassword = (password: string): string | null => {
        if (!password) {
            return 'Parol kiritilishi majburiy';
        }
        if (password.length < 8) {
            return 'Parol kamida 8 ta belgidan iborat bo\'lishi kerak';
        }
        if (password.length > 20) {
            return 'Parol 20 ta belgidan oshmasligi kerak';
        }
        return null;
    };

    const validateNewPassword = (newPassword: string, currentPassword: string): string | null => {
        const basicValidation = validatePassword(newPassword);
        if (basicValidation) return basicValidation;

        if (newPassword === currentPassword) {
            return 'Yangi parol eski paroldan farq qilishi kerak';
        }
        return null;
    };

    const validateConfirmPassword = (confirmPassword: string, newPassword: string): string | null => {
        if (!confirmPassword) {
            return 'Parolni qayta kiriting';
        }
        if (confirmPassword !== newPassword) {
            return 'Parollar mos kelmaydi';
        }
        return null;
    };

    // Real-time validation
    useEffect(() => {
        const newErrors: FormErrors = {};

        // Validate current password
        if (formData.currentPassword && !formData.currentPassword) {
            newErrors.currentPassword = 'Eski parol kiritilishi majburiy';
        }

        // Validate new password
        if (formData.newPassword) {
            const newPasswordError = validateNewPassword(formData.newPassword, formData.currentPassword);
            if (newPasswordError) {
                newErrors.newPassword = newPasswordError;
            }
        }

        // Validate confirm password
        if (formData.confirmPassword) {
            const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.newPassword);
            if (confirmPasswordError) {
                newErrors.confirmPassword = confirmPasswordError;
            }
        }

        setErrors(newErrors);
    }, [formData]);

    // Handle input changes
    const handleInputChange = (field: keyof PasswordForm, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Toggle password visibility
    const togglePasswordVisibility = (field: keyof ShowPassword) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Final validation
        const currentPasswordError = !formData.currentPassword ? 'Eski parol kiritilishi majburiy' : null;
        const newPasswordError = validateNewPassword(formData.newPassword, formData.currentPassword);
        const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.newPassword);

        if (currentPasswordError || newPasswordError || confirmPasswordError) {
            setErrors({
                currentPassword: currentPasswordError || undefined,
                newPassword: newPasswordError || undefined,
                confirmPassword: confirmPasswordError || undefined
            });
            return;
        }

        setIsLoading(true);

        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulate API response - check if current password is correct
            const isCurrentPasswordCorrect = true; // This should come from API

            if (!isCurrentPasswordCorrect) {
                toast({
                    title: "Xatolik",
                    description: "Eski parol noto'g'ri kiritilgan!",
                    duration: 3000
                });
                setErrors({currentPassword: 'Noto\'g\'ri parol'});
                return;
            }

            // Success
            setShowSuccess(true);
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setErrors({});

            // Hide success message after 3 seconds
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);

        } catch (error) {
            console.error('Error changing password:', error);
            toast({
                title: "Xatolik",
                description: error.message || 'Parolni o\'zgartirishda xatolik yuz berdi!',
                duration: 3000
            })
        } finally {
            setIsLoading(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setErrors({});
        setShowPassword({
            currentPassword: false,
            newPassword: false,
            confirmPassword: false
        });
    };

    // Check if form has data
    const hasFormData = () => {
        return formData.currentPassword || formData.newPassword || formData.confirmPassword;
    };

    // Password input component
    const PasswordInput: React.FC<{
        label: string;
        value: string;
        onChange: (value: string) => void;
        onToggleVisibility: () => void;
        showPassword: boolean;
        error?: string;
        placeholder: string;
        fieldName: keyof PasswordForm;
    }> = ({label, value, onChange, onToggleVisibility, showPassword, error, placeholder, fieldName}) => (
        <div>
            <label
                htmlFor={fieldName}
                className="block text-sm font-medium text-gray-700 mb-2"
            >
                {label}
            </label>
            <div className="relative">
                <input
                    id={fieldName}
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        error ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder={placeholder}
                    aria-label={label}
                    aria-describedby={error ? `${fieldName}-error` : undefined}
                    aria-invalid={error ? 'true' : 'false'}
                />
                <button
                    type="button"
                    onClick={onToggleVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko\'rsatish'}
                >
                    {showPassword ? (
                        <EyeSlashIcon className="w-5 h-5"/>
                    ) : (
                        <EyeIcon className="w-5 h-5"/>
                    )}
                </button>
            </div>
            {error && (
                <p id={`${fieldName}-error`} className="text-red-600 text-sm mt-1" role="alert">
                    {error}
                </p>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Success notification */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{opacity: 0, y: -50}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -50}}
                        className="fixed top-4 right-4 z-50"
                    >
                        <div
                            className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3">
                            <CheckCircleIcon className="w-6 h-6"/>
                            <span className="font-medium">Parol muvaffaqiyatli o'rnatildi</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex">
                {/* Sidebar - Hidden on mobile */}
                <aside className="hidden lg:block w-80 bg-white border-r border-gray-200 min-h-screen">
                    <div className="p-6 border-b border-gray-100">
                        {/* User info */}
                        <div className="flex items-center space-x-3">
                            {mockUser.avatar ? (
                                <img
                                    src={mockUser.avatar}
                                    alt={mockUser.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                    <UserIcon className="w-7 h-7 text-gray-400"/>
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-base font-semibold text-gray-900 truncate">
                                    {mockUser.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Bepul tarif rejasiga <span
                                    className="font-medium text-orange-600">{mockUser.subscriptionDays} kun qoldi</span>
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
                                        whileHover={{x: isActive ? 0 : 4}}
                                        whileTap={{scale: 0.98}}
                                    >
                                        <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}/>
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
                            <h1 className="text-2xl font-bold text-gray-900">Parolni o'zgartirish</h1>
                            <p className="text-gray-600 mt-1">Hisobingiz xavfsizligini ta'minlash uchun parolni
                                yangilang</p>
                        </div>

                        {/* Form */}
                        <motion.form
                            onSubmit={handleSubmit}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.3}}
                        >
                            <div className="p-6 lg:p-8">
                                <div className="space-y-6">
                                    {/* Current password */}
                                    <label htmlFor="currentPassword"
                                           className="block text-sm font-medium text-gray-700">
                                        Eski parolni kiriting
                                    </label>
                                    <Input
                                        type={showPassword.currentPassword ? 'text' : 'password'}
                                        id="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                                        placeholder="Hozirgi parolingizni kiriting"
                                        className='mb-1 outline-none transition-all duration-200'
                                        aria-label="Hozirgi parolni kiriting"
                                    />

                                    {/* New password */}
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                        Yangi parolni kiriting
                                    </label>
                                    <Input
                                        type={showPassword.newPassword ? 'text' : 'password'}
                                        id="newPassword"
                                        value={formData.newPassword}
                                        onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                        placeholder="Yangi parolingizni kiriting"
                                        // className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        aria-label="Yangi parolni kiriting"
                                    />

                                    {/* Confirm password */}
                                    <label htmlFor="confirmPassword"
                                           className="block text-sm font-medium text-gray-700">
                                        Yangi parolni tasdiqlang
                                    </label>
                                    <Input
                                        type={showPassword.confirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        placeholder="Yangi parolingizni qayta kiriting"
                                        // className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        aria-label="Yangi parolni tasdiqlang"
                                    />

                                    {/* Password requirements */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-blue-800 mb-2">Parol talablari:</h4>
                                        <ul className="text-sm text-blue-700 space-y-1">
                                            <li className="flex items-center space-x-2">
                                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                                <span>Kamida 8 ta belgi</span>
                                            </li>
                                            <li className="flex items-center space-x-2">
                                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                                <span>Maksimal 20 ta belgi</span>
                                            </li>
                                            <li className="flex items-center space-x-2">
                                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                                <span>Eski paroldan farq qilishi kerak</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Form actions */}
                            <div
                                className="px-6 lg:px-8 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={!hasFormData() || isLoading}
                                    className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    type="submit"
                                    disabled={Object.keys(errors).length > 0 || !hasFormData() || isLoading}
                                    className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    O'zgarishlarni saqlash
                                </button>
                            </div>
                        </motion.form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PasswordChange;