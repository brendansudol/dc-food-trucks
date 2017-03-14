export const MAPBOX_KEY = 'pk.eyJ1IjoiYnJlbmRhbnN1ZG9sIiwiYSI6ImNpenJzMWdjYzAyYmQzNnFndTk0a3Q3OGwifQ.INlrzzBop-AL0pAduxuQbA'

export const geoConfig = {
  map: {
    minZoom: 10,
    maxZoom: 16,
  },
  cluster: {
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    spiderfyOnMaxZoom: true,
    maxClusterRadius: 40,
    spiderfyDistanceMultiplier: 0.6,
  },
}

export const tooltip = ({ name, last_tweet }) => (`
  <div class='p1 h5' style='width:300px'>
    <div class='h4 bold'>${name}</div>
    <div>${last_tweet.text}</div>
  </div>
`)

export const formatData = data => (
  data.map(d => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [d.location.lng, d.location.lat]
    },
    properties: {
      'marker-color': '#fc4353',
      'marker-size': 'small',
      title: tooltip(d),
      info: { ...d }
    }
  }))
)