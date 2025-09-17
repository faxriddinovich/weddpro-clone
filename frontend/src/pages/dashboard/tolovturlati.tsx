import React, { useState } from 'react';
import { X, CreditCard, Shield, Check } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const PaymentMethods = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [enabledMethods, setEnabledMethods] = useState({
    click: true,
    payme: true,
    'robo-pay': false,
    visa: true,
    mastercard: false,
    uzcard: true
  });
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    zipCode: '',
    agreeTerms: false
  });

  const paymentMethods = [
    {
      id: 'click',
      name: 'Click',
      description: 'Tez va xavfsiz to\'lov',
      icon: '💳',
      gradient: 'from-blue-50 to-blue-100',
      border: 'border-blue-200',
      hover: 'hover:border-blue-300 hover:shadow-blue-100'
    },
    {
      id: 'payme',
      name: 'Payme',
      description: 'Mobil to\'lovlar',
      icon: '📱',
      gradient: 'from-green-50 to-green-100',
      border: 'border-green-200',
      hover: 'hover:border-green-300 hover:shadow-green-100'
    },
    {
      id: 'robo-pay',
      name: 'Robo Pay',
      description: 'Avtomatik to\'lovlar',
      icon: '🤖',
      gradient: 'from-purple-50 to-purple-100',
      border: 'border-purple-200',
      hover: 'hover:border-purple-300 hover:shadow-purple-100'
    },
    {
      id: 'visa',
      name: 'Visa',
      description: 'Bank kartalari',
      icon: '💎',
      gradient: 'from-gray-50 to-gray-100',
      border: 'border-gray-200',
      hover: 'hover:border-gray-300 hover:shadow-gray-100'
    },
    {
      id: 'mastercard',
      name: 'Mastercard',
      description: 'Xalqaro kartalar',
      icon: '🌍',
      gradient: 'from-orange-50 to-orange-100',
      border: 'border-orange-200',
      hover: 'hover:border-orange-300 hover:shadow-orange-100'
    },
    {
      id: 'uzcard',
      name: 'UzCard',
      description: 'Milliy to\'lov tizimi',
      icon: '🇺🇿',
      gradient: 'from-cyan-50 to-cyan-100',
      border: 'border-cyan-200',
      hover: 'hover:border-cyan-300 hover:shadow-cyan-100'
    }
  ];

  const handleMethodClick = (method, event) => {
    // Switch bosilganda method ochilishini to'xtatish
    if (event.target.closest('[role="switch"]') || event.target.closest('.switch-container')) {
      return;
    }
    
    if (['click', 'payme', 'robo-pay'].includes(method.id) && enabledMethods[method.id]) {
      setSelectedMethod(method);
      setShowDialog(true);
    }
  };

  const handleSwitchChange = (methodId, checked) => {
    setEnabledMethods(prev => ({
      ...prev,
      [methodId]: checked
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    if (formData.agreeTerms && formData.email && formData.cardNumber && formData.expiryDate && formData.cvc && formData.zipCode) {
      console.log('Payment submitted:', formData);
      // Bu yerda backend ga ma'lumotlar jo'natiladi
      setShowDialog(false);
      setFormData({
        email: '',
        cardNumber: '',
        expiryDate: '',
        cvc: '',
        zipCode: '',
        agreeTerms: false
      });
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData(prev => ({ ...prev, cardNumber: formatted }));
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setFormData(prev => ({ ...prev, expiryDate: formatted }));
  };

  const isFormValid = () => {
    return formData.agreeTerms && 
           formData.email && 
           formData.cardNumber && 
           formData.expiryDate && 
           formData.cvc && 
           formData.zipCode;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">To'lov usullari</h2>
        <p className="text-gray-600">O'zingizga qulay to'lov usulini tanlang</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            onClick={(e) => handleMethodClick(method, e)}
            className={`
              relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer
              bg-gradient-to-br ${method.gradient} ${method.border} ${method.hover}
              hover:shadow-lg hover:-translate-y-1 hover:scale-105
              group
              ${!enabledMethods[method.id] ? 'opacity-60' : ''}
            `}
          >
            {/* Switch - yuqori o'ng burchakda */}
            <div className="absolute top-4 right-4 switch-container" onClick={(e) => e.stopPropagation()}>
              <Switch
                checked={enabledMethods[method.id]}
                onCheckedChange={(checked) => handleSwitchChange(method.id, checked)}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>

            <div className="flex items-start justify-between mb-4 pr-12">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                {method.icon}
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Shield className="w-5 h-5 text-green-500" />
              </div>
            </div>
            
            <h3 className="font-semibold text-lg text-gray-800 mb-1">
              {method.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {method.description}
            </p>

            {/* Status indicator */}
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${enabledMethods[method.id] ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-xs text-gray-500">
                {enabledMethods[method.id] ? 'Faol' : 'O\'chiq'}
              </span>
            </div>

            {['click', 'payme', 'robo-pay'].includes(method.id) && enabledMethods[method.id] && (
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <CreditCard className="w-4 h-4 text-gray-600" />
                </div>
              </div>
            )}

            {['click', 'payme', 'robo-pay'].includes(method.id) && enabledMethods[method.id] && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </div>
        ))}
      </div>

      {/* Payment Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedMethod?.icon}</span>
                <h3 className="text-xl font-semibold text-gray-800">
                  {selectedMethod?.name} orqali to'lov
                </h3>
              </div>
              <button
                onClick={() => setShowDialog(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="sizning@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                  <div className="absolute right-3 top-3 flex gap-1">
                    <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                      V
                    </div>
                    <div className="w-8 h-5 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">
                      M
                    </div>
                    <div className="w-8 h-5 bg-cyan-500 rounded text-white text-xs flex items-center justify-center font-bold">
                      U
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    MM / YY *
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleExpiryChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="12/25"
                    maxLength="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVC *
                  </label>
                  <input
                    type="text"
                    name="cvc"
                    value={formData.cvc}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="123"
                    maxLength="4"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zip Code *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="100000"
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                  I Have Read And Agree To The Website{' '}
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    Terms And Conditions
                  </span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDialog(false)}
                  className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isFormValid()}
                  className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  To'lash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;