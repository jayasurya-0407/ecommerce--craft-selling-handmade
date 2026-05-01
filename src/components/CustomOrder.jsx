import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function CustomOrder() {
  const [status, setStatus] = useState('idle');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { message: 'Please sign in to place a custom order.', from: location } });
      return;
    }
    setStatus('submitting');
    
    const formData = {
      userId: user._id,
      name: e.target.name.value,
      email: e.target.email.value,
      productType: e.target.product.value,
      details: e.target.details.value
    };

    try {
      const response = await fetch('http://localhost:5000/api/orders/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setStatus('success');
        e.target.reset();
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section className="custom-order" id="custom-order">
      <div className="container fade-in">
        <div className="form-wrapper">
          <h2 className="section-title">Request a Custom Order</h2>
          <p className="form-subtitle">Have a unique idea? Let's create something beautiful together.</p>
          <form id="orderForm" className="contact-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="name">Your Name</label>
              <input type="text" id="name" required />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" required />
            </div>
            <div className="input-group">
              <label htmlFor="product">Interested In</label>
              <select id="product">
                <option value="bouquet">Handmade Bouquet</option>
                <option value="crochet">Crochet Product</option>
                <option value="dress">Custom Dress</option>
                <option value="bangles">Silk Bangles</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="details">Design Details</label>
              <textarea id="details" rows="4" required placeholder="Tell us about your colors, size, and ideas..."></textarea>
            </div>
            <button 
              type="submit" 
              className="btn-primary w-100" 
              disabled={status === 'submitting'}
              style={status === 'success' ? { backgroundColor: '#4CAF50' } : status === 'error' ? { backgroundColor: '#f44336' } : {}}
            >
              {status === 'submitting' ? 'Sending Request...' : 
               status === 'success' ? 'Request Sent Successfully!' : 
               status === 'error' ? 'Connection Error. Is Backend running?' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
