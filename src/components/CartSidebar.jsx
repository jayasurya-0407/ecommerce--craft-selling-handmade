import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function CartSidebar() {
  const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, cartTotal } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [checkoutStatus, setCheckoutStatus] = useState('idle');
  const navigate = useNavigate();
  const location = useLocation();

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (!user) {
      toggleCart();
      navigate('/login', { state: { message: 'Please sign in to complete your checkout.', from: location } });
      return;
    }

    setCheckoutStatus('submitting');
    
    const orderData = {
      userId: user._id,
      name: user.name,
      email: user.email,
      items: cart.map(item => ({
        productId: item.id,
        title: item.title,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: cartTotal
    };

    try {
      const response = await fetch('http://localhost:5000/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      if (response.ok) {
        setCheckoutStatus('success');
        setTimeout(() => {
          setCheckoutStatus('idle');
          toggleCart();
          // Ideally you'd clear the cart context here too
        }, 2000);
      } else {
        setCheckoutStatus('error');
        setTimeout(() => setCheckoutStatus('idle'), 2000);
      }
    } catch (err) {
      console.error(err);
      setCheckoutStatus('error');
      setTimeout(() => setCheckoutStatus('idle'), 2000);
    }
  };

  return (
    <>
      <div className="cart-overlay" onClick={toggleCart}></div>
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-cart" onClick={toggleCart}>&times;</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty.</p>
          ) : (
            cart.map(item => (
              <div className="cart-item" key={item.id}>
                <img src={item.img} alt={item.title} />
                <div className="item-details">
                  <h4>{item.title}</h4>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button className="remove-item" onClick={() => removeFromCart(item.id)}>&times;</button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button 
              className="btn-primary w-100" 
              onClick={handleCheckout}
              disabled={checkoutStatus === 'submitting'}
              style={checkoutStatus === 'success' ? { backgroundColor: '#4CAF50' } : checkoutStatus === 'error' ? { backgroundColor: '#f44336' } : {}}
            >
              {checkoutStatus === 'submitting' ? 'Processing...' : 
               checkoutStatus === 'success' ? 'Order Placed!' : 
               checkoutStatus === 'error' ? 'Connection Error' : 'Checkout'}
            </button>
            <Link to="/#custom-order" className="btn-primary-outline w-100" onClick={toggleCart} style={{ marginTop: '1rem', display: 'block', textAlign: 'center' }}>
              Checkout as Custom Order
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
