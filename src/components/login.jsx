import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './style.css'

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to authenticate the user
    console.log('Login attempt:', formData);
    // For now, just navigate to the app on any login attempt
    navigate('/app');
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Welcome Back to TuneTrail</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="auth-button">Log In</button>
      </form>
      
      <p className="auth-switch">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
      
      <p className="auth-switch">
        <Link to="/" className="home-link">Back to Home</Link>
      </p>
    </div>
  );
}

export default Login