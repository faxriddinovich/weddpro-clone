import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, X, Eye, Calendar, Type, AlertCircle, Image as ImageIcon, ToggleRight, ToggleLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// FormData interfeysi
interface FormData {
    title: string;
    description: string;
    image: File | null;
    status: 'active' | 'inactive';
    publishDate: string;
}

// Form xatolari uchun interfeys
interface FormErrors {
    title?: string;
    image?: string;
    publishDate?: string;
}

const AddBanner: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        image: null,
        status: 'active',
        publishDate: new Date().toISOString().split('T')[0]
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    // Formani validatsiya qilish
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Banner nomi kiritilishi shart';
        }

        if (!formData.image) {
            newErrors.image = 'Rasm yuklash shart';
        }

        if (!formData.publishDate) {
            newErrors.publishDate = 'Chop etish sanasi kiritilishi shart';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Formani boshqarish
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target as { name: keyof FormData; value: string };
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Fayl yuklash
    const handleFileUpload = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));

            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);

            if (errors.image) {
                setErrors(prev => ({
                    ...prev,
                    image: ''
                }));
            }
        } else {
            setErrors(prev => ({
                ...prev,
                image: 'Iltimos, rasm formatidagi fayl tanlang'
            }));
        }
    };

    // Drag va drop
    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
        }
    };

    // Rasmni o'chirish
    const removeImage = () => {
        setFormData(prev => ({
            ...prev,
            image: null
        }));
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Formani yuborish
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('Banner ma\'lumotlari:', formData);
            alert('Banner muvaffaqiyatli qo\'shildi!');
            console.log('Navigating back to BannerGrid...');
        } catch (error) {
            console.error('Xato:', error);
            alert('Xato yuz berdi. Qaytadan urinib ko\'ring.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        console.log('Navigating back to BannerGrid...');
        navigate('/dashboard/marketing/banner');
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 backdrop-blur-sm bg-white/80">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleBack}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                                <ArrowLeft size={24} className="text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Yangi Banner Qo'shish
                                </h1>
                                <p className="text-gray-600 mt-1">Banner ma'lumotlarini to'ldiring</p>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Type className="text-blue-600" size={20} />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800">Banner Nomi</h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Banner sarlavhasi *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="Masalan: BUYURTMA BERISH ENDI YANADA OSONROQ"
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors.title ? 'border-red-500' : 'border-gray-200'
                                                }`}
                                        />
                                        {errors.title && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle size={14} />
                                                {errors.title}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Qo'shimcha tavsif
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Banner haqida qo'shimcha ma'lumot..."
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <ImageIcon className="text-purple-600" size={20} />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800">Banner Rasmi</h2>
                                </div>

                                <div className="space-y-4">
                                    <div
                                        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${dragActive
                                                ? 'border-blue-500 bg-blue-50'
                                                : errors.image
                                                    ? 'border-red-300 bg-red-50'
                                                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                            }`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileInputChange}
                                            className="hidden"
                                        />

                                        {imagePreview ? (
                                            <div className="relative">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="max-w-full max-h-48 mx-auto rounded-lg shadow-md"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeImage();
                                                    }}
                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="cursor-pointer">
                                                <Upload className={`mx-auto mb-4 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} size={48} />
                                                <div className="text-lg font-medium text-gray-700 mb-2">
                                                    Rasm yuklash uchun bosing yoki sudrab tashlang
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    PNG, JPG, JPEG (maksimal 5MB)
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {errors.image && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle size={14} />
                                            {errors.image}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Calendar className="text-green-600" size={20} />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800">Chop Etish</h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Chop etish sanasi *
                                        </label>
                                        <input
                                            type="date"
                                            name="publishDate"
                                            value={formData.publishDate}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors.publishDate ? 'border-red-500' : 'border-gray-200'
                                                }`}
                                        />
                                        {errors.publishDate && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle size={14} />
                                                {errors.publishDate}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Banner holati
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, status: formData.status === 'active' ? 'inactive' : 'active' }))}
                                                className="flex items-center gap-2"
                                            >
                                                {formData.status === 'active' ? (
                                                    <ToggleRight className="text-green-500" size={24} />
                                                ) : (
                                                    <ToggleLeft className="text-gray-400" size={24} />
                                                )}
                                                <span className={`text-sm font-medium ${formData.status === 'active' ? 'text-green-700' : 'text-gray-500'
                                                    }`}>
                                                    {formData.status === 'active' ? 'Faol' : 'Faol emas'}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <Eye className="text-orange-600" size={20} />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800">Oldin Ko'rish</h2>
                                </div>

                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="relative h-24 bg-gray-100">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <ImageIcon className="text-gray-400" size={24} />
                                            </div>
                                        )}

                                        {formData.title && (
                                            <div className="absolute bottom-1 left-2 right-2">
                                                <h3 className="text-white text-xs font-semibold truncate bg-black/50 px-2 py-1 rounded">
                                                    {formData.title}
                                                </h3>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-3 text-xs text-gray-600">
                                        <div className="flex justify-between">
                                            <span>{formData.publishDate || 'Sana tanlanmagan'}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-white ${formData.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                                                }`}>
                                                {formData.status === 'active' ? 'Faol' : 'Faol emas'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform hover:-translate-y-0.5 ${isSubmitting
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Qo'shilmoqda...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <Check size={20} />
                                        Banner Qo'shish
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBanner;