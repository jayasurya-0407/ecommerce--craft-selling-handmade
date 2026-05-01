import { useState, useEffect, useContext } from 'react';
import { AdminAuthContext } from '../../context/AdminAuthContext';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const { admin } = useContext(AdminAuthContext);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('https://ecommerce-craft-selling-handmade.onrender.com/api/admin/stats', {
          headers: { Authorization: `Bearer ${admin.token}` }
        });
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, [admin.token]);

  if (!stats) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Dashboard Overview</h1>
      <div className="admin-stats-grid">
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">${stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-value">{stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p className="stat-value" style={{ color: '#f39c12' }}>{stats.pendingOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Products in Store</h3>
          <p className="stat-value">{stats.totalProducts}</p>
        </div>
      </div>
    </div>
  );
}
