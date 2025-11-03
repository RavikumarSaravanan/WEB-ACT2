import { useCart } from '../context/CartContext';
import { FaStar } from 'react-icons/fa';
import '../styles/ProductCard.css';
import { MdLocalShipping } from 'react-icons/md';

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
  const discount = Math.floor(Math.random() * 30) + 10; // Random discount between 10-40%
  const originalPrice = Math.floor(product.price * (100 / (100 - discount)));

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={getImageUrl()} alt={product.name} />
        {discount > 0 && <span className="discount-tag">{discount}% off</span>}
      </div>
      <div className="product-card-body">
        <h3 className="product-title">{product.name}</h3>
        {product.category && (
          <div className="category">{product.category}</div>
        )}
        <div className="product-rating">
          <span className="rating">
            4.{Math.floor(Math.random() * 5) + 5} <FaStar className="star-icon" />
          </span>
          <span className="rating-count">({Math.floor(Math.random() * 1000) + 100})</span>
        </div>
        <div className="product-price">
          <span className="current-price">₹{product.price.toFixed(2)}</span>
          <span className="original-price">₹{originalPrice}</span>
          <span className="discount-percent">{discount}% off</span>
        </div>
        {product.description && (
          <div className="description">{product.description}</div>
        )}
        <div className="delivery-info">
          <MdLocalShipping className="shipping-icon" />
          <span>Free Delivery</span>
        </div>
        <div className={`stock-info ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}>
          {isOutOfStock ? 'Out of Stock' : `Only ${product.stock} left!`}
        </div>
        <button
          className={`add-to-cart-btn ${isOutOfStock ? 'disabled' : ''}`}
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

