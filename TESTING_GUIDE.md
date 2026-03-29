# E-Commerce Testing Guide

## Prerequisites
- ✅ Database initialized with `ecommerce_schema.sql`
- ✅ Server running on `http://localhost:8001`
- ✅ Client running on `http://localhost:3000`
- ✅ Products exist in database

---

## 🧪 Phase 1: Database Verification

### Check Database Tables
```bash
# Connect to MySQL
mysql -u root -p your_database_name

# Verify tables exist
SHOW TABLES;

# Check table structures
DESCRIBE users;
DESCRIBE products;
DESCRIBE cart;
DESCRIBE orders;
DESCRIBE order_items;
DESCRIBE categories;
```

### Verify Sample Data
```sql
-- Check if products exist
SELECT COUNT(*) FROM products;

-- Check if categories exist
SELECT COUNT(*) FROM categories;

-- View sample products
SELECT id, name, price, stock FROM products LIMIT 5;
```

---

## 🧪 Phase 2: Backend API Testing

### Tool: Use **Postman** or **Thunder Client** (VS Code Extension)

#### Test 1: User Authentication
```
POST http://localhost:8001/api/auth/register
Content-Type: application/json

{
  "fname": "Test",
  "lname": "User",
  "email": "test@example.com",
  "password": "Test@1234"
}
```
✅ **Expected**: Status 201, user created

```
POST http://localhost:8001/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test@1234"
}
```
✅ **Expected**: Status 200, receive JWT token

---

#### Test 2: Get Products
```
GET http://localhost:8001/api/products
```
✅ **Expected**: Status 200, array of products

```
GET http://localhost:8001/api/products?page=1&limit=12
```
✅ **Expected**: Status 200, paginated results

```
GET http://localhost:8001/api/products?category=1
```
✅ **Expected**: Status 200, filtered products

---

#### Test 3: Search Products
```
GET http://localhost:8001/api/products/search?q=laptop
```
✅ **Expected**: Status 200, matching products

```
GET http://localhost:8001/api/products/search?q=laptop&category=1&sort=price_low
```
✅ **Expected**: Status 200, filtered and sorted

---

#### Test 4: Cart Operations
**Get Auth Token First** - Copy token from login response

```
GET http://localhost:8001/api/cart
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```
✅ **Expected**: Status 200, empty cart array `[]`

```
POST http://localhost:8001/api/cart/add
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 2
}
```
✅ **Expected**: Status 201, cart item added

```
GET http://localhost:8001/api/cart
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```
✅ **Expected**: Status 200, cart contains 1 item with quantity 2

```
PUT http://localhost:8001/api/cart/1
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "quantity": 5
}
```
✅ **Expected**: Status 200, quantity updated to 5

---

#### Test 5: Order Creation
```
POST http://localhost:8001/api/orders
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "subtotal": 5000,
  "tax": 250,
  "shipping_charge": 99,
  "shipping_address": {
    "name": "Test User",
    "phone": "9876543210",
    "email": "test@example.com",
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  },
  "payment_method": "cod"
}
```
✅ **Expected**: Status 201, order created with orderId
✅ **Verify**: Cart should be cleared after order

---

#### Test 6: Order History
```
GET http://localhost:8001/api/orders
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```
✅ **Expected**: Status 200, array of user's orders

```
GET http://localhost:8001/api/orders?page=1&limit=10
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```
✅ **Expected**: Status 200, paginated orders

---

#### Test 7: Order Details
```
GET http://localhost:8001/api/orders/1
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```
✅ **Expected**: Status 200, order with all items and details

---

#### Test 8: Cancel Order
```
PUT http://localhost:8001/api/orders/1/cancel
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```
✅ **Expected**: Status 200, order cancelled
✅ **Verify**: Product stock increased back

---

### Error Scenarios to Test

#### Empty Cart Checkout
```
POST http://localhost:8001/api/orders
Headers:
  Authorization: Bearer TOKEN
{order data}
```
✅ **Expected**: Status 400, "Cart is empty"

#### Invalid Token
```
GET http://localhost:8001/api/cart
Headers:
  Authorization: Bearer invalid_token_here
```
✅ **Expected**: Status 401, "Invalid token"

#### Missing Authorization
```
GET http://localhost:8001/api/cart
```
✅ **Expected**: Status 401, "No token provided"

---

## 🧪 Phase 3: Frontend Component Testing

### Test 1: Authentication Flow
1. **Go to** `http://localhost:3000/register`
2. **Fill form**:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: Pass@123
3. **Click** Register
4. ✅ Should redirect to `/login`
5. **Fill login form** with credentials
6. ✅ Should redirect to `/` and show user greeting in navbar

### Test 2: Navbar Search
1. **Logged in state**
2. **Click** search bar in navbar
3. **Type**: "laptop"
4. **Press** Enter or click search icon
5. ✅ Should navigate to `/search?q=laptop`
6. ✅ Should display search results matching "laptop"

### Test 3: Product Listing
1. **Navigate** to home (`/`)
2. **Verify** products display in grid
3. **Scroll** and verify lazy loading/pagination

### Test 4: Product Detail
1. **Click** on any product card
2. ✅ Should navigate to `/products/{id}`
3. **Verify** product info displays:
   - Product name
   - Price and MRP
   - Discount percentage
   - Stock status
   - Description
4. **Check** quantity selector works (1-10)
5. **Click** "Add to Cart"
6. ✅ Should show success message
7. ✅ Cart badge in navbar should increment

### Test 5: Shopping Cart
1. **Add 2-3 products** to cart
2. **Navigate** to `/cart`
3. ✅ Should display all added products
4. **Verify** cart contains:
   - Product images
   - Product names
   - Quantities
   - Prices
   - Remove buttons
5. **Update quantity** for one product
6. ✅ Totals should recalculate
7. **Change quantity** to 10
8. ✅ Verify max quantity warning (if implemented)
9. **Remove** one product
10. ✅ Product should disappear from cart
11. **Click** "Proceed to Checkout"
12. ✅ Should navigate to `/checkout`

### Test 6: Checkout
1. **On checkout page** (`/checkout`)
2. **Verify** order summary displays:
   - All cart items
   - Subtotal
   - Tax (5%)
   - Shipping
   - Total amount
3. **Fill address form**:
   - Name: John Doe
   - Phone: 9876543210
   - Email: john@example.com
   - Street: 123 Main Street
   - City: Mumbai
   - State: Maharashtra
   - Pincode: 400001
4. **Select payment method**: COD
5. **Click** "Place Order"
6. ✅ Should show loading state
7. ✅ Should navigate to `/order-confirmation/{orderId}`

### Test 7: Order Confirmation
1. **On confirmation page** (`/order-confirmation/{orderId}`)
2. ✅ Should display:
   - Success message
   - Order number
   - Order items
   - Shipping address
   - Total amount
   - "What's Next?" section
3. **Click** "View My Orders"
4. ✅ Should navigate to `/orders`

### Test 8: Order History
1. **On order history page** (`/orders`)
2. ✅ Should display table with:
   - Order numbers
   - Order amounts
   - Status badges
   - Order dates
   - "View Details" buttons
3. **Check** pagination (if multiple orders)
4. **Click** "View Details" for an order
5. ✅ Should navigate to `/orders/{orderId}`

### Test 9: Order Details
1. **On order details page** (`/orders/{orderId}`)
2. ✅ Should display:
   - Order number and date
   - Status timeline (pending → confirmed → shipped → delivered)
   - Order items with details
   - Shipping address
   - Payment method
   - Price breakdown
3. **Click** "Back to Orders"
4. ✅ Should return to order history

### Test 10: Search Results
1. **Search** for a product
2. ✅ Should display matching products
3. **Test category filter**:
   - Select a category
   - ✅ Results should filter
4. **Test sorting**:
   - Sort by Price: Low to High
   - ✅ Should reorder results
   - Sort by Price: High to Low
   - ✅ Should reorder results
   - Sort by Discount
   - ✅ Should reorder by discount
5. **Pagination**:
   - If >12 results, click next page
   - ✅ Should load next set
6. **Add to Cart** from search results
7. ✅ Should work correctly

---

## 🧪 Phase 4: End-to-End Flow Testing

### Complete Purchase Flow
```
1. REGISTER → 2. LOGIN → 3. BROWSE → 4. SEARCH → 5. VIEW PRODUCT 
→ 6. ADD TO CART → 7. VIEW CART → 8. CHECKOUT → 9. CONFIRM → 10. VIEW ORDERS
```

**Step-by-step**:
1. Open `http://localhost:3000`
2. Click "Sign Up"
3. Fill registration form and submit
4. Login with credentials
5. Verify navbar shows greeting
6. Search for a product
7. Click product from results
8. View product details
9. Add 2 units to cart
10. Verify cart badge = 2
11. Go to cart
12. Add 1 more product (different)
13. Proceed to checkout
14. Fill address details
15. Select COD
16. Place order
17. See confirmation page
18. Note the order number
19. Click "View My Orders"
20. Verify order appears in list
21. Click order to view details
22. Verify all information matches

---

## ✅ Verification Checklist

### Core Features
- [ ] Register new user successfully
- [ ] Login with credentials
- [ ] Search products by keyword
- [ ] Filter products by category
- [ ] Sort products by price/discount
- [ ] View product details
- [ ] Add product to cart
- [ ] Update quantity in cart
- [ ] Remove item from cart
- [ ] Clear entire cart
- [ ] Cart count badge updates
- [ ] Proceed to checkout
- [ ] Fill address form with validation
- [ ] Place order successfully
- [ ] Order shows in confirmation page
- [ ] Order appears in history
- [ ] View order details with timeline
- [ ] Cancel order (if pending)

### Data Integrity
- [ ] Stock decreases after order
- [ ] Stock increases after cancellation
- [ ] Cart cleared after order placement
- [ ] Order total = subtotal + tax + shipping
- [ ] Discount calculated correctly
- [ ] User can only see own orders

### UI/UX
- [ ] All pages responsive (desktop, tablet, mobile)
- [ ] Error messages display correctly
- [ ] Success messages display correctly
- [ ] Loading states show
- [ ] Cart badge updates in real-time
- [ ] Navigation works correctly
- [ ] Buttons are clickable and responsive
- [ ] Forms validate input before submit

### Error Handling
- [ ] Invalid login shows error
- [ ] Missing required fields show errors
- [ ] Invalid phone number rejected
- [ ] Invalid pincode rejected
- [ ] Empty cart checkout shows error
- [ ] Out of stock products can't be purchased
- [ ] Expired token redirects to login

---

## 🐛 Common Issues & Debugging

### Issue: 404 Product Not Found
**Solution**: 
- Verify product ID exists in database
- Check URL format: `/products/{id}` not `/products?id=`

### Issue: Cart Not Updating
**Solution**:
- Clear browser cache
- Check Redux state in browser DevTools
- Verify token is valid

### Issue: Order Creation Failed
**Solution**:
- Verify all address fields filled
- Check phone is 10 digits
- Check pincode is 6 digits
- Verify cart not empty
- Verify stock available

### Issue: Search Returns No Results
**Solution**:
- Verify product name/description in database
- Try different search term
- Check database has data

### Issue: CORS Errors
**Solution**:
- Verify server is running on port 8001
- Check server CORS configuration
- Restart server if needed

---

## 📊 Performance Testing

### Load Testing Checklist
- [ ] Can view products with 100+ items
- [ ] Search works with 1000 products
- [ ] Pagination loads quickly
- [ ] Cart operations are instant
- [ ] Order creation takes <5 seconds

---

## 📝 Test Report Template

```
Testing Date: ___________
Tester Name: ___________

Feature: ___________
Status: ✅ PASS / ❌ FAIL

Test Cases:
1. ___________: ✅/❌
2. ___________: ✅/❌
3. ___________: ✅/❌

Issues Found:
- Issue 1: ___________
- Issue 2: ___________

Notes: ___________
```

---

## 🚀 Automated Testing (Optional)

### Jest + React Testing Library
```bash
# Install dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Create test files in __tests__ folder
# Example: client/src/components/__tests__/Cart.test.js

# Run tests
npm test
```

### Supertest for API Testing
```bash
# Install on server
cd server
npm install --save-dev supertest

# Create test file: server/__tests__/api.test.js

# Run tests
npm test
```

---

## ✨ Final Validation

Once all tests pass:
1. ✅ Commit code to git
2. ✅ Document any issues found
3. ✅ Mark features as production-ready
4. ✅ Deploy to staging/production

