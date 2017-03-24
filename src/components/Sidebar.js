import uniqBy from 'lodash.uniqby'
import React from 'react'


const Sidebar = ({ fetching, highlight, open, trucks }) => {
  const ct = trucks.length
  const trucksFiltered = uniqBy(trucks.map(t => t.properties.info), 'name')

  return (
    <div className={`bg-white overflow-scroll sidebar ${open ? 'open' : ''}`}>
      <div className='p2'>
        {fetching ? <div>Finding food trucks...</div> : !highlight && (
          <div className='mb2 pb1 border-bottom border-silver'>
            <strong>{ct}</strong>
            {` food truck${ct === 1 ? '' : 's'}`}
          </div>
        )}
        {trucksFiltered.map((t, i) => (
          <div key={i} className='mb2'>
            <h4 className='m0'>{t.name}</h4>
            <p className='m0 h5'>{t.last_tweet.text}</p>
            <p className='m0 h6 gray'>
              {new Date(t.last_tweet.ts * 1000).toDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
