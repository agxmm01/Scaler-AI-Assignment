import React, { useEffect, useState } from 'react'
import './Cart.css';
import { Divider } from '@mui/material';
import { useParams } from 'react-router-dom';
const Cart = () => {

    const { id } = useParams();

    const [inData, setInData] = useState([]);


const getinData = async () => {
    const res = await fetch(`/api/getProducts/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const data = await res.json();
    console.log(data);

    if (res.status !== 200) {
            alert("no data available")
        } else {
            // console.log("ind mila hain");
            setInData(data);
        }
};

useEffect(() => {
    getinData();
}, [id]);
  return (
    <div className='cart_section'>
        <div className='cart_container'>
            <div className='left_cart'>
                <img src={inData.image_url} alt='cart_img'/>
            <div className='cart_btn'>
                <button className='cart_btn1'>Add to Cart</button>
                <button className='cart_btn2'>Buy Now</button>
            </div>
            </div>
            <div className='right_cart'>
                <h3>{inData.name}</h3>
                <h4>{inData.description}</h4>
                <Divider/>
                <p className='mrp'> ₹ {inData.mrp}</p>
                <p>Deal of the Day : <span style={{color:"#B12074"}}>₹ {inData.price}</span></p>
                <p>You Save : <span style={{color:"#B12074"}}> ₹ {inData.mrp - inData.price} (22%)</span></p>
                <div className='discount_box'>
                <h5> Discount : <span style={{color:"#111"}}>{inData.discount}</span></h5>
                <h4>Free Delivery <span style={{color:"#111",fontWeight:600}}>Oct 8 - 21</span>Details</h4>
                <p>Fastest Delivery : <span style={{color:"#111",fontWeight:600}}>Within 2 - 3 days</span></p>
            </div>
            <p className='description'>About the item : <span style={{color:"#565959",fontSize:14,fontWeight:500,letterSpacing:"0.4px"}}>{inData.description}</span> </p>
            </div>
        </div>
      
    </div>
  )
}

export default Cart
