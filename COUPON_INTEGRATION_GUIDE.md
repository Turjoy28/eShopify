# 🎟️ Coupon Integration with Payment System - Complete Guide

## What We Added

Your payment system now supports **discount coupons**! Customers can apply coupon codes at checkout to get percentage-based discounts.

---

## How It Works - Simple Explanation

**Before (No Coupon):**
```
Product A: 1000 BDT × 2 = 2000 BDT
Product B: 500 BDT × 1 = 500 BDT
Total: 2500 BDT ← Customer pays this
```

**After (With 20% Coupon):**
```
Product A: 1000 BDT × 2 = 2000 BDT
Product B: 500 BDT × 1 = 500 BDT
Subtotal: 2500 BDT
Discount (20%): -500 BDT
Final Total: 2000 BDT ← Customer pays this (saved 500 BDT!)
```

---

## Files Modified

1. **payment.controller.js** - Added coupon validation and discount calculation
2. **order.model.js** - Added coupon fields to store discount information

---

## Understanding the Code - Line by Line

### PART 1: Coupon Model (Already Existed)

**File:** `coupons.model.js`

```javascript
{
  code: "SAVE20",              // Coupon code (e.g., SAVE20, NEWYEAR)
  discountPercentage: 20,      // 20% discount
  expirationDate: "2025-12-31", // Valid until this date
  isActive: true,              // Is coupon active?
  userId: "user123"            // Which user owns this coupon
}
```

**What this means:**
- Each user can have their own coupon
- Coupon gives a percentage discount (0-100%)
- Coupon has expiration date
- Can be activated/deactivated

---

### PART 2: Updated Order Model

**File:** `order.model.js`

**New fields added:**

```javascript
couponCode: {
  type: String,
}
```
- **Stores:** Which coupon was used (e.g., "SAVE20")

```javascript
discountPercentage: {
  type: Number,
  min: 0,
  max: 100,
}
```
- **Stores:** What percentage discount was applied (e.g., 20)

```javascript
discountAmount: {
  type: Number,
  min: 0,
}
```
- **Stores:** How much money was saved (e.g., 500 BDT)

```javascript
originalAmount: {
  type: Number,
  min: 0,
}
```
- **Stores:** Price before discount (e.g., 2500 BDT)

**Why store all this?**
- Keep record of what discount was applied
- Show customer how much they saved
- Track coupon usage for analytics
- Can display on invoice/receipt

---

### PART 3: Updated Payment Controller

**File:** `payment.controller.js`

#### Step 1: Import Coupon Model

```javascript
import Coupon from '../models/coupons.model.js';
```
- Import Coupon model so we can check if coupon is valid

---

#### Step 2: Get Coupon Code from Request

```javascript
const { products, customerInfo, couponCode } = req.body;
```

**Before (without coupon):**
```javascript
{
  products: [...],
  customerInfo: {...}
}
```

**After (with coupon):**
```javascript
{
  products: [...],
  customerInfo: {...},
  couponCode: "SAVE20"  // ← New field (optional)
}
```

---

#### Step 3: Calculate Original Total

```javascript
// Calculate total amount
let totalAmount = 0;
const orderProducts = [];

for (const item of products) {
    const amount = item.price * item.quantity;
    totalAmount += amount;

    orderProducts.push({
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
    });
}
```

**What this does:**
- Calculate total without discount
- Example: 2500 BDT

---

#### Step 4: Apply Coupon Discount (THE MAIN PART!)

```javascript
// Apply coupon discount if provided
let discount = 0;
let finalAmount = totalAmount;
let appliedCoupon = null;
```

**Initialize variables:**
- `discount` = 0 (no discount yet)
- `finalAmount` = totalAmount (same as original)
- `appliedCoupon` = null (no coupon applied yet)

```javascript
if (couponCode) {
```
- **Check:** Did customer provide a coupon code?
- If no → Skip this entire section
- If yes → Validate and apply discount

```javascript
    const coupon = await Coupon.findOne({
        code: couponCode,
        userId: userId,
        isActive: true
    });
```

**Find coupon in database:**
- Must match the code (e.g., "SAVE20")
- Must belong to this user
- Must be active (not deactivated)

```javascript
    if (coupon) {
```
- **Check:** Did we find a valid coupon?

```javascript
        // Check if coupon is expired
        if (coupon.expirationDate < new Date()) {
            coupon.isActive = false;
            await coupon.save();
            return res.status(400).json({ error: "Coupon has expired" });
        }
```

**Check expiration:**
- Compare coupon expiration date with today's date
- If expired:
  - Deactivate the coupon
  - Send error to customer
  - Stop payment process

```javascript
        // Calculate discount
        discount = (totalAmount * coupon.discountPercentage) / 100;
        finalAmount = totalAmount - discount;
```

**Calculate discount:**

Example:
```javascript
totalAmount = 2500 BDT
discountPercentage = 20

discount = (2500 × 20) / 100
discount = 50000 / 100
discount = 500 BDT

finalAmount = 2500 - 500
finalAmount = 2000 BDT
```

```javascript
        appliedCoupon = {
            code: coupon.code,
            discountPercentage: coupon.discountPercentage,
            discountAmount: discount
        };
```

**Store coupon details:**
- Save for later use (will add to order)

```javascript
    } else {
        return res.status(400).json({ error: "Invalid or inactive coupon code" });
    }
}
```

**If coupon not found:**
- Maybe code is wrong
- Maybe it's for different user
- Maybe it's deactivated
- Send error to customer

---

#### Step 5: Create Order with Coupon Info

```javascript
const order = new Order({
    user: userId,
    products: orderProducts,
    totalAmount: finalAmount,        // ← Amount AFTER discount
    originalAmount: totalAmount,      // ← Amount BEFORE discount
    sslCommerzTransactionId: transactionId,
    paymentStatus: 'pending',
    paymentGateway: 'sslcommerz',
    customerName: customerInfo.name,
    customerEmail: customerInfo.email,
    customerPhone: customerInfo.phone,
    customerAddress: customerInfo.address || '',
    // Add coupon details if applied
    ...(appliedCoupon && {
        couponCode: appliedCoupon.code,
        discountPercentage: appliedCoupon.discountPercentage,
        discountAmount: appliedCoupon.discountAmount,
    }),
});
```

**What `...(appliedCoupon && {...})` means:**

**If coupon was applied:**
```javascript
{
    // ... other fields ...
    couponCode: "SAVE20",
    discountPercentage: 20,
    discountAmount: 500,
}
```

**If NO coupon was applied:**
```javascript
{
    // ... other fields ...
    // No coupon fields added
}
```

**Why this is smart:**
- Only add coupon fields if coupon was used
- Keeps database clean
- No null values for unused fields

---

#### Step 6: Charge Discounted Amount

```javascript
const data = {
    total_amount: finalAmount,  // ← Use discounted amount!
    currency: 'BDT',
    tran_id: transactionId,
    // ... other fields
};
```

**Important:**
- Customer is charged `finalAmount` (after discount)
- NOT `totalAmount` (before discount)
- SSLCommerz processes the discounted amount

---

#### Step 7: Send Response with Discount Details

```javascript
res.status(200).json({
    success: true,
    message: "Payment session created",
    gatewayUrl: apiResponse.GatewayPageURL,
    orderId: order._id,
    paymentDetails: {
        originalAmount: totalAmount,    // 2500 BDT
        discountAmount: discount,       // 500 BDT
        finalAmount: finalAmount,       // 2000 BDT
        ...(appliedCoupon && { coupon: appliedCoupon }),
    },
});
```

**Frontend receives:**
```json
{
  "success": true,
  "gatewayUrl": "https://sandbox.sslcommerz.com/...",
  "orderId": "order123",
  "paymentDetails": {
    "originalAmount": 2500,
    "discountAmount": 500,
    "finalAmount": 2000,
    "coupon": {
      "code": "SAVE20",
      "discountPercentage": 20,
      "discountAmount": 500
    }
  }
}
```

**Frontend can show:**
```
Subtotal: 2500 BDT
Discount (SAVE20 - 20%): -500 BDT
Total: 2000 BDT
```

---

## Complete Flow with Coupon

### Step 1: Customer Adds Products

```
Cart:
- Product A: 1000 BDT × 2 = 2000 BDT
- Product B: 500 BDT × 1 = 500 BDT
Subtotal: 2500 BDT
```

### Step 2: Customer Enters Coupon Code

```
Customer types: "SAVE20"
```

### Step 3: Frontend Calls Payment API

```javascript
POST /api/payment/create-checkout-session

Body:
{
  "products": [
    { "productId": "abc", "price": 1000, "quantity": 2 },
    { "productId": "def", "price": 500, "quantity": 1 }
  ],
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "01700000000",
    "address": "Dhaka"
  },
  "couponCode": "SAVE20"  // ← Coupon code included!
}
```

### Step 4: Backend Validates Coupon

```javascript
// 1. Find coupon in database
Coupon.findOne({
  code: "SAVE20",
  userId: "user123",
  isActive: true
})

// 2. Check expiration
if (coupon.expirationDate < new Date()) {
  // Expired!
  return error
}

// 3. Calculate discount
discount = (2500 × 20) / 100 = 500 BDT
finalAmount = 2500 - 500 = 2000 BDT
```

### Step 5: Create Order with Discount

```javascript
Order created:
{
  totalAmount: 2000,        // ← Customer pays this
  originalAmount: 2500,     // ← Original price
  discountAmount: 500,      // ← Saved amount
  couponCode: "SAVE20",
  discountPercentage: 20,
  paymentStatus: "pending"
}
```

### Step 6: Customer Pays Discounted Amount

```
SSLCommerz charges: 2000 BDT (not 2500!)
Customer saves: 500 BDT
```

### Step 7: Order Updated to Paid

```javascript
Order:
{
  totalAmount: 2000,
  originalAmount: 2500,
  discountAmount: 500,
  couponCode: "SAVE20",
  paymentStatus: "paid"  // ← Updated!
}
```

---

## Testing the Coupon System

### Step 1: Create a Coupon (Use Postman)

**Endpoint:** `POST /api/coupons` (you may need to create this endpoint)

Or manually add to database:

```javascript
{
  "code": "SAVE20",
  "discountPercentage": 20,
  "expirationDate": "2025-12-31T23:59:59.999Z",
  "isActive": true,
  "userId": "YOUR_USER_ID"
}
```

### Step 2: Test Payment WITHOUT Coupon

**Request:**
```json
POST /api/payment/create-checkout-session
{
  "products": [
    { "productId": "abc123", "price": 1000, "quantity": 2 }
  ],
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "01700000000"
  }
}
```

**Expected Response:**
```json
{
  "success": true,
  "paymentDetails": {
    "originalAmount": 2000,
    "discountAmount": 0,
    "finalAmount": 2000
  }
}
```

### Step 3: Test Payment WITH Valid Coupon

**Request:**
```json
POST /api/payment/create-checkout-session
{
  "products": [
    { "productId": "abc123", "price": 1000, "quantity": 2 }
  ],
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "01700000000"
  },
  "couponCode": "SAVE20"
}
```

**Expected Response:**
```json
{
  "success": true,
  "paymentDetails": {
    "originalAmount": 2000,
    "discountAmount": 400,
    "finalAmount": 1600,
    "coupon": {
      "code": "SAVE20",
      "discountPercentage": 20,
      "discountAmount": 400
    }
  }
}
```

### Step 4: Test Payment WITH Invalid Coupon

**Request:**
```json
{
  // ... same as above ...
  "couponCode": "INVALID123"
}
```

**Expected Response:**
```json
{
  "error": "Invalid or inactive coupon code"
}
```

### Step 5: Test Payment WITH Expired Coupon

**Expected Response:**
```json
{
  "error": "Coupon has expired"
}
```

---

## Frontend Integration Example

### Checkout Form with Coupon

```javascript
import { useState } from 'react';

function CheckoutPage() {
  const [couponCode, setCouponCode] = useState('');
  const [discountInfo, setDiscountInfo] = useState(null);

  const handleApplyCoupon = async () => {
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code: couponCode })
      });

      const data = await response.json();

      if (data.message === 'Coupon is valid') {
        setDiscountInfo({
          code: data.code,
          discountPercentage: data.discountPercentage
        });
        alert(`Coupon applied! ${data.discountPercentage}% off`);
      }
    } catch (error) {
      alert('Invalid coupon code');
    }
  };

  const handleCheckout = async () => {
    const response = await fetch('/api/payment/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        products: cartItems,
        customerInfo: formData,
        couponCode: couponCode || undefined  // Include if entered
      })
    });

    const data = await response.json();

    if (data.success) {
      // Show discount breakdown
      console.log('Original:', data.paymentDetails.originalAmount);
      console.log('Discount:', data.paymentDetails.discountAmount);
      console.log('Final:', data.paymentDetails.finalAmount);

      // Redirect to payment
      window.location.href = data.gatewayUrl;
    }
  };

  return (
    <div>
      <h2>Checkout</h2>

      {/* Coupon Input */}
      <div>
        <input
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
        />
        <button onClick={handleApplyCoupon}>Apply Coupon</button>
      </div>

      {/* Show discount if applied */}
      {discountInfo && (
        <div>
          ✅ Coupon "{discountInfo.code}" applied!
          You save {discountInfo.discountPercentage}%
        </div>
      )}

      {/* Price breakdown */}
      <div>
        <p>Subtotal: {originalAmount} BDT</p>
        {discountInfo && (
          <p>Discount: -{discountAmount} BDT</p>
        )}
        <p><strong>Total: {finalAmount} BDT</strong></p>
      </div>

      <button onClick={handleCheckout}>Pay Now</button>
    </div>
  );
}
```

---

## Database Example

### Order Without Coupon

```javascript
{
  "_id": "order123",
  "user": "user123",
  "products": [...],
  "totalAmount": 2500,
  "originalAmount": 2500,
  "paymentStatus": "paid",
  // No coupon fields
}
```

### Order With Coupon

```javascript
{
  "_id": "order456",
  "user": "user123",
  "products": [...],
  "totalAmount": 2000,         // ← After discount
  "originalAmount": 2500,      // ← Before discount
  "discountAmount": 500,       // ← Money saved
  "couponCode": "SAVE20",      // ← Which coupon
  "discountPercentage": 20,    // ← Percentage off
  "paymentStatus": "paid",
}
```

---

## Key Points to Remember

### 1. Coupon Validation

✅ **We check:**
- Coupon exists in database
- Coupon belongs to this user
- Coupon is active
- Coupon not expired

❌ **We reject if:**
- Invalid code
- Different user's coupon
- Deactivated coupon
- Expired coupon

### 2. Discount Calculation

```javascript
discount = (originalAmount × discountPercentage) / 100
finalAmount = originalAmount - discount
```

### 3. Payment Amount

**Customer is charged:** `finalAmount` (after discount)
**NOT:** `originalAmount` (before discount)

### 4. What We Store

- Original amount (before discount)
- Discount amount (money saved)
- Final amount (what customer paid)
- Coupon code used
- Discount percentage

**Why?**
- Show customer their savings
- Analytics and reporting
- Invoice generation
- Refund calculations

---

## Common Scenarios

### Scenario 1: Valid Coupon

```
Input: "SAVE20" (20% off, valid until 2025-12-31)
Cart Total: 2500 BDT
Result: 500 BDT discount, pay 2000 BDT ✅
```

### Scenario 2: Expired Coupon

```
Input: "OLD20" (20% off, expired 2024-12-31)
Cart Total: 2500 BDT
Result: Error "Coupon has expired" ❌
```

### Scenario 3: Invalid Coupon

```
Input: "FAKE123" (doesn't exist)
Cart Total: 2500 BDT
Result: Error "Invalid or inactive coupon code" ❌
```

### Scenario 4: No Coupon

```
Input: (none)
Cart Total: 2500 BDT
Result: Pay 2500 BDT ✅
```

### Scenario 5: Wrong User's Coupon

```
Input: "USER2SAVE" (belongs to different user)
Cart Total: 2500 BDT
Result: Error "Invalid or inactive coupon code" ❌
```

---

## API Reference

### Create Checkout with Coupon

**Endpoint:** `POST /api/payment/create-checkout-session`

**Request:**
```json
{
  "products": [
    { "productId": "abc", "price": 1000, "quantity": 2 }
  ],
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "01700000000",
    "address": "Dhaka"
  },
  "couponCode": "SAVE20"  // Optional
}
```

**Response (Success with Coupon):**
```json
{
  "success": true,
  "message": "Payment session created",
  "gatewayUrl": "https://sandbox.sslcommerz.com/...",
  "orderId": "order123",
  "paymentDetails": {
    "originalAmount": 2000,
    "discountAmount": 400,
    "finalAmount": 1600,
    "coupon": {
      "code": "SAVE20",
      "discountPercentage": 20,
      "discountAmount": 400
    }
  }
}
```

**Response (Error - Invalid Coupon):**
```json
{
  "error": "Invalid or inactive coupon code"
}
```

**Response (Error - Expired Coupon):**
```json
{
  "error": "Coupon has expired"
}
```

### Get Order Status (with Coupon Info)

**Endpoint:** `GET /api/payment/order/:orderId`

**Response:**
```json
{
  "orderId": "order123",
  "paymentStatus": "paid",
  "totalAmount": 1600,
  "originalAmount": 2000,
  "discountAmount": 400,
  "couponCode": "SAVE20",
  "discountPercentage": 20,
  "products": [...],
  "createdAt": "2025-01-12T..."
}
```

---

## Summary

✅ **What You Can Do Now:**
- Accept coupon codes at checkout
- Validate coupons (expiry, ownership, active status)
- Calculate percentage-based discounts
- Charge discounted amount via SSLCommerz
- Store discount information in orders
- Show customers their savings

✅ **What Gets Tracked:**
- Which coupon was used
- How much discount was applied
- Original vs final price
- Money saved

✅ **Security:**
- Users can only use their own coupons
- Expired coupons are rejected
- Inactive coupons are rejected
- Validation happens server-side (secure)

**Your payment system is now complete with coupon support!** 🎉