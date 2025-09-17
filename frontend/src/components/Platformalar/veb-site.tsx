import React, { useState, useRef, useEffect } from 'react';
import {
  Upload, X, Globe, BarChart3, QrCode, Check,
  AlertTriangle, Download, Copy, Trash2, Save,
  XCircle, CheckCircle, Camera, Image as ImageIcon
} from 'lucide-react';

// Ma'lumotlar (kelajakda backend dan keladi)
const INITIAL_DATA = {
  asosiy: {
    favicon: null,
    saytNomi: '',
    tarif: ''
  },
  analitika: {
    googleAnalytics: '',
    googleTagManager: '',
    facebook: '',
    yandex: ''
  },
  domen: {
    asosiyDomen: 'yo\'q',
    subdomen: '',
    customDomain: ''
  },
  qrKod: {
    url: '',
    qrData: null
  }
};

const TABS = [
  { id: 'asosiy', name: 'Asosiy', icon: Globe },
  { id: 'analitika', name: 'Analitika', icon: BarChart3 },
  { id: 'domen', name: 'Domen', icon: Globe },
  { id: 'qrKod', name: 'QR kod', icon: QrCode }
];

const WebsiteManagement = () => {
  const [activeTab, setActiveTab] = useState('asosiy');
  const [data, setData] = useState(INITIAL_DATA);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const containerRef = useRef(null);

  // Touch navigation
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    const currentIndex = TABS.findIndex(tab => tab.id === activeTab);

    if (isLeftSwipe && currentIndex < TABS.length - 1) {
      setActiveTab(TABS[currentIndex + 1].id);
    }
    if (isRightSwipe && currentIndex > 0) {
      setActiveTab(TABS[currentIndex - 1].id);
    }
  };

  // Favicon upload
  const handleFileUpload = (file) => {
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
      const reader = new FileReader();
      reader.onload = (e) => {
        setData(prev => ({
          ...prev,
          asosiy: { ...prev.asosiy, favicon: e.target.result }
        }));
      };
      reader.readAsDataURL(file);
    } else {
      alert('Fayl hajmi 5MB dan oshmasligi kerak!');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files[0]) handleFileUpload(files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  // QR kod generate
  useEffect(() => {
    if (data.domen.subdomen || data.domen.customDomain) {
      const url = data.domen.asosiyDomen === 'ha'
        ? data.domen.customDomain
        : `${data.domen.subdomen}.robosale.uz`;

      // Simple QR code generation (real implementation would use QR library)
      setData(prev => ({
        ...prev,
        qrKod: {
          ...prev.qrKod,
          url: url,
          qrData: `https://${url}`
        }
      }));
    }
  }, [data.domen]);

  // Form handlers
  const updateData = (section, field, value) => {
    setData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDelete = () => {
    setData(INITIAL_DATA);
    setShowDeleteModal(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'asosiy':
        return (
          <div className="space-y-6 w-[700px]">
            {/* Favicon Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Favicon (web-sayt belgisi)
              </label>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative border-2  border-dashed rounded-xl p-8 text-center transition-all duration-300 ${dragOver
                  ? 'border-blue-400 bg-blue-50 scale-105'
                  : 'border-gray-300 hover:border-gray-400'
                  }`}
              >
                {data.asosiy.favicon ? (
                  <div className="relative group">
                    <img
                      src={data.asosiy.favicon}
                      alt="Favicon"
                      className="w-16 h-16 mx-auto rounded-lg shadow-md"
                    />
                    <button
                      onClick={() => updateData('asosiy', 'favicon', null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                      {dragOver ? <Camera className="w-6 h-6 text-blue-500" /> : <ImageIcon className="w-6 h-6 text-gray-400" />}
                    </div>
                    <p className="text-gray-600 mb-2">Faylni shu yerga tashlang yoki tanlang</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Fayl tanlash
                    </button>
                    <p className="text-xs text-gray-400 mt-1">PNG, ICO, SVG (Max: 5MB)</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.ico,.svg,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
                />
              </div>
            </div>

            {/* Sayt nomi */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Sayt nomi
              </label>
              <input
                type="text"
                value={data.asosiy.saytNomi}
                onChange={(e) => updateData('asosiy', 'saytNomi', e.target.value)}
                placeholder="Sayt nomini kiriting"
                className="w-full px-4 py-3 border border-gray-300 bg-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Ta'rif */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Ta'rif
              </label>
              <textarea
                value={data.asosiy.tarif}
                onChange={(e) => updateData('asosiy', 'tarif', e.target.value)}
                placeholder="Saytingiz haqida qisqa ta'rif yozing"
                rows={4}
                className="w-full px-4 py-3 border outline-none border-gray-300 bg-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setData(INITIAL_DATA)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50 transition-colors"
              >
                <XCircle className="w-4 h-4 inline mr-2" />
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Saqlash
              </button>
            </div>
          </div>


        );

      case 'analitika':
        return (
          <div className="space-y-6 w-[700px]">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Analitika kodlarini kiritib, saytingiz statistikasini kuzating
              </p>
            </div>

            {/* Google Analytics */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Google Analytics
              </label>
              <input
                type="text"
                value={data.analitika.googleAnalytics}
                onChange={(e) => updateData('analitika', 'googleAnalytics', e.target.value)}
                placeholder="GA4-XXXXXXX-X yoki UA-XXXXXXX-X"
                className="w-full px-4 py-2 border outline-none border-gray-300 bg-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Google Tag Manager */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Google Tag Manager
              </label>
              <input
                type="text"
                value={data.analitika.googleTagManager}
                onChange={(e) => updateData('analitika', 'googleTagManager', e.target.value)}
                placeholder="GTM-XXXXXXX"
                className="w-full px-4 py-2 border outline-none border-gray-300 bg-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Facebook Pixel */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Facebook
              </label>
              <input
                type="text"
                value={data.analitika.facebook}
                onChange={(e) => updateData('analitika', 'facebook', e.target.value)}
                placeholder="Facebook Pixel ID"
                className="w-full px-4 py-2 border outline-none border-gray-300 bg-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Yandex Metrica */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Yandex
              </label>
              <input
                type="text"
                value={data.analitika.yandex}
                onChange={(e) => updateData('analitika', 'yandex', e.target.value)}
                placeholder="Yandex.Metrica ID"
                className="w-full px-4 py-2 border outline-none border-gray-300 bg-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setData(INITIAL_DATA)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50 transition-colors"
              >
                <XCircle className="w-4 h-4 inline mr-2" />
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Saqlash
              </button>
            </div>
          </div>
        );

      case 'domen':
        return (
          <div className="space-y-6">
            {/* Asosiy domen */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                Sizning asosiy domeningiz bormi?
              </label>
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="asosiyDomen"
                    value="ha"
                    checked={data.domen.asosiyDomen === 'ha'}
                    onChange={(e) => updateData('domen', 'asosiyDomen', e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-900">Ha</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="asosiyDomen"
                    value="yo'q"
                    checked={data.domen.asosiyDomen === 'yo\'q'}
                    onChange={(e) => updateData('domen', 'asosiyDomen', e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-900">Yo'q</span>
                </label>
              </div>
            </div>

            {/* Custom domain input */}
            {data.domen.asosiyDomen === 'ha' && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Domen nomini kiriting
                </label>
                <input
                  type="text"
                  value={data.domen.customDomain}
                  onChange={(e) => updateData('domen', 'customDomain', e.target.value)}
                  placeholder="example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            )}

            {/* Subdomen */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Sub domen
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={data.domen.subdomen}
                  onChange={(e) => updateData('domen', 'subdomen', e.target.value)}
                  placeholder="subdomeningizkiring"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <div className="px-4 py-3 bg-gray-100 border-t border-b border-r border-gray-300 rounded-r-xl text-gray-600">
                  .robosale.uz
                </div>
              </div>
            </div>

            {/* Delete button */}
            <div className="pt-4">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                O'chirish
              </button>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setData(INITIAL_DATA)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50 transition-colors"
              >
                <XCircle className="w-4 h-4 inline mr-2" />
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-6 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Saqlash
              </button>
            </div>
          </div>
        );

      case 'qrKod':
        return (
          <div className="space-y-6 w-[700px]">
            <div className="text-center">
              <div className="mx-auto w-64 h-64 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                {data.qrKod.url ? (
                  <div className="text-center">
                    {/* Simple QR representation */}
                    <div className="w-48 h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">QR kod avtomatik yaratiladi</p>
                  </div>
                )}
              </div>

              {data.qrKod.url && (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    QR kod: <span className="font-mono text-blue-600">{data.qrKod.url}</span>
                  </p>

                  <div className="flex gap-3 justify-center">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Download className="w-4 h-4" />
                      Yuklab olish
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Copy className="w-4 h-4" />
                      Nusxalash
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50 animate-slide-in-right">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Muvaffaqiyatli!</h4>
              <p className="text-sm text-gray-600">Ma'lumotlar saqlandi</p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 animate-scale-in">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Haqiqatan ham o'chirib tashlaysizmi?
              </h3>
              <p className="text-gray-600 mb-6">
                Bu amal ortga qaytarib bo'lmaydi. Barcha ma'lumotlar o'chiriladi.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Yo'q, bekor qilish
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  Ha, o'chirish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-2 bg-white rounded-lg p-6 shadow-sm ">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Veb-sayt sozlamalari</h1>
        <p className="text-gray-600">Saytingizni sozlang va boshqaring</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white rounded-md shadow-md">
        <nav className="flex space-x-8 px-4 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <Icon className="w-5 h-5" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="bg-white rounded-b-2xl shadow-md border border-gray-200 px-8 pt-8 min-h-96"
      >
        {renderTabContent()}
      </div>

      {/* Action Buttons */}


    </div>
  );
};

export default WebsiteManagement;