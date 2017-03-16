import React from 'react'
import ReactDOM from 'react-dom'

import App from './components/App'

import 'ace-css/css/ace.min.css'
import './css/misc.css'

ReactDOM.render(
  <App width={window && window.innerWidth} />,
  document.getElementById('root')
)
