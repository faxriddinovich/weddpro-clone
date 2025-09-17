import React, { useState } from 'react';
import {
  Settings,
  MessageSquare,
  QrCode,
  User,
  Calendar,
  Globe,
  Zap,
  Square,
  Trash2,
  CheckCircle,
  AlertCircle,
  Copy,
  Edit3,
  Play,
  Pause,
  Bot,
  Shield,
  Activity,
  Clock,
  Users,
  Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TelegramBot = () => {
  const [activeTab, setActiveTab] = useState('sozlamalar');
  const [showNotification, setShowNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [formData, setFormData] = useState({
    startMessage: `Bugurtmalarni Telegram guruhiga yo'naltirishda o'zingizdan ustoz buyurtmalarni haddan tashqariga chiqarsiz amallari bajarish:
1. Botingizni va sotish guruhiga sozlash administrator huquqlarini bering
2. Undan belgilarda ruxsat oling. 8KFK0AdqzaZLdB8XcfR3qurreVqiMWx4EHPvgrn5 ga guruhga yuborish
3. Bot bildirilmalarni o'rnatmoqda afzalligi tushunarli va javob beradi`,
    language: 'uzbek',
    buttonText: 'Assalomu alaykum [user], [bot] botiga xush kelibsiz!',
    buttonName: 'Do\'kon'
  });
  const [active, setActive] = useState(false);
  const navigate = useNavigate();

  // Statik ma'lumotlar
  const botInfo = {
    name: "Alibaba",
    lastUpdated: "21-Avg, 2025",
    token: "8KFK0AdqzaZLdB8XcfR3qurreVqiMWx4EHPvgrn5",
    isActive: true,
    status: "active",
    orders: 247,
    users: 1432
  };

  const languages = [
    { code: 'uzbek', name: "O'zbek", flag: '🇺🇿' },
    { code: 'russian', name: "Русский", flag: '🇷🇺' },
    { code: 'english', name: "English", flag: '🇺🇸' },
    { code: 'turkish', name: "Türkçe", flag: '🇹🇷' }
  ];

  const showMessage = (type, message, duration = 3000) => {
    setShowNotification({ type, message });
    setTimeout(() => setShowNotification(null), duration);
  };

  const handleAction = async (action) => {
    setIsLoading(action);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsLoading(null);

    switch (action) {
      case 'start':
        showMessage('success', 'Bot muvaffaqiyatli ishga tushirildi');
        break;
      case 'stop':
        showMessage('info', 'Bot to\'xtatildi');
        break;
      case 'delete':
        showMessage('success', 'Bot o\'chirildi');
        break;
      default:
        break;
    }
  };

  const handleSave = async () => {
    setIsLoading('save');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(null);
    showMessage('success', 'Sozlamalar saqlandi');
  };

  const copyToken = () => {
    navigator.clipboard.writeText(botInfo.token);
    showMessage('success', 'Token nusxalandi', 2000);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const tabs = [
    { id: 'sozlamalar', name: 'Sozlamalar', icon: Settings, color: 'blue' },
    { id: 'amallar', name: 'Boshqaruv', icon: MessageSquare, color: 'emerald' },
    { id: 'qrkod', name: 'QR Kod', icon: QrCode, color: 'purple' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'sozlamalar':
        return (
          <div className="space-y-8 bg-white rounded-xl shadow-lg border border-gray-200">
            {/* Boshlang'ich matn */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Boshlang'ich xabar
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Bot foydalanuvchilar bilan suhbatni boshlaganida ko'rsatiladigan xabar matnini sozlang
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 mb-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">Ko'rsatma</span>
                </div>
                <ol className="text-sm text-slate-700 space-y-2">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-medium">1</span>
                    <span>Botingizni sotish guruhiga qo'shing va administrator huquqlarini bering</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-medium">2</span>
                    <div>
                      <span>Bot tokenini guruhga yuborish: </span>
                      <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono text-slate-800 border">
                        {botInfo.token.slice(0, 20)}...
                      </code>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-medium">3</span>
                    <span>Bot sozlamalari saqlangandan so'ng faollashtiring</span>
                  </li>
                </ol>
              </div>

              <div className="relative">
                <textarea
                  value={formData.startMessage}
                  onChange={(e) => updateFormData('startMessage', e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none text-sm leading-relaxed transition-all duration-200"
                  placeholder="Boshlang'ich matnni kiriting..."
                />
                <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                  {formData.startMessage.length} / 1000
                </div>
              </div>
            </div>

            {/* Qo'shimcha sozlamalar */}
            <div className="bg-gradient-to-r from-slate-50 to-emerald-50 rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Interfeys sozlamalari
                  </h3>
                  <p className="text-sm text-slate-600">
                    Bot tili va foydalanuvchi interfeysi parametrlari
                  </p>
                </div>
              </div>

              {/* Til tanlash */}
              <div className="mb-6">
                <label className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Bot tili
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => updateFormData('language', lang.code)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${formData.language === lang.code
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-900 shadow-lg shadow-emerald-100'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
                        }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="text-sm font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Xabar matni */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Salomlashish matni
                  </label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => updateFormData('buttonText', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                    placeholder="Foydalanuvchiga ko'rsatiladigan matn"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                    <Square className="w-4 h-4" />
                    Tugma nomi
                  </label>
                  <input
                    type="text"
                    value={formData.buttonName}
                    onChange={(e) => updateFormData('buttonName', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                    placeholder="Tugma nomini kiriting"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'amallar':
        return (
          <div className="space-y-8 bg-white rounded-xl shadow-lg border border-gray-200">
            {/* Bot Token */}
            <div className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Hash className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Bot Token</h3>
                    <p className="text-sm text-slate-600">Xavfsiz saqlang va ulashmang</p>
                  </div>
                </div>
                <button
                  onClick={copyToken}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all duration-200 hover:scale-105 shadow-sm"
                >
                  <Copy className="w-4 h-4" />
                  <span className="text-sm font-medium">Nusxalash</span>
                </button>
              </div>
              <div className="bg-white rounded-xl p-4 font-mono text-sm text-slate-800 border border-slate-200 break-all">
                {botInfo.token}
              </div>
            </div>

            {/* Bot statistikasi */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Status</p>
                    <p className="text-xl font-bold text-blue-900 capitalize">{botInfo.status}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-600 font-medium">Foydalanuvchilar</p>
                    <p className="text-xl font-bold text-emerald-900">{botInfo.users.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-2xl p-6 border border-violet-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-violet-500 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-violet-600 font-medium">Buyurtmalar</p>
                    <p className="text-xl font-bold text-violet-900">{botInfo.orders}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bot boshqaruvi */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Bot boshqaruvi</h3>
                  <p className="text-sm text-slate-600">Botni ishga tushiring yoki to'xtating</p>
                </div>
              </div>

              {/* Botni ishga tushirish */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border-2 border-emerald-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-emerald-900 text-lg">Botni ishga tushirish</h4>
                      <p className="text-sm text-emerald-700 mt-1">
                        Botni faollashtiring va foydalanuvchilarga xizmat ko'rsatishni boshlang
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAction('start')}
                    disabled={isLoading === 'start'}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-200 disabled:opacity-50 min-w-[140px] justify-center shadow-lg hover:shadow-emerald-200 hover:scale-105"
                  >
                    {isLoading === 'start' ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        <span className="font-medium">Ishga tushir</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Botni to'xtatish */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border-2 border-amber-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                      <Pause className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-900 text-lg">Botni to'xtatish</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        Ma'lumotlarni yo'qotmasdan botni vaqtincha to'xtating
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAction('stop')}
                    disabled={isLoading === 'stop'}
                    className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all duration-200 disabled:opacity-50 min-w-[140px] justify-center shadow-lg hover:shadow-amber-200 hover:scale-105"
                  >
                    {isLoading === 'stop' ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Pause className="w-5 h-5" />
                        <span className="font-medium">To'xtatish</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Botni o'chirish */}
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl p-6 border-2 border-red-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                      <Trash2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-900 text-lg">Botni o'chirish</h4>
                      <p className="text-sm text-red-700 mt-1">
                        <strong>Diqqat!</strong> Barcha ma'lumotlar, sozlamalar va foydalanuvchilar o'chiriladi
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAction('delete')}
                    disabled={isLoading === 'delete'}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 disabled:opacity-50 min-w-[140px] justify-center shadow-lg hover:shadow-red-200 hover:scale-105"
                  >
                    {isLoading === 'delete' ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="w-5 h-5" />
                        <span className="font-medium">O'chirish</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'qrkod':
        return (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-12 border-2 border-purple-200 max-w-md mx-auto">
              <div className="w-32 h-32 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center border-2 border-purple-200 shadow-lg">
                <QrCode className="w-16 h-16 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">QR Kod</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Bot uchun QR kod yaratish va ulashish imkoniyati tez orada qo'shiladi
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {active ? (

        <div className="min-h-screen bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="max-w-6xl mx-auto p-6">
            {/* Success/Error Notifications */}
            {showNotification && (
              <div className={`fixed top-6 right-6 p-4 rounded-2xl shadow-xl z-50 flex items-center gap-3 backdrop-blur-sm animate-in slide-in-from-right duration-300 ${showNotification.type === 'success' ? 'bg-emerald-50/90 border border-emerald-200' :
                showNotification.type === 'error' ? 'bg-red-50/90 border border-red-200' :
                  'bg-blue-50/90 border border-blue-200'
                }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${showNotification.type === 'success' ? 'bg-emerald-100' :
                  showNotification.type === 'error' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                  {showNotification.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                  {showNotification.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
                  {showNotification.type === 'info' && <AlertCircle className="w-5 h-5 text-blue-600" />}
                </div>
                <span className={`text-sm font-medium ${showNotification.type === 'success' ? 'text-emerald-800' :
                  showNotification.type === 'error' ? 'text-red-800' :
                    'text-blue-800'
                  }`}>
                  {showNotification.message}
                </span>
              </div>
            )}

            {/* Header */}
            <div className="mb-8">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Bot className="w-8 h-8 text-white" />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${botInfo.isActive ? 'bg-emerald-400' : 'bg-slate-400'} rounded-full border-2 border-white`} />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-slate-800 mb-1">{botInfo.name}</h1>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Oxirgi yangilanish: {botInfo.lastUpdated}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${botInfo.isActive ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                          <span>{botInfo.isActive ? 'Faol' : 'Nofaol'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-800">{botInfo.orders}</div>
                      <div className="text-sm text-slate-600">Buyurtmalar</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-800">{botInfo.users.toLocaleString()}</div>
                      <div className="text-sm text-slate-600">Foydalanuvchilar</div>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-slate-200">
                  <nav className="flex space-x-1 overflow-x-auto">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-3 py-4 px-6 rounded-t-xl font-medium text-sm whitespace-nowrap transition-all duration-200 relative ${isActive
                            ? `bg-${tab.color}-50 text-${tab.color}-700 border-b-2 border-${tab.color}-500`
                            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                            }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{tab.name}</span>
                          {isActive && (
                            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-${tab.color}-500 rounded-full`} />
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-lg min-h-96">
              {renderTabContent()}
            </div>

            {/* Action Buttons */}
            {activeTab === 'sozlamalar' && (
              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => setFormData(prev => ({ ...prev }))}
                  className="px-6 py-3 text-sm border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium hover:scale-105"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading === 'save'}
                  className="px-8 py-3 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 flex items-center gap-3 min-w-[180px] justify-center font-medium shadow-lg hover:shadow-blue-200 hover:scale-105"
                >
                  {isLoading === 'save' ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Saqlash</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>) : (
        <div className="min-h-screen bg-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center">
          <div className="max-w-6xl mx-auto p-6 flex flex-col items-center justify-center">
            
              <h1 className="text-3xl font-bold text-slate-800 mb-6">Siz hali bot qo’shmagansiz</h1>
              <p className="text-slate-600 text-center mb-6 text-lg leading-relaxed">
                Agar siz telefon orqali buyurtma qabul qilsangiz, ularni tizimga <br /> kiritish orqali ham ularni boshqarishingiz mumkin.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard/platforms/telegram/create")}
                className="text-center px-8 py-3 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Botni qo’shish
              </Button>
            
          </div>
        </div>
      )}</>
  );
};

export default TelegramBot;