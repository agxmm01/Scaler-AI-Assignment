import React from 'react'
import './BuyNow.css';
import { Divider } from '@mui/material';
import Option from './Option';
import Subtotal from './Subtotal';
import Right from './Right';
const BuyNow = () => {
  return (
    <div className='buynow_section'>
      <div className='buynow_container'>
        <div className='left_buy'>
            <h1>Shoping Cart</h1>
            <p>Select all items</p>
            <span className='leftbuyprice'>Price</span>
            <Divider/>
            <div className='item_containert'>
                <img src='https://cdn.prod.website-files.com/6231a9ee43621f83e1552a71/692ece827b6237ab2d2dc031_pec%20fly%20(clubline%20plus)-min.png' alt='item_img'/>
                <div className='item_details'>
                    <h3>Fitness Gear</h3>
                    <h3>Workout Stuff</h3>
                    <h3 className='diffrentprice'>$79.99</h3>
                    <p className='unusuall'>Usually Dispatched in 8 working days</p>
                    <p>Eligible for Free Shipping</p>
                    <Option/>
                </div>
                <h3 className='item_price'>$79.99</h3>
            </div>
            <Divider/>
            <Subtotal/>
        </div>
        <Right/>
      </div>
    </div>
  )
}

export default BuyNow
