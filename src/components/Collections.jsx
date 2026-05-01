import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products as localProducts } from '../data/products';

export default function Collections() {
  const [products, setProducts] = useState(localProducts);
  
  const API_URL = 'https://ecommerce-craft-selling-handmade.onrender.com';

  useEffect(() => {
    // Attempt to fetch products from backend DB
    // If it fails (backend not running), it safely falls back to local data
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(err => {
        console.log('Backend not detected, using local product data fallback.');
      });
  }, []);

  // Helper to format image URL if it's an uploaded file
  const getImageUrl = (img) => {
    if (!img) return '';
    if (img.startsWith('http') || img.startsWith('data:')) return img;
    // For local assets shipped with frontend, keep as is
    if (img.startsWith('/assets/')) return img;
    // For legacy uploaded files on backend
    return `${API_URL}${img}`;
  };

  return (
    <section className="collections" id="collections">
      <div className="container fade-in">
        <h2 className="section-title">Our Collections</h2>
        <div className="collection-grid">
          {products.map(product => (
            <div className="product-card" key={product._id || product.id}>
              <Link to={`/product/${product.id || product._id}`}>
                <div className="card-img">
                  <img src={getImageUrl(product.img)} alt={product.title} />
                </div>
                <h3>{product.title}</h3>
                <p>{product.shortDesc}</p>
                <p className="price" style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>${product.price.toFixed(2)}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
