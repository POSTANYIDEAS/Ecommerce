import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import useTheme from './hooks/useTheme';
import './styles/themes.css';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProducts from './pages/admin/Products';
import AdminProductDetails from './pages/admin/ProductDetails';
import AdminCategories from './pages/admin/Categories';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';
import NavbarUser from './components/NavbarUser';
import Footer from './components/Footer';
import Home from './pages/user/Home';
import About from './pages/user/About';
import Contact from './pages/user/Contact';
import UserProducts from './pages/user/Products';
import UserProductDetails from './pages/user/ProductDetails';
import Cart from './pages/user/Cart';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import Customers from './pages/admin/Customers';
import Orders from './pages/admin/Orders';
import Profile from './pages/user/Profile';
import UserOrders from './pages/user/UserOrders';

function App() {
  const location = useLocation();

  // Initialize theme system
  useTheme();

  // ✅ Hide Navbar and Footer for Admin paths
  const hideNavbarAndFooter = location.pathname.startsWith('/admin');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!hideNavbarAndFooter && <NavbarUser />} {/* Only show for user panel */}

      <main style={{ flex: 1 }}>
        <Routes>
        {/* User Panel */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" element={<UserProducts />} />
        <Route path="/product/:id" element={<UserProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/orders" element={<UserOrders />} />

        {/* Admin Panel */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <AdminProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/product-details"
          element={
            <ProtectedRoute>
              <AdminProductDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute>
              <AdminCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute>
              <AdminReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/customers" element={<Customers />} />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
      </Routes>
      </main>

      {!hideNavbarAndFooter && <Footer />} {/* Only show for user panel */}
    </div>
  );
}

export default App;
