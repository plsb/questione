import React from 'react'


import './logo-style.css';

import LogoMarca from '../../assets/Logo.jpeg';

export default function Logo() {
  return (
    <div className="logo">
      <img src={LogoMarca} alt="Logo" className="image"/>
    </div>
  )
}
