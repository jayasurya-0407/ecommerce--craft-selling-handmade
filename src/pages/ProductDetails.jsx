import { useParams, Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { products } from '../data/products';
import { CartContext } from '../context/CartContext';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const product = products.find(p => p.id === parseInt(id));
  
  // Scroll to top when loading new product
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="container" style={{ padding: '8rem 2rem', textAlign: 'center', minHeight: '60vh' }}>
        <h2>Product not found.</h2>
        <Link to="/" className="btn-primary" style={{ marginTop: '2rem' }}>Back to Home</Link>
      </div>
    );
  }

  // Recommended products (excluding current one)
  const recommendations = products.filter(p => p.id !== product.id).slice(0, 3);

  const handleCustomOrderClick = () => {
    // Navigate home and pass state to scroll to order form, or just navigate to #custom-order
    navigate('/#custom-order');
    // Using a timeout to let react-router digest the hash and jump
    setTimeout(() => {
      document.getElementById('custom-order')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <main className="product-page">
      <section className="product-details container">
        <Link to="/" className="back-link">← Back to Collections</Link>
        
        <div className="product-layout">
          <div className="product-image-large">
            <img src={product.img} alt={product.title} />
          </div>
          <div className="product-info">
            <h1>{product.title}</h1>
            <p className="price">${product.price.toFixed(2)}</p>
            <div className="description">
              <p>{product.fullDesc}</p>
            </div>
            
            <div className="product-actions">
              <button 
                className="btn-primary w-100" 
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
              <button 
                className="btn-primary-outline w-100" 
                onClick={handleCustomOrderClick}
                style={{ marginTop: '1rem' }}
              >
                Request Custom Order
              </button>
            </div>
            <p className="shipping-note">Ships within 5-7 business days. Custom orders take 2-3 weeks.</p>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="recommendations container">
        <h2 className="section-title">You May Also Like</h2>
        <div className="collection-grid">
          {recommendations.map(rec => (
            <div className="product-card" key={rec.id}>
              <Link to={`/product/${rec.id}`}>
                <div className="card-img">
                  <img src={rec.img} alt={rec.title} />
                </div>
                <h3>{rec.title}</h3>
                <p>{rec.shortDesc}</p>
                <p className="rec-price">${rec.price.toFixed(2)}</p>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
