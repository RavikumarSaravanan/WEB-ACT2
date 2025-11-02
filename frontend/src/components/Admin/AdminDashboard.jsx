import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI, adminAPI } from '../../services/api';
import ProductTable from './ProductTable';
import ProductForm from './ProductForm';
import CustomerList from './CustomerList';
import OrderList from './OrderList';
import DashboardStats from './DashboardStats';
import '../../App.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, products, customers, orders
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    if (activeTab === 'products') {
      fetchProducts();
      fetchCategories();
    }
  }, [activeTab]);

  const checkAuth = async () => {
    try {
      const response = await adminAPI.getStatus();
      if (!response.success || !response.data.isAdmin) {
        navigate('/admin/login');
      }
    } catch (err) {
      navigate('/admin/login');
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      if (response.success) {
        setProducts(response.data);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError('Error loading products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productAPI.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await productAPI.delete(id);
      if (response.success) {
        fetchProducts();
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      alert('Error deleting product');
      console.error('Error deleting product:', err);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleLogout = async () => {
    try {
      await adminAPI.logout();
      navigate('/admin/login');
    } catch (err) {
      console.error('Error logging out:', err);
      navigate('/admin/login');
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="admin-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <div>
          {activeTab === 'products' && (
            <button className="btn btn-primary" onClick={handleCreate} style={{ marginRight: '10px' }}>
              Add New Product
            </button>
          )}
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #ddd' }}>
        <button
          className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderBottom: activeTab === 'dashboard' ? '3px solid #007bff' : '3px solid transparent',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'dashboard' ? 'bold' : 'normal'
          }}
        >
          📊 Dashboard
        </button>
        <button
          className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderBottom: activeTab === 'products' ? '3px solid #007bff' : '3px solid transparent',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'products' ? 'bold' : 'normal'
          }}
        >
          📦 Products
        </button>
        <button
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderBottom: activeTab === 'orders' ? '3px solid #007bff' : '3px solid transparent',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'orders' ? 'bold' : 'normal'
          }}
        >
          🛒 Orders
        </button>
        <button
          className={`tab-button ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderBottom: activeTab === 'customers' ? '3px solid #007bff' : '3px solid transparent',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'customers' ? 'bold' : 'normal'
          }}
        >
          👥 Customers
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Tab Content */}
      {activeTab === 'dashboard' && <DashboardStats />}
      
      {activeTab === 'products' && (
        <>
          {showForm ? (
            <ProductForm
              product={editingProduct}
              categories={categories}
              onClose={handleFormClose}
              onSuccess={handleFormSuccess}
            />
          ) : (
            <ProductTable
              products={products}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRefresh={fetchProducts}
            />
          )}
        </>
      )}

      {activeTab === 'orders' && <OrderList />}
      
      {activeTab === 'customers' && <CustomerList />}
    </div>
  );
};

export default AdminDashboard;

