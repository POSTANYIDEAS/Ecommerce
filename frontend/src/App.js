import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProducts from './pages/admin/Products';
import AdminProductDetails from './pages/admin/ProductDetails';
import NavbarUser from './components/NavbarUser';
import Home from './pages/user/Home';
import About from './pages/user/About';
import Contact from './pages/user/Contact';
import UserProducts from './pages/user/Products';
import UserProductDetails from './pages/user/ProductDetails';

function App() {
  const location = useLocation();

  // ✅ Hide Navbar for Admin paths
  const hideNavbar = location.pathname.startsWith('/admin');

  return (
    <div>
      {!hideNavbar && <NavbarUser />} {/* Only show for user panel */}

      <Routes>
        {/* User Panel */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" element={<UserProducts />} />
        <Route path="/product/:id" element={<UserProductDetails />} />

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
          element={<AdminProductDetails />}
        />
      </Routes>
    </div>
  );
}

export default App;
