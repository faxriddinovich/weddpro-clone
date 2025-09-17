import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, X, Phone, User, Lock, Mail } from 'lucide-react';
import { register, login, getToken } from "@/services/authService";
import { useNavigate } from 'react-router-dom';

const AuthModal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState('phone');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (getToken()) {
      navigate('/');
    }
  }, [navigate]);

  const handleInputChange = (field: string, value: string) => {
    if (field === 'phone') {
      const digits = value.replace(/\D/g, '');
      if (digits.length === 0) {
        setFormData(prev => ({ ...prev, [field]: '' }));
        return;
      }
      let formatted = '+998';
      if (digits.length > 3) {
        const phoneDigits = digits.slice(3);
        if (phoneDigits.length > 0) formatted += ' ' + phoneDigits.slice(0, 2);
        if (phoneDigits.length > 2) formatted += ' ' + phoneDigits.slice(2, 5);
        if (phoneDigits.length > 5) formatted += ' ' + phoneDigits.slice(5, 7);
        if (phoneDigits.length > 7) formatted += ' ' + phoneDigits.slice(7, 9);
      }
      setFormData(prev => ({ ...prev, [field]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.username.trim()) return "Username kiritish majburiy";
    if (authMethod === 'phone' || isLogin) {
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length !== 12 || !formData.phone.startsWith('+998')) return "Telefon raqami +998 bilan boshlanib, 9 ta raqamdan iborat bo'lishi kerak";
    } else if (authMethod === 'email' && !isLogin) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) return "Email manzil noto'g'ri";
    }
    if (formData.password.length < 6) return "Parol kamida 6 ta belgidan iborat bo'lishi kerak";
    if (!isLogin && formData.password !== formData.confirmPassword) return "Parollar mos kelmaydi";
    return null;
  };

  const handleSubmit = async () => {
    setError('');
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const response = await login({
          username: formData.username,
          password: formData.password,
        });
        console.log('Login response:', response);
        navigate('/verify-login', { state: { phoneNumber: formData.phone, username: formData.username } });
      } else {
        const response = await register({
          username: formData.username,
          phone_number: formData.phone.replace(/\s/g, ''),
          password: formData.password,
          confirm_password: formData.confirmPassword,
          ...(authMethod === 'email' && formData.email ? { email: formData.email } : {}),
        });
        console.log('Register response:', response);
        navigate('/verify', { state: { phoneNumber: formData.phone, username: formData.username, telegramAppLink: response.telegram_app_link } });
        // telegramAppLink: response.telegram_app
      }
    } catch (err: any) {
      const errorMessage = err.message || "Xatolik yuz berdi!";
      setError(errorMessage === "Login yoki parol noto‘g‘ri"
        ? "Iltimos, to‘g‘ri username va parol kiriting"
        : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = (provider: string) => {
    console.log(`${provider} bilan kirish`);
    alert(`${provider} bilan kirish!`);
  };

  const handleTabSwitch = (method: string) => {
    setAuthMethod(method);
    setError('');
  };

  const handleModeSwitch = (loginMode: boolean) => {
    setIsLogin(loginMode);
    setAuthMethod('phone');
    setError('');
  };

  if (!isOpen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <button
          onClick={() => setIsOpen(true)}
          className="px-8 py-3 bg-white text-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Auth Modal-ni ochish
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-gray-200 to-[#a9b3c4] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#dfd3d3] rounded-full blur-[160px] opacity-20"></div>
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-[#d8e3da] rounded-full blur-[140px] opacity-20"></div>
        </div>
      </div>

      <div className="relative w-full max-w-md mx-auto">
        <div className="bg-white backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden">
          <div className="relative p-6 pb-4">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex bg-gray-800/50 rounded-xl p-1 mb-6">
              <button
                onClick={() => handleModeSwitch(false)}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${!isLogin ? 'bg-white text-gray-900 shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                Yangi akkaunt yarating
              </button>
              <button
                onClick={() => handleModeSwitch(true)}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${isLogin ? 'bg-white text-gray-900 shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                Xush kelibsiz!
              </button>
            </div>

            <h2 className="text-2xl font-bold text-gray-900/80 mb-6">
              {isLogin ? 'Xush kelibsiz!' : 'Yangi akkaunt yarating'}
            </h2>
          </div>

          <div className="px-6 pb-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-[#f5f5f7] border border-gray-600 rounded-lg text-black font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder={isLogin ? "Telefon raqami yoki username" : "Username"}
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-4 bg-gradient-to-b from-blue-400 via-white to-green-400 rounded-sm flex items-center justify-center">
                      <div className="w-4 h-3 bg-gradient-to-b from-blue-500 via-white to-green-500 rounded-sm"></div>
                    </div>
                  </div>
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="block w-full pl-12 pr-3 py-3 bg-[#f5f5f7] border border-gray-600 rounded-lg text-black font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Telefon raqami (+998 90 123 45 67)"
                  maxLength={17}
                  required
                />
              </div>

              {!isLogin && authMethod === 'email' && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-[#f5f5f7] border border-gray-600 rounded-lg text-black font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Email manzilingiz"
                  />
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 bg-[#f5f5f7] border border-gray-600 rounded-lg text-black font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Parol"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {!isLogin && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 bg-[#f5f5f7] border border-gray-600 rounded-lg text-black font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Parolni qayta kiriting"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-end text-sm">
                  <button
                    type="button"
                    className="text-blue-400 text-sm tracking-wide hover:text-blue-300 transition-colors"
                    onClick={() => navigate('/forgot-password')}
                  >
                    Parolni unutdingizmi?
                  </button>
                </div>
              )}

              {error && (
                <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  {error}
                </div>
              )}

              {!isLogin && (
                <div className="flex items-start space-x-3 text-sm">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                    required
                  />
                  <label htmlFor="terms" className="text-gray-300 leading-relaxed">
                    Men{' '}
                    <button type="button" className="text-blue-400 hover:text-blue-300 underline">
                      Ommaviy taklif
                    </button>
                    {' '}va{' '}
                    <button type="button" className="text-blue-400 hover:text-blue-300 underline">
                      Maxfiylik siyosatini
                    </button>
                    {' '}o'qib chiqdim va rozillik bildiraman
                  </label>
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{isLogin ? 'Kirilmoqda...' : 'Ro\'yxatga olinmoqda...'}</span>
                  </div>
                ) : (
                  isLogin ? 'Kirish' : 'Registratsiyadan o\'tish'
                )}
              </button>
            </div>

            <div className="mt-4 text-center text-sm text-gray-400">
              {isLogin ? 'Hali akkauntingiz yo\'qmi?' : 'Akkauntingiz mavjudmi?'}{' '}
              <button
                onClick={() => handleModeSwitch(!isLogin)}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                {isLogin ? 'Registratsiyadan o\'tish' : 'Kirish'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;