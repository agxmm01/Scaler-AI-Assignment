import React from 'react'
import './Cart.css';
import { Divider } from '@mui/material';
const Cart = () => {
  return (
    <div className='cart_section'>
        <div className='cart_container'>
            <div className='left_cart'>
                <img src='https://cdn.prod.website-files.com/6231a9ee43621f83e1552a71/692ece827b6237ab2d2dc031_pec%20fly%20(clubline%20plus)-min.png' alt='cart_img'/>
            <div className='cart_btn'>
                <button className='cart_btn1'>Add to Cart</button>
                <button className='cart_btn2'>Buy Now</button>
            </div>
            </div>
            <div className='right_cart'>
                <h3>Fitness Gear</h3>
                <h4>Used for Getting Fit</h4>
                <Divider/>
                <p className='mrp'>M.R.P : $101.99</p>
                <p>Deal of the Day : <span style={{color:"#B12074"}}>$79.99</span></p>
                <p>You Save : <span style={{color:"#B12074"}}>$22.00 (22%)</span></p>
                <div className='discount_box'>
                <h5> Discount : <span style={{color:"#111"}}>Extra 10% off</span></h5>
                <h4>Free Delivery <span style={{color:"#111",fontWeight:600}}>Oct 8 - 21</span>Details</h4>
                <p>Fastest Delivery : <span style={{color:"#111",fontWeight:600}}>Within 2 - 3 days</span></p>
            </div>
            <p className='description'>About the item : <span style={{color:"#565959",fontSize:14,fontWeight:500,letterSpacing:"0.4px"}}>This is a fitness item used to improve your fitness level.</span> </p>
            </div>
        </div>
      
    </div>
  )
}

export default Cart
