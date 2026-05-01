import { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount, toggleCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const handleScroll = (id) => {
    setIsOpen(false);
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="navbar">
      <Link to="/" className="logo">Haan Handmade</Link>
      <nav className={`nav-links ${isOpen ? 'active' : ''}`}>
        <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
        <Link to="/#about" onClick={() => handleScroll('about')}>About</Link>
        <Link to="/#collections" onClick={() => handleScroll('collections')}>Collections</Link>
        <Link to="/#testimonials" onClick={() => handleScroll('testimonials')}>Testimonials</Link>
        
        {user ? (
          <Link to="/profile" onClick={() => setIsOpen(false)} style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
            Hi, {user.name.split(' ')[0]}
          </Link>
        ) : (
          <Link to="/login" onClick={() => setIsOpen(false)}>Sign In</Link>
        )}

        <Link to="/#custom-order" className="btn-primary-outline" onClick={() => handleScroll('custom-order')}>Custom Order</Link>
        <button className="cart-icon" onClick={toggleCart}>
          🛒 <span className="cart-badge">{cartCount}</span>
        </button>
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="cart-icon mobile-cart" onClick={toggleCart} style={{ display: 'none' }}>
          🛒 <span className="cart-badge">{cartCount}</span>
        </button>
        <button 
          className="mobile-menu-toggle" 
          aria-label="Toggle menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>
    </header>
  );
}
