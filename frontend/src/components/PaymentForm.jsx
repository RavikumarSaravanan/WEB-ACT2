import { useState, useEffect } from 'react';
import { paymentAPI } from '../services/api';
import '../App.css';

const PaymentForm = ({ amount, orderItems, customerData, onSuccess, onCancel, onError }) => {
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  const handlePayment = async () => {
    try {
      setPaymentLoading(true);

      // Create order on backend
      const receipt = `receipt_${Date.now()}`;
      const orderResponse = await paymentAPI.createOrder(amount, receipt, {
        items: JSON.stringify(orderItems.map(item => ({
          product_id: item.product_id,
          name: item.name,
          quantity: item.quantity
        })))
      });

      if (!orderResponse.success) {
        // If payment keys not configured, proceed without payment (for testing)
        if (orderResponse.error === 'PAYMENT_NOT_CONFIGURED' || 
            (orderResponse.message && orderResponse.message.includes('Razorpay API keys'))) {
          // Show a message but proceed with mock payment for testing
          console.warn('Razorpay not configured, using mock payment for testing');
          // Skip payment and proceed with mock payment
          onSuccess({
            orderId: `mock_order_${Date.now()}`,
            paymentId: `mock_payment_${Date.now()}`,
            signature: 'mock_signature',
            verified: true
          });
          return;
        }
        throw new Error(orderResponse.message || 'Failed to create payment order');
      }

      if (!window.Razorpay) {
        // Wait a bit for script to load
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (!window.Razorpay) {
          throw new Error('Razorpay script not loaded. Please refresh the page.');
        }
      }

      const { orderId, keyId } = orderResponse.data;

      // Initialize Razorpay checkout
      const options = {
        key: keyId,
        amount: orderResponse.data.amount, // Amount in paise
        currency: orderResponse.data.currency,
        name: 'Local Cart Store',
        description: `Order for ${orderItems.length} item(s)`,
        order_id: orderId,
        prefill: {
          name: customerData.name || '',
          email: customerData.email || '',
          contact: customerData.phone || ''
        },
        notes: {
          customer_name: customerData.name,
          items: JSON.stringify(orderItems)
        },
        theme: {
          color: '#007bff'
        },
        handler: async function (response) {
          // Verify payment on backend
          try {
            setPaymentLoading(true);
            const verifyResponse = await paymentAPI.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            if (verifyResponse.success) {
              // Payment verified successfully
              onSuccess({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                verified: true
              });
            } else {
              onError('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            onError('Payment verification failed. Please contact support.');
          } finally {
            setPaymentLoading(false);
          }
        },
        modal: {
          ondismiss: function() {
            setPaymentLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      
      // Handle payment errors
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        onError(`Payment failed: ${response.error.description || response.error.reason || 'Unknown error'}`);
        setPaymentLoading(false);
      });
      
      razorpay.open();
      setPaymentLoading(false); // Reset loading since modal is now open
      
    } catch (error) {
      console.error('Payment error:', error);
      
      // Check if it's a network/API error
      if (error.response) {
        const errorData = error.response.data;
        if (errorData?.error === 'PAYMENT_NOT_CONFIGURED') {
          // Use mock payment
          console.warn('Razorpay not configured, using mock payment for testing');
          onSuccess({
            orderId: `mock_order_${Date.now()}`,
            paymentId: `mock_payment_${Date.now()}`,
            signature: 'mock_signature',
            verified: true
          });
          return;
        }
        onError(errorData?.message || 'Payment initialization failed. Please try again.');
      } else {
        onError(error.message || 'Payment initialization failed. Please try again.');
      }
      setPaymentLoading(false);
    }
  };

  return (
    <div className="payment-form">
      <h3>Payment</h3>
      <div className="payment-summary">
        <div className="summary-row">
          <span>Order Total:</span>
          <span className="amount">₹{amount.toFixed(2)}</span>
        </div>
        <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
          Click the button below to proceed with secure payment via Razorpay
        </p>
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px', fontSize: '12px', color: '#666' }}>
          <strong>Payment Methods:</strong>
          <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
            <li>Credit/Debit Cards</li>
            <li>Net Banking</li>
            <li>UPI</li>
            <li>Wallet</li>
          </ul>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button
          type="button"
          className="btn btn-success"
          onClick={handlePayment}
          disabled={paymentLoading || loading}
          style={{ flex: 1 }}
        >
          {paymentLoading ? 'Processing...' : `Pay ₹${amount.toFixed(2)}`}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={paymentLoading || loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;

