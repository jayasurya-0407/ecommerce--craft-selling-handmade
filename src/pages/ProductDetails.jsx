import { useParams, Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { products as localProducts } from '../data/products';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Backend URL (matching what you set in Collections.jsx)
  const API_URL = 'https://ecommerce-craft-selling-handmade.onrender.com';

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Fetch products from database
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          // Find product by id (it might be a string from Mongo _id or a number from seed)
          const foundProduct = data.find(p => p.id == id || p._id == id);
          setProduct(foundProduct);
          setRecommendations(data.filter(p => p.id != id && p._id != id).slice(0, 3));
        } else {
          // Fallback to local
          fallbackToLocal();
        }
        setLoading(false);
      })
      .catch(err => {
        console.log('Backend not detected, using local data fallback.');
        fallbackToLocal();
        setLoading(false);
      });
  }, [id]);

  const fallbackToLocal = () => {
    const foundProduct = localProducts.find(p => p.id === parseInt(id));
    setProduct(foundProduct);
    setRecommendations(localProducts.filter(p => p.id !== foundProduct?.id).slice(0, 3));
  };

  if (loading) {
    return <div className="container" style={{ padding: '8rem 2rem', textAlign: 'center' }}>Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '8rem 2rem', textAlign: 'center', minHeight: '60vh' }}>
        <h2>Product not found.</h2>
        <Link to="/" className="btn-primary" style={{ marginTop: '2rem' }}>Back to Home</Link>
      </div>
    );
  }

  const handleCustomOrderClick = () => {
    navigate('/#custom-order');
    setTimeout(() => {
      document.getElementById('custom-order')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Helper to format image URL if it's an uploaded file
  const getImageUrl = (img) => {
    if (!img) return '';
    if (img.startsWith('http') || img.startsWith('data:')) return img;
    return `${API_URL}${img}`;
  };

  return (
    <main className="product-page">
      <section className="product-details container">
        <Link to="/" className="back-link">← Back to Collections</Link>
        
        <div className="product-layout">
          <div className="product-image-large">
            <img src={getImageUrl(product.img)} alt={product.title} />
          </div>
          <div className="product-info">
            <h1>{product.title}</h1>
            <p className="price">${product.price.toFixed(2)}</p>
            <div className="description">
              <p>{product.fullDesc || product.shortDesc}</p>
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
            <div className="product-card" key={rec._id || rec.id}>
              <Link to={`/product/${rec.id || rec._id}`}>
                <div className="card-img">
                  <img src={getImageUrl(rec.img)} alt={rec.title} />
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
