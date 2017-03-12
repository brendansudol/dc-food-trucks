import L from 'mapbox.js'
import React, { Component } from 'react'

import { MAPBOX_KEY } from './data'
import { tooltip } from './util'

L.mapbox.accessToken = MAPBOX_KEY

class App extends Component {
  state = {
    map: null,
    layer: null,
    filter: null,
  }

  componentDidMount() {
    this.initMap() 
  }

  componentWillUpdate(_, nextState) {
    const { filter } = this.state
    const { filter: nextFilter } = nextState

    if (filter !== nextFilter) this.filterLayer(nextFilter)
  }

  initMap = () => {
    const { geojson } = this.props

    const map = L.mapbox
      .map(this.mapHolder, 'mapbox.streets', { minZoom: 1, maxZoom: 5 })
      .setView([23.06, -13.61], 1)

    const layer = L.mapbox
      .featureLayer()
      .addTo(map)

    layer.on('layeradd', this.onLayerAdd)
    layer.setGeoJSON(geojson)

    this.setState({ map, layer })
  }

  onLayerAdd = e => {
    const marker = e.layer
    const { title, info } = marker.feature.properties

    marker.bindPopup(tooltip({ title, ...info }), {
      closeButton: false,
      maxWidth: 'auto',
    })
  }

  filterLayer = (nextFilter) => {
    const { map, layer } = this.state

    layer.setFilter(feature => {
      const { something } = feature.properties.info
      return something === nextFilter
    })

    map.fitBounds(layer.getBounds())
  }

  onChange = e => {
    const { value: filter } = e.target
    this.setState({ filter })
  }

  render() {
    const { layer, filter } = this.state

    let markers = []
    layer && layer.eachLayer(d => markers.push(d.feature.properties))

    return (
      <div className='p2'>
        <div
          ref={div => { this.mapHolder = div }}
          style={{ width: '100%', height: 300 }}
        />
        <div>
          {markers.length > 0 && markers.map((d, i) => (
            <pre key={i}>{JSON.stringify(d)}</pre>
          ))}
        </div>
        <select
          className='select md-col-3'
          onChange={this.onChange}
          value={filter || ''}
        >
          <option>foo</option>
          <option>bar</option>
        </select>
      </div>
    )
  }
}

export default App
