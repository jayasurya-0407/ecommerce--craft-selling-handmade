import { useState, useEffect, useContext } from 'react';
import { AdminAuthContext } from '../../context/AdminAuthContext';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const { admin } = useContext(AdminAuthContext);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/orders', {
        headers: { Authorization: `Bearer ${admin.token}` }
      });
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${admin.token}` 
        },
        body: JSON.stringify({ status })
      });
      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await fetch(`http://localhost:5000/api/admin/orders/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${admin.token}` }
      });
      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Manage Orders</h1>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Type</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id.substring(18)}</td>
                <td>{order.customerName}<br/><small>{order.customerEmail}</small></td>
                <td>
                  <span className={`badge ${order.orderType === 'custom_request' ? 'badge-primary' : 'badge-secondary'}`}>
                    {order.orderType.replace('_', ' ')}
                  </span>
                </td>
                <td>${order.totalAmount ? order.totalAmount.toFixed(2) : 'N/A'}</td>
                <td>
                  <select 
                    value={order.status} 
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className={`status-select status-${order.status}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => deleteOrder(order._id)} className="btn-danger-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
