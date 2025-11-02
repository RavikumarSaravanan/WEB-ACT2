import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  // Get image URL - handle both relative and absolute paths
  const getImageUrl = () => {
    if (!product.image_path) {
      return 'https://via.placeholder.com/300x200?text=No+Image';
    }
    if (product.image_path.startsWith('http')) {
      return product.image_path;
    }
    return `http://localhost:5000${product.image_path}`;
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="product-card">
      <img src={getImageUrl()} alt={product.name} />
      <div className="product-card-body">
        <h3>{product.name}</h3>
        {product.category && (
          <div className="category">{product.category}</div>
        )}
        {product.description && (
          <div className="description">{product.description}</div>
        )}
        <div className="price">₹{product.price.toFixed(2)}</div>
        <div className={`stock ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}>
          {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
        </div>
        <button
          className={`btn ${isOutOfStock ? 'btn-secondary' : 'btn-primary'}`}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

