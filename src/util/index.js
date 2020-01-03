export const MAPBOX_KEY =
  "pk.eyJ1IjoiYnJlbmRhbnN1ZG9sIiwiYSI6ImNrM25oNThxZzE0d2QzZ3FuaHIwcWxhYnkifQ.4ieoOfQ1fHd3pkDn1IZRKw"

export const geoConfig = {
  map: {
    minZoom: 10,
    maxZoom: 16,
    zoomControl: false
  },
  cluster: {
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    spiderfyOnMaxZoom: true,
    maxClusterRadius: 40,
    spiderfyDistanceMultiplier: 0.6
  }
}

const tooltip = ({ name, last_tweet }) =>
  `
  <div class='p1' style='width:300px'>
    <div class='h5 bold'>${name}</div>
    <div class='h6'>"${last_tweet.text}"</div>
  </div>
`.trim()

const entry = (datum, loc) => ({
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [loc.lng, loc.lat]
  },
  properties: {
    "marker-color": "#fc4353",
    "marker-size": "small",
    title: tooltip(datum),
    info: { ...datum }
  }
})

export const formatData = data => {
  const results = []

  data.forEach(d => {
    d.location.forEach(l => {
      results.push(entry(d, l))
    })
  })

  return results
}
