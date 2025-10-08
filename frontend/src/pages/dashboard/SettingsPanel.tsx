import {useState, useEffect, useRef, SetStateAction} from 'react';
import {
    Upload,
    Plus,
    X,
    Edit,
    MapPin,
    Phone,
    Globe,
    Clock,
    Building,
    ChevronLeft,
    ChevronRight,
    Check
} from 'lucide-react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import telegram_icon from '@/images/telegram.png';
import instagram_icon from '@/images/icons8-instagram-94.png';
import facebook_icon from '@/images/icons8-facebook-48 (1).png';
import youtube_icon from '@/images/icons8-youtube-50 (1).png';
import tiktok_icon from '@/images/icons8-tik-tok-94.png';
import whatsapp from '@/images/icons8-whatsapp-50.png'
import {useToast} from "@/hooks/use-toast.ts";


const SettingsPanel = () => {
    const [activeLanguage, setActiveLanguage] = useState('uz');
    const [companyName, setCompanyName] = useState('weddStore');
    const [isEditingCompany, setIsEditingCompany] = useState(false);
    const [phoneCode, setPhoneCode] = useState('+998');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [currency, setCurrency] = useState('UZS');
    const [branchName, setBranchName] = useState('Guncha');
    const [isEditingBranch, setIsEditingBranch] = useState(false);

    // Language settings with primary language
    const [languageSettings, setLanguageSettings] = useState({
        uz: {enabled: true, isPrimary: true},
        ru: {enabled: true, isPrimary: false},
        en: {enabled: true, isPrimary: false},
        tr: {enabled: true, isPrimary: false}
    });


    const [workDays, setWorkDays] = useState({
        dushanba: {active: true, times: [{start: '09:00', end: '18:00'}]},
        seshanba: {active: true, times: [{start: '09:00', end: '18:00'}]},
        chorshanba: {active: true, times: [{start: '09:00', end: '18:00'}]},
        payshanba: {active: true, times: [{start: '09:00', end: '18:00'}]},
        juma: {active: true, times: [{start: '09:00', end: '18:00'}]},
        shanba: {active: true, times: [{start: '10:00', end: '16:00'}]},
        yakshanba: {active: false, times: [{start: '10:00', end: '16:00'}]}
    });

    const [socialLinks, setSocialLinks] = useState({
        instagram: '',
        facebook: '',
        tiktok: '',
        telegram: '',
        youtube: '',
        whatsapp: ''
    });

    const [timePickerOpen, setTimePickerOpen] = useState(false);
    const [selectedTime, setSelectedTime] = useState({hour: 9, minute: 0});
    const [currentTimeEdit, setCurrentTimeEdit] = useState(null);
    const [timePickerMode, setTimePickerMode] = useState('hour');
    const [hoveredTime, setHoveredTime] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Image upload state
    const [companyImage, setCompanyImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const languages = [
        {code: 'uz', name: "O'zbek", flag: '🇺🇿'},
        {code: 'ru', name: 'Русский', flag: '🇷🇺'},
        {code: 'en', name: 'English', flag: '🇺🇸'},
        {code: 'tr', name: 'Türkçe', flag: '🇹🇷'}
    ];

    const countryCodes = [
        {code: '+998', country: "O'zbekiston", flag: '🇺🇿'},
        {code: '+996', country: 'Qirg\'iziston', flag: '🇰🇬'},
        {code: '+7', country: 'Rossiya', flag: '🇷🇺'},
        {code: '+90', country: 'Turkiya', flag: '🇹🇷'},
        {code: '+1', country: 'AQSH', flag: '🇺🇸'},
        {code: '+86', country: 'Xitoy', flag: '🇨🇳'}
    ];

    const currencies = ['UZS', 'USD', 'EUR', 'RUB', 'TRY'];

    const dayNames = {
        dushanba: 'Dushanba',
        seshanba: 'Seshanba',
        chorshanba: 'Chorshanba',
        payshanba: 'Payshanba',
        juma: 'Juma',
        shanba: 'Shanba',
        yakshanba: 'Yakshanba'
    };

    // Social media icons - using emojis as placeholders
    const socialIcons = {
        Instagram: instagram_icon,
        Facebook: facebook_icon,
        Tiktok: tiktok_icon,
        Telegram: telegram_icon,
        youtube: youtube_icon,
        Whatsapp: whatsapp,
    };
    const {toast} = useToast();

    const openTimePicker = (day, timeIndex, type) => {
        const time = workDays[day].times[timeIndex];
        const timeString = type === 'start' ? time.start : time.end;
        const [hour, minute] = timeString.split(':').map(Number);

        setSelectedTime({hour, minute});
        setCurrentTimeEdit({day, timeIndex, type});
        setTimePickerMode('hour');
        setTimePickerOpen(true);
        setIsAnimating(true);
    };

    const updateTime = () => {
        if (!currentTimeEdit) return;

        const {day, timeIndex, type} = currentTimeEdit;
        const timeString = `${selectedTime.hour.toString().padStart(2, '0')}:${selectedTime.minute.toString().padStart(2, '0')}`;

        setWorkDays(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                times: prev[day].times.map((time, idx) =>
                    idx === timeIndex
                        ? {...time, [type]: timeString}
                        : time
                )
            }
        }));

        closeTimePicker();
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "Ogohlantirish",
                    description: "Fayl hajmi 5MB dan oshmasligi kerak!",
                    duration: 3000,
                })
                return;
            }

            // Check file type
            if (!file.type.match(/image\/(png|jpg|jpeg|gif|webp)/)) {
                toast({
                    title: "Ogohlantirish",
                    description: 'Faqat rasm fayllari qo\'llab-quvvatlanadi!',
                    duration: 3000,
                })
                return;
            }

            setCompanyImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);

            // TODO: Backend integration - send file to server
            // uploadImageToServer(file);
        }
    };

    const setPrimaryLanguage = (langCode) => {
    setLanguageSettings(prev => {
      const updated = {};
      Object.keys(prev).forEach(code => {
        updated[code] = {
          ...prev[code],
          isPrimary: code === langCode,
          enabled: code === langCode ? true : prev[code].enabled
        };
      });
      return updated;
      // TODO: Backend integration - save primary language setting
    });
  };

    const toggleLanguage = (langCode) => {
        setLanguageSettings(prev => ({
            ...prev,
            [langCode]: {
                ...prev[langCode],
                enabled: !prev[langCode].enabled,
                isPrimary: prev[langCode].isPrimary && prev[langCode].enabled ? false : prev[langCode].isPrimary
            }
            // TODO: Backend integration - save language settings
        }));
    };

    const closeTimePicker = () => {
        setIsAnimating(false);
        setTimeout(() => {
            setTimePickerOpen(false);
            setCurrentTimeEdit(null);
            setHoveredTime(null);
        }, 200);
    };

    const addTimeSlot = (day) => {
        setWorkDays(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                times: [...prev[day].times, {start: '09:00', end: '18:00'}]
            }
        }));
    };

    const removeTimeSlot = (day, timeIndex) => {
        if (workDays[day].times.length === 1) return;

        setWorkDays(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                times: prev[day].times.filter((_, idx) => idx !== timeIndex)
            }
        }));
    };

    const toggleDay = (day) => {
        setWorkDays(prev => ({
            ...prev,
            [day]: {...prev[day], active: !prev[day].active}
        }));
    };

    const CircularTimePicker = () => {
        const clockRef = useRef(null);
        const outerNumbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        const innerNumbers = timePickerMode === 'hour' ?
            [0, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23] :
            [];
        const minuteNumbers = timePickerMode === 'minute' ?
            Array.from({length: 12}, (_, i) => i * 5) :
            [];
        const allMinutes = Array.from({length: 60}, (_, i) => i);

        const selectedValue = timePickerMode === 'hour' ? selectedTime.hour : selectedTime.minute;
        const displayTime = hoveredTime || selectedTime;

        const handleNumberClick = (num) => {
            if (timePickerMode === 'hour') {
                setSelectedTime(prev => ({...prev, hour: num}));
                setTimeout(() => setTimePickerMode('minute'), 300);
            } else {
                setSelectedTime(prev => ({...prev, minute: num}));
            }
            setHoveredTime(null);
        };

        const handleMouseEnter = (num) => {
            if (timePickerMode === 'hour') {
                setHoveredTime({...selectedTime, hour: num});
            } else {
                setHoveredTime({...selectedTime, minute: num});
            }
        };

        const handleMouseLeave = () => {
            setHoveredTime(null);
        };

        const calculateTimeFromPosition = (e, isDrag = false) => {
            if (!clockRef.current) return;
            const rect = clockRef.current.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const mx = e.clientX || (e.touches && e.touches[0].clientX);
            const my = e.clientY || (e.touches && e.touches[0].clientY);
            const dx = mx - cx;
            const dy = my - cy;
            let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
            if (angle < 0) angle += 360;
            angle %= 360;

            const dist = Math.sqrt(dx * dx + dy * dy);
            let newValue;
            if (timePickerMode === 'hour') {
                let h = Math.round(angle / 30) % 12;
                const isInner = dist < 70; // Inner radius ~55, buffer 70
                if (isInner) {
                    h += 12;
                    if (h === 24) h = 0;
                }
                newValue = {hour: h};
            } else {
                const m = Math.round(angle / 6) % 60;
                newValue = {minute: m};
            }

            if (isDrag) {
                setSelectedTime(prev => ({...prev, ...newValue}));
            } else {
                setHoveredTime({...selectedTime, ...newValue});
            }
        };

        const handleStart = (e) => {
            e.preventDefault();
            setIsDragging(true);
            calculateTimeFromPosition(e, true);
        };

        const handleMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            calculateTimeFromPosition(e, true);
        };

        const handleEnd = () => {
            setIsDragging(false);
        };

        const handleClockMouseMove = (e) => {
            if (isDragging) return;
            calculateTimeFromPosition(e);
        };

        useEffect(() => {
            if (isDragging) {
                document.addEventListener('mousemove', handleMove);
                document.addEventListener('mouseup', handleEnd);
                document.addEventListener('touchmove', handleMove, {passive: false});
                document.addEventListener('touchend', handleEnd);
                return () => {
                    document.removeEventListener('mousemove', handleMove);
                    document.removeEventListener('mouseup', handleEnd);
                    document.removeEventListener('touchmove', handleMove);
                    document.removeEventListener('touchend', handleEnd);
                };
            }
        }, [isDragging]);

        const renderHourNumbers = () => {
            return (
                <>
                    {/* Outer circle (12,1-11) */}
                    {outerNumbers.map((num, index) => {
                        const angle = index * 30 - 90;
                        const radian = (angle * Math.PI) / 180;
                        const radius = 85;
                        const x = Math.cos(radian) * radius + 120;
                        const y = Math.sin(radian) * radius + 120;
                        const isSelected = num === selectedValue;
                        const isHovered = hoveredTime?.hour === num;

                        return (
                            <button
                                key={`outer-${num}`}
                                className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${isSelected ? 'bg-blue-500 text-white scale-105 shadow' : isHovered ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-600'
                                }`}
                                style={{left: x, top: y}}
                                onClick={() => handleNumberClick(num)}
                                onMouseEnter={() => handleMouseEnter(num)}
                                onMouseLeave={handleMouseLeave}
                            >
                                {num}
                            </button>
                        );
                    })}

                    {/* Inner circle (0,13-23) */}
                    {innerNumbers.map((num, index) => {
                        const angle = index * 30 - 90;
                        const radian = (angle * Math.PI) / 180;
                        const radius = 55;
                        const x = Math.cos(radian) * radius + 120;
                        const y = Math.sin(radian) * radius + 120;
                        const isSelected = num === selectedValue;
                        const isHovered = hoveredTime?.hour === num;
                        const displayNum = num === 0 ? '00' : num;

                        return (
                            <button
                                key={`inner-${num}`}
                                className={`absolute w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${isSelected ? 'bg-blue-500 text-white scale-105 shadow' : isHovered ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-500'
                                }`}
                                style={{left: x, top: y}}
                                onClick={() => handleNumberClick(num)}
                                onMouseEnter={() => handleMouseEnter(num)}
                                onMouseLeave={handleMouseLeave}
                            >
                                {displayNum}
                            </button>
                        );
                    })}
                </>
            );
        };

        const renderMinuteNumbers = () => {
            return (
                <>
                    {/* Main minute numbers (0,5,10,...) */}
                    {minuteNumbers.map((num, index) => {
                        const angle = index * 30 - 90;
                        const radian = (angle * Math.PI) / 180;
                        const radius = 85;
                        const x = Math.cos(radian) * radius + 120;
                        const y = Math.sin(radian) * radius + 120;
                        const isSelected = num === selectedValue;
                        const isHovered = hoveredTime?.minute === num;

                        return (
                            <button
                                key={`minute-${num}`}
                                className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${isSelected ? 'bg-blue-500 text-white scale-105 shadow' : isHovered ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-600'
                                }`}
                                style={{left: x, top: y}}
                                onClick={() => handleNumberClick(num)}
                                onMouseEnter={() => handleMouseEnter(num)}
                                onMouseLeave={handleMouseLeave}
                            >
                                {num.toString().padStart(2, '0')}
                            </button>
                        );
                    })}

                    {/* Minute dots (kichik va hover da faol) */}
                    {allMinutes.filter(m => m % 5 !== 0).map((num) => {
                        const angle = num * 6 - 90;
                        const radian = (angle * Math.PI) / 180;
                        const radius = 85;
                        const x = Math.cos(radian) * radius + 120;
                        const y = Math.sin(radian) * radius + 120;
                        const isSelected = num === selectedValue;
                        const isHovered = hoveredTime?.minute === num;

                        return (
                            <button
                                key={`minute-dot-${num}`}
                                className={`absolute w-1.5 h-1.5 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${isSelected ? 'bg-blue-500 scale-125 shadow' : isHovered ? 'bg-blue-200 scale-110' : 'bg-transparent hover:bg-blue-100 hover:scale-110'
                                }`}
                                style={{left: x, top: y}}
                                onClick={() => handleNumberClick(num)}
                                onMouseEnter={() => handleMouseEnter(num)}
                                onMouseLeave={handleMouseLeave}
                            />
                        );
                    })}
                </>
            );
        };

        const getSelectionAngle = () => {
            if (timePickerMode === 'hour') {
                return (displayTime.hour % 12) * 30;
            } else {
                return displayTime.minute * 6;
            }
        };

        const getSelectionRadius = () => {
            if (timePickerMode === 'hour') {
                const hour = displayTime.hour;
                return (hour > 12 || hour === 0) ? 55 : 85;
            }
            return 85;
        };

        if (!timePickerOpen) return null;

        return (
            <div
                className={`fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
                <div
                    className={`bg-white rounded-xl p-4 w-full max-w-80 sm:w-96 sm:p-6 shadow-lg transform transition-all duration-300 ${isAnimating ? 'scale-100' : 'scale-95'}`}>
                    {/* Header */}
                    <div className="text-center mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <button
                                onClick={() => setTimePickerMode('hour')}
                                className={`px-2 py-1 rounded text-xs sm:text-sm font-medium transition-colors ${timePickerMode === 'hour' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                Soat
                            </button>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-700">Vaqt tanlash</h3>
                            <button
                                onClick={() => setTimePickerMode('minute')}
                                className={`px-2 py-1 rounded text-xs sm:text-sm font-medium transition-colors ${timePickerMode === 'minute' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                Minut
                            </button>
                        </div>
                        <div
                            className="text-2xl sm:text-3xl font-mono font-bold text-gray-800 bg-gray-50 rounded py-1 sm:py-2">
                            {displayTime.hour.toString().padStart(2, '0')}:{displayTime.minute.toString().padStart(2, '0')}
                        </div>
                    </div>

                    {/* Clock Face */}
                    <div
                        className="relative w-48 h-48 sm:w-60 sm:h-60 mx-auto mb-4 sm:mb-6 cursor-pointer"
                        ref={clockRef}
                        onMouseMove={handleClockMouseMove}
                        onMouseDown={handleStart}
                        onTouchStart={handleStart}
                    >
                        <div className="w-full h-full border border-gray-200 rounded-full relative bg-white shadow-sm">
                            {timePickerMode === 'hour' ? renderHourNumbers() : renderMinuteNumbers()}

                            {/* Center dot */}
                            <div
                                className="absolute w-2 h-2 bg-blue-500 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>

                            {/* Selection line (tayoqcha) */}
                            <div
                                className="absolute w-0.5 bg-blue-500 origin-bottom transition-all duration-200"
                                style={{
                                    height: `${getSelectionRadius()}px`,
                                    left: '50%',
                                    top: '50%',
                                    transform: `translateX(-50%) translateY(-100%) rotate(${getSelectionAngle()}deg)`
                                }}
                            >
                                <div
                                    className="absolute w-1.5 h-1.5 bg-blue-500 rounded-full -right-0.5 -top-0.5"></div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-2 sm:gap-3">
                        <button
                            className="px-3 py-1 sm:px-4 sm:py-2 text-gray-600 hover:bg-gray-50 rounded font-medium transition-colors"
                            onClick={closeTimePicker}
                        >
                            Bekor
                        </button>
                        <button
                            className="px-4 py-1 sm:px-6 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium transition-colors shadow hover:shadow-md"
                            onClick={updateTime}
                        >
                            OK
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200 min-h-screen">
            {/* Header with image upload */}
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 mb-6 w-full lg:w-[70%]">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative">
                        <div
                            className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center overflow-hidden">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Company logo"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Building className="w-8 h-8 lg:w-10 lg:h-10 text-white"/>
                            )}
                        </div>
                        <label
                            className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors cursor-pointer">
                            <Upload className="w-4 h-4"/>
                            <input
                                type="file"
                                accept="image/png,image/jpg,image/jpeg,image/gif,image/webp"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        {isEditingCompany ? (
                            <div className="flex items-center justify-center sm:justify-start gap-2">
                                <input
                                    type="text"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    className="text-xl lg:text-2xl font-bold border-b-2 border-blue-500 bg-transparent outline-none text-center sm:text-left"
                                    onBlur={() => setIsEditingCompany(false)}
                                    onKeyPress={(e) => e.key === 'Enter' && setIsEditingCompany(false)}
                                    autoFocus
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center sm:justify-start gap-2">
                                <h1 className="text-xl lg:text-2xl font-bold text-gray-800">{companyName}</h1>
                                <button
                                    onClick={() => setIsEditingCompany(true)}
                                    className="text-gray-400 hover:text-blue-500 transition-colors"
                                >
                                    <Edit className="w-4 h-4"/>
                                </button>
                            </div>
                        )}
                        <p className="text-gray-600 mt-1">Kompaniya sozlamalari</p>
                    </div>
                </div>
            </div>

            {/* Enhanced Language Settings */}
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 mb-6 w-full lg:w-[70%]">
                <div className="flex items-center gap-3 mb-4">
                    <Globe className="w-5 h-5 text-blue-500"/>
                    <h2 className="text-lg font-semibold">Til sozlamalari</h2>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-green-800">
                        Saytingiz qo'llab-quvvatlaydigan tillarni tanlang
                    </p>
                </div>

                <div className="space-y-3">
                    {languages.map((lang) => (
                        <div key={lang.code}
                             className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                {/* Enable/Disable checkbox */}
                                <button
                                    onClick={() => toggleLanguage(lang.code)}
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${languageSettings[lang.code].enabled
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : 'border-gray-300 hover:border-green-400'
                                    }`}
                                >
                                    {languageSettings[lang.code].enabled && <Check className="w-3 h-3"/>}
                                </button>
                                <span className="text-2xl">{lang.flag}</span>
                                <span className="font-medium">{lang.name}</span>
                            </div>

                            {/* Primary language selection */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPrimaryLanguage(lang.code)}
                                    disabled={!languageSettings[lang.code].enabled}
                                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${languageSettings[lang.code].isPrimary
                                        ? 'bg-blue-500 border-blue-500'
                                        : languageSettings[lang.code].enabled
                                            ? 'border-gray-300 hover:border-blue-400'
                                            : 'border-gray-200 cursor-not-allowed'
                                    }`}
                                >
                                    {languageSettings[lang.code].isPrimary && (
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                </button>
                                <span className="text-sm text-gray-600">Asosiy til</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 w-[70%]">
                <div className="flex items-center gap-3 mb-4">
                    <Phone className="w-5 h-5 text-blue-500"/>
                    <h2 className="text-lg font-semibold">Aloqa uchun telefon raqami</h2>
                </div>

                <div className="flex gap-2">
                    <div>
                        <Select
                            value={phoneCode}
                            onValueChange={(e) => setPhoneCode(e)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Tilni tanlang"/>
                            </SelectTrigger>
                            <SelectContent>
                                {countryCodes.map((country) => (
                                    <SelectItem key={country.code} value={country.code}>
                                        {country.flag} {country.code} ({country.country})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Telefon raqami"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                    />
                </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 w-[70%]">
                <h2 className="text-lg font-semibold mb-4">Ijtimoiy tarmoqlarga havolalar</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(socialIcons).map(([platform, icon]) => (
                        <div key={platform} className="flex items-center gap-2">
                            {/* Icon */}
                            <img
                                src={icon}
                                alt={platform}
                                className="w-6 h-6 object-contain"
                            />

                            {/* Input */}
                            <input
                                type="url"
                                value={socialLinks[platform] || ""}
                                onChange={(e) =>
                                    setSocialLinks((prev) => ({
                                        ...prev,
                                        [platform]: e.target.value
                                    }))
                                }
                                placeholder={`${platform} havolasi`}
                                className="flex-1 border border-gray-300 bg-[#f5f5f5] rounded-lg px-3 py-2"
                            />
                        </div>
                    ))}
                </div>
            </div>


            {/* Currency Settings */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 w-[70%]">
                <h2 className="text-lg font-semibold mb-4">Valyuta</h2>
                <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full md:w-48 border border-gray-300 rounded-lg px-3 py-2 bg-[#f5f5f5]"
                >
                    {currencies.map((curr) => (
                        <option key={curr} value={curr}>{curr}</option>
                    ))}
                </select>
            </div>

            {/* Work Schedule */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 w-[70%]">
                <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-5 h-5 text-blue-500"/>
                    <h2 className="text-lg font-semibold">Ish vaqti</h2>
                </div>

                <div className="space-y-4">
                    {Object.entries(workDays).map(([day, data]) => (
                        <div key={day} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => toggleDay(day)}
                                        className={`w-12 h-6 rounded-full transition-colors ${data.active ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                    >
                                        <div
                                            className={`w-5 h-5 bg-white rounded-full transition-transform ${data.active ? 'translate-x-6' : 'translate-x-0.5'
                                            }`}></div>
                                    </button>
                                    <span className="font-medium">{dayNames[day]}</span>
                                </div>
                                <button
                                    onClick={() => addTimeSlot(day)}
                                    className="text-blue-500 hover:text-blue-600"
                                >
                                    <Plus className="w-5 h-5"/>
                                </button>
                            </div>

                            {data.active && (
                                <div className="space-y-2">
                                    {data.times.map((timeSlot, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <button
                                                onClick={() => openTimePicker(day, index, 'start')}
                                                className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-50"
                                            >
                                                {timeSlot.start}
                                            </button>
                                            <span>-</span>
                                            <button
                                                onClick={() => openTimePicker(day, index, 'end')}
                                                className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-50"
                                            >
                                                {timeSlot.end}
                                            </button>
                                            {data.times.length > 1 && (
                                                <button
                                                    onClick={() => removeTimeSlot(day, index)}
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    <X className="w-4 h-4"/>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Branch Location */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 w-[70%]">
                <div className="flex items-center gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-blue-500"/>
                    <h2 className="text-lg font-semibold">Manzil</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Filial nomi</label>
                        {isEditingBranch ? (
                            <input
                                type="text"
                                value={branchName}
                                onChange={(e) => setBranchName(e.target.value)}
                                className="w-full border border-blue-500 rounded-lg px-3 py-2 outline-none"
                                onBlur={() => setIsEditingBranch(false)}
                                onKeyPress={(e) => e.key === 'Enter' && setIsEditingBranch(false)}
                                autoFocus
                            />
                        ) : (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={branchName}
                                    onClick={() => setIsEditingBranch(true)}
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:border-blue-500"
                                    readOnly
                                />
                                <button
                                    onClick={() => setIsEditingBranch(true)}
                                    className="text-gray-400 hover:text-blue-500"
                                >
                                    <Edit className="w-4 h-4"/>
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Manzilni xaritadan
                            toping</label>
                        <div
                            className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <div className="text-center">
                                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2"/>
                                <p className="text-gray-500">Xarita bu yerda ko'rsatiladi</p>
                                <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                    Manzilni tanlash
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        Bekor qilish
                    </button>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        O'zgarishlarni saqlash
                    </button>
                </div>
            </div>

            {/* Time Picker Modal */}
            {timePickerOpen && <CircularTimePicker/>}
        </div>
    );
};

export default SettingsPanel;