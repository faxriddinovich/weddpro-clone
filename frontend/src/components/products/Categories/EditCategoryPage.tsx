import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Upload, Image, Check, X, Save, Trash2, AlertCircle, CheckCircle, XCircle, Calendar, Hash, Package } from 'lucide-react';

const EditCategoryPage = () => {
  // Simulate getting ID from URL params
  const categoryId = 1; // In real app: useParams().id
  
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    isActive: true,
    image: null,
    productsCount: 0,
    createdDate: '',
    updatedDate: ''
  });
  
  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef(null);

  // Simulate fetching category data
  useEffect(() => {
    const fetchCategoryData = () => {
      // Simulate API call - in real app this would be from backend
      const categories = [
        {
          id: 1,
          name: "Elektronika",
          description: "Zamonaviy elektronik mahsulotlar va aksessuarlar",
          icon: "📱",
          productsCount: 248,
          createdDate: "2024-01-15",
          updatedDate: "2024-02-20",
          isActive: true,
          color: "#3B82F6",
          image: {
            preview: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjM0I4MkY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0MCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7wn5OxPC90ZXh0Pjwvc3ZnPg==",
            name: "elektronika-category.jpg"
          }
        },
        // Add more categories as needed...
      ];
      
      const category = categories.find(cat => cat.id === categoryId);
      if (category) {
        const data = {
          ...category,
          updatedDate: new Date().toISOString()
        };
        setFormData(data);
        setOriginalData(data);
      }
    };

    fetchCategoryData();
  }, [categoryId]);

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

  // O'zgarishlar bor-yo'qligini tekshirish
  const hasChanges = () => {
    return (
      formData.name !== originalData.name ||
      formData.description !== originalData.description ||
      formData.isActive !== originalData.isActive ||
      (formData.image && formData.image.file) // Yangi rasm yuklangan
    );
  };

  // Form submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      showNotification('Iltimos, barcha majburiy maydonlarni to\'ldiring!', 'error');
      return;
    }

    if (!hasChanges()) {
      showNotification('Hech qanday o\'zgarish kiritilmadi!', 'info');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedCategory = {
        ...formData,
        updatedDate: new Date().toISOString()
      };
      
      console.log('Yangilangan kategoriya:', updatedCategory);
      
      showNotification('Kategoriya muvaffaqiyatli yangilandi!', 'success');
      
      setTimeout(() => {
        // Redirect to categories list
        window.location.href = '/dashboard/products/categories';
      }, 1000);
      
    } catch (error) {
      showNotification('Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring!', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete funksiyasi
  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Kategoriya o\'chirildi:', formData.id);
      
      showNotification('Kategoriya muvaffaqiyatli o\'chirildi!', 'success');
      setShowDeleteModal(false);
      
      setTimeout(() => {
        window.location.href = '/dashboard/products/categories';
      }, 1000);
      
    } catch (error) {
      showNotification('O\'chirishda xatolik yuz berdi!', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Bekor qilish
  const handleCancel = () => {
    if (hasChanges()) {
      if (window.confirm('O\'zgarishlar saqlanmaydi. Davom etasizmi?')) {
        window.location.href = '/dashboard/products/categories';
      }
    } else {
      window.location.href = '/dashboard/products/categories';
    }
  };

  // Rasm o'chirish
  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
  };

  // Sana formatlash
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!formData.id) {
    // Loading state
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Kategoriya ma'lumotlari yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ${
          notification ? 'translate-y-0 opacity-100' : 'translate-y-[-100%] opacity-0'
        }`}>
          <div className={`rounded-xl shadow-lg border p-4 ${
            notification.type === 'success' 
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

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDeleteModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Kategoriyani o'chirish
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        "<strong>{formData.name}</strong>" kategoriyasini o'chirishni xohlaysizmi? 
                        Bu amal ortga qaytarib bo'lmaydi.
                      </p>
                      {formData.productsCount > 0 && (
                        <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <p className="text-sm text-yellow-800">
                            ⚠️ Diqqat! Bu kategoriyada <strong>{formData.productsCount} ta mahsulot</strong> mavjud. 
                            Kategoriya o'chirilganda barcha mahsulotlar "Kategoriyasiz" bo'limiga o'tkaziladi.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      O'chirilmoqda...
                    </>
                  ) : (
                    'Ha, O\'chirish'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  Bekor qilish
                </button>
              </div>
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
                <h1 className="text-xl font-semibold text-gray-900">Kategoriyani Tahrirlash</h1>
                <p className="text-sm text-gray-600">"{formData.name}" kategoriyasini o'zgartirish</p>
              </div>
            </div>
            {hasChanges() && (
              <div className="bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-lg">
                <p className="text-sm text-yellow-800 font-medium">O'zgarishlar saqlanmadi</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chap tomon - Rasm */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Kategoriya Rasmi</h2>
              
              {formData.image ? (
                // Mavjud rasm ko'rsatish
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
                      <p className="font-medium text-gray-900 truncate">
                        {formData.image.name || 'Mavjud rasm'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formData.image.file ? 'Yangi rasm tanlandi' : 'Hozirgi rasm'}
                      </p>
                    </div>
                    <button
                      onClick={removeImage}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Rasmni o'chirish"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  {/* Rasm o'zgartirish zonasi */}
                  <div className="mt-4">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-blue-50 hover:bg-blue-100 border-2 border-dashed border-blue-300 rounded-xl p-6 text-center transition-all duration-200"
                    >
                      <Upload className="mx-auto text-blue-600 mb-2" size={24} />
                      <p className="text-blue-700 font-medium">Rasmni o'zgartirish</p>
                      <p className="text-sm text-blue-600">Yangi rasm yuklash uchun bosing</p>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
                      className="hidden"
                    />
                  </div>
                </div>
              ) : (
                // Rasm yuklash zonasi
                <div
                  className={`relative aspect-square rounded-2xl border-2 border-dashed transition-all duration-200 ${
                    dragActive 
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
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                      dragActive ? 'bg-blue-100' : 'bg-gray-200'
                    }`}>
                      {dragActive ? (
                        <Upload className="text-blue-600" size={24} />
                      ) : (
                        <Image className="text-gray-500" size={24} />
                      )}
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {dragActive ? 'Fayl ni qo\'yib yuboring' : 'Yangi rasm yuklang'}
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
                {/* Read-only ma'lumotlar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Hash size={16} className="inline mr-1" />
                      Kategoriya ID
                    </label>
                    <p className="text-sm text-gray-900 font-mono bg-white px-3 py-2 rounded-lg border">
                      #{formData.id}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Package size={16} className="inline mr-1" />
                      Mahsulotlar soni
                    </label>
                    <p className="text-sm text-gray-900 font-semibold bg-white px-3 py-2 rounded-lg border">
                      {formData.productsCount} ta mahsulot
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar size={16} className="inline mr-1" />
                      Yaratilgan sana
                    </label>
                    <p className="text-xs text-gray-600 bg-white px-3 py-2 rounded-lg border">
                      {formatDate(formData.createdDate)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar size={16} className="inline mr-1" />
                      Oxirgi o'zgartirish
                    </label>
                    <p className="text-xs text-gray-600 bg-white px-3 py-2 rounded-lg border">
                      {formatDate(formData.updatedDate)}
                    </p>
                  </div>
                </div>

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
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${
                      errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
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
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                        formData.isActive ? 'bg-blue-600' : 'bg-gray-400'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          formData.isActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Mahsulotlar haqida ogohlantirish */}
                {formData.productsCount > 0 && !formData.isActive && (
                  <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="text-yellow-600 mt-0.5" size={18} />
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800">Diqqat!</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Bu kategoriyada {formData.productsCount} ta mahsulot mavjud. 
                          Kategoriyani noaktiv qilsangiz, bu mahsulotlar saytda ko'rinmaydi.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action tugmalari */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting || isDeleting}
                className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Bekor qilish
              </button>
              
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                disabled={isSubmitting || isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={20} />
                O'chirish
              </button>
              
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || isDeleting || !hasChanges()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saqlanmoqda...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    O'zgarishlarni Saqlash
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

export default EditCategoryPage;