import { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import SearchFilter from './SearchFilter';
import ProductCard from './ProductCard';
import '../App.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: ''
  });

  // Fetch products and categories on mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Client-side filtering when filters change
  useEffect(() => {
    let filtered = [...products];

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower))
      );
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    setFilteredProducts(filtered);
  }, [products, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      if (response.success) {
        setProducts(response.data);
        setFilteredProducts(response.data);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError('Error loading products. Please try again.');
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

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="products-section">
      <div className="container">
        <div className="page-header">
          <h2>Our Products</h2>
          <p>Shop from our wide selection of items</p>
        </div>

        <SearchFilter
          categories={categories}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3>No products found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;

