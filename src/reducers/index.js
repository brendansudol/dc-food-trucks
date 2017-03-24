import { combineReducers } from 'redux'

import {
  REQUEST_TRUCKS,
  RECEIVE_TRUCKS,
  UPDATE_TRUCKS,
  TOGGLE_MODAL,
  TOGGLE_SIDEBAR,
  REQUEST_LOCATION,
  RECEIVE_LOCATION,
  FAIL_LOCATION,
} from '../constants'
import { formatData } from '../util'


const truckInfo = (state = {
  fetching: true,
  highlight: false,
  sidebarOpen: false,
  trucks: [],
}, action) => {
  switch (action.type) {
    case REQUEST_TRUCKS:
      return {
        ...state,
        fetching: true,
      }
    case RECEIVE_TRUCKS:
      return {
        ...state,
        fetching: false,
        trucks: formatData(action.trucks),
      }
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      }
    case UPDATE_TRUCKS:
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state
  }
}

const modalOpen = (state = false, action) => {
  switch (action.type) {
    case TOGGLE_MODAL:
      return !state
    default:
      return state
  }
}

const geolocation = (state = {
  available: true,
  locating: false,
  location: null,
}, action) => {
  switch (action.type) {
    case REQUEST_LOCATION:
      return {
        ...state,
        locating: true,
      }
    case RECEIVE_LOCATION:
      return {
        ...state,
        locating: false,
        location: {
          lat: action.coords.latitude,
          lon: action.coords.longitude,
        }
      }
    case FAIL_LOCATION:
      return {
        ...state,
        locating: false,
        available: false,
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  truckInfo,
  modalOpen,
  geolocation,
})

export default rootReducer
