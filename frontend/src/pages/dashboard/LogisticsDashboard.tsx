import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Edit3, Package, Truck, Calculator, Plus, X, Check, AlertCircle } from 'lucide-react';

// Shadcn/ui components
const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`p-6 pb-4 ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className = "", ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

const Button = ({ children, variant = "default", size = "default", className = "", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    outline: "border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-blue-300",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
  };
  const sizes = {
    default: "px-4 py-2",
    sm: "px-3 py-1.5 text-sm",
    icon: "p-2"
  };
  
  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Badge = ({ children, variant = "default", className = "", ...props }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    destructive: "bg-red-100 text-red-800"
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

const Input = ({ className = "", ...props }) => (
  <input className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${className}`} {...props} />
);

const Select = ({ children, className = "", ...props }) => (
  <select className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white ${className}`} {...props}>
    {children}
  </select>
);

const Textarea = ({ className = "", ...props }) => (
  <textarea className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${className}`} {...props} />
);

const LogisticsDashboard = () => {
  const [pickupSettings, setPickupSettings] = useState({
    address: "123 Business St, Tashkent, Uzbekistan",
    businessHours: { start: "09:00", end: "18:00" },
    serviceFee: 25000,
    currency: "UZS",
    status: "active"
  });

  const [deliverySettings, setDeliverySettings] = useState({
    deliveryTime: "2",
    deliveryOption: "fixed",
    price: 15000,
    currency: "UZS",
    customText: "",
    countries: ["Uzbekistan", "Kazakhstan"],
    cities: ["Tashkent", "Samarkand"],
    status: "active",
    flexiblePricing: {
      basePrice: 10000,
      pricePerKm: 500
    }
  });

  const [selectedCountries, setSelectedCountries] = useState(["Uzbekistan"]);
  const [selectedCities, setSelectedCities] = useState(["Tashkent"]);

  const countries = ["Uzbekistan", "Kazakhstan", "Kyrgyzstan", "Tajikistan", "Turkmenistan"];
  const citiesByCountry = {
    "Uzbekistan": ["Tashkent", "Samarkand", "Bukhara", "Andijan", "Namangan"],
    "Kazakhstan": ["Almaty", "Nur-Sultan", "Shymkent", "Aktobe"],
    "Kyrgyzstan": ["Bishkek", "Osh", "Jalal-Abad"],
    "Tajikistan": ["Dushanbe", "Khujand", "Kulob"],
    "Turkmenistan": ["Ashgabat", "Turkmenbashi", "Dashoguz"]
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: currency === 'UZS' ? 'UZS' : 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateFlexiblePrice = (distance = 10) => {
    return deliverySettings.flexiblePricing.basePrice + (distance * deliverySettings.flexiblePricing.pricePerKm);
  };

  const removeTag = (item, type) => {
    if (type === 'country') {
      setSelectedCountries(prev => prev.filter(c => c !== item));
    } else {
      setSelectedCities(prev => prev.filter(c => c !== item));
    }
  };

  return (
    <div className="min-h-screen bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Logistics Settings
          </h1>
          <p className="text-gray-600 text-lg">
            Configure your pickup and delivery options
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Pickup Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Pickup Settings</h2>
                      <p className="text-sm text-gray-500">Olib ketish</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={pickupSettings.status === 'active' ? 'success' : 'destructive'}>
                      {pickupSettings.status === 'active' ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </Badge>
                    <Button variant="outline" size="icon">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Address Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Address
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{pickupSettings.address}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Address
                    </Button>
                    {/* Google Maps Preview Placeholder */}
                    <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Google Maps Preview</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opening Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        type="time" 
                        value={pickupSettings.businessHours.start}
                        className="pl-10"
                        onChange={(e) => setPickupSettings(prev => ({
                          ...prev,
                          businessHours: { ...prev.businessHours, start: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Closing Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        type="time" 
                        value={pickupSettings.businessHours.end}
                        className="pl-10"
                        onChange={(e) => setPickupSettings(prev => ({
                          ...prev,
                          businessHours: { ...prev.businessHours, end: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Service Fee */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Fee
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <Input 
                        type="number" 
                        value={pickupSettings.serviceFee}
                        onChange={(e) => setPickupSettings(prev => ({
                          ...prev,
                          serviceFee: parseInt(e.target.value)
                        }))}
                      />
                    </div>
                    <Select 
                      value={pickupSettings.currency}
                      onChange={(e) => setPickupSettings(prev => ({
                        ...prev,
                        currency: e.target.value
                      }))}
                    >
                      <option value="UZS">UZS</option>
                      <option value="USD">USD</option>
                    </Select>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Display: {formatCurrency(pickupSettings.serviceFee, pickupSettings.currency)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Truck className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Delivery Settings</h2>
                      <p className="text-sm text-gray-500">Yetkazib berish</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={deliverySettings.status === 'active' ? 'success' : 'destructive'}>
                      {deliverySettings.status === 'active' ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </Badge>
                    <Button variant="outline" size="icon">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Delivery Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Time
                  </label>
                  <Select 
                    value={deliverySettings.deliveryTime}
                    onChange={(e) => setDeliverySettings(prev => ({
                      ...prev,
                      deliveryTime: e.target.value
                    }))}
                  >
                    <option value="1">1 day</option>
                    <option value="2">2 days</option>
                    <option value="3">3 days</option>
                  </Select>
                </div>

                {/* Delivery Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Delivery Options
                  </label>
                  <div className="space-y-4">
                    {[
                      { id: 'free', label: 'Free delivery', desc: 'No charge for delivery' },
                      { id: 'fixed', label: 'Fixed price', desc: 'Set a standard delivery fee' },
                      { id: 'flexible', label: 'Flexible price', desc: 'Distance-based pricing' },
                      { id: 'custom', label: 'Custom text', desc: 'Custom delivery message' }
                    ].map((option) => (
                      <div key={option.id} className="space-y-3">
                        <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border-2 border-gray-100 hover:border-blue-200 transition-colors">
                          <input 
                            type="radio" 
                            name="deliveryOption" 
                            value={option.id}
                            checked={deliverySettings.deliveryOption === option.id}
                            onChange={(e) => setDeliverySettings(prev => ({
                              ...prev,
                              deliveryOption: e.target.value
                            }))}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{option.label}</div>
                            <div className="text-sm text-gray-500">{option.desc}</div>
                          </div>
                        </label>

                        {/* Option-specific inputs */}
                        {deliverySettings.deliveryOption === option.id && option.id === 'fixed' && (
                          <div className="ml-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2">
                              <Input 
                                type="number" 
                                placeholder="Enter price"
                                value={deliverySettings.price}
                                onChange={(e) => setDeliverySettings(prev => ({
                                  ...prev,
                                  price: parseInt(e.target.value)
                                }))}
                              />
                            </div>
                            <Select 
                              value={deliverySettings.currency}
                              onChange={(e) => setDeliverySettings(prev => ({
                                ...prev,
                                currency: e.target.value
                              }))}
                            >
                              <option value="UZS">UZS</option>
                              <option value="USD">USD</option>
                            </Select>
                          </div>
                        )}

                        {deliverySettings.deliveryOption === option.id && option.id === 'flexible' && (
                          <div className="ml-7 space-y-3">
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-3">
                                <Calculator className="h-4 w-4 text-blue-600" />
                                <span className="font-medium text-blue-900">Distance Calculator</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-blue-700 mb-1">Base Price</label>
                                  <Input 
                                    type="number" 
                                    value={deliverySettings.flexiblePricing.basePrice}
                                    onChange={(e) => setDeliverySettings(prev => ({
                                      ...prev,
                                      flexiblePricing: {
                                        ...prev.flexiblePricing,
                                        basePrice: parseInt(e.target.value)
                                      }
                                    }))}
                                    className="text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-blue-700 mb-1">Per KM</label>
                                  <Input 
                                    type="number" 
                                    value={deliverySettings.flexiblePricing.pricePerKm}
                                    onChange={(e) => setDeliverySettings(prev => ({
                                      ...prev,
                                      flexiblePricing: {
                                        ...prev.flexiblePricing,
                                        pricePerKm: parseInt(e.target.value)
                                      }
                                    }))}
                                    className="text-sm"
                                  />
                                </div>
                              </div>
                              <div className="mt-2 text-xs text-blue-700">
                                Example (10km): {formatCurrency(calculateFlexiblePrice(10), deliverySettings.currency)}
                              </div>
                            </div>
                          </div>
                        )}

                        {deliverySettings.deliveryOption === option.id && option.id === 'custom' && (
                          <div className="ml-7">
                            <Textarea 
                              placeholder="Enter custom delivery message..."
                              rows={3}
                              value={deliverySettings.customText}
                              onChange={(e) => setDeliverySettings(prev => ({
                                ...prev,
                                customText: e.target.value
                              }))}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location Settings */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Countries
                    </label>
                    <Select onChange={(e) => {
                      if (e.target.value && !selectedCountries.includes(e.target.value)) {
                        setSelectedCountries(prev => [...prev, e.target.value]);
                      }
                    }}>
                      <option value="">Select countries...</option>
                      {countries.filter(country => !selectedCountries.includes(country)).map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedCountries.map(country => (
                        <span key={country} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                          {country}
                          <button onClick={() => removeTag(country, 'country')} className="ml-2 hover:text-blue-600">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Cities
                    </label>
                    <Select onChange={(e) => {
                      if (e.target.value && !selectedCities.includes(e.target.value)) {
                        setSelectedCities(prev => [...prev, e.target.value]);
                      }
                    }}>
                      <option value="">Select cities...</option>
                      {selectedCountries.flatMap(country => 
                        citiesByCountry[country]?.filter(city => !selectedCities.includes(city)) || []
                      ).map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedCities.map(city => (
                        <span key={city} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                          {city}
                          <button onClick={() => removeTag(city, 'city')} className="ml-2 hover:text-green-600">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                  <p className="text-sm text-gray-500">Current settings summary</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Pickup Preview */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-gray-900">Pickup</span>
                    </div>
                    <div className="pl-6 space-y-2 text-sm text-gray-600">
                      <div>📍 {pickupSettings.address.split(',')[0]}...</div>
                      <div>🕐 {pickupSettings.businessHours.start} - {pickupSettings.businessHours.end}</div>
                      <div>💰 {formatCurrency(pickupSettings.serviceFee, pickupSettings.currency)}</div>
                      <Badge variant={pickupSettings.status === 'active' ? 'success' : 'destructive'} className="text-xs">
                        {pickupSettings.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Delivery Preview */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-gray-900">Delivery</span>
                    </div>
                    <div className="pl-6 space-y-2 text-sm text-gray-600">
                      <div>⏱️ {deliverySettings.deliveryTime} day{deliverySettings.deliveryTime !== '1' ? 's' : ''}</div>
                      <div>
                        📦 {deliverySettings.deliveryOption === 'free' && 'Free delivery'}
                        {deliverySettings.deliveryOption === 'fixed' && `Fixed: ${formatCurrency(deliverySettings.price, deliverySettings.currency)}`}
                        {deliverySettings.deliveryOption === 'flexible' && 'Distance-based pricing'}
                        {deliverySettings.deliveryOption === 'custom' && 'Custom message'}
                      </div>
                      <div>🌍 {selectedCountries.length} countries</div>
                      <div>🏙️ {selectedCities.length} cities</div>
                      <Badge variant={deliverySettings.status === 'active' ? 'success' : 'destructive'} className="text-xs">
                        {deliverySettings.status}
                      </Badge>
                    </div>
                  </div>

                  <Button className="w-full">
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsDashboard;