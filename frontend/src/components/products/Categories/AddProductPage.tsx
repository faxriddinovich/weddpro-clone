import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, Image, Check, X, Save, Plus, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// interface FormData {
//   name: string;
//   description: string;
//   isActive: boolean;
//   image: File | null;
// }

const AddProductPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isActive: true,
        image: null
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate(); // Assuming you're using react-router for navigation

    // Rasm yuklash
    const handleImageUpload = (file) => {
        // Fayl hajmi tekshirish (5MB)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('Fayl hajmi 5MB dan oshmasligi kerak!', 'error');
            return;
        }

        // Fayl turi tekshirish
        if (!file.type.startsWith('image/')) {
            showNotification('Faqat rasm fayllarini yuklash mumkin!', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setFormData(prev => ({
                ...prev,
                image: {
                    file: file,
                    preview: e.target.result,
                    name: file.name
                }
            }));
            setErrors(prev => ({ ...prev, image: '' }));
        };
        reader.readAsDataURL(file);
    };

    // Drag & Drop
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleImageUpload(files[0]);
        }
    };

    // Input o'zgarishlari
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // Validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Kategoriya nomi kiritilishi shart!';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Kategoriya nomi kamida 2 ta belgidan iborat bo\'lishi kerak!';
        }

        if (!formData.image) {
            newErrors.image = 'Kategoriya uchun rasm yuklash shart!';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Notification ko'rsatish
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    // Form submit
    const handleSubmit = async (action = 'save') => {
        if (!validateForm()) {
            showNotification('Iltimos, barcha majburiy maydonlarni to\'ldiring!', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            const newCategory = {
                id: Date.now(),
                name: formData.name.trim(),
                description: formData.description.trim(),
                isActive: formData.isActive,
                image: formData.image,
                productsCount: 0,
                createdDate: new Date().toISOString(),
                color: '#3B82F6' // Default rang
            };

            console.log('Yangi kategoriya:', newCategory);

            if (action === 'save') {
                showNotification('Kategoriya muvaffaqiyatli qo\'shildi!', 'success');
                setTimeout(() => {
                    // Kategoriyalar ro'yxatiga qaytish
                    navigate('/dashboard/products/categories'); // Kategoriyalar sahifasiga qaytishF
                }, 1000);
            } else if (action === 'saveAndNew') {
                showNotification('Kategoriya saqlandi! Yangi kategoriya qo\'shishingiz mumkin.', 'success');
                // Form ni tozalash
                setFormData({
                    name: '',
                    description: '',
                    isActive: true,
                    image: null
                });
            }

        } catch (error) {
            showNotification('Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring!', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Bekor qilish
    const handleCancel = () => {
        if (formData.name || formData.description || formData.image) {
            if (window.confirm('O\'zgarishlar saqlanmaydi. Davom etasizmi?')) {
                navigate('/dashboard/products/categories'); // Kategoriyalar sahifasiga qaytish
            }
        } else {
           navigate('/dashboard/products/categories'); // Kategoriyalar sahifasiga qaytish  
        }
    };

    // Rasm o'chirish
    const removeImage = () => {
        setFormData(prev => ({ ...prev, image: null }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ${notification ? 'translate-y-0 opacity-100' : 'translate-y-[-100%] opacity-0'
                    }`}>
                    <div className={`rounded-xl shadow-lg border p-4 ${notification.type === 'success'
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : notification.type === 'error'
                                ? 'bg-red-50 border-red-200 text-red-800'
                                : 'bg-blue-50 border-blue-200 text-blue-800'
                        }`}>
                        <div className="flex items-start gap-3">
                            {notification.type === 'success' && <CheckCircle size={20} className="text-green-600 mt-0.5" />}
                            {notification.type === 'error' && <XCircle size={20} className="text-red-600 mt-0.5" />}
                            {notification.type === 'info' && <AlertCircle size={20} className="text-blue-600 mt-0.5" />}
                            <div className="flex-1">
                                <p className="font-medium text-sm">{notification.message}</p>
                            </div>
                            <button
                                onClick={() => setNotification(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleCancel}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Orqaga qaytish"
                            >
                                <ArrowLeft size={20} className="text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">Yangi Kategoriya Qo'shish</h1>
                                <p className="text-sm text-gray-600">Mahsulot kategoriyasi yarating</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Chap tomon - Rasm yuklash */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Kategoriya Rasmi</h2>

                            {formData.image ? (
                                // Yuklangan rasm ko'rsatish
                                <div className="relative">
                                    <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
                                        <img
                                            src={formData.image.preview}
                                            alt="Kategoriya rasmi"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="mt-4 flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                                        <div>
                                            <p className="font-medium text-gray-900 truncate">{formData.image.name}</p>
                                            <p className="text-sm text-gray-600">Rasm muvaffaqiyatli yuklandi</p>
                                        </div>
                                        <button
                                            onClick={removeImage}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Rasmni o'chirish"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Rasm yuklash zonasi
                                <div
                                    className={`relative aspect-square rounded-2xl border-2 border-dashed transition-all duration-200 ${dragActive
                                            ? 'border-blue-500 bg-blue-50'
                                            : errors.image
                                                ? 'border-red-300 bg-red-50'
                                                : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
                                        }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />

                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${dragActive ? 'bg-blue-100' : 'bg-gray-200'
                                            }`}>
                                            {dragActive ? (
                                                <Upload className="text-blue-600" size={24} />
                                            ) : (
                                                <Image className="text-gray-500" size={24} />
                                            )}
                                        </div>

                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            {dragActive ? 'Fayl ni qo\'yib yuboring' : 'Kategoriya rasmini yuklang'}
                                        </h3>

                                        <p className="text-gray-600 mb-4">
                                            Rasmni bu yerga sudrab olib keling yoki{' '}
                                            <span className="text-blue-600 font-medium">fayl tanlash</span> tugmasini bosing
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
                                        >
                                            <Upload size={20} />
                                            Fayl Tanlash
                                        </button>

                                        <p className="text-xs text-gray-500 mt-4">
                                            JPG, PNG formatida, maksimal 5MB
                                        </p>
                                    </div>
                                </div>
                            )}

                            {errors.image && (
                                <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                                    <AlertCircle size={16} />
                                    {errors.image}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* O'ng tomon - Ma'lumotlar */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Kategoriya Ma'lumotlari</h2>

                            <div className="space-y-6">
                                {/* Kategoriya nomi */}
                                <div>
                                    <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Kategoriya Nomi <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="categoryName"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                                            }`}
                                        placeholder="Masalan: Elektronika, Kiyim, Kitoblar..."
                                    />
                                    {errors.name && (
                                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                                            <AlertCircle size={14} />
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Tavsif */}
                                <div>
                                    <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700 mb-2">
                                        Tavsif <span className="text-gray-500">(ixtiyoriy)</span>
                                    </label>
                                    <textarea
                                        id="categoryDescription"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white resize-none"
                                        placeholder="Kategoriya haqida qisqacha ma'lumot yozing..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formData.description.length}/500 belgi
                                    </p>
                                </div>

                                {/* Holat */}
                                <div className="bg-gray-50 p-6 rounded-xl">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">Kategoriya Holati</h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {formData.isActive ? 'Kategoriya aktiv va foydalanuvchilar ko\'ra oladi' : 'Kategoriya noaktiv va foydalanuvchilar ko\'ra olmaydi'}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleInputChange('isActive', !formData.isActive)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${formData.isActive ? 'bg-blue-600' : 'bg-gray-400'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${formData.isActive ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* Avtomatik ma'lumotlar */}
                                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                                    <h3 className="text-sm font-medium text-blue-900 mb-3 flex items-center gap-2">
                                        <AlertCircle size={16} />
                                        Avtomatik Ma'lumotlar
                                    </h3>
                                    <div className="space-y-2 text-sm text-blue-800">
                                        <p>• <strong>Mahsulotlar soni:</strong> Kategoriyaga mahsulot qo'shilganda avtomatik hisoblanadi</p>
                                        <p>• <strong>Yaratilgan sana:</strong> Bugun sanasi avtomatik qo'shiladi</p>
                                        <p>• <strong>Kategoriya ID:</strong> Tizim tomonidan avtomatik beriladi</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action tugmalari */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                                className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Bekor qilish
                            </button>

                            <button
                                type="button"
                                onClick={() => handleSubmit('saveAndNew')}
                                disabled={isSubmitting}
                                className="flex-1 bg-[#3e9552e7] hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Plus size={20} />
                                        Saqlash va Davom Etish
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => handleSubmit('save')}
                                disabled={isSubmitting}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Saqlash va Tugatish
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProductPage;