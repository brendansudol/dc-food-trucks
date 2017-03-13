import React, { Component } from 'react'
import L from 'mapbox.js'
import 'leaflet.markercluster'

import { MAPBOX_KEY } from './data'
import { tooltip } from './util'

L.mapbox.accessToken = MAPBOX_KEY

class App extends Component {
  state = {
    map: null,
    cluster: null,
    layer: null,
    filter: null,
    trucks: [],
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
    const { geojson, width } = this.props
    const zoom = width && width > 500 ? 13 : 11

    const map = L.mapbox
      .map(this.mapHolder, 'mapbox.streets', { minZoom: 6, maxZoom: 16 })
      .setView([38.894, -77.030], zoom)

    const cluster = new L.MarkerClusterGroup({
        iconCreateFunction: (cluster) => {
            const count = cluster.getChildCount()
            const digits = `${count}`.length

            return new L.DivIcon({
              className: `cluster digits-${digits}`,
              html: count,
              iconSize: null
            })
        },
        showCoverageOnHover: false,
        zoomToBoundsOnClick: false,
        spiderfyOnMaxZoom: true,
        maxClusterRadius: 40,
        spiderfyDistanceMultiplier: 0.6
    })

    const layer = L.mapbox.featureLayer()

    map.on('drag', this.updateList)
    map.on('zoomend', this.updateList)
    cluster.on('clusterclick', this.onClusterClick)
    layer.on('layeradd', this.onLayerAdd)
    layer.on('click', this.onLayerClick)

    layer.setGeoJSON(geojson)
    cluster.addLayer(layer)
    map.addLayer(cluster)

    this.setState({ map, layer, trucks: geojson.features })
  }

  updateList = () => {
    const { map, layer } = this.state
    const [bounds, trucks] = [map.getBounds(), []]

    layer.eachLayer(d => {
      if (bounds.contains(d.getLatLng())) trucks.push(d.feature)
    })

    this.setState({ trucks })
  }

  onLayerAdd = e => {
    const marker = e.layer
    const { title, info } = marker.feature.properties

    marker.bindPopup(tooltip({ title, ...info }), {
      closeButton: false,
      maxWidth: 'auto',
    })
  }

  onLayerClick = e => {
    const truck = e.layer.feature
    this.setState({ trucks: [truck] })
  }

  onClusterClick = e => {
    const children = e.layer.getAllChildMarkers()
    const trucks = children.map(d => d.feature)
    this.setState({ trucks })
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
    const { trucks } = this.state

    return (
      <div className='flex flex-column' style={{ height: '100%' }}>
        <header className='flex-none bg-black white p1 bold'>
          food trucks
        </header>
        <main className='flex flex-auto'>
          <div className='sm-col sm-col-3 xs-hide bg-darken-1'>
            {trucks.map((t, i) => (
              <div key={i}>{t.properties.title}</div>
            ))}
          </div>
          <div className='sm-col sm-col-9 flex-auto'>
            <div
              ref={div => { this.mapHolder = div }}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </main>
      </div>
    )
  }
}

export default App
