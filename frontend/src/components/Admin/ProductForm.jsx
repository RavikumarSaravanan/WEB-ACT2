import { useState, useEffect } from 'react';
import { productAPI } from '../../services/api';
import '../../App.css';

const ProductForm = ({ product, categories, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [useImageUrl, setUseImageUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
        category: product.category || ''
      });
      if (product.image_path) {
        if (product.image_path.startsWith('http')) {
          // External URL
          setImageUrl(product.image_path);
          setUseImageUrl(true);
          setImagePreview(product.image_path);
        } else {
          // Local file
          setUseImageUrl(false);
          setImagePreview(`http://localhost:5000${product.image_path}`);
        }
      }
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(''); // Clear URL when file is selected
      setUseImageUrl(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setImageFile(null); // Clear file when URL is entered
    setUseImageUrl(true);
    if (url) {
      setImagePreview(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      const productData = { ...formData };
      
      // Add image URL if using URL instead of file
      if (useImageUrl && imageUrl) {
        productData.image_url = imageUrl;
      }

      if (product) {
        // Update existing product
        response = await productAPI.update(product.id, productData, useImageUrl ? null : imageFile);
      } else {
        // Create new product
        response = await productAPI.create(productData, useImageUrl ? null : imageFile);
      }

      if (response.success) {
        onSuccess();
      } else {
        setError(response.message || 'Failed to save product');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving product. Please try again.');
      console.error('Error saving product:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-form">
      <h3>{product ? 'Edit Product' : 'Add New Product'}</h3>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Product Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price (₹) *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="stock">Stock Quantity *</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="image-source">Image Source</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="radio"
                name="imageSource"
                checked={!useImageUrl}
                onChange={() => setUseImageUrl(false)}
              />
              Upload File
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="radio"
                name="imageSource"
                checked={useImageUrl}
                onChange={() => setUseImageUrl(true)}
              />
              Image URL
            </label>
          </div>

          {!useImageUrl ? (
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
          ) : (
            <input
              type="url"
              id="image-url"
              name="image-url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={handleImageUrlChange}
            />
          )}
          
          {imagePreview && (
            <div style={{ marginTop: '10px' }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '5px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  setError('Failed to load image. Please check the URL.');
                }}
              />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;

