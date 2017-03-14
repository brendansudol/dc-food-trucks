import React from 'react'
import ReactDOM from 'react-dom'

import App from './components/App'
import 'ace-css/css/ace.min.css'

ReactDOM.render(
  <App width={window && window.innerWidth} />,
  document.getElementById('root')
)
