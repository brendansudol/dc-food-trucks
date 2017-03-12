export const MAPBOX_KEY = 'pk.eyJ1IjoiYnJlbmRhbnN1ZG9sIiwiYSI6ImNpenJzMWdjYzAyYmQzNnFndTk0a3Q3OGwifQ.INlrzzBop-AL0pAduxuQbA'

export const POINTS = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "title": "DC",
        "info": {
          "address": "123 Main St, Washington DC 12345",
          "something": "foo",
        },
        "marker-color": "#fc4353",
        "marker-symbol": "star",
        "marker-size": "small"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-77.038659, 38.931567]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title": "SF",
        "info": {
          "address": "123 Main St, San Francisco, CA 12345",
          "something": "bar",
        },
        "marker-color": "#fc4353",
        "marker-size": "small"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-122.414, 37.776]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title": "Austin",
        "info": {
          "address": "123 Main St, Austin, TX 12345",
          "something": "foo",
        },
        "marker-color": "#2ecc71",
        "marker-size": "small"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-97.755996,  30.307182]
      }
    }
  ]
}
