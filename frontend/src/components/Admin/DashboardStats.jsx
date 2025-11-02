import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import '../../App.css';

const DashboardStats = ({ onExport }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getStats();
      if (response.success) {
        setStats(response.data);
      } else {
        setError('Failed to load statistics');
      }
    } catch (err) {
      setError('Error loading statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (error || !stats) {
    return <div className="error-message">{error || 'Failed to load statistics'}</div>;
  }

  return (
    <div className="admin-stats">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#007bff' }}>📦</div>
          <div className="stat-content">
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#28a745' }}>👥</div>
          <div className="stat-content">
            <h3>{stats.totalCustomers}</h3>
            <p>Total Customers</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ffc107' }}>🛒</div>
          <div className="stat-content">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#17a2b8' }}>💰</div>
          <div className="stat-content">
            <h3>₹{parseFloat(stats.totalRevenue || 0).toFixed(2)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#6c757d' }}>📊</div>
          <div className="stat-content">
            <h3>{stats.totalStock}</h3>
            <p>Total Stock</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="stat-section">
          <h3>Orders by Status</h3>
          <div style={{ marginTop: '15px' }}>
            {Object.entries(stats.ordersByStatus || {}).map(([status, count]) => (
              <div key={status} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <span style={{ textTransform: 'capitalize' }}>{status}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="stat-section">
          <h3>Recent Orders</h3>
          <div style={{ marginTop: '15px', maxHeight: '300px', overflowY: 'auto' }}>
            {stats.recentOrders && stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <div key={order.id || order._id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <strong>#{order.id || order._id}</strong>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {order.customer_name || order.customer_id?.name || 'Unknown'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold' }}>₹{parseFloat(order.total_amount || 0).toFixed(2)}</div>
                      <div style={{ fontSize: '12px', color: '#666', textTransform: 'capitalize' }}>
                        {order.status || 'pending'}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#666' }}>No recent orders</p>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button className="btn btn-primary" onClick={fetchStats}>
          Refresh Statistics
        </button>
      </div>
    </div>
  );
};

export default DashboardStats;


