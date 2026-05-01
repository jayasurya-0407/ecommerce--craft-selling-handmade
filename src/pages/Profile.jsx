import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, updateProfile, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    password: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', message: 'Updating...' });
    const res = await updateProfile(formData);
    if (res.success) {
      setStatus({ type: 'success', message: 'Profile updated successfully!' });
      setFormData({ ...formData, password: '' });
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } else {
      setStatus({ type: 'error', message: res.message });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="auth-page" style={{ padding: '8rem 0 4rem' }}>
      <div className="container">
        <div className="form-wrapper" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2>My Profile</h2>
            <button className="btn-danger-sm" onClick={handleLogout}>Log Out</button>
          </div>
          
          {status.message && (
            <div className={`auth-${status.type === 'error' ? 'error' : 'success'}`} style={{ marginBottom: '1rem', padding: '1rem', borderRadius: '4px', backgroundColor: status.type === 'error' ? '#ffeaea' : '#eafaf1', color: status.type === 'error' ? '#e74c3c' : '#27ae60' }}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email (Cannot be changed)</label>
              <input type="email" value={user.email} disabled style={{ backgroundColor: '#f9f9f9', color: '#888' }} />
            </div>
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Delivery Address</label>
              <textarea name="address" rows="3" value={formData.address} onChange={handleChange} required></textarea>
            </div>
            <div className="input-group">
              <label>New Password (Leave blank to keep current)</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} />
            </div>
            <button type="submit" className="btn-primary w-100">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
}
