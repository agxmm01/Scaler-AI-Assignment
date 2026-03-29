import React, { useRef } from 'react'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Divider } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './Slide.css'
import {Navigate, NavLink} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  }
};

const sendData = (id) => {
  Navigate("/",{state:id});
}

const Slide = ({ title, products = [] }) => { // ✅ default value added
  const carouselRef = useRef();

  const handlePrev = () => {
    carouselRef.current?.previous(1);
  };

  const handleNext = () => {
    carouselRef.current?.next(1);
  };

  return (
    <div className='products_section'>
      <div className='products_deal'></div>
      <h3>{title}</h3>
      <button className='view_btn'>View All</button>
      <Divider/>

      <div className='carousel_wrapper'>
        <button className='carousel_arrow left_arrow' onClick={handlePrev}>
          <ArrowBackIosIcon />
        </button>

        <Carousel
          ref={carouselRef}
          responsive={responsive}
          infinite={true}
          draggable={false}
          swipeable={true}
          showDots={false}
          centerMode={true}
          autoPlay={true}
          autoPlaySpeed={4000}
          keyBoardControl={true}
          removeArrowOnDeviceType={["tablet","mobile","desktop"]}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
          containerClass="carousel-container"
        >

          {
            products?.map((e) => {
              return (
                <NavLink to={`/getProducts/${e.id}`}>

                
                <div className="products_items" key={e.id}>
                  <div className='product_img'>
                    <img src={e.image_url} alt="productitem"/>
                  </div>

                  <p className='products_name'>{e.name}</p>

                  <p className='products_offer'>
                    ₹{e.price} <span className="mrp">₹{e.mrp}</span>
                  </p>

                  <p className='products_explore'>{e.discount}</p>
                </div>
                </NavLink>
              )
            })
          }

        </Carousel>

        <button className='carousel_arrow right_arrow' onClick={handleNext}>
          <ArrowForwardIosIcon />
        </button>
      </div>
    </div>
  )
}

export default Slide;