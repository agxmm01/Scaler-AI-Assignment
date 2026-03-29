import React, { useState } from 'react'
import amazonLogo from "../../amazon-logo.png";
import './SignUp.css';
import { NavLink, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const [udata, setUdata] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    cpassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUdata({ ...udata, [name]: value });
    setError(""); // Clear error when user starts typing
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!udata.name || !udata.email || !udata.password || !udata.cpassword) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (udata.password !== udata.cpassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (udata.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: udata.name,
          email: udata.email,
          phone: udata.phone || null,
          password: udata.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      // Store token in localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to home page
      navigate("/");
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Registration error:", err);
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
            <h1>Register to Amazon</h1>

            {error && <div style={{ color: 'red', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}

            <div className='form_data'>
              <label htmlFor='name'>Enter your Name</label>
              <input
                type='text'
                onChange={handleChange}
                value={udata.name}
                name='name'
                id='name'
                placeholder='John Doe'
                disabled={loading}
              />
            </div>

            <div className='form_data'>
              <label htmlFor='email'>Enter your email</label>
              <input
                type='email'
                onChange={handleChange}
                value={udata.email}
                name='email'
                id='email'
                placeholder='john.doe@example.com'
                disabled={loading}
              />
            </div>

            <div className='form_data'>
              <label htmlFor='phone'>Enter your mobile number</label>
              <input
                type='tel'
                onChange={handleChange}
                value={udata.phone}
                name='phone'
                id='phone'
                placeholder='Enter your mobile number'
                disabled={loading}
              />
            </div>

            <div className='form_data'>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                onChange={handleChange}
                value={udata.password}
                name='password'
                id='password'
                placeholder='Enter your password (min 6 characters)'
                disabled={loading}
              />
            </div>

            <div className='form_data'>
              <label htmlFor='cpassword'>Confirm Password</label>
              <input
                type='password'
                onChange={handleChange}
                value={udata.cpassword}
                name='cpassword'
                id='cpassword'
                placeholder='Confirm your password'
                disabled={loading}
              />
            </div>

            <button className='signin_btn' type='submit' disabled={loading}>
              {loading ? "Creating Account..." : "Continue"}
            </button>

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