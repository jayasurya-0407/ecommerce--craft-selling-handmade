import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', address: ''
  });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(formData);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="auth-page" style={{ padding: '6rem 0' }}>
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <h2>Create Profile</h2>
        <p className="auth-subtitle">Join us to place custom orders and checkout quickly.</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" name="name" onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Delivery Address</label>
            <textarea name="address" rows="3" onChange={handleChange} required></textarea>
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" name="password" onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-primary w-100">Create Profile</button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login" state={{ from: location.state?.from }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
