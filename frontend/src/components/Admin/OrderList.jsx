import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import '../../App.css';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getOrders();
      if (response.success) {
        setOrders(response.data);
      } else {
        setError('Failed to load orders');
      }
    } catch (err) {
      setError('Error loading orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await adminAPI.exportOrders('csv');
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error exporting orders');
      console.error('Export error:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
      case 'delivered':
        return '#28a745';
      case 'pending':
        return '#ffc107';
      case 'shipped':
        return '#17a2b8';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#666';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.id || order._id)?.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = filteredOrders.reduce((sum, order) => {
    return sum + (parseFloat(order.total_amount) || 0);
  }, 0);

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Order Management</h2>
        <div>
          <button className="btn btn-success" onClick={handleExport}>
            Export CSV
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search orders by customer, email, or order ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: '1',
            minWidth: '200px',
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '5px'
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '5px'
          }}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Date</th>
              <th>Status</th>
              <th>Items</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No orders found matching your filters' 
                    : 'No orders yet'}
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id || order._id}>
                  <td>#{order.id || order._id}</td>
                  <td>{order.customer_name || order.customer_id?.name || '-'}</td>
                  <td>{order.email || order.customer_id?.email || '-'}</td>
                  <td>
                    {order.order_date
                      ? new Date(order.order_date).toLocaleDateString()
                      : order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : '-'}
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: getStatusColor(order.status),
                        color: 'white',
                        fontSize: '12px',
                        textTransform: 'capitalize'
                      }}
                    >
                      {order.status || 'pending'}
                    </span>
                  </td>
                  <td>{order.item_count || order.total_items || order.items?.length || 0}</td>
                  <td>₹{parseFloat(order.total_amount || 0).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: '#666' }}>
          Total Orders: <strong>{filteredOrders.length}</strong>
        </div>
        <div style={{ color: '#28a745', fontSize: '18px', fontWeight: 'bold' }}>
          Total Revenue: <strong>₹{totalRevenue.toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
};

export default OrderList;


