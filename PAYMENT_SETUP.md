# Payment Integration Setup

## ✅ Features Implemented

1. **Razorpay Payment Integration**
   - Secure payment processing
   - Payment verification on backend
   - Order creation only after successful payment

2. **Product ID in Orders**
   - Orders require `product_id` for each item
   - Validation ensures all items have valid product IDs

3. **External Image URLs**
   - Products can use images from external sites
   - Option to upload files OR use image URLs
   - Automatic preview for both options

---

## 🔧 Setup Instructions

### 1. Get Razorpay API Keys

1. Sign up at https://razorpay.com
2. Go to Dashboard → Settings → API Keys
3. Generate **Test Key ID** and **Test Key Secret** (for development)
4. For production, use **Live Keys**

### 2. Configure Backend Environment

Add to `backend/.env`:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
```

**Important**: 
- Never commit `.env` file to version control
- Use test keys for development
- Use live keys only in production

### 3. Database Schema Update (MySQL - Optional)

If using MySQL, add payment_info column:

```sql
ALTER TABLE orders ADD COLUMN payment_info TEXT;
```

**Note**: MongoDB automatically handles the payment field (no migration needed).

---

## 🧪 Testing Payment

### Test Card Numbers (Razorpay Test Mode)

- **Success**: `4111 1111 1111 1111`
- **Failure**: `4000 0000 0000 0002`
- **CVV**: Any 3 digits
- **Expiry**: Any future date

### Test Flow

1. Add products to cart
2. Click "Proceed to Checkout"
3. Fill customer information
4. Click "Pay ₹X" button
5. Use test card: `4111 1111 1111 1111`
6. Enter any CVV and future expiry
7. Complete payment
8. Order will be created with payment confirmation

---

## 📝 Order Flow

1. **Customer fills checkout form** → Customer data collected
2. **Payment initiated** → Razorpay order created
3. **Payment processed** → Customer pays via Razorpay
4. **Payment verified** → Backend verifies signature
5. **Order created** → Order saved with payment info
6. **Stock updated** → Product quantities reduced
7. **Success message** → Customer redirected

---

## 🔒 Security Features

- ✅ Payment signature verification
- ✅ Secure API key handling
- ✅ Payment only after verification
- ✅ Order status set to 'confirmed' after payment
- ✅ Transaction rollback on errors

---

## 📦 Product Image URLs

When adding products in admin panel:

1. **Option 1: Upload File**
   - Select "Upload File" radio button
   - Choose image from your computer

2. **Option 2: Image URL**
   - Select "Image URL" radio button
   - Paste URL from any website (e.g., Unsplash, Pexels)
   - Example: `https://images.unsplash.com/photo-xxx`

**Tips for image URLs:**
- Use reliable image hosting (Unsplash, Pexels, Imgur)
- Ensure URLs are publicly accessible
- Use HTTPS URLs for security
- Check image preview before saving

---

## 🐛 Troubleshooting

### Payment not working?
- Check Razorpay keys in `.env`
- Verify keys are correct (no extra spaces)
- Ensure test mode keys are used in development
- Check browser console for errors

### Image URL not loading?
- Verify URL is accessible (open in new tab)
- Check if URL requires authentication
- Ensure HTTPS URLs (some browsers block HTTP)
- Use CORS-enabled image hosts

### Order creation fails?
- Verify product IDs are valid
- Check stock availability
- Ensure payment was verified
- Check backend logs for errors

---

## 📚 API Endpoints

### Create Payment Order
```
POST /api/payments/create-order
Body: { amount, receipt, notes }
```

### Verify Payment
```
POST /api/payments/verify
Body: { orderId, paymentId, signature }
```

---

## 💡 Production Checklist

- [ ] Replace test keys with live keys
- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Enable HTTPS
- [ ] Configure webhook for payment notifications
- [ ] Set up error logging
- [ ] Test with real payment (small amount)
- [ ] Configure order status webhooks

