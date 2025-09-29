import React, {useRef, useState} from 'react';
import {ArrowLeft, CheckCircle, ExternalLink, Send} from 'lucide-react';
import {useLocation, useNavigate} from 'react-router-dom';
import {resendVerificationCode, verifyOTP} from '@/services/authService';

const VerifyCode = () => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate();
    const location = useLocation();
    const {phoneNumber, username, telegramAppLink} = location.state || {};

    const handleInputChange = (index: number, value: string) => {
        if (value.length > 1) return;
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        if (error) setError('');
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasteData.length === 6) {
            const newCode = pasteData.split('');
            setCode(newCode);
            inputRefs.current[5]?.focus();
        }
    };

    const verifyCodeHandler = async () => {
        const verificationCode = code.join('').replace(/\s/g, '');
        if (!/^\d{6}$/.test(verificationCode)) {
            setError("Iltimos, 6 raqamli kodni to‘g‘ri kiriting");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await verifyOTP({phone_number: phoneNumber, code: verificationCode})
            if (response.token) {
                localStorage.setItem('auth_token', response.token);
                setTimeout(() => {
                    alert('✅ Akkaunt muvaffaqiyatli tasdiqlandi!');
                }, 100);
                navigate('/', {replace: true});
            } else {
                setError(response.message || 'Tasdiqlashda xatolik yuz berdi');
            }
        } catch (error: any) {
            console.error("Registratsiya xatosi:", error.response?.data);
            const errorData = error.response?.data || {};
            let errorMessage = "Ro'yxatdan o'tishda xatolik yuz berdi";
            if (errorData.username) {
                errorMessage = "Bu username allaqachon ro‘yxatdan o‘tgan. Boshqa username kiriting.";
            } else if (errorData.phone_number) {
                errorMessage = "Bu telefon raqami allaqachon ro‘yxatdan o‘tgan. Login qiling yoki boshqa raqam kiriting.";
            } else if (errorData.password) {
                errorMessage = "Parollar mos kelmaydi yoki noto‘g‘ri.";
            }
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const resendCode = async () => {
        setResendLoading(true);
        setError('');
        try {
            const action = 'login' //location.pathname.includes('/verify-login') ? 'login' : 'register';
            const response = await resendVerificationCode(phoneNumber, action);
            if (response.success) {
                alert('✅ Yangi kod yuborildi!');
            }
        } catch (err: any) {
            console.error('Resend xatosi:', err);
            setError(err.message || 'Kodni qayta yuborishda xatolik yuz berdi');
        } finally {
            setResendLoading(false);
        }
    };

    const openTelegramBot = () => {
        if (telegramAppLink) {
            window.location.href = telegramAppLink;
        } else {
            window.location.href = `tg://resolve?domain=weddProBot`;
        }
    };

    const isCodeComplete = code.every(digit => digit !== '');

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-indigo-200 via-gray-200 to-[#a9b3c4] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -inset-10 opacity-50">
                    <div
                        className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#dfd3d3] rounded-full blur-[160px] opacity-20"></div>
                    <div
                        className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-[#d8e3da] rounded-full blur-[140px] opacity-20"></div>
                </div>
            </div>

            <div className="relative w-full max-w-md mx-auto p-4">
                <div
                    className="bg-white backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden">
                    <div className="relative p-6 pb-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors p-2"
                        >
                            <ArrowLeft size={20}/>
                        </button>

                        <div className="text-center pt-8">
                            <div
                                className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Send className="w-8 h-8 text-blue-600"/>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Akkauntni tasdiqlash
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {phoneNumber && (
                                    <>
                                        <span className="font-medium">{phoneNumber}</span> raqamiga
                                        <br/>
                                    </>
                                )}
                                Tasdiqlash kodi yuborildi
                            </p>
                        </div>
                    </div>

                    <div className="px-6 pb-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                            <div className="flex items-start space-x-3">
                                <div
                                    className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <ExternalLink className="w-4 h-4 text-white"/>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                        Telegram botdan kod oling
                                    </h3>
                                    <p className="text-sm text-gray-700 mb-3">
                                        Ro'yxatdan to'liq o'tish uchun telegram botdan ro'yxatdan o'tib
                                        6 raqamli kodni oling va quyidagi bo'sh joylarga kiriting.
                                    </p>
                                    <button
                                        onClick={openTelegramBot}
                                        className="inline-flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        <span>Telegram botni ochish</span>
                                        <ExternalLink className="w-4 h-4"/>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                6 raqamli tasdiqlash kodini kiriting
                            </label>
                            <div className="flex space-x-3 justify-center">
                                {code.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={el => inputRefs.current[index] = el}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={index === 0 ? handlePaste : undefined}
                                        className="w-12 h-12 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-gray-50"
                                        disabled={loading}
                                    />
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div
                                className="mb-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={verifyCodeHandler}
                            disabled={loading || !isCodeComplete}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div
                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Tasdiqlanmoqda...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center space-x-2">
                                    <CheckCircle className="w-5 h-5"/>
                                    <span>Tasdiqlash</span>
                                </div>
                            )}
                        </button>

                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-600 mb-2">
                                Kod kelmadimi?{' '}
                                {resendCooldown > 0 && (
                                    <span className="text-gray-500">({resendCooldown} soniya kutish)</span>
                                )}
                            </p>
                            <button
                                onClick={resendCode}
                                disabled={resendLoading || resendCooldown > 0}
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors disabled:text-gray-400"
                            >
                                {resendLoading ? 'Yuborilmoqda...' : 'Qayta yuborish'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyCode;