import React, { Component } from 'react'
import L from 'mapbox.js'
import 'leaflet.markercluster'

import Modal from './Modal'
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

  render() {
    const { trucks, highlight, modalOpen } = this.state
    const ct = trucks.length

    return (
      <div className='flex flex-column' style={{ height: '100%' }}>
        <header className='flex-none bg-black white'>
          <button
            type='button'
            className='btn p1 regular right'
            onClick={this.toggleModal}
          >
            about
          </button>
          <a href='/' className='btn p1'>food trucks</a>
        </header>
        <main className='flex flex-auto'>
          <div className='sm-col sm-col-3 xs-hide overflow-scroll'>
            <div className='p2'>
              {!highlight && (
                <h2 className='mt0'>
                  {`${ct} food truck${ct === 1 ? '' : 's'}`}
                </h2>
              )}
              {trucks.map((t, i) => (
                <div key={i}>{t.properties.info.name}</div>
              ))}
            </div>
          </div>
          <div className='sm-col sm-col-9 flex-auto'>
            <div
              ref={div => { this.mapHolder = div }}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </main>
        <Modal open={modalOpen} toggle={this.toggleModal} />
      </div>
    )
  }
}

export default App
