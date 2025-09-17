import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Phone, Mail, Briefcase, Building2, MapPin, Calendar, Camera, Save, AlertCircle, Check, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';

interface EmployeeForm {
    id?: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    role: string;
    department: string;
    branch: string;
    startDate: string;
    salary: string;
    birthDate: string;
    address: string;
    emergencyContact: string;
    emergencyPhone: string;
    isActive: boolean;
}

const departmentOptions = [
    { id: 'it', name: 'IT Bo\'limi', roles: ['Admin', 'Manager', 'Employee'] },
    { id: 'hr', name: 'Kadrlar bo\'limi', roles: ['HR', 'Manager', 'Employee'] },
    { id: 'sales', name: 'Savdo bo\'limi', roles: ['Sales', 'Manager', 'Employee'] },
    { id: 'finance', name: 'Moliya bo\'limi', roles: ['Accountant', 'Manager', 'Employee'] },
    { id: 'marketing', name: 'Marketing bo\'limi', roles: ['Manager', 'Employee'] }
];

const branchOptions = [
    'Toshkent filiali',
    'Samarqand filiali',
    'Buxoro filiali',
    'Andijon filiali',
    'Namangan filiali'
];

// Mock data for employee to edit (normally this would come from props or API)
const employees: EmployeeForm[] = [
    {
        id: '1',
        fullName: 'Assalom Karimov',
        phoneNumber: '+998945344408',
        email: 'assalom@company.uz',
        role: 'Admin',
        department: 'IT Bo\'limi',
        branch: 'Toshkent filiali',
        startDate: '2025-07-24',
        salary: '15000000',
        birthDate: '1995-03-15',
        address: 'Toshkent shahar, Mirzo-Ulug\'bek tumani, 123-uy',
        emergencyContact: 'Karimova Fotima',
        emergencyPhone: '+998901234567',
        isActive: true
    },
    {
        id: '2',
        fullName: 'Malika Toshmatova',
        phoneNumber: '+998901234567',
        email: 'malika@company.uz',
        role: 'HR',
        department: 'Kadrlar bo\'limi',
        branch: 'Samarqand filiali',
        startDate: '2024-05-10',
        salary: '12000000',
        birthDate: '1990-08-20',
        address: 'Samarqand shahar, Registon ko\'chasi, 45-uy',
        emergencyContact: 'Toshmatov Bekzod',
        emergencyPhone: '+998901234568',
        isActive: true
    },
    {
        id: '3',
        fullName: 'Bobur Ergashev',
        phoneNumber: '+998901234569',
        email: 'bobur@company.uz',
        role: 'Sales',
        department: 'Savdo bo\'limi',
        branch: 'Buxoro filiali',
        startDate: '2023-11-01',
        salary: '13000000',
        birthDate: '1988-12-05',
        address: 'Buxoro shahar, Navoi ko\'chasi, 78-uy',
        emergencyContact: 'Ergasheva Dilnoza',
        emergencyPhone: '+998901234570',
        isActive: true
    }

]

const EditEmployee: React.FC = () => {
    const [formData, setFormData] = useState<EmployeeForm>(employees[0]);
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<Partial<EmployeeForm>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string>('');
    const [availableRoles, setAvailableRoles] = useState<string[]>([]);
    const [hasChanges, setHasChanges] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    const totalSteps = 3;

    // Department tanlanganida rollarni yangilash
    useEffect(() => {
        if (formData.department) {
            const selectedDept = departmentOptions.find(dept => dept.name === formData.department);
            setAvailableRoles(selectedDept?.roles || []);

            // Agar joriy rol yangi bo'limda mavjud bo'lmasa, tozalash
            if (formData.role && selectedDept && !selectedDept.roles.includes(formData.role)) {
                setFormData(prev => ({ ...prev, role: '' }));
                setHasChanges(true);
            }
        } else {
            setAvailableRoles([]);
        }
    }, [formData.department]);

    // O'zgarishlarni kuzatish
    useEffect(() => {
        if (id) {
            const employee = employees.find(emp => emp.id === id);
            if (employee) setFormData(employee);
        }
    }, [id]);

    const handleInputChange = (field: keyof EmployeeForm, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Xatolikni tozalash
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setAvatarPreview(reader.result as string);
                setHasChanges(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateStep = (step: number): boolean => {
        const newErrors: Partial<EmployeeForm> = {};

        if (step === 1) {
            if (!formData.fullName.trim()) newErrors.fullName = 'To\'liq ism kiritilishi shart';
            if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Telefon raqami kiritilishi shart';
            else if (!/^\+998\d{9}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Telefon raqami +998XXXXXXXXX formatida bo\'lishi kerak';
            if (!formData.email.trim()) newErrors.email = 'Email manzil kiritilishi shart';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email manzil noto\'g\'ri formatda';
        }

        if (step === 2) {
            if (!formData.role) newErrors.role = 'Rol tanlanishi shart';
            if (!formData.department) newErrors.department = 'Bo\'lim tanlanishi shart';
            if (!formData.branch) newErrors.branch = 'Filial tanlanishi shart';
            if (!formData.startDate) newErrors.startDate = 'Ish boshlash sanasi kiritilishi shart';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        }
    };

    const handlePrev = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) return;

        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('Updated employee data:', formData);

            // Employees ro'yxatiga qaytish
            handleBack();
        } catch (error) {
            console.error('Error updating employee:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Haqiqatdan ham bu xodimni o\'chirmoqchimisiz?')) {
            setIsLoading(true);
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                console.log('Delete employee:', formData.id);
                handleBack();
            } catch (error) {
                console.error('Error deleting employee:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleBack = () => {
        if (hasChanges) {
            if (window.confirm('Saqlanmagan o\'zgarishlar bor. Haqiqatdan ham chiqmoqchimisiz?')) {
                navigate('/dashboard/employees/list');
            }
        } else {
            navigate('/dashboard/employees/list');
        }
    };

    const getStepIcon = (step: number) => {
        if (step < currentStep) return <Check className="w-5 h-5" />;
        if (step === currentStep) return step;
        return step;
    };

    const getInitials = (fullName: string) => {
        return fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Shaxsiy ma'lumotlar</h2>

            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                    {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-white font-semibold text-lg">
                            {getInitials(formData.fullName)}
                        </div>
                    )}
                </div>
                <div className="text-center">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                        <Camera className="w-4 h-4" />
                        Rasmni o'zgartirish
                        <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    </label>
                    <p className="text-sm text-gray-500 mt-1">JPG, PNG formatda (maks 2MB)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        To'liq ism <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            placeholder="Ism Familiya"
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                        />
                    </div>
                    {errors.fullName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.fullName}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefon raqami <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            placeholder="+998901234567"
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${errors.phoneNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                        />
                    </div>
                    {errors.phoneNumber && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.phoneNumber}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email manzil <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="email@example.com"
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.email}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tug'ilgan sana
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="date"
                            value={formData.birthDate}
                            onChange={(e) => handleInputChange('birthDate', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manzil
                </label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <textarea
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="To'liq manzil"
                        rows={3}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    />
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Ish ma'lumotlari</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bo'lim <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                            value={formData.department}
                            onChange={(e) => handleInputChange('department', e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white ${errors.department ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Bo'limni tanlang</option>
                            {departmentOptions.map(dept => (
                                <option key={dept.id} value={dept.name}>{dept.name}</option>
                            ))}
                        </select>
                    </div>
                    {errors.department && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.department}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rol <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                            value={formData.role}
                            onChange={(e) => handleInputChange('role', e.target.value)}
                            disabled={!formData.department}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white ${errors.role ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                } ${!formData.department ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        >
                            <option value="">Rolni tanlang</option>
                            {availableRoles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                    {errors.role && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.role}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filial <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                            value={formData.branch}
                            onChange={(e) => handleInputChange('branch', e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white ${errors.branch ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Filialni tanlang</option>
                            {branchOptions.map(branch => (
                                <option key={branch} value={branch}>{branch}</option>
                            ))}
                        </select>
                    </div>
                    {errors.branch && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.branch}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ish boshlash sanasi <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => handleInputChange('startDate', e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${errors.startDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`} 
                        />
                    </div>
                    {errors.startDate && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.startDate}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maosh (UZS)
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">UZS</span>
                        <input
                            type="number"
                            value={formData.salary}
                            onChange={(e) => handleInputChange('salary', e.target.value)}
                            placeholder="0"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Xodim holati
                    </label>
                    <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                        <span className={`font-medium ${formData.isActive ? 'text-green-700' : 'text-red-700'}`}>
                            {formData.isActive ? 'Faol' : 'Faol emas'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Qo'shimcha ma'lumotlar</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Favqulodda holat uchun ism
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            value={formData.emergencyContact}
                            onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                            placeholder="Ism Familiya"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Favqulodda holat uchun telefon
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="tel"
                            value={formData.emergencyPhone}
                            onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                            placeholder="+998901234567"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Preview */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ma'lumotlarni ko'rib chiqish</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><span className="font-medium">To'liq ism:</span> {formData.fullName}</div>
                    <div><span className="font-medium">Telefon:</span> {formData.phoneNumber}</div>
                    <div><span className="font-medium">Email:</span> {formData.email}</div>
                    <div><span className="font-medium">Rol:</span> {formData.role}</div>
                    <div><span className="font-medium">Bo'lim:</span> {formData.department}</div>
                    <div><span className="font-medium">Filial:</span> {formData.branch}</div>
                    <div><span className="font-medium">Ish boshlash:</span> {formData.startDate}</div>
                    {formData.salary && <div><span className="font-medium">Maosh:</span> {formData.salary} UZS</div>}
                    <div><span className="font-medium">Holat:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${formData.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {formData.isActive ? 'Faol' : 'Faol emas'}
                        </span>
                    </div>
                </div>

                {hasChanges && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 text-yellow-800">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Saqlanmagan o'zgarishlar mavjud</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={handleBack}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900">Xodim ma'lumotlarini tahrirlash</h1>
                            <p className="text-gray-600">Xodim: {formData.fullName}</p>
                        </div>
                        <button
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <DeleteOutlined className="w-4 h-4" />
                            O'chirish
                        </button>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-between mb-8">
                        {Array.from({ length: totalSteps }, (_, i) => {
                            const step = i + 1;
                            const isActive = step === currentStep;
                            const isCompleted = step < currentStep;

                            return (
                                <div key={step} className="flex items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${isCompleted
                                        ? 'bg-green-600 text-white'
                                        : isActive
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-600'
                                        }`}>
                                        {getStepIcon(step)}
                                    </div>
                                    <div className="ml-3">
                                        <div className={`text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                                            {step === 1 ? 'Shaxsiy ma\'lumotlar' : step === 2 ? 'Ish ma\'lumotlari' : 'Qo\'shimcha'}
                                        </div>
                                    </div>
                                    {step < totalSteps && (
                                        <div className={`w-16 h-0.5 mx-4 ${step < currentStep ? 'bg-green-600' : 'bg-gray-200'}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Form Content */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                        <button
                            onClick={handlePrev}
                            disabled={currentStep === 1}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Orqaga
                        </button>

                        <div className="flex gap-3">
                            {currentStep === totalSteps ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading || !hasChanges}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                                >
                                    <Save className="w-5 h-5" />
                                    {isLoading ? 'Saqlanmoqda...' : hasChanges ? 'O\'zgarishlarni saqlash' : 'Hech qanday o\'zgarish yo\'q'}
                                </button>
                            ) : (
                                <button
                                    onClick={handleNext}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                                >
                                    Keyingisi
                                    <ArrowLeft className="w-5 h-5 rotate-180" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditEmployee;