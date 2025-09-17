import React, { useState } from 'react';
import { Check, Crown, MessageCircle, Globe, QrCode, Instagram, MousePointer, ChevronDown } from 'lucide-react';

const TarifRejasi = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6');

  const periods = [
    { value: '1', label: '1 oylik', discount: null },
    { value: '6', label: '6 oylik', discount: '-30%' },
    { value: '12', label: '1 yillik', discount: '-50%' }
  ];

  const plans = [
    {
      id: 'start',
      name: 'Start',
      price: 0,
      currency: 'UZS',
      features: [
        { icon: MessageCircle, text: 'Telegram bot (WebApp)', available: true },
        { icon: Globe, text: 'Veb-sayt (Faqat subdomen)', available: true }
      ],
      buttonText: 'Joriy tarif',
      buttonStyle: 'outline',
      popular: false
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 500000,
      currency: 'UZS',
      features: [
        { icon: MessageCircle, text: 'Telegram bot (WebApp)', available: true },
        { icon: Globe, text: 'Veb-sayt', available: true },
        { icon: QrCode, text: 'QR Menyu/Katalog', available: true },
        { icon: Instagram, text: 'Instagram', available: true }
      ],
      buttonText: 'Tarifni yangilang',
      buttonStyle: 'primary',
      popular: true
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 900000,
      currency: 'UZS',
      features: [
        { icon: MessageCircle, text: 'Telegram bot (WebApp)', available: true },
        { icon: Globe, text: 'Veb-sayt', available: true },
        { icon: QrCode, text: 'QR Menyu/Katalog', available: true },
        { icon: Instagram, text: 'Instagram', available: true },
        { icon: MousePointer, text: 'ClickSuperApp', available: true }
      ],
      buttonText: 'Tarifni yangilang',
      buttonStyle: 'premium',
      popular: false,
      crown: true
    }
  ];

  const formatPrice = (price) => {
    if (price === 0) return '0';
    return new Intl.NumberFormat('uz-UZ').format(price);
  };

  const getDiscountedPrice = (originalPrice, period) => {
    if (originalPrice === 0) return 0;
    
    const discounts = {
      '1': 0,
      '6': 0.3,
      '12': 0.5
    };
    
    return Math.round(originalPrice * (1 - discounts[period]));
  };

  return (
    <div className="min-h-screen bg-white rounded-xl shadow-lg border border-gray-200 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span>✅</span>
            Yetarli! Biznesingizni onlayn qilish uchun 10 baroba
            ko'p pul sarflashingiz shart emas.
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            WedApp BILAN TEZROQ TARIFNI TANLANG VA
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            SAMARADORLIKNI OSHIRING! 🎯
          </h2>
        </div>

        {/* Period Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200 inline-flex gap-2">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedPeriod === period.value
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {period.label}
                {period.discount && (
                  <span className={`absolute -top-2 -right-1 px-2 py-1 text-xs font-bold rounded-full ${
                    selectedPeriod === period.value 
                      ? 'bg-yellow-400 text-yellow-900' 
                      : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900'
                  }`}>
                    {period.discount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-3xl p-8 transition-all duration-300 hover:transform hover:scale-105 ${
                plan.popular 
                  ? 'shadow-2xl border-2 border-gradient-to-r from-purple-500 to-blue-500 ring-2 ring-purple-200' 
                  : 'shadow-lg hover:shadow-xl border border-gray-200'
              } ${
                plan.crown ? 'bg-gradient-to-br from-purple-50 to-indigo-50' : ''
              }`}
            >
              {/* Crown for Professional */}
              {plan.crown && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-1">
                    <Crown className="h-4 w-4" />
                    <span className="text-sm font-bold">PREMIUM</span>
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-gray-900">
                    {formatPrice(getDiscountedPrice(plan.price, selectedPeriod))}
                  </span>
                  <span className="text-lg text-gray-600 ml-2">{plan.currency}</span>
                </div>
                
                {/* Original Price (crossed out) */}
                {selectedPeriod !== '1' && plan.price > 0 && (
                  <div className="text-center mb-4">
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(plan.price)} {plan.currency}
                    </span>
                    <div className="text-sm text-green-600 font-semibold">
                      {periods.find(p => p.value === selectedPeriod)?.discount} chegirma!
                    </div>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      feature.available 
                        ? plan.crown 
                          ? 'bg-purple-100 text-purple-600' 
                          : 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      <feature.icon className="h-4 w-4" />
                    </div>
                    <span className={`text-sm ${
                      feature.available ? 'text-gray-700' : 'text-gray-400'
                    }`}>
                      {feature.text}
                    </span>
                    {feature.available && (
                      <Check className="h-4 w-4 text-green-500 ml-auto" />
                    )}
                  </div>
                ))}
              </div>

              {/* Button */}
              <button className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                plan.buttonStyle === 'outline'
                  ? 'border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                  : plan.buttonStyle === 'primary'
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black shadow-lg hover:shadow-xl'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl'
              }`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <button className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors">
            Xususiyatlarning to'liq ro'yxati
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl shadow-lg">
            <h3 className="text-xl md:text-2xl font-bold">
              <span className="bg-white text-purple-600 px-3 py-1 rounded-lg mr-2">WedApp</span>
              SIZ ENG MINIMAL YO'QOTISHLARNI KO'RIB CHIQAYLIK.
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarifRejasi;