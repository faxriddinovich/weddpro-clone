import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Users,
  Shield,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Save,
  UserPlus,
  X,
  Check,
  Edit2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DeleteOutlined } from "@ant-design/icons";

// Toast Hook
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    const toast = { id, message, type };
    setToasts(prev => [...prev, toast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
};

// Toast Component
const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed top-4 right-4 z-50 space-y-2">
    <AnimatePresence>
      {toasts.map((toast) => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`p-4 rounded-lg shadow-lg border max-w-sm ${
            toast.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : toast.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {toast.type === 'success' && <Check className="w-4 h-4" />}
              {toast.type === 'error' && <X className="w-4 h-4" />}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeToast(toast.id)}
              className="w-6 h-6 p-0 hover:bg-transparent"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 text-center bg-red-50 border border-red-200 rounded-lg m-4"
        >
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-800 mb-2">Xatolik yuz berdi</h2>
          <p className="text-red-600 mb-4">Sahifani qaytadan yuklang yoki texnik yordam bilan bog'laning</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 hover:bg-red-700"
          >
            Sahifani qaytadan yuklash
          </Button>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

// Statik ma'lumotlar
const roles = [
  {
    id: 1,
    name: "Super Administrator",
    createdDate: "2024-01-15",
    lastLogin: "2024-08-15T10:30:00",
    status: "active",
    creator: "System Admin",
    assignedUsers: ["Johon Doe", "Jane Smith"],
    permissions: {
      dashboard: { view: true, edit: true, delete: true },
      buyurtmalar: { view: true, edit: true, delete: true },
      mijozlar: { view: true, edit: true, delete: true },
      chat: { view: true, edit: false, delete: false },
    }
  },
  {
    id: 2,
    name: "Menejer",
    createdDate: "2024-02-20",
    lastLogin: "2024-08-14T16:45:00",
    status: "active",
    creator: "Super Admin",
    assignedUsers: ["Ali Karimov", "Dilnoza Rashidova"],
    permissions: {
      dashboard: { view: true, edit: false, delete: false },
      buyurtmalar: { view: true, edit: true, delete: false },
      mijozlar: { view: true, edit: true, delete: false },
      chat: { view: true, edit: true, delete: false },
    }
  },
  {
    id: 3,
    name: "Operator",
    createdDate: "2024-03-10",
    lastLogin: "2024-08-13T09:20:00",
    status: "active",
    creator: "Menejer",
    assignedUsers: ["Sardor Abdullayev"],
    permissions: {
      dashboard: { view: true, edit: false, delete: false },
      buyurtmalar: { view: true, edit: true, delete: false },
      mijozlar: { view: true, edit: false, delete: false },
      chat: { view: true, edit: true, delete: false },
    }
  },
  {
    id: 4,
    name: "Hisobchi",
    createdDate: "2024-04-05",
    lastLogin: "2024-08-10T14:15:00",
    status: "inactive",
    creator: "Super Admin",
    assignedUsers: [],
    permissions: {
      dashboard: { view: true, edit: false, delete: false },
      buyurtmalar: { view: true, edit: false, delete: false },
      mijozlar: { view: false, edit: false, delete: false },
      chat: { view: false, edit: false, delete: false },
    }
  },
];

const sections = [
  "Dashboard", "Buyurtmalar", "Mijozlar", "Chat", "Kategoriyalar", 
  "Mahsulotlar", "Chegirmalar", "IKPU", "Omborxona", "Rassilka",
  "Promokod", "Manbalar", "SMS rassilka", "Banner", "Telegram Bot",
  "Veb sayt", "QR Katalog", "To'lov turi", "Yetkazib berish",
  "Filiallar", "Xodimlar", "Rollar", "Kuryer", "Tarif reja",
  "Robo market", "Sozlamalar"
];

const Rollar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRolePermissions, setNewRolePermissions] = useState({});
  const { toasts, showToast, removeToast } = useToast();

  // Memoized formatLastLogin function
  const formatLastLogin = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Hozir";
    if (diffInHours < 24) return `${diffInHours} soat oldin`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} kun oldin`;
    return date.toLocaleDateString('uz-UZ');
  }, []);

  // Memoized filtered roles
  const filteredRoles = useMemo(() => 
    roles.filter(role =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.creator.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]
  );

  const handleRoleSelect = useCallback((role) => {
    setSelectedRole(role);
    setEditingRole(null);
    setIsViewSheetOpen(true);
  }, []);

  const handleEditRole = useCallback((role, e) => {
    e.stopPropagation();
    setSelectedRole(role);
    setEditingRole({ ...role });
    setIsViewSheetOpen(true);
    showToast('Rol tahrirlash rejimida ochildi', 'info');
  }, [showToast]);

  const handleDeleteRole = useCallback((roleId, e) => {
    e.stopPropagation();
    // Backend API call bo'ladi
    showToast('Rol muvaffaqiyatli o\'chirildi', 'success');
  }, [showToast]);

  // Tahrirlash rejimida permission o'zgartirish
  const handleEditPermissionChange = useCallback((section, permissionType, checked) => {
    if (!editingRole) return;
    
    setEditingRole(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [section.toLowerCase().replace(/\s+/g, '_')]: {
          ...prev.permissions[section.toLowerCase().replace(/\s+/g, '_')] || { view: false, edit: false, delete: false },
          [permissionType]: checked
        }
      }
    }));
  }, [editingRole]);

  // Yangi rol uchun permission o'zgartirish
  const handleNewPermissionChange = useCallback((section, permissionType, checked) => {
    setNewRolePermissions(prev => ({
      ...prev,
      [section.toLowerCase().replace(/\s+/g, '_')]: {
        ...prev[section.toLowerCase().replace(/\s+/g, '_')] || { view: false, edit: false, delete: false },
        [permissionType]: checked
      }
    }));
  }, []);

  // Rol saqlash
  const handleSaveRole = useCallback(() => {
    if (!editingRole) return;
    
    // Backend API call bo'ladi
    setSelectedRole(editingRole);
    setEditingRole(null);
    showToast('O\'zgarishlar muvaffaqiyatli saqlandi', 'success');
  }, [editingRole, showToast]);

  // Yangi rol qo'shish
  const handleAddRole = useCallback((saveAndAddNew = false) => {
    if (!newRoleName.trim()) {
      showToast('Rol nomini kiriting', 'error');
      return;
    }
    
    // Backend API call bo'ladi
    console.log("Yangi rol:", {
      name: newRoleName,
      permissions: newRolePermissions
    });

    showToast('Yangi rol muvaffaqiyatli qo\'shildi', 'success');

    // Form tozalash
    if (!saveAndAddNew) {
      setNewRoleName("");
      setNewRolePermissions({});
      setIsAddSheetOpen(false);
    } else {
      setNewRoleName("");
      setNewRolePermissions({});
    }
  }, [newRoleName, newRolePermissions, showToast]);

  return (
    <ErrorBoundary>
      <div className="p-4 sm:p-6 space-y-6 bg-white rounded-xl shadow-lg border border-gray-200 min-h-screen">
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Rollar</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Xodimlar uchun rollar va ruxsatlarni boshqaring</p>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={() => setIsAddSheetOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              Yangi rol qo'shish
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { icon: Shield, color: "blue", value: roles.length, label: "Jami rollar" },
            { icon: CheckCircle, color: "green", value: roles.filter(r => r.status === 'active').length, label: "Faol rollar" },
            { icon: Users, color: "orange", value: roles.reduce((acc, role) => acc + role.assignedUsers.length, 0), label: "Tayinlangan" },
            { icon: XCircle, color: "red", value: roles.filter(r => r.status === 'inactive').length, label: "Nofaol" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                      <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rol nomi yoki yaratuvchi bo'yicha qidiring..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Roles Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 border-b border-gray-200">
                  <div className="grid grid-cols-12 gap-4 px-6 py-4">
                    <div className="col-span-4 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol nomi</div>
                    <div className="col-span-3 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yaratilgan</div>
                    <div className="col-span-3 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oxirgi kirish</div>
                    <div className="col-span-2 px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amallar</div>
                  </div>
                </div>

                {/* Body */}
                <div className="divide-y divide-gray-100">
                  <AnimatePresence>
                    {filteredRoles.map((role, index) => (
                      <motion.div 
                        key={role.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
                        className="grid grid-cols-12 gap-4 px-6 py-4 cursor-pointer transition-colors"
                        onClick={() => handleRoleSelect(role)}
                      >
                        <div className="col-span-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Shield className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 text-sm truncate">{role.name}</p>
                              <Badge 
                                variant={role.status === 'active' ? 'default' : 'secondary'}
                                className={`mt-1 text-xs ${role.status === 'active' 
                                  ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {role.status === 'active' ? 'Faol' : 'Nofaol'}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 text-sm">
                              {new Date(role.createdDate).toLocaleDateString('uz-UZ')}
                            </span>
                          </div>
                        </div>

                        <div className="col-span-3">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 text-sm">
                              {formatLastLogin(role.lastLogin)}
                            </span>
                          </div>
                        </div>

                        <div className="col-span-2">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={(e) => handleEditRole(role, e)}
                              className="text-blue-600 hover:text-blue-700 transition-all duration-200 transform hover:-translate-y-0.5"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              onClick={(e) => handleDeleteRole(role, e)}
                              className="border rounded-md text-red-700 transition-all duration-200 transform hover:-translate-y-0.5"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* View/Edit Role Sheet */}
        <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
          <SheetContent className="w-full sm:max-w-4xl overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ duration: 0.3 }}
            >
              <SheetHeader className="pb-6">
                <SheetTitle className="text-xl font-bold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  {selectedRole?.name}
                  {editingRole && (
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                      Tahrirlash rejimi
                    </Badge>
                  )}
                </SheetTitle>
                <SheetDescription>
                  {editingRole ? 'Bu rol uchun ruxsatlarni tahrirlang' : 'Bu rol uchun ruxsatlarni ko\'ring'}
                </SheetDescription>
              </SheetHeader>

              {selectedRole && (
                <div className="space-y-6">
                  {/* Role Info */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm text-gray-600">Yaratilgan sana</p>
                      <p className="font-medium">{new Date(selectedRole.createdDate).toLocaleDateString('uz-UZ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Yaratuvchi</p>
                      <p className="font-medium">{selectedRole.creator}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge 
                        variant={selectedRole.status === 'active' ? 'default' : 'secondary'}
                        className={selectedRole.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                        }
                      >
                        {selectedRole.status === 'active' ? 'Faol' : 'Nofaol'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Oxirgi kirish</p>
                      <p className="font-medium">{formatLastLogin(selectedRole.lastLogin)}</p>
                    </div>
                  </motion.div>

                  <Separator />

                  {/* Permissions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">Bo'limlar uchun ruxsatlar</h3>
                      {!editingRole && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingRole({ ...selectedRole })}
                          className="gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Tahrirlash
                        </Button>
                      )}
                    </div>
                    
                    {/* Permissions Header */}
                    <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-t-lg border-b border-gray-200">
                      <div className="font-semibold text-sm text-gray-700">Bo'lim</div>
                      <div className="font-semibold text-sm text-gray-700 text-center">Kirish</div>
                      <div className="font-semibold text-sm text-gray-700 text-center">Tahrirlash</div>
                      <div className="font-semibold text-sm text-gray-700 text-center">O'chirish</div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-b-lg overflow-hidden">
                      {sections.map((section, index) => {
                        const sectionKey = section.toLowerCase().replace(/\s+/g, '_');
                        const permissions = editingRole 
                          ? editingRole.permissions[sectionKey] || { view: false, edit: false, delete: false }
                          : selectedRole.permissions[sectionKey] || { view: false, edit: false, delete: false };
                        
                        return (
                          <motion.div 
                            key={section}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + (index * 0.02) }}
                            className="grid grid-cols-4 gap-4 p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                          >
                            <div className="font-medium text-sm text-gray-900">
                              {section}
                            </div>
                            <div className="flex justify-center">
                              <Checkbox 
                                checked={permissions.view}
                                disabled={!editingRole}
                                onCheckedChange={(checked) => editingRole && handleEditPermissionChange(section, 'view', checked)}
                                className="border-gray-300"
                              />
                            </div>
                            <div className="flex justify-center">
                              <Checkbox 
                                checked={permissions.edit}
                                disabled={!editingRole}
                                onCheckedChange={(checked) => editingRole && handleEditPermissionChange(section, 'edit', checked)}
                                className="border-gray-300"
                              />
                            </div>
                            <div className="flex justify-center">
                              <Checkbox 
                                checked={permissions.delete}
                                disabled={!editingRole}
                                onCheckedChange={(checked) => editingRole && handleEditPermissionChange(section, 'delete', checked)}
                                className="border-gray-300"
                              />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* Save Buttons */}
                  {editingRole && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="pt-4 border-t space-y-3"
                    >
                      <div className="flex gap-3">
                        <Button 
                          onClick={handleSaveRole}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2"
                        >
                          <Save className="w-4 h-4" />
                          O'zgarishlarni saqlash
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setEditingRole(null)}
                          className="flex-1"
                        >
                          Bekor qilish
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </SheetContent>
        </Sheet>

        {/* Add New Role Sheet */}
        <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
          <SheetContent className="w-full sm:max-w-4xl overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ duration: 0.3 }}
            >
              <SheetHeader className="pb-6">
                <SheetTitle className="text-xl font-bold flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  Yangi rol qo'shish
                </SheetTitle>
                <SheetDescription>
                  Yangi rol yarating va ruxsatlarni belgilang
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6">
                {/* Role Name Input */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Label htmlFor="role-name" className="text-sm font-medium">
                    Rol nomi *
                  </Label>
                  <Input
                    id="role-name"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="Masalan: Kassir, Sotuvchi..."
                    className="mt-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </motion.div>

                <Separator />

                {/* Permissions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="font-semibold text-lg mb-4">Bo'limlar uchun ruxsatlar</h3>
                  
                  {/* Permissions Header */}
                  <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-t-lg border-b border-gray-200">
                    <div className="font-semibold text-sm text-gray-700">Bo'lim</div>
                    <div className="font-semibold text-sm text-gray-700 text-center">Kirish</div>
                    <div className="font-semibold text-sm text-gray-700 text-center">Tahrirlash</div>
                    <div className="font-semibold text-sm text-gray-700 text-center">O'chirish</div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-b-lg overflow-hidden">
                    {sections.map((section, index) => {
                      const sectionKey = section.toLowerCase().replace(/\s+/g, '_');
                      const permissions = newRolePermissions[sectionKey] || { view: false, edit: false, delete: false };
                      
                      return (
                        <motion.div 
                          key={section}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + (index * 0.02) }}
                          className="grid grid-cols-4 gap-4 p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                        >
                          <div className="font-medium text-sm text-gray-900">
                            {section}
                          </div>
                          <div className="flex justify-center">
                            <Checkbox 
                              checked={permissions.view}
                              onCheckedChange={(checked) => handleNewPermissionChange(section, 'view', checked)}
                              className="border-gray-300"
                            />
                          </div>
                          <div className="flex justify-center">
                            <Checkbox 
                              checked={permissions.edit}
                              onCheckedChange={(checked) => handleNewPermissionChange(section, 'edit', checked)}
                              className="border-gray-300"
                            />
                          </div>
                          <div className="flex justify-center">
                            <Checkbox 
                              checked={permissions.delete}
                              onCheckedChange={(checked) => handleNewPermissionChange(section, 'delete', checked)}
                              className="border-gray-300"
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Save Buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-4 border-t space-y-3"
                >
                  <Button 
                    onClick={() => handleAddRole(false)}
                    className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
                    disabled={!newRoleName.trim()}
                  >
                    <Save className="w-4 h-4" />
                    Saqlash
                  </Button>
                  <Button 
                    onClick={() => handleAddRole(true)}
                    variant="outline" 
                    className="w-full gap-2"
                    disabled={!newRoleName.trim()}
                  >
                    <UserPlus className="w-4 h-4" />
                    Saqlash va Yangi qo'shish
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </SheetContent>
        </Sheet>
      </div>
    </ErrorBoundary>
  );
};

export default Rollar;