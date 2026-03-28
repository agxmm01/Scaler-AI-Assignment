import React, { useState } from 'react'
import amazonLogo from "../../amazon-logo.png";
import './SignUp.css';
import { NavLink } from 'react-router-dom';
const SignUp = () => {


  const[udata, setUdata] = useState({
    fname: "",
    email: "",
    mobile: "",
    password: "",
    cpassword: "",
  });


  console.log(udata);
  return (
      <>
      <section className='sign_container'>
        <div className='sign_header'>
          <img src={amazonLogo} alt='amazonlogo'/>
        </div>
        <div className='sign_form'>
          <form>
            <h1>Register to Amazon</h1>
            <div className='form_data'>
              <label htmlFor='fname'>Enter your Name </label>
              <input type='text' 
              onChange={(e) => setUdata({...udata, fname: e.target.value})}
              value={udata.fname}
              name='fname' id='email' placeholder='John Doe'/>
            </div>

            <div className='form_data'>
              <label htmlFor='email'>Enter your email</label>
              <input type='text' 
              onChange={(e) => setUdata({...udata, email: e.target.value})}
              value={udata.email}
              name='email' id='email' placeholder='john.doe@example.com'/>
            </div>

            <div className='form_data'>
              <label htmlFor='mobile'>Enter your mobile number</label>
              <input type='text' 
              onChange={(e) => setUdata({...udata, mobile: e.target.value})}
              value={udata.mobile}
              name='mobile' id='mobile' placeholder='Enter your mobile number'/>
            </div>

            <div className='form_data'>
              <label htmlFor='password'>Password</label>
              <input type='password' 
              onChange={(e) => setUdata({...udata, password: e.target.value})}
              value={udata.password}
              name='password' id='password' placeholder='Enter your password'/>
            </div>

            <div className='form_data'>
              <label htmlFor='cpassword'>Confirm Password</label>
              <input type='password' 
              onChange={(e) => setUdata({...udata, cpassword: e.target.value})}
              value={udata.cpassword}
              name='cpassword' id='cpassword' placeholder='Confirm your password'/>
            </div>

            <button className='signin_btn'>Continue</button>

            <div className='signin_info'>
              <p>Already have an account?<NavLink to="/login"> Sign in</NavLink></p>
            </div>
          </form>
        </div>
  
       
      </section>
      </>
    )
}

export default SignUp