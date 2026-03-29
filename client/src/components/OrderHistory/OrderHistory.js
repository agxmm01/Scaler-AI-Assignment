import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchOrders, fetchOrderDetails } from '../Redux/Actions/orderActions';
import { isAuthenticated } from '../../services/api';
import '../Cart/Cart.css';

const OrderHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, pagination, loading, error } = useSelector(state => state.orders);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    dispatch(fetchOrders(currentPage, 10));
  }, [dispatch, navigate, currentPage]);

  const handleViewDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

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

  if (!isAuthenticated()) {
    return (
      <div className="cart_container">
        <p>Please <a href="/login">login</a> to view your orders</p>
      </div>
    );
  }

  return (
    <div className="cart_container" style={{ padding: '20px' }}>
      <h1>Order History</h1>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      {loading && <p>Loading orders...</p>}

      {!loading && orders.length === 0 ? (
        <div style={{
          border: '1px solid #ddd',
          padding: '40px',
          borderRadius: '4px',
          textAlign: 'center',
          backgroundColor: '#f5f5f5'
        }}>
          <p style={{ fontSize: '18px', marginBottom: '20px' }}>You haven't placed any orders yet.</p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 30px',
              backgroundColor: '#FF9900',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '20px',
            backgroundColor: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '15px', textAlign: 'left' }}>Order Number</th>
                <th style={{ padding: '15px', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Date</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '15px' }}>
                    <strong>{order.order_number}</strong>
                  </td>
                  <td style={{ padding: '15px', textAlign: 'right' }}>
                    <strong style={{ color: '#186A3B', fontSize: '16px' }}>
                      ₹{order.total_amount.toFixed(2)}
                    </strong>
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <span style={{
                      backgroundColor: getStatusColor(order.status),
                      color: 'white',
                      padding: '5px 15px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      fontWeight: 'bold'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleViewDetails(order.id)}
                      style={{
                        padding: '8px 15px',
                        backgroundColor: '#007185',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '20px'
            }}>
              <button
                onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 15px',
                  backgroundColor: currentPage === 1 ? '#ccc' : '#FF9900',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                Previous
              </button>

              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: currentPage === page ? '#FF9900' : '#f5f5f5',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    color: currentPage === page ? 'white' : '#333',
                    fontWeight: currentPage === page ? 'bold' : 'normal'
                  }}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(page => Math.min(pagination.pages, page + 1))}
                disabled={currentPage === pagination.pages}
                style={{
                  padding: '8px 15px',
                  backgroundColor: currentPage === pagination.pages ? '#ccc' : '#FF9900',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentPage === pagination.pages ? 'not-allowed' : 'pointer',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                Next
              </button>
            </div>
          )}

          <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
            Showing {orders.length} of {pagination.total} orders
          </p>
        </>
      )}
    </div>
  );
};

export default OrderHistory;
