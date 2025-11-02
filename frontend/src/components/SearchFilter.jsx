import { useState } from 'react';

const SearchFilter = ({ categories, filters, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedCategory, setSelectedCategory] = useState(filters.category || '');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilterChange({
      search: value,
      category: selectedCategory
    });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    onFilterChange({
      search: searchTerm,
      category: value
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    onFilterChange({
      search: '',
      category: ''
    });
  };

  return (
    <div className="search-filter-container">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="form-control"
      />
      
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="form-control"
      >
        <option value="">All Categories</option>
        {categories.map(category => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {(searchTerm || selectedCategory) && (
        <button onClick={clearFilters} className="btn btn-secondary">
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default SearchFilter;

