import React from 'react'

const Header = ({ highlight, trucks }) => {
  const ct = trucks.length
  const truckInfo = trucks.map(t => t.properties.info)

  return (
    <div className='p2'>
      {!highlight && (
        <div className='mb2 pb1 border-bottom border-silver'>
          <strong>{ct}</strong>
          {` food truck${ct === 1 ? '' : 's'}`}
        </div>
      )}
      {truckInfo.map((t, i) => (
        <div key={i} className='mb2'>
          <h4 className='m0'>{t.name}</h4>
          <p className='m0 h5'>{t.last_tweet.text}</p>
          <p className='m0 h6 gray'>{t.last_tweet.date_display}</p>
        </div>
      ))}
    </div>
  )
}

export default Header
