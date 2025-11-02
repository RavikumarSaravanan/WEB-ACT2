# How to Get Razorpay Test Keys - Quick Guide

## ⚡ Quick Steps (5 minutes)

### ✅ No Business Required!
You can get **test keys** immediately without any business documents or verification!

### 1. Sign Up for Razorpay
- Go to: **https://razorpay.com/signup**
- Use any email (personal email is fine)
- Use your name (doesn't need to be business name)
- **No business information needed!**
- Verify email (check inbox)

### 2. Login to Dashboard
- Go to: **https://dashboard.razorpay.com**
- Login with your credentials

### 3. Get Test Keys
1. Click on **"Settings"** (gear icon, top right)
2. Go to **"API Keys"** from the menu
3. You'll see a section **"Test Mode"**
4. Click **"Generate Test Key"** button (if keys don't exist)
5. Copy:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret** (long alphanumeric string)

### 4. Add to Your Project
Open `backend/.env` and add:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
```

### 5. Restart Backend
```bash
cd backend
npm start
```

---

## 🎯 Visual Guide

### Where to Find Keys:
```
Razorpay Dashboard
  └── Settings (⚙️ icon, top right)
      └── API Keys
          └── Test Mode Section
              ├── Key ID: rzp_test_xxxxx
              └── Key Secret: xxxxx
                  [Reveal] button to show secret
```

---

## ✅ Quick Test

After adding keys, test with:
```bash
curl -X POST http://localhost:5000/api/payments/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount":100}'
```

**Expected Response:**
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

---

## 🔒 Security Notes

1. **Test Keys** are safe to use in development
2. **Never commit** `.env` file to git
3. **Don't share** your keys publicly
4. Test keys only work with test cards

---

## 💳 Test Card Numbers

Once keys are set, use these test cards:

**Success:**
- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Failure:**
- Card: `4000 0000 0000 0002`

---

## 🆘 Troubleshooting

### "Key ID not found"
- Check you copied the full key ID (starts with `rzp_test_`)
- Make sure there are no extra spaces

### "Invalid key secret"
- Click "Reveal" button in Razorpay dashboard
- Copy the entire secret (long string)
- No spaces before/after

### "Test mode only"
- You're using test keys (correct!)
- Use test card numbers above

---

## ⏱️ Time Required

- Sign up: 2 minutes
- Get keys: 1 minute  
- Add to .env: 30 seconds
- Restart server: 10 seconds

**Total: ~5 minutes**

---

## 🎉 Once Done

Your payment will work perfectly with:
- Real Razorpay payment popup
- Multiple payment methods
- Full payment verification
- Complete order flow

**Go ahead and get your keys - it's free and takes 5 minutes!** 🚀

