import { useState } from 'react';

const ProductTable = ({ products, onEdit, onDelete }) => {
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortField) return 0;

    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return 'https://via.placeholder.com/60x60?text=No+Image';
    }
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `http://localhost:5000${imagePath}`;
  };

  return (
    <div className="admin-table">
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
              Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th>Category</th>
            <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
              Price {sortField === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('stock')} style={{ cursor: 'pointer' }}>
              Stock {sortField === 'stock' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                No products found. Click "Add New Product" to create one.
              </td>
            </tr>
          ) : (
            sortedProducts.map(product => (
              <tr key={product.id}>
                <td>
                  <img src={getImageUrl(product.image_path)} alt={product.name} />
                </td>
                <td>{product.name}</td>
                <td>{product.category || '-'}</td>
                <td>₹{product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>
                  <div className="admin-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => onEdit(product)}
                      style={{ padding: '5px 10px', fontSize: '14px' }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => onDelete(product.id)}
                      style={{ padding: '5px 10px', fontSize: '14px' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;

