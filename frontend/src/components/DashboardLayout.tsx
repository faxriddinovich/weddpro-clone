import { useState } from "react";
import {
  BarChart3,
  ShoppingCart,
  Package,
  TrendingUp,
  MessageSquare,
  Settings,
  LogOut,
  Search,
  Bell,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Wrench,
  CreditCard,
  Store,
  Users,
  Truck,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationDropdown from "./notifications/NotificationDropdown";
import { motion, AnimatePresence } from "framer-motion";
import { Link, Outlet, useLocation } from "react-router-dom";
import Profile from "./Profile/Profile";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const location = useLocation();

  const navigationItems = [
    { name: "Dashboard", icon: BarChart3, key: "Dashboard", path: "/dashboard" },
    { name: "Buyurtmalar", icon: ShoppingCart, key: "Orders", path: "/dashboard/orders" },
    { name: "Mijozlar", icon: User, key: "Customers", path: "/dashboard/customers" },
    { name: "Chat", icon: MessageSquare, key: "Chat", path: "/dashboard/chat" },
    {
      name: "Mahsulotlar", icon: Package, key: "Products",
      children: [
        { label: "Kategoriyalar", path: "/dashboard/products/categories" },
        { label: "Mahsulotlar", path: "/dashboard/products/list" },
        { label: "Chegirmalar", path: "/dashboard/products/discounts" },
        { label: "IKPU", path: "/dashboard/products/ikpu" },
        { label: "Omborxona", path: "/dashboard/products/warehouse" },
      ]
    },
    {
      name: "Marketing", icon: TrendingUp, key: "Marketing",
      children: [
        { label: "Rassilka", path: "/dashboard/marketing/newsletter" },
        { label: "Promokod", path: "/dashboard/marketing/promocode" },
        { label: "Manbalar", path: "/dashboard/marketing/sources" },
        { label: "SMS rassilka", path: "/dashboard/marketing/sms" },
        { label: "Banner", path: "/dashboard/marketing/banner" },
      ]
    },
    {
      name: "Platformalar", icon: Settings, key: "Platforms",
      children: [
        { label: "Telegram bot", path: "/dashboard/platforms/telegram" },
        { label: "Veb sayt", path: "/dashboard/platforms/website" },
        { label: "QR katalog", path: "/dashboard/platforms/qr-catalog" },
      ]
    },
    { name: "To'lov turi", icon: CreditCard, key: "PaymentMethods", path: "/dashboard/payment-methods" },
    { name: "Yetkazib berish", icon: Truck, key: "Delivery", path: "/dashboard/delivery" },
    { name: "Filiallar", icon: MapPin, key: "Branches", path: "/dashboard/branches" },
    {
      name: "Xodimlar", icon: Users, key: "Employees",
      children: [
        { label: "Xodimlar", path: "/dashboard/employees/list" },
        { label: "Rollar", path: "/dashboard/employees/roles" },
        { label: "Kuryer", path: "/dashboard/employees/couriers" },
      ]
    },
    { name: "Tarif rejasi", icon: CreditCard, key: "Pricing", path: "/dashboard/pricing" },
    { name: "Robo market", icon: Store, key: "RoboMarket", path: "/dashboard/robo-market" },
    { name: "Sozlamalar", icon: Wrench, key: "Settings", path: "/dashboard/settings" }
  ];

  const handleLogout = async () => {
    console.log("Logout clicked");
  };

  const toggleItem = (key: string) => {
    if (expandedItems.has(key)) {
      setExpandedItems(new Set());
    } else {
      setExpandedItems(new Set([key]));
    }
  };

  const handleItemClick = (item: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (item.children) {
      toggleItem(item.key);
    } else if (item.path) {
      setActiveItem(item.key);
    }
  };

  const isActiveItem = (item: any) => {
    if (item.path && location.pathname === item.path) return true;
    if (item.children && item.children.some((child: any) => location.pathname === child.path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar (desktop) - 640px dan katta ekranlarda har doim ko'rinadi */}
      <aside className="w-[16rem] lg:w-[18rem] bg-white shadow-sm border-r hidden min-[640px]:block h-screen sticky top-0 z-50 overflow-y-auto">
        <div className="p-4 lg:p-6 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-lg lg:text-xl font-semibold text-gray-900">Wedd</span>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <div key={item.key} className="w-full">
              {item.path && !item.children ? (
                <Link
                  to={item.path}
                  onClick={() => setActiveItem(item.key)}
                  className="block w-full"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
                    className={`w-full flex items-center justify-between space-x-4 px-4 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer ${isActiveItem(item)
                      ? "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200 shadow-lg"
                      : "text-[#8393A6] hover:bg-gray-100 hover:shadow-md"
                      }`}
                  >
                    <div className="flex items-center space-x-4">
                      <item.icon
                        className={`w-6 h-6 ${isActiveItem(item) ? "text-blue-600" : "text-[#8393A6]"} transition-colors duration-200`}
                      />
                      <span className={`font-medium ${isActiveItem(item) ? "text-blue-700" : "text-[#8393A6]"} text-sm lg:text-base truncate`}>{item.name}</span>
                    </div>
                  </motion.div>
                </Link>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
                  onClick={(e) => handleItemClick(item, e)}
                  className={`w-full flex items-center justify-between space-x-4 px-4 py-3 rounded-xl text-left transition-all duration-200 ${isActiveItem(item)
                    ? "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200 shadow-lg"
                    : "text-[#8393A6] hover:bg-gray-100 hover:shadow-md"
                    }`}
                >
                  <div className="flex items-center space-x-4">
                    <item.icon
                      className={`w-6 h-6 ${isActiveItem(item) ? "text-blue-600" : "text-[#8393A6]"} transition-colors duration-200`}
                    />
                    <span className={`font-medium ${isActiveItem(item) ? "text-blue-700" : "text-[#8393A6]"} text-sm lg:text-base truncate`}>{item.name}</span>
                  </div>
                  {item.children && (
                    <span className={`${isActiveItem(item) ? "text-blue-600" : "text-[#8393A6]"}`}>
                      {expandedItems.has(item.key) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </span>
                  )}
                </motion.button>
              )}
              {item.children && (
                <AnimatePresence>
                  {expandedItems.has(item.key) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="ml-6 space-y-1 mt-1 overflow-hidden"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.path}
                          onClick={() => setActiveItem(item.key)}
                          className={`block px-4 py-2 text-sm lg:text-base text-blue-600 hover:bg-gray-50 rounded transition-colors ${location.pathname === child.path ? "text-blue-600 font-medium bg-blue-50" : "text-gray-600"}`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Sidebar (mobile overlay) - 640px dan kichik ekranlarda */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <div
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 z-[99] min-[640px]:hidden"
            />
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="fixed inset-y-0 left-0 w-[280px] max-w-[90vw] bg-white shadow-md border-r p-6 flex flex-col z-[100] min-[640px]:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">D</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">Wedd</span>
                </div>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <nav className="space-y-2 flex-1 overflow-auto">
                {navigationItems.map((item) => (
                  <div key={item.key}>
                    {item.path && !item.children ? (
                      <Link
                        to={item.path}
                        onClick={() => {
                          setActiveItem(item.key);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${isActiveItem(item)
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "text-gray-600 hover:bg-gray-50"
                          }`}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium text-sm">{item.name}</span>
                        </div>
                      </Link>) : (

                      <button
                        onClick={() => {
                          if (item.children) {
                            toggleItem(item.key);
                          } else if (item.path) {
                            setActiveItem(item.key);
                            setSidebarOpen(false);
                          }
                        }}
                        className={`w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${isActiveItem(item)
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "text-gray-600 hover:bg-gray-50"
                          }`}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium text-sm">{item.name}</span>
                        </div>
                        {item.children && (
                          <span>
                            {expandedItems.has(item.key) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </span>
                        )}
                      </button>)}
                    {item.children && expandedItems.has(item.key) && (
                      <div className="ml-6 space-y-1 mt-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.path}
                            onClick={() => {
                              setActiveItem(item.key);
                              setSidebarOpen(false);
                            }}
                            className={`block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded ${location.pathname === child.path ? "text-blue-600 font-medium" : ""}`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="sticky top-0 z-40 bg-[#f9f9fc] px-4 py-3">
          {/* Header */}
          <header className="bg-[#ffffff] rounded-md px-4 sm:px-6 lg:px-8 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                {/* Mobile menu button - faqat 640px dan kichik ekranlarda */}
                <button className="min-[640px]:hidden" onClick={() => setSidebarOpen(true)}>
                  <Menu className="w-6 h-6 text-gray-700" />
                </button>
                <div className="relative w-full max-w-[90vw] sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Qidiruv..."
                    className="pl-10 pr-4 py-2 h-10 text-sm border border-gray-200 rounded-md bg-[#fbfafa] hover:border-gray-300 shadow-sm transition focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4 ml-2 sm:ml-4">
                <Button variant="ghost" size="icon" className="relative w-10 h-10 sm:w-12 sm:h-12 shadow-sm hover:bg-muted bg-[#f9f9fc]">
                  <NotificationDropdown />
                </Button>

                <div className="flex items-center gap-2 cursor-pointer group relative rounded-md z-100 bg-[#fbfbfe] shadow-sm">
                  <div className="text-sm leading-tight">
                    <Profile />
                  </div>
                </div>
              </div>
            </div>
          </header>
        </div>


        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-[#f9f9fc]">
          <div className="max-w-[96rem] mx-auto px-4 py-2">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;