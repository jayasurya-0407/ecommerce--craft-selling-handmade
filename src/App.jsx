import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Collections from './components/Collections';
import CustomOrder from './components/CustomOrder';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import ProductDetails from './pages/ProductDetails';
import CartSidebar from './components/CartSidebar';
import { CartProvider } from './context/CartContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AuthProvider } from './context/AuthContext';

// Customer Auth Imports
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// Admin Imports
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import Products from './pages/admin/Products';

import { useEffect } from 'react';

function Home() {
  useEffect(() => {
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('appear');
        appearOnScroll.unobserve(entry.target);
      });
    }, appearOptions);

    faders.forEach(fader => {
      appearOnScroll.observe(fader);
    });

    return () => {
      faders.forEach(fader => appearOnScroll.unobserve(fader));
    };
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Collections />
      <CustomOrder />
      <Testimonials />
      <Footer />
      <CartSidebar />
    </>
  );
}

function App() {
  return (
    <AdminAuthProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<><Navbar /><ProductDetails /><Footer /><CartSidebar /></>} />
              
              {/* Customer Auth Routes */}
              <Route path="/login" element={<><Navbar /><Login /><Footer /><CartSidebar /></>} />
              <Route path="/register" element={<><Navbar /><Register /><Footer /><CartSidebar /></>} />
              <Route path="/profile" element={<><Navbar /><Profile /><Footer /><CartSidebar /></>} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="orders" element={<Orders />} />
                <Route path="products" element={<Products />} />
              </Route>
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </AdminAuthProvider>
  );
}

export default App;
