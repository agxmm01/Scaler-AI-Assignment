import React , {useState} from 'react'
import amazonLogo from "../../amazon-logo.png";
import './SignUp.css';
import { NavLink } from 'react-router-dom';
const SignIn = () => {

  const [logdata, setData] = useState({
  email: "",
  password: "",
});


  console.log(logdata);
  return (
    <>
    <section className='sign_container'>
      <div className='sign_header'>
        <img src={amazonLogo} alt='amazonlogo'/>
      </div>
      <div className='sign_form'>
        <form>
          <h1>Sign-In</h1>
          <div className='form_data'>
            <label htmlFor='email'>Email or mobile phone number</label>
            <input type='text' 
            onChange={(e) => setData({...logdata, email: e.target.value})}
            value={logdata.email}
            name='email' id='email' placeholder='Enter your email or mobile phone number'/>
          </div>
          <div className='form_data'>
            <label htmlFor='password'>Password</label>
            <input type='password' 
            onChange={(e) => setData({...logdata, password: e.target.value})}
            value={logdata.password}
            name='password' id='password' placeholder='Enter your password'/>
          </div>
          <button className='signin_btn'>Continue</button>
        </form>
      </div>

      <div className='create_accountinfo'>
        <p>New to Amazon?</p>
        <NavLink to="/register">
        <button className='create_account_btn'>Create your Amazon account</button>
        </NavLink>
      </div>

    </section>
    </>
  )
}

export default SignIn
