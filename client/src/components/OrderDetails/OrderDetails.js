import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrderDetails } from '../Redux/Actions/orderActions';
import { isAuthenticated } from '../../services/api';
import '../Cart/Cart.css';

const OrderDetails = () => {
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
      case 'processing':
        return '#0066cc';
      case 'shipped':
        return '#FF9900';
      case 'delivered':
        return '#186A3B';
      case 'cancelled':
        return '#B12704';
      default:
        return '#666';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'confirmed':
        return '✓';
      case 'processing':
        return '🔄';
      case 'shipped':
        return '📦';
      case 'delivered':
        return '✓✓';
      case 'cancelled':
        return '✗';
      default:
        return '•';
    }
  };

  if (!isAuthenticated()) {
    return (
      <div className="cart_container">
        <p>Please <a href="/login">login</a> to view order details</p>
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
        <button onClick={() => navigate('/orders')}>Back to Orders</button>
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
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => navigate('/orders')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#007185',
              cursor: 'pointer',
              fontSize: '16px',
              textDecoration: 'underline',
              marginBottom: '10px'
            }}
          >
            ← Back to Orders
          </button>
          <h1 style={{ margin: 0 }}>Order {orderDetails.order_number}</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          {/* Main Content */}
          <div>
            {/* Order Status Timeline */}
            <div style={{
              border: '1px solid #ddd',
              padding: '20px',
              marginBottom: '20px',
              borderRadius: '4px'
            }}>
              <h3>Order Status</h3>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                position: 'relative'
              }}>
                {['pending', 'confirmed', 'shipped', 'delivered'].map((status, index) => (
                  <div key={status} style={{ flex: 1, position: 'relative' }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: orderDetails.status === status || ['pending', 'confirmed', 'shipped', 'delivered'].indexOf(orderDetails.status) >= index ? '#186A3B' : '#ddd',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        marginBottom: '10px'
                      }}>
                        {getStatusIcon(status)}
                      </div>
                      <span style={{ fontSize: '12px', textTransform: 'uppercase', textAlign: 'center' }}>
                        {status}
                      </span>
                    </div>
                    {index < 3 && (
                      <div style={{
                        position: 'absolute',
                        top: '20px',
                        left: '50%',
                        width: '100%',
                        height: '2px',
                        backgroundColor: ['pending', 'confirmed', 'shipped', 'delivered'].indexOf(orderDetails.status) > index ? '#186A3B' : '#ddd',
                        zIndex: -1
                      }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div style={{
              border: '1px solid #ddd',
              padding: '20px',
              marginBottom: '20px',
              borderRadius: '4px'
            }}>
              <h3 style={{ margin: '0 0 15px 0' }}>Order Items</h3>
              
              {orderDetails.items && orderDetails.items.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #ddd' }}>
                      <th style={{ textAlign: 'left', padding: '10px' }}>Product</th>
                      <th style={{ textAlign: 'right', padding: '10px' }}>Price</th>
                      <th style={{ textAlign: 'right', padding: '10px' }}>Qty</th>
                      <th style={{ textAlign: 'right', padding: '10px' }}>Discount</th>
                      <th style={{ textAlign: 'right', padding: '10px' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.items.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '10px' }}>{item.product_name}</td>
                        <td style={{ textAlign: 'right', padding: '10px' }}>₹{item.price}</td>
                        <td style={{ textAlign: 'right', padding: '10px' }}>{item.quantity}</td>
                        <td style={{ textAlign: 'right', padding: '10px' }}>
                          {item.discount_percent || '-'}
                        </td>
                        <td style={{ textAlign: 'right', padding: '10px', fontWeight: 'bold' }}>
                          ₹{item.line_total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No items in order</p>
              )}
            </div>

            {/* Shipping Address */}
            <div style={{
              border: '1px solid #ddd',
              padding: '20px',
              borderRadius: '4px'
            }}>
              <h3 style={{ margin: '0 0 15px 0' }}>Shipping Address</h3>
              <p style={{ margin: '5px 0' }}>
                <strong>{orderDetails.shipping_address_name}</strong><br />
                {orderDetails.shipping_address_street}<br />
                {orderDetails.shipping_address_city}, {orderDetails.shipping_address_state} {orderDetails.shipping_address_pincode}<br />
                {orderDetails.shipping_address_country}<br />
                <br />
                Phone: {orderDetails.shipping_address_phone}<br />
                Email: {orderDetails.shipping_address_email}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Order Info */}
            <div style={{
              border: '1px solid #ddd',
              padding: '20px',
              marginBottom: '20px',
              borderRadius: '4px',
              backgroundColor: '#f5f5f5'
            }}>
              <h3 style={{ margin: '0 0 15px 0' }}>Order Information</h3>
              
              <div style={{ marginBottom: '15px' }}>
                <span style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Status</span><br />
                <span style={{
                  backgroundColor: getStatusColor(orderDetails.status),
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  display: 'inline-block'
                }}>
                  {orderDetails.status}
                </span>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <span style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Order Date</span><br />
                <span style={{ fontSize: '14px' }}>
                  {new Date(orderDetails.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <span style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Payment Method</span><br />
                <span style={{ fontSize: '14px' }}>
                  {orderDetails.payment_method === 'cod' ? 'Cash on Delivery' : 'Card Payment'}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Payment Status</span><br />
                <span style={{
                  color: orderDetails.payment_status === 'completed' ? '#186A3B' : '#B12704',
                  fontWeight: 'bold'
                }}>
                  {orderDetails.payment_status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Price Summary */}
            <div style={{
              border: '1px solid #ddd',
              padding: '20px',
              borderRadius: '4px'
            }}>
              <h3 style={{ margin: '0 0 15px 0' }}>Price Summary</h3>
              
              <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal:</span>
                <span>₹{orderDetails.subtotal.toFixed(2)}</span>
              </div>
              
              <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Tax:</span>
                <span>₹{orderDetails.tax.toFixed(2)}</span>
              </div>
              
              <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping:</span>
                <span>₹{orderDetails.shipping_charge.toFixed(2)}</span>
              </div>

              <div style={{
                paddingTop: '10px',
                borderTop: '2px solid #ddd',
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 'bold',
                fontSize: '16px'
              }}>
                <span>Total:</span>
                <span style={{ color: '#B12704' }}>₹{orderDetails.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
