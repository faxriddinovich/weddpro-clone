import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Orders from "./components/Order/Orders";
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardLayout from "./components/DashboardLayout";
import 'leaflet/dist/leaflet.css';
import Categories from "./components/products/Categories/Categories";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AddProductPage from "./components/products/Categories/AddProductPage";
import ProductPage from "./components/products/mahsulotlar/ProductCard";
import AddProduct from "./components/products/mahsulotlar/AddProduct";
import Discounts from "./components/products/Discount/Discounts";
import AddDiscount from "./components/products/Discount/AddDiscount";
import WarehouseDashboard from "./components/products/Omborxona/WareHouseDashboard";
import AddWareHouse from "./components/products/Omborxona/AddWareHouse";
import ProductDetailedPage from "./components/products/Categories/ProductDetailPage";
import DetailedPage from "./components/products/mahsulotlar/DetailedPage";
import Ikpu from "./components/products/Ikpu/Ikpu";
import AddIkpu from "./components/products/Ikpu/AddIkpu";
import Employees from "./components/Employees/Employes";
import AddEmployees from "./components/Employees/AddEmployees";
import EditEmployee from "./components/Employees/EditEmployee";
import Tarifrejasi from "./pages/dashboard/tarifrejasi";
import Robomarket from "./pages/dashboard/robomarket";
import Tolovturi from "./pages/dashboard/tolovturlati";
import Branches from "./pages/dashboard/Branches";
import Rasilka from "./components/Marketing/rasilka";
import Promkod from "./components/Marketing/Promkod";
import Manbalar from "./components/Marketing/Resources";
import Smsrasilka from "./components/Marketing/smsrasilka";
import Banner from "./components/Marketing/Banner/BannerCard";
import Chatpage from "./pages/dashboard/chatpage";
import Customer from "./pages/dashboard/customers";
import LogisticsDashboard from "./pages/dashboard/LogisticsDashboard";
import WebsiteManagement from "./components/Platformalar/veb-site";
import TgCreate from "./components/Platformalar/Telegram/TgCreate";
import TelegramBot from "./components/Platformalar/Telegram/TelegramBot";
import SettingsPanel from "./pages/dashboard/SettingsPanel";
import EditCategoryPage from "./components/products/Categories/EditCategoryPage";
import DiscountType from "./components/products/Discount/DiscountType";
import CategoryProducts from "./components/products/Discount/CategoryProducts";
import ProductsList from "./components/products/Discount/ProductsList";
import AddBanner from "./components/Marketing/Banner/AddBanner";
import Rollar from "./components/Employees/Rollar/Rollar";
import Couriers from "./components/Employees/Kuryer/Couriers";
import AuthModal from "./pages/Auth/AuthModal";
import ProfileEdit from "./components/Profile/ProfileEdit";
import ProtectedRoute from "./pages/ProtectedRoute";
import PasswordChange from "./components/Profile/PasswordChange";
import ProfileLanguage from "./components/Profile/ProfileLanguage";
import ProfilePlatforms from "./components/Profile/ProfilePlatforms";
import ProfileCards from "./components/Profile/ProfileCards";
import VerifyCode from "./pages/Auth/VerifyCode";

const handleSubmit = (data: any) => {
  // handle warehouse submit logic
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <DndProvider backend={HTML5Backend}>
        <BrowserRouter>
          <Routes>
              <Route path={'/login'} element={<VerifyCode />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin/profile" element={<ProfileEdit />} />
              <Route path="/admin/profile/password" element={<PasswordChange />} />
              <Route path="/admin/profile/language" element={<ProfileLanguage />} />
              <Route path="/admin/profile/platforms" element={<ProfilePlatforms />} />
              <Route path="/admin/profile/cards" element={<ProfileCards />} />
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="dashboard/orders" element={<Orders />} />
              <Route path="dashboard/customers" element={<Customer />} />
              <Route path="dashboard/chat" element={<Chatpage />} />

              {/* Products Routes */}
              <Route path="dashboard/products/categories" element={<Categories />} />
              <Route path="dashboard/products/categories/add-product" element={<AddProductPage />} />
              <Route path="dashboard/products/categories/edit-product/:id" element={<EditCategoryPage />} />
              <Route path="dashboard/products/categories/product-detailed/:id" element={<ProductDetailedPage />} />
              <Route path="dashboard/products/list" element={<ProductPage />} />
              <Route path="dashboard/products/list/add_product" element={<AddProduct />} />
              <Route path="dashboard/products/list/edit/:id" element={<DetailedPage />} />
              <Route path="dashboard/products/discounts" element={<Discounts />} />
              <Route path="dashboard/products/discounts/add/type" element={<DiscountType />} />
              <Route path="dashboard/products/discounts/add/category" element={<CategoryProducts />} />
              <Route path="dashboard/products/discounts/add/products" element={<ProductsList />} />
              <Route path="dashboard/products/discounts/add_discount" element={<AddDiscount />} />
              <Route path="dashboard/products/ikpu" element={<Ikpu />} />
              <Route path="dashboard/products/ikpu/add_ikpu" element={<AddIkpu />} />
              <Route path="dashboard/products/warehouse" element={<WarehouseDashboard />} />
              <Route path="dashboard/products/warehouse/add_warehouse" element={<AddWareHouse onSubmit={handleSubmit} />} />

              {/* Marketing Routes */}
              <Route path="dashboard/marketing/newsletter" element={<Rasilka />} />
              <Route path="dashboard/marketing/promocode" element={<Promkod />} />
              <Route path="dashboard/marketing/sources" element={<Manbalar />} />
              <Route path="dashboard/marketing/sms" element={<Smsrasilka />} />
              <Route path="dashboard/marketing/banner" element={<Banner />} />
              <Route path="dashboard/marketing/banner/add-banner" element={<AddBanner />} />

              {/* Platforms Routes */}
              <Route path="dashboard/platforms/telegram" element={<TelegramBot />} />
              <Route path="dashboard/platforms/telegram/create" element={<TgCreate />} />
              <Route path="dashboard/platforms/website" element={<WebsiteManagement />} />
              <Route path="dashboard/platforms/qr-catalog" element={<div>QR Catalog</div>} />

              {/* Other Routes */}
              <Route path="dashboard/payment-methods" element={<Tolovturi />} />
              <Route path="dashboard/delivery" element={<LogisticsDashboard />} />
              <Route path="dashboard/branches" element={<Branches />} />

              {/* Employees Routes */}
              <Route path="dashboard/employees/list" element={<Employees />} />
              <Route path="dashbord/employees/list/add-emlpoyees" element={<AddEmployees />} />
              <Route path="dashboard/employees/edit/:id" element={<EditEmployee />} />
              <Route path="dashboard/employees/roles" element={<Rollar />} />
              <Route path="dashboard/employees/couriers" element={<Couriers />} />

              <Route path="dashboard/pricing" element={<Tarifrejasi />} />
              <Route path="dashboard/robo-market" element={<Robomarket />} />
              <Route path="dashboard/settings" element={<SettingsPanel />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DndProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;