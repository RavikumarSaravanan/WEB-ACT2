import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    updateQuantity(item.product_id, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.product_id);
  };

  // Get image URL
  const getImageUrl = () => {
    if (!item.image_path) {
      return 'https://via.placeholder.com/100x100?text=No+Image';
    }
    if (item.image_path.startsWith('http')) {
      return item.image_path;
    }
    return `http://localhost:5000${item.image_path}`;
  };

  return (
    <div className="cart-item">
      <img src={getImageUrl()} alt={item.name} />
      <div className="cart-item-details">
        <h3>{item.name}</h3>
        <p>₹{item.price.toFixed(2)} each</p>
      </div>
      <div className="cart-item-controls">
        <div className="quantity-controls">
          <button onClick={() => handleQuantityChange(item.quantity - 1)}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => handleQuantityChange(item.quantity + 1)}>+</button>
        </div>
        <div style={{ minWidth: '100px', textAlign: 'right' }}>
          <strong>₹{(item.price * item.quantity).toFixed(2)}</strong>
        </div>
        <button className="btn btn-danger" onClick={handleRemove}>
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;

