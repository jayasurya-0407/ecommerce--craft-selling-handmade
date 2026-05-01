import { useContext } from 'react';
import { Navigate, Outlet, Link, useNavigate } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { LayoutDashboard, ShoppingBag, Package, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const { admin, loading, logout } = useContext(AdminAuthContext);
  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (!admin) return <Navigate to="/admin/login" replace />;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>Haan Admin</h2>
        </div>
        <nav className="admin-nav">
          <Link to="/admin/dashboard" className="admin-nav-link">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/admin/orders" className="admin-nav-link">
            <ShoppingBag size={20} /> Orders
          </Link>
          <Link to="/admin/products" className="admin-nav-link">
            <Package size={20} /> Products
          </Link>
        </nav>
        <button className="admin-logout-btn" onClick={handleLogout}>
          <LogOut size={20} /> Logout
        </button>
      </aside>
      
      <main className="admin-main-content">
        <header className="admin-topbar">
          <div>Welcome back, {admin.name}</div>
          <Link to="/" className="btn-primary-outline" style={{ padding: '0.5rem 1rem' }}>View Store</Link>
        </header>
        <div className="admin-page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
