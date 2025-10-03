import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { productAPI, productCategories } from '../../services/products';
import './ProductManagement.css';

const ProductManagement = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'other',
    stock: '',
    images: []
  });

  useEffect(() => {
    if (user?.businessVerified) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('bizsphere_token');
      const productsData = await productAPI.getMyProducts(token);
      setProducts(productsData);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      alert('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user.businessVerified) {
      alert('Your business must be verified to manage products');
      return;
    }

    try {
      const token = localStorage.getItem('bizsphere_token');
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0
      };

      if (editingProduct) {
        await productAPI.updateProduct(editingProduct._id, productData, token);
        alert('Product updated successfully!');
      } else {
        await productAPI.createProduct(productData, token);
        alert('Product created successfully!');
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'other',
      stock: '',
      images: []
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const editProduct = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      images: product.images
    });
    setEditingProduct(product);
    setShowForm(true);
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const token = localStorage.getItem('bizsphere_token');
      await productAPI.deleteProduct(productId, token);
      alert('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  const toggleProductStatus = async (product) => {
    try {
      const token = localStorage.getItem('bizsphere_token');
      await productAPI.updateProduct(
        product._id, 
        { isActive: !product.isActive }, 
        token
      );
      alert(`Product ${!product.isActive ? 'activated' : 'deactivated'} successfully!`);
      fetchProducts();
    } catch (error) {
      alert('Failed to update product status');
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="product-management">
      <div className="product-header">
        <h2>Product Management</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="add-product-btn"
          disabled={!user.businessVerified}
        >
          + Add New Product
        </button>
      </div>

      {!user.businessVerified && (
        <div className="verification-warning">
          <p>⚠️ Your business must be verified by admin to manage products.</p>
          <p>Current status: <strong>{user.verificationStatus}</strong></p>
        </div>
      )}

      {showForm && (
        <div className="product-form-overlay">
          <div className="product-form">
            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter product name"
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter product description"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label>Stock Quantity *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  {productCategories
                    .filter(cat => cat.value !== 'all')
                    .map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))
                  }
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
                <button type="button" onClick={resetForm} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="products-grid">
        {products.length === 0 ? (
          <div className="empty-products">
            <h3>No products yet</h3>
            <p>Start by adding your first product to your catalog.</p>
            <button 
              onClick={() => setShowForm(true)}
              className="add-first-product-btn"
              disabled={!user.businessVerified}
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          products.map(product => (
            <div key={product._id} className={`product-card ${!product.isActive ? 'inactive' : ''}`}>
              <div className="product-image">
                {product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.name} />
                ) : (
                  <div className="no-image">📷 No Image</div>
                )}
              </div>
              
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-details">
                  <span className="product-price">₹{product.price}</span>
                  <span className={`product-stock ${product.stock <= 10 ? 'low-stock' : ''}`}>
                    Stock: {product.stock}
                  </span>
                  <span className="product-category">{product.category}</span>
                </div>
                
                <div className="product-status">
                  <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="product-actions">
                <button 
                  onClick={() => editProduct(product)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button 
                  onClick={() => toggleProductStatus(product)}
                  className={`status-btn ${product.isActive ? 'deactivate' : 'activate'}`}
                >
                  {product.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button 
                  onClick={() => deleteProduct(product._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductManagement;