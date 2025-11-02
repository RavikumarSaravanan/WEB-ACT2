import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import '../../App.css';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getCustomers();
      if (response.success) {
        setCustomers(response.data);
      } else {
        setError('Failed to load customers');
      }
    } catch (err) {
      setError('Error loading customers');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await adminAPI.exportCustomers('csv');
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error exporting customers');
      console.error('Export error:', err);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Customer Management</h2>
        <div>
          <button className="btn btn-success" onClick={handleExport}>
            Export CSV
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search customers by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '5px'
          }}
        />
      </div>

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                  {searchTerm ? 'No customers found matching your search' : 'No customers yet'}
                </td>
              </tr>
            ) : (
              filteredCustomers.map(customer => (
                <tr key={customer.id || customer._id}>
                  <td>{customer.id || customer._id}</td>
                  <td>{customer.name}</td>
                  <td>{customer.email || '-'}</td>
                  <td>{customer.phone || '-'}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {customer.address || '-'}
                  </td>
                  <td>
                    {customer.created_at
                      ? new Date(customer.created_at).toLocaleDateString()
                      : customer.createdAt
                      ? new Date(customer.createdAt).toLocaleDateString()
                      : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '20px', color: '#666' }}>
        Total Customers: <strong>{filteredCustomers.length}</strong>
      </div>
    </div>
  );
};

export default CustomerList;


