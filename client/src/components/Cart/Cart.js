import React, { useEffect, useState } from 'react'
import './Cart.css';
import { Divider } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../Redux/Actions/cartActions';
import { isAuthenticated, getAuthToken } from '../../services/api';

const Cart = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [inData, setInData] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const getinData = async () => {
        try {
            const res = await fetch(`http://localhost:8001/api/products/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await res.json();

            if (res.status !== 200) {
                setMessage("Product not available");
                setMessageType("error");
            } else {
                setInData(data.product || data);
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            setMessage("Error loading product");
            setMessageType("error");
        }
    };

    useEffect(() => {
        getinData();
    }, [id]);

    const handleAddToCart = async () => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        setLoading(true);
        setMessage('');
        
        try {
            // Wait for the addToCart action to complete
            await dispatch(addToCart(id, quantity));
            setMessage('✓ Product added to cart!');
            setMessageType('success');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to add to cart');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const handleBuyNow = async () => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            // Add to cart and wait for it to complete
            await dispatch(addToCart(id, quantity));
            // Navigate immediately since dispatch is properly awaited
            navigate('/checkout');
        } catch (error) {
            setMessage('Failed to add to cart');
            setMessageType('error');
            setLoading(false);
        }
    };

    const calculateDiscount = () => {
        if (inData.mrp) {
            return Math.round(((inData.mrp - inData.price) / inData.mrp) * 100);
        }
        return 0;
    };

    return (
        <div className='cart_section'>
            <div className='cart_container'>
                <div className='left_cart'>
                    <img src={inData.image_url} alt='cart_img'/>
                    <div className='cart_btn'>
                        <button 
                            className='cart_btn1' 
                            onClick={handleAddToCart}
                            disabled={loading}
                            style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                        >
                            {loading ? 'Adding...' : 'Add to Cart'}
                        </button>
                        <button 
                            className='cart_btn2'
                            onClick={handleBuyNow}
                            disabled={loading}
                            style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                        >
                            {loading ? 'Processing...' : 'Buy Now'}
                        </button>
                    </div>
                    {message && (
                        <div style={{
                            marginTop: '15px',
                            padding: '10px',
                            backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da',
                            color: messageType === 'success' ? '#155724' : '#721c24',
                            borderRadius: '4px',
                            textAlign: 'center'
                        }}>
                            {message}
                        </div>
                    )}
                </div>
                <div className='right_cart'>
                    <h3>{inData.name}</h3>
                    <h4>{inData.description}</h4>
                    <Divider/>
                    
                    <div style={{ marginTop: '15px' }}>
                        <p className='mrp' style={{ margin: '5px 0' }}>MRP: <span style={{textDecoration: 'line-through', color: '#888'}}>₹ {inData.mrp}</span></p>
                        <p style={{ margin: '5px 0', fontSize: '18px', color: '#186A3B', fontWeight: 'bold' }}>Deal Price: ₹ {inData.price}</p>
                        {inData.mrp && <p style={{ margin: '5px 0', color: '#B12074' }}>You Save: ₹ {(inData.mrp - inData.price).toFixed(2)} ({calculateDiscount()}%)</p>}
                    </div>

                    <div className='discount_box'>
                        <h5>Discount: <span style={{color:"#111"}}>{inData.discount || calculateDiscount() + '%'}</span></h5>
                        <h4>Free Delivery <span style={{color:"#111",fontWeight:600}}>Oct 8 - 21</span></h4>
                        <p>Fastest Delivery: <span style={{color:"#111",fontWeight:600}}>Within 2 - 3 days</span></p>
                        
                        {inData.stock !== undefined && (
                            <p style={{ color: inData.stock > 0 ? '#186A3B' : '#B12704', fontWeight: 'bold' }}>
                                {inData.stock > 0 ? `✓ In Stock (${inData.stock} available)` : '✗ Out of Stock'}
                            </p>
                        )}
                    </div>

                    {/* Quantity Selector */}
                    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                        <label style={{ marginRight: '10px' }}>Quantity: </label>
                        <select 
                            value={quantity} 
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            style={{
                                padding: '5px 10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                            }}
                        >
                            {[1,2,3,4,5,6,7,8,9,10].map(q => (
                                <option key={q} value={q}>{q}</option>
                            ))}
                        </select>
                    </div>

                    <p className='description'>About the item: <span style={{color:"#565959",fontSize:14,fontWeight:500,letterSpacing:"0.4px"}}>{inData.description}</span> </p>
                </div>
            </div>
        </div>
    )
}

export default Cart
