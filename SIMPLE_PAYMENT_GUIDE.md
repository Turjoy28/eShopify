# 💳 Simple Payment System Guide - Your eShop Project

## What We Built - Quick Overview

You have a **payment system** that lets customers pay for products using **SSLCommerz** (Bangladesh's payment gateway).

**In simple terms:**
1. Customer adds products to cart
2. Customer clicks "Checkout"
3. Customer gets sent to SSLCommerz payment page
4. Customer pays with bKash/Card/Nagad
5. Customer comes back to your site
6. Order is marked as "paid" in your database

---

## Files We Created/Modified

### 1. `payment.controller.js` - The Brain (Handles all payment logic)
### 2. `order.model.js` - The Database Schema (What an order looks like)
### 3. `payment.routes.js` - The URLs (Which URL does what)
### 4. `.env` - The Secrets (SSLCommerz credentials)

---

## Understanding Each File - Line by Line

---

## FILE 1: `payment.controller.js`

This file has **6 functions**. Let's understand each one:

---

### FUNCTION 1: `createCheckoutSession`

**What it does:** Creates a payment when customer clicks "Checkout"

**Code Breakdown:**

```javascript
export const createCheckoutSession = async (req, res) => {
```
- `export` = Other files can use this function
- `async` = This function will wait for things (database, API calls)
- `req` = Request (data from frontend)
- `res` = Response (data we send back)

```javascript
  try {
    const { products, customerInfo } = req.body;
```
- Get `products` and `customerInfo` from request
- Example: `products = [{ productId: "abc", price: 1000, quantity: 2 }]`
- Example: `customerInfo = { name: "John", email: "john@example.com", phone: "01700000000" }`

```javascript
    const userId = req.user._id;
```
- Get logged-in user's ID
- `req.user` comes from auth middleware (checks if user is logged in)

```javascript
    if (!products || products.length === 0) {
      return res.status(400).json({ error: "No products in cart" });
    }
```
- **Check:** Is cart empty?
- If yes → Send error "No products in cart"
- `400` = Bad request error code

```javascript
    if (!customerInfo || !customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      return res.status(400).json({
        error: "Customer information required: name, email, phone"
      });
    }
```
- **Check:** Did customer fill in name, email, phone?
- If no → Send error

```javascript
    let totalAmount = 0;
    const orderProducts = [];

    for (const item of products) {
      const amount = item.price * item.quantity;
      totalAmount += amount;
```
- **Calculate:** Total price
- Example: Product costs 1000 BDT, quantity is 2
- Amount = 1000 × 2 = 2000 BDT
- Add to `totalAmount`

```javascript
      orderProducts.push({
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
    }
```
- Store each product in array
- Will save this to database

```javascript
    const transactionId = `TXN-${Date.now()}-${userId}`;
```
- **Generate unique ID** for this transaction
- `Date.now()` = Current timestamp (e.g., 1736612345678)
- Example result: `TXN-1736612345678-user123`
- Why? So we can track this specific payment

```javascript
    const order = new Order({
      user: userId,
      products: orderProducts,
      totalAmount: totalAmount,
      sslCommerzTransactionId: transactionId,
      paymentStatus: 'pending',
      paymentGateway: 'sslcommerz',
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      customerAddress: customerInfo.address || '',
    });

    await order.save();
```
- **Create new order** in database
- Status = `'pending'` (not paid yet!)
- `await order.save()` = Wait until saved to database
- Now order exists in MongoDB

```javascript
    const baseUrl = process.env.SERVER_URL || 'http://example.com';
```
- Get server URL from .env file
- Example: `https://sulfonyl-diametrically-twanda.ngrok-free.dev`
- This is where SSLCommerz will send payment results

```javascript
    const data = {
      total_amount: totalAmount,
      currency: 'BDT',
      tran_id: transactionId,
      success_url: `${baseUrl}/api/payment/success`,
      fail_url: `${baseUrl}/api/payment/fail`,
      cancel_url: `${baseUrl}/api/payment/cancel`,
      ipn_url: `${baseUrl}/api/payment/ipn`,
```
- **Prepare data for SSLCommerz**
- `total_amount`: How much to charge (2000 BDT)
- `currency`: Bangladeshi Taka
- `tran_id`: Our unique transaction ID
- `success_url`: Where to send customer if payment succeeds
- `fail_url`: Where to send customer if payment fails
- `cancel_url`: Where to send customer if they cancel
- `ipn_url`: Direct server notification URL

```javascript
      shipping_method: 'NO',
      product_name: 'eShop Order',
      product_category: 'Electronic',
      product_profile: 'general',
```
- Product details (required by SSLCommerz)

```javascript
      cus_name: customerInfo.name,
      cus_email: customerInfo.email,
      cus_add1: customerInfo.address || 'Dhaka',
      cus_add2: '',
      cus_city: customerInfo.city || 'Dhaka',
      cus_state: customerInfo.state || 'Dhaka',
      cus_postcode: customerInfo.postcode || '1000',
      cus_country: 'Bangladesh',
      cus_phone: customerInfo.phone,
      cus_fax: '',
```
- Customer details (required by SSLCommerz)
- `|| 'Dhaka'` means "if not provided, use 'Dhaka'"

```javascript
      ship_name: customerInfo.name,
      ship_add1: customerInfo.address || 'Dhaka',
      ship_add2: '',
      ship_city: customerInfo.city || 'Dhaka',
      ship_state: customerInfo.state || 'Dhaka',
      ship_postcode: customerInfo.postcode || '1000',
      ship_country: 'Bangladesh',
    };
```
- Shipping details (same as customer for digital products)

```javascript
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
```
- **Initialize SSLCommerz**
- `store_id` = Your store ID from .env
- `store_passwd` = Your store password from .env
- `is_live` = false (sandbox mode)

```javascript
    const apiResponse = await sslcz.init(data);
```
- **Call SSLCommerz API** with our data
- `await` = Wait for response
- SSLCommerz creates payment session and returns URL

```javascript
    if (apiResponse.GatewayPageURL) {
      res.status(200).json({
        success: true,
        message: "Payment session created",
        gatewayUrl: apiResponse.GatewayPageURL,
        orderId: order._id,
      });
```
- **If successful:** Send payment URL to frontend
- `GatewayPageURL` = SSLCommerz payment page URL
- Frontend will redirect customer to this URL

```javascript
    } else {
      await Order.findByIdAndUpdate(order._id, { paymentStatus: 'failed' });
      res.status(400).json({ error: "Failed to initialize payment" });
    }
```
- **If failed:** Update order to "failed" and send error

```javascript
  } catch (error) {
    console.error("Payment creation error:", error);
    res.status(500).json({
      error: "Failed to create payment session",
      details: error.message
    });
  }
};
```
- **Error handling:** If anything breaks, log error and send response
- `500` = Server error

---

### FUNCTION 2: `paymentSuccess`

**What it does:** Handles when payment succeeds

```javascript
export const paymentSuccess = async (req, res) => {
  try {
    const { tran_id, val_id } = req.body;
```
- Get transaction ID and validation ID from SSLCommerz
- SSLCommerz sends this data when payment succeeds

```javascript
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const validation = await sslcz.validate({ val_id });
```
- **Verify payment is real** by asking SSLCommerz
- Why? Someone could try to fake a success callback
- `validate()` = Ask SSLCommerz "did YOU process this payment?"

```javascript
    if (validation.status === 'VALID' || validation.status === 'VALIDATED') {
```
- Check if SSLCommerz says "yes, payment is valid"

```javascript
      const order = await Order.findOneAndUpdate(
        { sslCommerzTransactionId: tran_id },
        { paymentStatus: 'paid' },
        { new: true }
      );
```
- **Find order** using transaction ID
- **Update** status from `'pending'` to `'paid'`
- `{ new: true }` = Return updated order

```javascript
      if (!order) {
        return res.redirect(`${process.env.CLIENT_URL}/payment/error?message=Order not found`);
      }
```
- If order not found → Redirect to error page

```javascript
      res.redirect(`${process.env.CLIENT_URL}/payment/success?orderId=${order._id}`);
```
- **Redirect customer** to success page
- Pass order ID in URL so frontend can show order details
- Example: `http://localhost:3000/payment/success?orderId=abc123`

```javascript
    } else {
      res.redirect(`${process.env.CLIENT_URL}/payment/error?message=Payment validation failed`);
    }
  } catch (error) {
    console.error("Payment success handler error:", error);
    res.redirect(`${process.env.CLIENT_URL}/payment/error?message=Something went wrong`);
  }
};
```
- If validation fails or error occurs → Redirect to error page

---

### FUNCTION 3: `paymentFail`

**What it does:** Handles when payment fails

```javascript
export const paymentFail = async (req, res) => {
  try {
    const { tran_id } = req.body;
```
- Get transaction ID from SSLCommerz

```javascript
    await Order.findOneAndUpdate(
      { sslCommerzTransactionId: tran_id },
      { paymentStatus: 'failed' }
    );
```
- Find order and update status to `'failed'`

```javascript
    res.redirect(`${process.env.CLIENT_URL}/payment/failed`);
```
- Redirect customer to failure page

```javascript
  } catch (error) {
    console.error("Payment fail handler error:", error);
    res.redirect(`${process.env.CLIENT_URL}/payment/error`);
  }
};
```
- Error handling

---

### FUNCTION 4: `paymentCancel`

**What it does:** Handles when customer cancels payment

```javascript
export const paymentCancel = async (req, res) => {
  try {
    const { tran_id } = req.body;

    await Order.findOneAndUpdate(
      { sslCommerzTransactionId: tran_id },
      { paymentStatus: 'cancelled' }
    );

    res.redirect(`${process.env.CLIENT_URL}/payment/cancelled`);
  } catch (error) {
    console.error("Payment cancel handler error:", error);
    res.redirect(`${process.env.CLIENT_URL}/payment/error`);
  }
};
```
- Similar to `paymentFail` but status = `'cancelled'`

---

### FUNCTION 5: `paymentIPN`

**What it does:** Backup payment notification (server-to-server)

```javascript
export const paymentIPN = async (req, res) => {
  try {
    const { tran_id, val_id } = req.body;

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const validation = await sslcz.validate({ val_id });

    if (validation.status === 'VALID' || validation.status === 'VALIDATED') {
      await Order.findOneAndUpdate(
        { sslCommerzTransactionId: tran_id },
        { paymentStatus: 'paid' }
      );
    }

    res.status(200).send('IPN received');
  } catch (error) {
    console.error("IPN handler error:", error);
    res.status(500).send('IPN error');
  }
};
```
- **IPN = Instant Payment Notification**
- SSLCommerz sends this DIRECTLY to server (not through customer's browser)
- Backup in case customer closes browser before redirect
- Same logic as `paymentSuccess` but no redirect

---

### FUNCTION 6: `getOrderStatus`

**What it does:** Get order details for customer

```javascript
export const getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
```
- Get order ID from URL
- Example: `/api/payment/order/abc123` → `orderId = "abc123"`

```javascript
    const userId = req.user._id;
```
- Get logged-in user's ID

```javascript
    const order = await Order.findOne({
      _id: orderId,
      user: userId
    }).populate('products.product');
```
- **Find order** where:
  - Order ID matches
  - User ID matches (security: user can only see their own orders)
- `.populate('products.product')` = Get full product details (not just IDs)

```javascript
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
```
- If not found → Send error

```javascript
    res.status(200).json({
      orderId: order._id,
      paymentStatus: order.paymentStatus,
      totalAmount: order.totalAmount,
      products: order.products,
      createdAt: order.createdAt,
    });
```
- Send order details to frontend

```javascript
  } catch (error) {
    console.error("Get order status error:", error);
    res.status(500).json({ error: "Failed to fetch order status" });
  }
};
```
- Error handling

---

## FILE 2: `order.model.js`

**What it does:** Defines what an order looks like in database

```javascript
import mongoose from "mongoose";
```
- Import Mongoose (MongoDB library)

```javascript
const orderSchema = new mongoose.Schema(
  {
```
- Create schema (blueprint for orders)

```javascript
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
```
- **user:** Who placed the order
- `ObjectId` = Reference to User collection
- `ref: "User"` = Link to User model
- `required: true` = Must have a user

```javascript
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
```
- **products:** Array of products in order
- Each product has:
  - `product` = Reference to Product collection
  - `quantity` = How many (minimum 1)
  - `price` = Price at time of purchase (minimum 0)

```javascript
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
```
- **totalAmount:** Total price of order
- Must be a number, required, can't be negative

```javascript
    stripeSessionId: {
      type: String,
      sparse: true,
    },
    sslCommerzTransactionId: {
      type: String,
      sparse: true,
    },
```
- **Payment gateway IDs**
- `sparse: true` = Allows multiple orders with null values
- Only one will be filled (either Stripe OR SSLCommerz)

```javascript
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'cancelled'],
      default: 'pending',
    },
```
- **paymentStatus:** Current payment status
- `enum` = Only these 4 values allowed
- `default: 'pending'` = New orders start as pending

```javascript
    paymentGateway: {
      type: String,
      enum: ['stripe', 'sslcommerz', 'cod'],
      default: 'sslcommerz',
    },
```
- **paymentGateway:** Which payment method used
- Default is SSLCommerz

```javascript
    customerName: {
      type: String,
    },
    customerEmail: {
      type: String,
    },
    customerPhone: {
      type: String,
    },
    customerAddress: {
      type: String,
    },
```
- **Customer details** (required by SSLCommerz)
- All are strings, all optional

```javascript
  },
  { timestamps: true }
);
```
- `{ timestamps: true }` = Automatically add `createdAt` and `updatedAt` fields

```javascript
const Order = mongoose.model("Order", orderSchema);
export default Order;
```
- Create model from schema
- Export so other files can use it

---

## FILE 3: `payment.routes.js`

**What it does:** Defines URLs for payment operations

```javascript
import express from "express";
```
- Import Express framework

```javascript
import {
  createCheckoutSession,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
  getOrderStatus
} from "../controllers/payment.controller.js";
```
- Import all payment functions

```javascript
import authMiddleware from "../middleware/auth.middleware.js";
```
- Import authentication middleware

```javascript
const router = express.Router();
```
- Create router (handles routes)

```javascript
router.post("/create-checkout-session", authMiddleware.protectRoute, createCheckoutSession);
```
- **POST /api/payment/create-checkout-session**
- `authMiddleware.protectRoute` = Check if user is logged in first
- Then run `createCheckoutSession` function
- Protected = Must be logged in

```javascript
router.post("/success", paymentSuccess);
router.post("/fail", paymentFail);
router.post("/cancel", paymentCancel);
router.post("/ipn", paymentIPN);
```
- **SSLCommerz callback URLs**
- NOT protected (SSLCommerz needs to call these)
- SSLCommerz doesn't have login token

```javascript
router.get("/order/:orderId", authMiddleware.protectRoute, getOrderStatus);
```
- **GET /api/payment/order/:orderId**
- Protected = Must be logged in
- `:orderId` = Parameter in URL (e.g., `/order/abc123`)

```javascript
export default router;
```
- Export router so server.js can use it

---

## FILE 4: `.env`

**What it does:** Stores secret configuration

```env
SSLCOMMERZ_STORE_ID=eshop69629eb5aa8f5
SSLCOMMERZ_STORE_PASSWORD=eshop69629eb5aa8f5@ssl
SSLCOMMERZ_IS_LIVE=false
```
- **SSLCommerz credentials** from sandbox account
- `IS_LIVE=false` = Testing mode (fake money)

```env
SERVER_URL=https://sulfonyl-diametrically-twanda.ngrok-free.dev
CLIENT_URL=http://localhost:3000
```
- **SERVER_URL:** Where backend runs (ngrok tunnel)
- **CLIENT_URL:** Where frontend runs

---

## Complete Flow - What Happens When Customer Pays

### Step 1: Customer Clicks "Checkout"

```
Frontend → POST /api/payment/create-checkout-session
```

Data sent:
```javascript
{
  products: [{ productId: "abc", price: 1000, quantity: 2 }],
  customerInfo: { name: "John", email: "john@example.com", phone: "01700000000" }
}
```

### Step 2: Your Backend (createCheckoutSession)

1. ✅ Check if user is logged in (auth middleware)
2. ✅ Validate products and customer info
3. ✅ Calculate total: 1000 × 2 = 2000 BDT
4. ✅ Generate transaction ID: `TXN-1736612345678-user123`
5. ✅ Create order in database (status: pending)
6. ✅ Call SSLCommerz API
7. ✅ Get payment URL from SSLCommerz
8. ✅ Send URL to frontend

Response:
```javascript
{
  success: true,
  gatewayUrl: "https://sandbox.sslcommerz.com/gwprocess/...",
  orderId: "order123"
}
```

### Step 3: Frontend Redirects Customer

```javascript
window.location.href = gatewayUrl;
```

Customer goes to SSLCommerz payment page

### Step 4: Customer Pays

- Customer enters bKash number OR card details
- SSLCommerz processes payment
- Bank approves payment

### Step 5: SSLCommerz Redirects Back

If successful:
```
SSLCommerz → POST https://your-ngrok-url.com/api/payment/success
```

Data sent:
```javascript
{
  tran_id: "TXN-1736612345678-user123",
  val_id: "validation123",
  amount: "2000",
  status: "VALID"
}
```

### Step 6: Your Backend (paymentSuccess)

1. ✅ Receive callback from SSLCommerz
2. ✅ Validate with SSLCommerz API (verify it's real)
3. ✅ Find order using transaction ID
4. ✅ Update order status: pending → paid
5. ✅ Redirect customer to success page

```
Customer → http://localhost:3000/payment/success?orderId=order123
```

### Step 7: Frontend Shows Success

Customer sees:
```
✅ Payment Successful!
Order ID: order123
Amount: 2000 BDT
```

---

## Key Concepts

### 1. **Transaction ID**

```javascript
const transactionId = `TXN-${Date.now()}-${userId}`;
```

- Unique ID for each payment
- Used to track payment
- Links order to SSLCommerz payment

### 2. **Payment Status**

```
pending → Customer hasn't paid yet
paid → Payment successful
failed → Payment failed (card declined, etc.)
cancelled → Customer cancelled payment
```

### 3. **Validation**

```javascript
const validation = await sslcz.validate({ val_id });
```

- Ask SSLCommerz "is this payment real?"
- Prevents fake payments
- Always validate before marking as paid

### 4. **Callbacks**

```
success_url → Where to send customer if payment succeeds
fail_url → Where to send customer if payment fails
cancel_url → Where to send customer if they cancel
ipn_url → Direct server notification (backup)
```

### 5. **ngrok**

```
localhost:5000 → Can't be reached from internet
ngrok → Creates public URL
https://xxx.ngrok-free.app → Tunnels to localhost:5000
```

SSLCommerz can reach ngrok URL, which forwards to your computer.

---

## Testing Checklist

1. ✅ Start ngrok: `ngrok http 5000`
2. ✅ Update .env with ngrok URL
3. ✅ Start server: `npm run dev`
4. ✅ Login to get JWT token
5. ✅ Call create-checkout-session API
6. ✅ Get gatewayUrl
7. ✅ Open gatewayUrl in browser
8. ✅ Complete test payment
9. ✅ Verify order status changed to "paid"

---

## Common Questions

**Q: Why do we validate payments?**
A: To prevent fake payments. Anyone could call your success URL, but validation ensures SSLCommerz actually processed the payment.

**Q: What's the difference between success callback and IPN?**
A: Success callback goes through customer's browser. IPN is direct server-to-server. If customer closes browser, IPN still arrives.

**Q: Why create order before payment?**
A: So you have a record even if payment fails. You can track abandoned carts and retry later.

**Q: Why use transaction IDs?**
A: To uniquely identify each payment. Prevents duplicate processing and helps with debugging.

---

## What You Built

✅ Complete payment integration with SSLCommerz
✅ Order creation and tracking
✅ Payment validation
✅ Success/fail/cancel handling
✅ Secure authentication
✅ Database storage

**You can now accept real payments in Bangladesh!** 🎉

---

## Quick Reference

**Create Payment:**
```
POST /api/payment/create-checkout-session (protected)
Body: { products, customerInfo }
Response: { gatewayUrl, orderId }
```

**Check Order:**
```
GET /api/payment/order/:orderId (protected)
Response: { orderId, paymentStatus, totalAmount, products }
```

**Callbacks (SSLCommerz calls these):**
```
POST /api/payment/success
POST /api/payment/fail
POST /api/payment/cancel
POST /api/payment/ipn
```

---

That's it! You now understand exactly what each line of code does in your payment system. 🚀