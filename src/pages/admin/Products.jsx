import { useState, useEffect, useContext } from 'react';
import { AdminAuthContext } from '../../context/AdminAuthContext';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const { admin } = useContext(AdminAuthContext);
  
  // Form State
  const initialFormState = { title: '', shortDesc: '', fullDesc: '', price: '', category: 'bouquets' };
  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const openAddModal = () => {
    setFormData(initialFormState);
    setEditingProductId(null);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setFormData({
      title: product.title,
      shortDesc: product.shortDesc,
      fullDesc: product.fullDesc || '',
      price: product.price,
      category: product.category,
      img: product.img // keep existing image
    });
    setEditingProductId(product._id);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imagePath = formData.img || '/placeholder.png';
      
      // Upload image if a new one was selected
      if (imageFile) {
        const imgData = new FormData();
        imgData.append('image', imageFile);
        const uploadRes = await fetch('http://localhost:5000/api/admin/products/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${admin.token}` },
          body: imgData
        });
        imagePath = await uploadRes.text();
      }

      const method = editingProductId ? 'PUT' : 'POST';
      const url = editingProductId 
        ? `http://localhost:5000/api/admin/products/${editingProductId}` 
        : 'http://localhost:5000/api/admin/products';

      await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${admin.token}` 
        },
        body: JSON.stringify({ ...formData, img: imagePath })
      });

      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`http://localhost:5000/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${admin.token}` }
      });
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginbottom: '2rem' }}>
        <h1 style={{ marginBottom: '2rem' }}>Manage Products</h1>
        <button className="btn-primary" onClick={openAddModal}>+ Add Product</button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td>
                  <img src={product.img.startsWith('http') ? product.img : `http://localhost:5000${product.img}`} alt={product.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                </td>
                <td>{product.title}</td>
                <td style={{textTransform: 'capitalize'}}>{product.category}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  <button onClick={() => openEditModal(product)} className="btn-primary-outline" style={{ marginRight: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Edit</button>
                  <button onClick={() => deleteProduct(product._id)} className="btn-danger-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <h2>{editingProductId ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Title</label>
                <input type="text" value={formData.title} required onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Price</label>
                <input type="number" value={formData.price} step="0.01" required onChange={(e) => setFormData({...formData, price: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Category</label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option value="bouquets">Bouquets</option>
                  <option value="crochet">Crochet</option>
                  <option value="clothing">Clothing</option>
                  <option value="jewelry">Jewelry</option>
                </select>
              </div>
              <div className="input-group">
                <label>Short Description</label>
                <input type="text" value={formData.shortDesc} required onChange={(e) => setFormData({...formData, shortDesc: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Full Description (Optional)</label>
                <textarea rows="3" value={formData.fullDesc} onChange={(e) => setFormData({...formData, fullDesc: e.target.value})}></textarea>
              </div>
              <div className="input-group">
                <label>Product Image {editingProductId && '(Leave empty to keep current)'}</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-primary-outline w-100" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary w-100">{editingProductId ? 'Update Product' : 'Save Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
