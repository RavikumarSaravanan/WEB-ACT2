import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import CartItem from './CartItem';
import CheckoutForm from './CheckoutForm';
import PaymentForm from './PaymentForm';
import '../App.css';

const ShoppingCart = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = (customerData) => {
    // Store customer data and proceed to payment
    setCustomerData(customerData);
    setShowCheckout(false);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentData) => {
    if (cart.length === 0) {
      setError('Cart is empty');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare order data with payment information
      const items = cart.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: item.price
      }));

      const totalAmount = getTotalPrice();

      const orderData = {
        customer: customerData,
        items: items,
        totalAmount: totalAmount,
        payment: {
          orderId: paymentData.orderId,
          paymentId: paymentData.paymentId,
          verified: paymentData.verified
        }
      };

      const response = await orderAPI.create(orderData);

      if (response.success) {
        setOrderSuccess(true);
        clearCart();
        
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setError(response.message || 'Failed to place order');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error placing order. Please try again.');
      console.error('Error placing order:', err);
    } finally {
      setLoading(false);
      setShowPayment(false);
    }
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setShowCheckout(true);
  };

  if (orderSuccess) {
    return (
      <div className="cart-container">
        <div className="success-message" style={{ textAlign: 'center', padding: '40px' }}>
          <h2>Order Placed Successfully! 🎉</h2>
          <p>Thank you for your purchase. Redirecting to products...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some products to your cart to continue shopping</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="page-header">
        <h2>Shopping Cart</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      {cart.map(item => (
        <CartItem key={item.product_id} item={item} />
      ))}

      <div className="cart-summary">
        <h3>Order Summary</h3>
        <div className="cart-summary-row">
          <span>Subtotal:</span>
          <span>₹{getTotalPrice().toFixed(2)}</span>
        </div>
        <div className="cart-summary-row total">
          <span>Total:</span>
          <span>₹{getTotalPrice().toFixed(2)}</span>
        </div>

        {!showCheckout && (
          <button
            className="btn btn-success"
            style={{ width: '100%', marginTop: '20px' }}
            onClick={() => setShowCheckout(true)}
          >
            Proceed to Checkout
          </button>
        )}
      </div>

      {showCheckout && !showPayment && (
        <CheckoutForm
          onSubmit={handleCheckout}
          onCancel={() => setShowCheckout(false)}
          loading={loading}
        />
      )}

      {showPayment && customerData && (
        <PaymentForm
          amount={getTotalPrice()}
          orderItems={cart}
          customerData={customerData}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
          onError={(errorMessage) => {
            setError(errorMessage);
            setShowPayment(false);
            setShowCheckout(true);
          }}
        />
      )}
    </div>
  );
};

export default ShoppingCart;

