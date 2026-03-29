import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../Redux/Actions/orderActions';
import { fetchCart, clearCart } from '../Redux/Actions/cartActions';
import { isAuthenticated } from '../../services/api';
import './Checkout.css';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { cartItems, subtotal, tax, total, loading: cartLoading } = useSelector(state => state.cart);
  const { loading: orderLoading, error: orderError } = useSelector(state => state.orders);

  const [address, setAddress] = useState({
    name: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [cartFetchAttempted, setCartFetchAttempted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Only fetch cart once, when component mounts
    if (cartItems.length === 0 && !cartFetchAttempted) {
      dispatch(fetchCart());
      setCartFetchAttempted(true);
    }
  }, [dispatch, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!address.name.trim()) newErrors.name = 'Name is required';
    if (!address.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(address.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    if (!address.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
      newErrors.email = 'Invalid email';
    }
    if (!address.street.trim()) newErrors.street = 'Street address is required';
    if (!address.city.trim()) newErrors.city = 'City is required';
    if (!address.state.trim()) newErrors.state = 'State is required';
    if (!address.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(address.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (cartItems.length === 0) {
      alert('Cart is empty');
      return;
    }

    try {
      const orderData = {
        subtotal: subtotal,
        tax: tax,
        shipping_charge: 0,
        shipping_address: address,
        payment_method: paymentMethod
      };

      const result = await dispatch(createOrder(orderData));
      
      setOrderPlaced(true);
      
      // Clear cart and redirect to confirmation page
      await dispatch(clearCart());
      navigate(`/order-confirmation/${result.orderId}`);

    } catch (err) {
      setErrors({ submit: err.message });
    }
  };

  if (!isAuthenticated()) {
    return (
      <div className="checkout_container">
        <div className="checkout_empty_state">
          <h2>Authentication Required</h2>
          <p>Please log in to proceed with checkout</p>
          <a href="/login">Go to Login</a>
        </div>
      </div>
    );
  }

  // Show loading state while fetching cart
  if (cartLoading && cartItems.length === 0) {
    return (
      <div className="checkout_container">
        <div className="checkout_loading_state">
          <h2>Loading Your Cart...</h2>
          <p>Please wait while we prepare your checkout</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout_container">
        <div className="checkout_empty_state">
          <h2>Your Cart is Empty</h2>
          <p>Add some products before checking out</p>
          <a href="/">Continue Shopping</a>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="checkout_container">
        <div className="checkout_empty_state checkout_message success">
          <h2>✓ Order Placed Successfully!</h2>
          <p>Redirecting to order confirmation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout_container">
      <div className="checkout_header">
        <h1>Checkout</h1>
        <div className="checkout_breadcrumb">Cart → Checkout → Confirmation</div>
      </div>

      <div className="checkout_main">
        {/* Address Form */}
        <form onSubmit={handlePlaceOrder} className="checkout_form_section">
          <h2>Shipping Address</h2>

          {errors.submit && <div className="checkout_message error">{errors.submit}</div>}

          <div className="checkout_form_group">
            <label>Full Name <span className="required">*</span></label>
            <input
              type="text"
              name="name"
              value={address.name}
              onChange={handleAddressChange}
              className={errors.name ? 'error' : ''}
              placeholder="John Doe"
            />
            {errors.name && <span className="error_message">{errors.name}</span>}
          </div>

          <div className="checkout_form_group">
            <label>Phone Number <span className="required">*</span></label>
            <input
              type="tel"
              name="phone"
              value={address.phone}
              onChange={handleAddressChange}
              className={errors.phone ? 'error' : ''}
              placeholder="9876543210"
            />
            {errors.phone && <span className="error_message">{errors.phone}</span>}
          </div>

          <div className="checkout_form_group">
            <label>Email Address <span className="required">*</span></label>
            <input
              type="email"
              name="email"
              value={address.email}
              onChange={handleAddressChange}
              className={errors.email ? 'error' : ''}
              placeholder="john@example.com"
            />
            {errors.email && <span className="error_message">{errors.email}</span>}
          </div>

          <div className="checkout_form_group">
            <label>Street Address <span className="required">*</span></label>
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={handleAddressChange}
              className={errors.street ? 'error' : ''}
              placeholder="House No., Building Name, etc."
            />
            {errors.street && <span className="error_message">{errors.street}</span>}
          </div>

          <div className="checkout_form_row">
            <div className="checkout_form_group">
              <label>City <span className="required">*</span></label>
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleAddressChange}
                className={errors.city ? 'error' : ''}
                placeholder="Mumbai"
              />
              {errors.city && <span className="error_message">{errors.city}</span>}
            </div>
            <div className="checkout_form_group">
              <label>State <span className="required">*</span></label>
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleAddressChange}
                className={errors.state ? 'error' : ''}
                placeholder="Maharashtra"
              />
              {errors.state && <span className="error_message">{errors.state}</span>}
            </div>
          </div>

          <div className="checkout_form_row">
            <div className="checkout_form_group">
              <label>Pincode <span className="required">*</span></label>
              <input
                type="text"
                name="pincode"
                value={address.pincode}
                onChange={handleAddressChange}
                className={errors.pincode ? 'error' : ''}
                placeholder="400001"
              />
              {errors.pincode && <span className="error_message">{errors.pincode}</span>}
            </div>
            <div className="checkout_form_group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={address.country}
                onChange={handleAddressChange}
                disabled
              />
            </div>
          </div>

          <h3>Payment Method</h3>
          <div className="checkout_payment_method">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery (COD)
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Debit/Credit Card
            </label>
          </div>

          <button
            type="submit"
            disabled={orderLoading}
            className={`checkout_submit_btn ${orderLoading ? 'processing' : ''}`}
          >
            {orderLoading ? 'Processing Order...' : 'Place Order'}
          </button>
        </form>

        {/* Order Summary */}
        <div className="checkout_summary">
          <h3>Order Summary</h3>

          <div className="checkout_items_list">
            {cartItems.map(item => (
              <div key={item.product_id} className="checkout_item">
                <div className="checkout_item_name">{item.name}</div>
                <div className="checkout_item_qty">₹{item.price.toFixed(2)} × {item.quantity}</div>
                <div className="checkout_item_price">₹{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="checkout_summary_row">
            <span>Subtotal:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="checkout_summary_row">
            <span>Tax (5%):</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>

          <div className="checkout_summary_row shipping">
            <span>Shipping:</span>
            <span>Free</span>
          </div>

          <div className="checkout_total_row">
            <span>Total:</span>
            <span className="checkout_total_amount">₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
