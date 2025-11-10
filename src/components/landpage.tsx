import React from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Landpage() {
  const navigate = useNavigate();

  const handleListenNow = () => {
    navigate('/app');
  };

  return (
    <div>
      <div className='head'>
        <h1 className='logo'>TuneTrail</h1>
        <div className='auth-cont'>
          <li>
            <Link to="/signup" className='auth-link'>SIGN UP</Link>
            <Link to="/login" className='auth-link'>LOG IN</Link>
          </li>
        </div>
      </div>
      <div className='hero'>
        <img src="/src/assets/music.png" alt="Musical background" />
        <h2 className='hero-txt'>YOUR PERSONAL SOUNDTRACK ADVENTURE</h2>   
        <button className='litn-btn' onClick={handleListenNow}>LISTEN NOW</button>
      </div>
    </div>
  )
}

export default Landpage