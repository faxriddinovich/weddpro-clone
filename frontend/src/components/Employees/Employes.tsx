// src/components/Employee.tsx (or wherever it is; assuming EmployeesManagement is the component)
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, Download, Users, CheckCircle, X, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '@/services/employeeService'; // Adjust path as needed

// Types
interface Employee {
  id: number;
  name: string;
  phone: string;
  role: string;
  department: string | null;
  startDate: string;
  password: string;
}

interface FormData {
  name: string;
  phone: string;
  role: string;
  department: string;
  password: string;
  confirmPassword: string;
}

// Static departments data (assuming these are branches/filials; adjust if dynamic fetch needed)
const DEPARTMENTS = [
  'IT bo\'limi',
  'Marketing',
  'Moliya',
  'HR',
  'Sotuvlar',
  'Qo\'llab-quvvatlash',
  'Toshkent', // Added example from backend to match
];

// Role mapping for display and values
const ROLES = [
  { value: 'admin', label: 'Administrator' },
  { value: 'manager', label: 'Menejer' },
  { value: 'employee', label: 'Xodim' },
  { value: 'assistant', label: 'Yordamchi' },
  { value: 'intern', label: 'Intern' },
];

const EmployeesManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'department' | 'name'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    role: '',
    department: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  // Fetch employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (err) {
        showToast((err as Error).message || 'Ma\'lumotlarni yuklashda xatolik', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Toast notification
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Filter and sort employees
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees.filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue = sortBy === 'department' ? a.department || '' : a.name;
      let bValue = sortBy === 'department' ? b.department || '' : b.name;

      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    return filtered;
  }, [employees, searchTerm, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredAndSortedEmployees.slice(startIndex, endIndex);

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      showToast('Ism maydoni to\'ldirilishi shart', 'error');
      return;
    }

    if (!formData.phone.match(/^\+998\d{9}$/)) {
      showToast('Telefon raqami +998912345678 formatida bo\'lishi kerak', 'error');
      return;
    }

    if (!formData.role) {
      showToast('Rol tanlanishi shart', 'error');
      return;
    }

    if (!formData.department) {
      showToast('Bo\'lim tanlanishi shart', 'error');
      return;
    }

    if (!formData.password) {
      showToast('Parol kiritilishi shart', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast('Parollar mos kelmaydi', 'error');
      return;
    }

    // Check if phone already exists (for new employees) - local check for optimization
    if (!editingEmployee && employees.some((emp) => emp.phone === formData.phone)) {
      showToast('Bu telefon raqami allaqachon mavjud', 'error');
      return;
    }

    setLoading(true);
    try {
      let updatedEmployee: Employee;
      if (editingEmployee) {
        // Update
        updatedEmployee = await updateEmployee(editingEmployee.id, formData);
        setEmployees((prev) =>
          prev.map((emp) => (emp.id === editingEmployee.id ? updatedEmployee : emp))
        );
        showToast('Xodim ma\'lumotlari muvaffaqiyatli yangilandi', 'success');
      } else {
        // Create
        updatedEmployee = await createEmployee(formData);
        setEmployees((prev) => [...prev, updatedEmployee]);
        showToast('Yangi xodim muvaffaqiyatli qo\'shildi', 'success');
      }
    } catch (err) {
      showToast((err as Error).message || 'Operatsiyada xatolik yuz berdi', 'error');
    } finally {
      setLoading(false);
      // Reset form
      setFormData({
        name: '',
        phone: '',
        role: '',
        department: '',
        password: '',
        confirmPassword: '',
      });
      setShowAddForm(false);
      setEditingEmployee(null);
    }
  };

  // Handle edit
  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      phone: employee.phone,
      role: employee.role,
      department: employee.department || '',
      password: employee.password,
      confirmPassword: employee.password,
    });
    setShowAddForm(true);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await deleteEmployee(id);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      showToast('Xodim muvaffaqiyatli o\'chirildi', 'success');
    } catch (err) {
      showToast((err as Error).message || 'O\'chirishda xatolik', 'error');
    } finally {
      setLoading(false);
      setDeleteConfirm(null);
    }
  };

  // Export to CSV
  const handleExport = () => {
    const headers = ['ID', 'Ism', 'Telefon', 'Rol', 'Bo\'lim', 'Ish boshlagan sana'];
    const csvContent = [
      headers.join(','),
      ...employees.map((emp) => [
        emp.id,
        emp.name,
        emp.phone,
        ROLES.find((r) => r.value === emp.role)?.label || emp.role,
        emp.department || 'Yo\'q',
        emp.startDate,
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'xodimlar.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Ma\'lumotlar muvaffaqiyatli eksport qilindi', 'success');
  };

  return (
    <div className="min-h-screen bg-white rounded-xl shadow-lg border border-gray-200 p-4">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
            {toast.message}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Users className="text-blue-600" size={32} />
                Xodimlar bo'limiga xush kelibsiz
              </h1>
              <p className="text-gray-600">Bu yerda barcha xodimlarni boshqarishingiz mumkin</p>

              {/* Search */}
              <div className="relative mt-4 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Ism bo'yicha qidirish..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleExport}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-colors"
              >
                <Download size={18} />
                Eksport
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(true);
                  setEditingEmployee(null);
                  setFormData({
                    name: '',
                    phone: '',
                    role: '',
                    department: '',
                    password: '',
                    confirmPassword: '',
                  });
                }}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus size={18} />
                Xodim qo'shish
              </Button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Tartiblash:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'department' | 'name')}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Ism bo'yicha</option>
                <option value="department">Bo'lim bo'yicha</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {sortOrder === 'asc' ? '↑ O\'sish' : '↓ Kamayish'}
              </button>
            </div>
            <div className="text-sm text-gray-600">Jami: {filteredAndSortedEmployees.length} xodim</div>
          </div>
        </div>

        {/* Employee Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {editingEmployee ? 'Xodim ma\'lumotlarini tahrirlash' : 'Yangi xodim qo\'shish'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ism *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="To'liq ismni kiriting"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rol *</label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.role}
                      onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                    >
                      <option value="">Rolni tanlang</option>
                      {ROLES.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefon raqami *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="+998912345678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filial *</label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.department}
                      onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                    >
                      <option value="">Bo'limni tanlang</option>
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Parol *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.password}
                        onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                        placeholder="Parolni kiriting"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Parolni tasdiqlash *</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Parolni qayta kiriting"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2 flex justify-end gap-4 pt-4">
                    <Button
                      variant="outline"
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingEmployee(null);
                      }}
                      className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Bekor qilish
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      disabled={loading}
                      onClick={handleSubmit}
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {loading ? 'Saqlanmoqda...' : editingEmployee ? 'Yangilash' : 'Saqlash'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Xodimni o'chirish</h3>
              <p className="text-gray-600 mb-6">
                Haqiqatan ham bu xodimni o'chirmoqchimisiz? Bu amal bekor qilib bo'lmaydi.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={loading}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  {loading ? 'O\'chirilmoqda...' : 'O\'chirish'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Employees Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ism
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefon
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Filial
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ish boshlagan sana
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      Yuklanmoqda...
                    </td>
                  </tr>
                ) : (
                  currentEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {ROLES.find((r) => r.value === employee.role)?.label || employee.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {employee.department || 'Yo\'q'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(employee.startDate).toLocaleDateString('uz-UZ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(employee)}
                            disabled={loading}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Tahrirlash"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(employee.id)}
                            disabled={loading}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="O'chirish"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1 || loading}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Oldingi
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages || loading}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Keyingi
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{startIndex + 1}</span> dan{' '}
                      <span className="font-medium">
                        {Math.min(endIndex, filteredAndSortedEmployees.length)}
                      </span>{' '}
                      gacha, jami <span className="font-medium">{filteredAndSortedEmployees.length}</span> ta natija
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1 || loading}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Oldingi
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          disabled={loading}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages || loading}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Keyingi
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {!loading && currentEmployees.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hech qanday xodim topilmadi</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Qidiruv bo\'yicha natija topilmadi' : 'Hali birorta xodim qo\'shilmagan'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus size={18} />
                Birinchi xodimni qo'shing
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeesManagement;