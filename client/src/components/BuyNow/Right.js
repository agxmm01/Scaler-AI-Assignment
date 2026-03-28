import React from 'react'

const Right = () => {
  return (
    <div className='right_buy'>
         <img src="https://images-eu.ssl-images-amazon.com/images/G/31/checkout/assets/TM_desktop._CB443006202_.png" alt="rightimg" />
        <div className='cost_right'>
            <p>Your order is eligible for FREE Delivery.</p>
            <span style={{color:"#565959"}}>Select this option to checkout. </span>
            <h3> Subtotal (1 items): <strong style={{fontWeight:700,color:"#111"}}>$79.99</strong></h3>
            <button className='rightbuy_btn'>Proceed to Buy</button>
            <div className='emi'>
                <p>EMI available</p>
            </div>
        </div>
      
    </div>
  )
}

export default Right 
