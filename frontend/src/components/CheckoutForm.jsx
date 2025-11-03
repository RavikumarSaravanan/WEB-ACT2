import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import '../styles/CheckoutForm.css';

const FREE_DELIVERY_THRESHOLD = 499;
const DELIVERY_CHARGE = 50;

const CheckoutForm = ({ onSubmit, onCancel, loading }) => {
  const { cartItems } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    return Object.keys(newErrors).length === 0;
  };

  // Calculate subtotal and delivery charges
  useEffect(() => {
    const calculatedSubtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    setSubtotal(calculatedSubtotal);
    
    // Apply delivery charge if subtotal is less than threshold
    setDeliveryCharge(calculatedSubtotal < FREE_DELIVERY_THRESHOLD ? DELIVERY_CHARGE : 0);
  }, [cartItems]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Include delivery charge in the order details
    onSubmit({
      ...formData,
      subtotal,
      deliveryCharge,
      total: subtotal + deliveryCharge
    });
  };

  return (
    <div className="checkout-form">
      <h2 className="form-title">Checkout</h2>
      
      <div className="order-summary">
        <h3>Order Summary</h3>
        <div className="price-row">
          <span>Subtotal:</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="price-row">
          <span>Delivery Charge:</span>
          <span>₹{deliveryCharge.toFixed(2)}</span>
        </div>
        <div className="price-row total">
          <span>Total:</span>
          <span>₹{(subtotal + deliveryCharge).toFixed(2)}</span>
        </div>
        
        <div className={`delivery-info ${deliveryCharge > 0 ? 'charged' : ''}`}>
          {deliveryCharge > 0 ? (
            <>
              <span>Delivery Charge: ₹{DELIVERY_CHARGE}</span>
              <br />
              <small>Add items worth ₹{(FREE_DELIVERY_THRESHOLD - subtotal).toFixed(2)} more for free delivery</small>
            </>
          ) : (
            <span>✓ Eligible for FREE Delivery</span>
          )}
        </div>
      </div>

      <h3>Shipping Information</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Delivery Address *</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <div className="button-group">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Processing...' : `Pay ₹${(subtotal + deliveryCharge).toFixed(2)}`}
          </button>
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;

