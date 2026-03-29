import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart, removeFromCart, updateCartItem } from '../Redux/Actions/cartActions';
import { isAuthenticated, getAuthToken } from '../../services/api';
import '../Cart/Cart.css';

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { cartItems, loading, error, subtotal, tax, total } = useSelector(
    state => state.cart
  );

  useEffect(() => {
    if (isAuthenticated()) {
      dispatch(fetchCart());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity > 0 && newQuantity <= 100) {
      try {
        await dispatch(updateCartItem(productId, newQuantity));
      } catch (error) {
        console.error("Error updating cart:", error);
        alert("Failed to update cart. Please try again.");
      }
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await dispatch(removeFromCart(productId));
    } catch (error) {
      console.error("Error removing item from cart:", error);
      alert("Failed to remove item. Please try again.");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Cart is empty');
      return;
    }
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  if (loading) {
    return <div className="cart_container"><p>Loading cart...</p></div>;
  }

  if (!isAuthenticated()) {
    return (
      <div className="cart_container">
        <h1>Shopping Cart</h1>
        <p>Please <a href="/login">login</a> to view your cart</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart_container" style={{ padding: '40px 20px' }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Your Cart is Empty</h1>
          <p style={{ marginTop: '20px' }}>Add items to your cart to get started!</p>
          <button 
            onClick={handleContinueShopping}
            style={{
              marginTop: '20px',
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
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart_container">
      <h1>Shopping Cart ({cartItems.length} items)</h1>
      
      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '20px' }}>
        {/* Cart Items */}
        <div className="cart_items">
          {cartItems.map((item) => (
            <div key={item.product_id} className="cart_item" style={{
              display: 'flex',
              borderBottom: '1px solid #ddd',
              padding: '15px 0',
              gap: '15px'
            }}>
              {/* Product Image */}
              <div style={{ flex: '0 0 150px' }}>
                <img
                  src={item.image_url || 'https://via.placeholder.com/150'}
                  alt={item.name}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }}
                />
              </div>

              {/* Product Details */}
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
                  {item.name}
                </h3>
                
                <div style={{ marginBottom: '10px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#186A3B' }}>
                    ₹{item.price}
                  </span>
                  {item.mrp && (
                    <span style={{ marginLeft: '10px', textDecoration: 'line-through', color: '#888' }}>
                      ₹{item.mrp}
                    </span>
                  )}
                  {item.discount && (
                    <span style={{ marginLeft: '10px', color: '#B12704', fontWeight: 'bold' }}>
                      {item.discount} off
                    </span>
                  )}
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label style={{ marginRight: '10px' }}>Qty:</label>
                  <select
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.product_id, parseInt(e.target.value))}
                    style={{
                      padding: '5px 10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <strong>Line Total: ₹{(item.price * item.quantity).toFixed(2)}</strong>
                </div>

                {item.stock <= 0 && (
                  <div style={{ color: '#B12704', fontWeight: 'bold' }}>
                    Out of Stock
                  </div>
                )}

                <button
                  onClick={() => handleRemoveItem(item.product_id)}
                  style={{
                    color: '#007185',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0
                  }}
                >
                  Remove from cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div style={{
          border: '1px solid #ddd',
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          height: 'fit-content'
        }}>
          <h3 style={{ marginTop: 0 }}>Cart Summary</h3>
          
          <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Subtotal:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          
          <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Tax (5%):</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          
          <div style={{
            marginBottom: '20px',
            paddingTop: '10px',
            borderTop: '1px solid #ddd',
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            <span>Total:</span>
            <span style={{ color: '#B12704' }}>₹{total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#FF9900',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}
          >
            Proceed to Checkout
          </button>

          <button
            onClick={handleContinueShopping}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
