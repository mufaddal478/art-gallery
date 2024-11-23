import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loadUser } from './store/slices/authSlice';

// Layout Components
import Navbar from './components/layout/Navbar';
import NotFound from './components/layout/NotFound';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminLogin from './components/admin/AdminLogin';

// Protected Components
import Profile from './components/profile/Profile';
import AdminDashboard from './components/admin/AdminDashboard';
import ManageArtworks from './components/admin/ManageArtworks';
import ManageUsers from './components/admin/ManageUsers';

// Public Components
import Home from './pages/Home';
import ArtworkDetails from './components/artwork/ArtworkDetails';
import Artworks from './components/artwork/Artworks';
import Cart from './components/cart/Cart';
import Checkout from './components/checkout/Checkout';

// Route Guards
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/artworks" element={<Artworks />} />
          <Route path="/artwork/:id" element={<ArtworkDetails />} />
          
          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/artworks"
            element={
              <AdminRoute>
                <ManageArtworks />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <ManageUsers />
              </AdminRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
