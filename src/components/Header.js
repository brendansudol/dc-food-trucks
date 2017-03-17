import React from 'react'

const Header = ({ geolocate, toggleModal }) => (
  <header className='bg-red white'>
    <div className='right'>
      <button
        type='button'
        className='btn p2 h6 sm-h5 regular'
        onClick={geolocate}
      >
        geo
      </button>
      <button
        type='button'
        className='btn p2 h6 sm-h5 regular'
        onClick={toggleModal}
      >
        about
      </button>
    </div>
    <a href='/' className='btn p2 sm-h3'>dc food trucks today</a>
  </header>
)

export default Header
