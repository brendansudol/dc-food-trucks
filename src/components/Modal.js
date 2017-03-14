import React from 'react'

const Modal = ({ open, toggle }) => {
  const fixed = {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }

  const sx = {
    root: {
      ...fixed,
      zIndex: 1001,
      display: open ? 'flex' : 'none',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    dismiss: {
      ...fixed,
      backgroundColor: 'rgb(17, 17, 17)',
      opacity: 0.875
    },
    inner: {
      position: 'relative',
      zIndex: 1,
      minWidth: 320,
      overflow: 'scroll'
    }
  }

  return (
    <div style={sx.root}>
      <div style={sx.dismiss} onClick={toggle} />
      <div style={sx.inner}>
        <div className='p3 bg-white'>
          hello, world
        </div>
      </div>
    </div>
  )
}

Modal.propTypes = {
  open: React.PropTypes.bool,
  toggle: React.PropTypes.func
}

Modal.defaultProps = {
  open: false,
  toggle: function () {}
}

export default Modal
