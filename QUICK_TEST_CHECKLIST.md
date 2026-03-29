# Quick Testing Checklist ⚡

## 🚀 Start Here - Quick 15-Minute Test

### Setup (2 min)
```bash
# Terminal 1: Start Server
cd server
npm start

# Terminal 2: Start Client  
cd client
npm start

# Open: http://localhost:3000
```

### Quick Test Flow (13 min)

| Step | Action | Expected Result | ✓ |
|------|--------|-----------------|---|
| 1 | Register new user | Page redirects to login | |
| 2 | Login with credentials | Navbar shows "Hello, [name]" | |
| 3 | Search for "product" | Shows search results page | |
| 4 | Click on a product | Shows product details | |
| 5 | Add to cart (qty=2) | Cart badge shows "2" | |
| 6 | Go to /cart | Cart displays 2 items | |
| 7 | Click "Proceed" | Redirects to checkout | |
| 8 | Fill address form | Form accepts all fields | |
| 9 | Place order | Shows order confirmation | |
| 10 | Click "View Orders" | Shows order in history | |
| 11 | Click order details | Shows full order info | |
| 12 | Go home | Can browse products | |
| 13 | Sign out | Redirects to login | |

---

## 📱 Device Testing

```
✓ Desktop (1920x1080)
  - Full sidebar view
  - All buttons accessible
  - Cart dropdown works

✓ Tablet (768px)
  - Responsive layout
  - Touch-friendly buttons
  - Filters collapse properly

✓ Mobile (375px)
  - Stacked layout
  - Readable text
  - Buttons touch-sized
```

---

## 🔐 Security Testing

```javascript
// Test 1: Can't access /cart without login
1. Logout
2. Manually go to http://localhost:3000/cart
✓ Should redirect to /login

// Test 2: Can't modify someone else's order
1. Login as User A, create order
2. Get orderID from URL
3. Login as User B
4. Try to access: /orders/{User A's Order ID}
✓ Should show 404 or access denied
```

---

## 🛒 Cart Edge Cases

```javascript
// Test: Add same product twice
1. Add product #1 (qty=2)
2. Go to product #1 detail page
3. Add it again (qty=1)
4. Check cart
✓ Should have qty=3 (not 2 items)

// Test: Update to 0 quantity
1. Go to cart
2. Try to set quantity to 0
✓ Should prevent or remove item

// Test: Out of stock
1. Search product with stock=0
2. Try to add to cart
✓ Should disable button or reject
```

---

## 💳 Checkout Validation

```
Fill checkout form with these test cases:

Valid Case ✓
┌─────────────────────┐
│ Name: John Doe      │
│ Phone: 9876543210   │
│ Email: john@ex.com  │
│ Street: 123 Main St │
│ City: Mumbai        │
│ State: Maharashtra  │
│ Pincode: 400001     │
│ Country: India      │
└─────────────────────┘

Invalid Cases (should reject) ✗
┌─────────────────────┐
│ Phone: 987654 (5)   │ ← Should error: "10 digits"
│ Pincode: 4000 (4)   │ ← Should error: "6 digits"
│ Email: notanemail   │ ← Should error: "Invalid"
│ Missing Name        │ ← Should error: "Required"
└─────────────────────┘
```

---

## 🔍 Search & Filter Testing

```
Search Query Tests:
✓ "iphone" - returns iphones
✓ "laptop" - returns laptops  
✓ "" empty - shows all or error
✓ "xyz999" - returns no results (shows message)
✓ Special chars "!@#$" - handles gracefully

Filter Tests:
✓ Category: Electronics - only electronics
✓ Sort: Price Low→High - ordered correctly
✓ Sort: Discount - highest discount first
✓ Combined: Filter + Sort - both work together
```

---

## 📊 Database Verification

```sql
-- After placing an order, verify DB:

-- 1. Order created
SELECT * FROM orders WHERE user_id = 1;

-- 2. Order items created
SELECT * FROM order_items WHERE order_id = 1;

-- 3. Stock decreased
SELECT id, name, stock FROM products WHERE id = 1;

-- 4. Cart cleared
SELECT * FROM cart WHERE user_id = 1;

-- 5. Check totals
SELECT subtotal, tax, shipping_charge, 
       (subtotal + tax + shipping_charge) as total 
FROM orders WHERE id = 1;
```

---

## ✅ Core Functionality Matrix

```
Feature          | Test Case              | Status
-----------------|------------------------|-------
Authentication   | Register + Login       | [ ]
Product Browse   | View products grid     | [ ]
Product Search   | Search by keyword      | [ ]
Category Filter  | Filter by category     | [ ]
Product Detail   | View full details      | [ ]
Add to Cart      | Add single/multiple    | [ ]
View Cart        | Show all items         | [ ]
Update Quantity  | Increase/decrease qty  | [ ]
Remove Item      | Delete from cart       | [ ]
Checkout         | Fill address form      | [ ]
Place Order      | Create order record    | [ ]
Order Confirm    | Show confirmation      | [ ]
Order History    | List past orders       | [ ]
Order Details    | View single order      | [ ]
Cancel Order     | Cancel pending order   | [ ]
Responsive       | Mobile/Tablet/Desktop  | [ ]
```

---

## 🐛 Common Issues & Quick Fixes

| Issue | Quick Fix |
|-------|-----------|
| 404 errors after code change | `npm start` server again |
| Cart not updating | Clear cache: Ctrl+Shift+R |
| Products not showing | Check DB has data `SELECT COUNT(*) FROM products;` |
| Login not working | Verify user exists in DB |
| Search returns nothing | Try searching for "product" |
| Can't checkout | Make sure cart has items |
| Page keeps redirecting | Clear localStorage |

---

## 🎯 Pass/Fail Summary

After running all tests, fill this:

```
TOTAL TESTS: 30
PASSED: __/30
FAILED: __/30

Critical Issues: [ ] None [ ] Minor [ ] Major

Status: [ ] READY TO DEPLOY [ ] NEEDS FIXES [ ] IN PROGRESS
```

---

## 📞 Need Help?

If a test fails:
1. Check server console for errors
2. Check browser console (F12)
3. Check Redux DevTools (React Extension)
4. Verify database has data
5. Check network tab for failed requests

