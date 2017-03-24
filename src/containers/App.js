import throttle from 'lodash.throttle'
import L from 'mapbox.js'
import 'leaflet.markercluster'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as actions from '../actions'
import Header from '../components/Header'
import MapBtns from '../components/MapBtns'
import Modal from '../components/Modal'
import Sidebar from '../components/Sidebar'
import { MAPBOX_KEY, geoConfig } from '../util'


L.mapbox.accessToken = MAPBOX_KEY

class App extends Component {
  componentDidMount() {
    this.initMap()
  }

  componentWillReceiveProps(newProps) {
    const { fetching, locating } = this.props

    if (fetching && !newProps.fetching) {
      return this.addTrucksToMap(newProps.trucks)
    }

    if (locating && !newProps.locating) {
      return this.zoomToUser(newProps.location)
    }
  }

  initMap = () => {
    const { width, actions } = this.props
    const zoom = width && width > 500 ? 13 : 11

    const map = L.mapbox
      .map(this.mapHolder, 'mapbox.streets', geoConfig.map)
      .setView([38.894, -77.030], zoom)

    new L.Control.Zoom({ position: 'bottomright' }).addTo(map)

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

    map.on('drag', throttle(this.updateList, 100))
    map.on('zoomend', this.updateList)
    cluster.on('clusterclick', this.onClusterClick)
    layer.on('click', this.onLayerClick)

    this._mapbox = { map, layer, cluster }
    actions.fetchTrucks()
  }

  addTrucksToMap = trucks => {
    const { map, layer, cluster } = this._mapbox

    layer.setGeoJSON({ type: 'FeatureCollection', features: trucks })
    cluster.addLayer(layer)
    map.addLayer(cluster)
  }

  zoomToUser = loc => {
    if (!loc) return
    const { map } = this._mapbox
    map.setView(loc, 15, { animate: true })
  }

  updateList = () => {
    const { actions } = this.props
    const { map, layer } = this._mapbox
    const [bounds, trucks] = [map.getBounds(), []]

    layer.eachLayer(d => {
      if (bounds.contains(d.getLatLng())) trucks.push(d.feature)
    })

    actions.updateTrucks({ trucks, highlight: false })
  }

  onLayerClick = e => {
    const { actions } = this.props
    const trucks = [e.layer.feature]
    actions.updateTrucks({ trucks, highlight: true })
  }

  onClusterClick = e => {
    const { actions } = this.props
    const children = e.layer.getAllChildMarkers()
    const trucks = children.map(d => d.feature)
    actions.updateTrucks({ trucks, highlight: true, sidebarOpen: true })
  }

  render() {
    const { actions, fetching, highlight, modalOpen, sidebarOpen, trucks } = this.props

    return (
      <div className='app'>
        <Header toggleModal={actions.toggleModal} />
        <main className='absolute bottom-0 col-12 flex' style={{ top: 52 }}>
          <Sidebar
            fetching={fetching}
            highlight={highlight}
            open={sidebarOpen}
            trucks={trucks}
          />
          <div className='flex-auto relative h-col-12'>
            <div
              className='col-12 h-col-12'
              ref={div => { this.mapHolder = div }}
            />
            <MapBtns
              count={trucks.length}
              fetching={fetching}
              geolocate={actions.fetchLocationIfPossible}
              sidebarOpen={sidebarOpen}
              toggleSidebar={actions.toggleSidebar}
            />
          </div>
        </main>
        <Modal
          open={modalOpen}
          toggle={actions.toggleModal}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { truckInfo, modalOpen, geolocation } = state
  const { locating, location } = geolocation
  return { ...truckInfo, modalOpen, locating, location }
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App)
