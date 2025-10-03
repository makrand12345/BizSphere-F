import api from './auth';

export const productAPI = {
  // Get all products (for customers)
  getProducts: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.business) params.append('business', filters.business);
    
    const response = await api.get(`/products?${params}`);
    return response.data;
  },

  // Get single product
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Business owner product management
  getMyProducts: async (token) => {
    const response = await api.get('/products/my-products', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  createProduct: async (productData, token) => {
    const response = await api.post('/products', productData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  updateProduct: async (id, productData, token) => {
    const response = await api.put(`/products/${id}`, productData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  deleteProduct: async (id, token) => {
    const response = await api.delete(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getBusinessStats: async (token) => {
    const response = await api.get('/products/stats/business', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

// Product categories
export const productCategories = [
  { value: 'all', label: 'All Categories' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'food', label: 'Food' },
  { value: 'books', label: 'Books' },
  { value: 'home', label: 'Home' },
  { value: 'other', label: 'Other' }
];