import React, { useState } from 'react'
import amazonLogo from "../../amazon-logo.png";
import './SignUp.css';
import { NavLink, useNavigate } from 'react-router-dom';

const SignIn = () => {
  const navigate = useNavigate();
  const [logdata, setData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...logdata, [name]: value });
    setError(""); // Clear error when user starts typing
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!logdata.email || !logdata.password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: logdata.email,
          password: logdata.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Store token and user info in localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to home page
      navigate("/");
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className='sign_container'>
        <div className='sign_header'>
          <img src={amazonLogo} alt='amazonlogo' />
        </div>
        <div className='sign_form'>
          <form onSubmit={handleSubmit}>
            <h1>Sign-In</h1>

            {error && <div style={{ color: 'red', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}

            <div className='form_data'>
              <label htmlFor='email'>Email or mobile phone number</label>
              <input
                type='email'
                onChange={handleChange}
                value={logdata.email}
                name='email'
                id='email'
                placeholder='Enter your email or mobile phone number'
                disabled={loading}
              />
            </div>

            <div className='form_data'>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                onChange={handleChange}
                value={logdata.password}
                name='password'
                id='password'
                placeholder='Enter your password'
                disabled={loading}
              />
            </div>

            <button className='signin_btn' type='submit' disabled={loading}>
              {loading ? "Signing In..." : "Continue"}
            </button>
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
