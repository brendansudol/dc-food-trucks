import * as types from '../constants'


export const toggleModal = () => ({
  type: types.TOGGLE_MODAL,
})

export const toggleSidebar = () => ({
  type: types.TOGGLE_SIDEBAR,
})

export const requestTrucks = () => ({
  type: types.REQUEST_TRUCKS,
})

export const receiveTrucks = json => ({
  type: types.RECEIVE_TRUCKS,
  trucks: json['trucks'] || [],
})

export const updateTrucks = payload => ({
  type: types.UPDATE_TRUCKS,
  payload,
})

export const fetchTrucks = () => dispatch => {
  dispatch(requestTrucks())

  const url = 'https://dc-food-trucks-api.herokuapp.com/data'
  return fetch(url)
    .then(response => response.json())
    .then(json => dispatch(receiveTrucks(json)))
    .catch(error => console.log(error))
}

export const requestLocation = () => ({
  type: types.REQUEST_LOCATION,
})

export const receiveLocation = pos => ({
  type: types.RECEIVE_LOCATION,
  coords: pos.coords
})

export const failLocation = () => ({
  type: types.FAIL_LOCATION,
})

const fetchLocation = () => dispatch => {
  dispatch(requestLocation())

  navigator.geolocation.getCurrentPosition(
    (position) => dispatch(receiveLocation(position)),
    (error) => dispatch(failLocation()),
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
  )
}

export const fetchLocationIfPossible = () => (dispatch, getState) => {
  const { available } = getState().geolocation

  if (!available) return
  if (!navigator.geolocation) return dispatch(failLocation())
  return dispatch(fetchLocation())
}
