import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import { POINTS } from './data'

import 'ace-css/css/ace.min.css'

ReactDOM.render(
  <App geojson={POINTS} />,
  document.getElementById('root')
)
