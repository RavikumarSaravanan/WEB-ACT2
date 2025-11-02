import Razorpay from 'razorpay';
import { ApiError } from '../middleware/errorHandler.js';
import crypto from 'crypto';

/**
 * Payment Controller
 * Handles Razorpay payment integration
 */

// Lazy initialize Razorpay instance
let razorpayInstance = null;

const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!keyId || !keySecret) {
      throw new ApiError(500, 'Razorpay API keys not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env file.');
    }
    
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
  }
  return razorpayInstance;
};

/**
 * Create Razorpay order
 * POST /api/payments/create-order
 */
export const createPaymentOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'INR', receipt, notes = {} } = req.body;

    if (!amount || amount <= 0) {
      throw new ApiError(400, 'Amount is required and must be greater than 0');
    }

    // Convert amount to paise (smallest currency unit for INR)
    const amountInPaise = Math.round(parseFloat(amount) * 100);

    const options = {
      amount: amountInPaise,
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes
    };

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      message: 'Payment order created successfully',
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID || ''
      }
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    
    // Check if error is from ApiError (keys not configured)
    if (error.name === 'ApiError' && error.message && error.message.includes('Razorpay API keys')) {
      return res.status(500).json({
        success: false,
        message: 'Razorpay API keys not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env file. Using mock payment for testing.',
        error: 'PAYMENT_NOT_CONFIGURED'
      });
    }
    
    // Handle Razorpay API errors
    if (error.error) {
      return res.status(500).json({
        success: false,
        message: error.error.description || 'Razorpay API error occurred',
        error: 'RAZORPAY_ERROR',
        details: error.error
      });
    }
    
    // Generic error
    next(new ApiError(500, error.message || 'Failed to create payment order. Please try again.'));
  }
};

/**
 * Verify Razorpay payment
 * POST /api/payments/verify
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      throw new ApiError(400, 'Order ID, Payment ID, and Signature are required');
    }

    // Verify signature
    const text = `${orderId}|${paymentId}`;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(text)
      .digest('hex');

    if (generatedSignature !== signature) {
      throw new ApiError(400, 'Invalid payment signature');
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        orderId,
        paymentId,
        verified: true
      }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    next(error);
  }
};

