# Razorpay Setup Guide - Complete Instructions

## ✅ Yes, It Will Work With Razorpay Keys!

Once you add your Razorpay API keys, the payment system will work perfectly. The current error is simply because keys aren't configured yet.

---

## 🔑 Step-by-Step Setup

### 1. Get Razorpay API Keys

1. **Sign up/Login** at https://razorpay.com
2. Go to **Dashboard** → **Settings** → **API Keys**
3. If you don't have keys, click **"Generate Test Key"**
4. Copy your **Key ID** and **Key Secret**

**Important**: 
- Use **Test Keys** for development/testing
- Use **Live Keys** only for production (after testing)

---

### 2. Add Keys to Backend

1. Open `backend/.env` file
2. Add these lines:
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
   ```

**Example:**
```env
PORT=5000
DB_TYPE=mongodb
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=cart_store
SESSION_SECRET=your-secret-key
RAZORPAY_KEY_ID=rzp_test_1234567890ABCDEF
RAZORPAY_KEY_SECRET=abcdef1234567890ABCDEFGHIJ
FRONTEND_URL=http://localhost:3000
```

---

### 3. Restart Backend Server

```bash
cd backend
npm start
```

Or if using dev mode:
```bash
npm run dev
```

---

## 🧪 Testing Payment

### With Real Razorpay Keys

Once keys are added:

1. **Add products** to cart
2. **Click "Proceed to Checkout"**
3. **Fill customer information**
4. **Click "Place Order"**
5. **Payment form appears**
6. **Click "Pay ₹X"**
7. **Razorpay payment popup opens** with:
   - Card payment option
   - UPI option
   - Net Banking option
   - Wallet option

### Test Card Numbers (Razorpay Test Mode)

When using **test keys**, you can use:

- **Success Card**: `4111 1111 1111 1111`
- **Failure Card**: `4000 0000 0000 0002`
- **CVV**: Any 3 digits (e.g., `123`)
- **Expiry**: Any future date (e.g., `12/25`)
- **Name**: Any name

---

## 🎯 What Will Work

Once keys are configured:

✅ Payment order creation  
✅ Razorpay checkout popup  
✅ Multiple payment methods  
✅ Payment verification  
✅ Order creation after payment  
✅ Error handling for failed payments  

---

## 🔍 Verify Setup

### Test if Keys Are Working

You can test the payment endpoint:

```bash
curl -X POST http://localhost:5000/api/payments/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"receipt":"test123"}'
```

**Expected Response (with keys):**
```json
{
  "success": true,
  "message": "Payment order created successfully",
  "data": {
    "orderId": "order_xxxxxxxxxxxx",
    "amount": 10000,
    "currency": "INR",
    "keyId": "rzp_test_xxxxx"
  }
}
```

**Response (without keys):**
```json
{
  "success": false,
  "message": "Razorpay API keys not configured...",
  "error": "PAYMENT_NOT_CONFIGURED"
}
```

---

## 🐛 Troubleshooting

### Issue: "Razorpay API keys not configured"
**Solution**: Make sure keys are in `.env` file and backend is restarted

### Issue: "Invalid key_id"
**Solution**: Check that key ID starts with `rzp_test_` (for test) or `rzp_live_` (for live)

### Issue: "Payment failed"
**Solution**: 
- Check Razorpay dashboard for error details
- Verify you're using test keys with test cards
- Check network connectivity

### Issue: "Order creation failed after payment"
**Solution**:
- Check backend logs
- Verify database connection
- Check product stock availability

---

## 📝 Important Notes

1. **Test Mode**: Test keys only work with test cards
2. **Live Mode**: Live keys work with real payments
3. **Security**: Never commit `.env` file to git
4. **Restart**: Always restart backend after changing `.env`

---

## ✅ Quick Checklist

- [ ] Razorpay account created
- [ ] Test keys generated
- [ ] Keys added to `backend/.env`
- [ ] Backend server restarted
- [ ] Test payment with test card
- [ ] Verify order creation works

---

## 🎉 Once Configured

Your payment flow will be:
1. Customer adds products → Cart
2. Fills checkout form → Customer info
3. Payment form → Shows payment methods
4. Clicks "Pay" → Razorpay popup opens
5. Completes payment → Payment verified
6. Order created → Success message

**Everything will work perfectly!** 🚀

