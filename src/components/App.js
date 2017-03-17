import React, { Component } from 'react'
import L from 'mapbox.js'
import 'leaflet.markercluster'

import Header from './Header'
import Modal from './Modal'
import Sidebar from './Sidebar'
import { MAPBOX_KEY, geoConfig, formatData } from '../util'

L.mapbox.accessToken = MAPBOX_KEY

class App extends Component {
  state = {
    map: null,
    cluster: null,
    layer: null,
    trucks: [],
    highlight: false,
    modalOpen: false,
  }

  componentDidMount() {
    this.initMap()
  }

  initMap = () => {
    const { width } = this.props
    const zoom = width && width > 500 ? 13 : 11

    const map = L.mapbox
      .map(this.mapHolder, 'mapbox.streets', geoConfig.map)
      .setView([38.894, -77.030], zoom)

    new L.Control.Zoom({ position: 'topright' }).addTo(map)

    const layer = L.mapbox.featureLayer()

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
      ...geoConfig.cluster,
    })

    map.on('drag', this.updateList)
    map.on('zoomend', this.updateList)
    cluster.on('clusterclick', this.onClusterClick)
    layer.on('click', this.onLayerClick)

    fetch(`${process.env.PUBLIC_URL}/data/sample.json`)
      .then(response => response.json())
      .then(data => formatData(data.trucks))
      .then(trucks => {
        layer.setGeoJSON({ type: 'FeatureCollection', features: trucks })
        cluster.addLayer(layer)
        map.addLayer(cluster)
        this.setState({ map, layer, cluster, trucks })
      })
  }

  updateList = () => {
    const { map, layer } = this.state
    const [bounds, trucks] = [map.getBounds(), []]

    layer.eachLayer(d => {
      if (bounds.contains(d.getLatLng())) trucks.push(d.feature)
    })

    this.setState({ trucks, highlight: false })
  }

  onLayerClick = e => {
    const truck = e.layer.feature
    this.setState({ trucks: [truck], highlight: true })
  }

  onClusterClick = e => {
    const children = e.layer.getAllChildMarkers()
    const trucks = children.map(d => d.feature)
    this.setState({ trucks, highlight: true })
  }

  toggleModal = () => {
    this.setState(prevState => {
      return { modalOpen: !prevState.modalOpen }
    })
  }

  geolocate = () => {
    const { map } = this.state
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords
        map.setView({ lat, lon }, 15, { animate: true })
      },
      (err) => console.log('geolocation error', err),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    )
  }

  render() {
    const { trucks, highlight, modalOpen } = this.state

    return (
      <div className='app'>
        <Header
          geolocate={this.geolocate}
          toggleModal={this.toggleModal}
        />
        <main className='absolute bottom-0 col-12 flex' style={{ top: 52 }}>
          <Sidebar
            highlight={highlight}
            trucks={trucks}
          />
          <div className='flex-auto h-col-12 content'>
            <div
              className='col-12 h-col-12'
              ref={div => { this.mapHolder = div }}
            />
          </div>
        </main>
        <Modal
          open={modalOpen}
          toggle={this.toggleModal}
        />
      </div>
    )
  }
}

export default App
