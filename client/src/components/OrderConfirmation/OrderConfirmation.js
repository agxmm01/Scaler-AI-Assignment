import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrderDetails } from '../Redux/Actions/orderActions';
import { isAuthenticated } from '../../services/api';
import '../Cart/Cart.css';

const OrderConfirmation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId } = useParams();

  const { orderDetails, loading, error } = useSelector(state => state.orders);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (orderId) {
      dispatch(fetchOrderDetails(orderId));
    }
  }, [dispatch, navigate, orderId]);

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  if (!isAuthenticated()) {
    return (
      <div className="cart_container">
        <p>Please <a href="/login">login</a> to view orders</p>
      </div>
    );
  }

  if (loading) {
    return <div className="cart_container"><p>Loading order details...</p></div>;
  }

  if (error) {
    return (
      <div className="cart_container" style={{ padding: '40px 20px' }}>
        <p style={{ color: 'red' }}>Error loading order: {error}</p>
        <button onClick={handleContinueShopping}>Back to Home</button>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="cart_container">
        <p>Order not found</p>
      </div>
    );
  }

  return (
    <div className="cart_container" style={{ padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Success Banner */}
        <div style={{
          backgroundColor: '#186A3B',
          color: 'white',
          padding: '30px',
          borderRadius: '4px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: '0 0 10px 0' }}>✓ Order Confirmed!</h1>
          <p style={{ margin: 0 }}>Thank you for your order</p>
        </div>

        {/* Order Number */}
        <div style={{
          border: '1px solid #ddd',
          padding: '20px',
          marginBottom: '20px',
          borderRadius: '4px',
          backgroundColor: '#f5f5f5'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '12px', textTransform: 'uppercase' }}>
                Order Number
              </h3>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                {orderDetails.order_number}
              </p>
            </div>
            <div>
              <h3 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '12px', textTransform: 'uppercase' }}>
                Order Date
              </h3>
              <p style={{ margin: 0, fontSize: '16px' }}>
                {new Date(orderDetails.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div style={{
          border: '1px solid #ddd',
          padding: '20px',
          marginBottom: '20px',
          borderRadius: '4px'
        }}>
          <h2 style={{ margin: '0 0 15px 0' }}>Shipping Address</h2>
          <p style={{ margin: '5px 0' }}>
            <strong>{orderDetails.shipping_address_name}</strong><br />
            {orderDetails.shipping_address_street}<br />
            {orderDetails.shipping_address_city}, {orderDetails.shipping_address_state} {orderDetails.shipping_address_pincode}<br />
            {orderDetails.shipping_address_country}<br />
            Phone: {orderDetails.shipping_address_phone}<br />
            Email: {orderDetails.shipping_address_email}
          </p>
        </div>

        {/* Order Items */}
        <div style={{
          border: '1px solid #ddd',
          padding: '20px',
          marginBottom: '20px',
          borderRadius: '4px'
        }}>
          <h2 style={{ margin: '0 0 15px 0' }}>Order Items</h2>
          
          {orderDetails.items && orderDetails.items.length > 0 ? (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ddd' }}>
                    <th style={{ textAlign: 'left', padding: '10px' }}>Product</th>
                    <th style={{ textAlign: 'right', padding: '10px' }}>Price</th>
                    <th style={{ textAlign: 'right', padding: '10px' }}>Quantity</th>
                    <th style={{ textAlign: 'right', padding: '10px' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.items.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '10px' }}>{item.product_name}</td>
                      <td style={{ textAlign: 'right', padding: '10px' }}>₹{item.price}</td>
                      <td style={{ textAlign: 'right', padding: '10px' }}>{item.quantity}</td>
                      <td style={{ textAlign: 'right', padding: '10px', fontWeight: 'bold' }}>
                        ₹{item.line_total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p>No items in order</p>
          )}
        </div>

        {/* Order Summary */}
        <div style={{
          border: '1px solid #ddd',
          padding: '20px',
          marginBottom: '20px',
          borderRadius: '4px',
          backgroundColor: '#f5f5f5'
        }}>
          <h2 style={{ margin: '0 0 15px 0' }}>Order Summary</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Subtotal:</span>
            <span>₹{orderDetails.subtotal.toFixed(2)}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Tax:</span>
            <span>₹{orderDetails.tax.toFixed(2)}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Shipping Charge:</span>
            <span>₹{orderDetails.shipping_charge.toFixed(2)}</span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: '10px',
            borderTop: '2px solid #ddd',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            <span>Total Amount:</span>
            <span style={{ color: '#B12704' }}>₹{orderDetails.total_amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div style={{
          border: '1px solid #ddd',
          padding: '20px',
          marginBottom: '20px',
          borderRadius: '4px'
        }}>
          <h3>Payment Method</h3>
          <p style={{ margin: 0 }}>
            {orderDetails.payment_method === 'cod' ? 'Cash on Delivery (COD)' : 'Card Payment'}
          </p>
          <p style={{
            margin: '10px 0 0 0',
            fontSize: '12px',
            color: orderDetails.payment_status === 'completed' ? '#186A3B' : '#B12704'
          }}>
            Status: <strong>{orderDetails.payment_status.toUpperCase()}</strong>
          </p>
        </div>

        {/* What's Next */}
        <div style={{
          border: '1px solid #ddd',
          padding: '20px',
          marginBottom: '20px',
          borderRadius: '4px',
          backgroundColor: '#f0f8ff'
        }}>
          <h3 style={{ margin: '0 0 15px 0' }}>What's Next?</h3>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>You will receive an order confirmation email shortly</li>
            <li>Your order will be processed within 1-2 business days</li>
            <li>You'll receive shipping notification with tracking details</li>
            <li>Estimated delivery: {new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px'
        }}>
          <button
            onClick={handleViewOrders}
            style={{
              padding: '12px',
              backgroundColor: '#FF9900',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            View My Orders
          </button>

          <button
            onClick={handleContinueShopping}
            style={{
              padding: '12px',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
