import React, { useEffect } from 'react'; // ❌ removed "use"
import Banner from './Banner';
import './Home.css';
import Slide from './Slide.js';
import { getProducts } from "../Redux/Actions/Action.js";
import { useDispatch, useSelector } from 'react-redux';

const MainComponent = () => {

  const { products = [] } = useSelector(state => state.products || {});
  console.log(products);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <div className='home_section'>
      <div className='banner_part'>
        <Banner/>
      </div>

      <div className='slide_part'>
        <div className='left_slide'>
          <Slide title="Deals of the Day"  products={products}/>
        </div>

        <div className='right_slide'>
          <h4>Festive latest launches</h4>
          <img src='https://rukminim1.flixcart.com/flap/464/708/image/633789f7def60050.jpg?q=70' alt='rightside'/>
          <a href='#'>Explore More</a>
        </div>
      </div>

      <Slide title="Today's Deals"  products={products}/>
      <div className="center_img">
        <img src="https://m.media-amazon.com/images/G/31/AMS/IN/970X250-_desktop_banner.jpg" alt="" />
      </div>
      <Slide title="Best Sellers"/>
      <Slide title="Upto 80% Off"/>
      
    </div>
  )
}

export default MainComponent;