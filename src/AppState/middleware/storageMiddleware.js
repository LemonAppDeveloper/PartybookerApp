import AsyncStorage from '@react-native-async-storage/async-storage';
const STORAGE_LOCATION = '@PartyBooker/store'

export const APP_LOAD = 'STORAGE/APP_LOAD'
export const actions = {
  appLoad: () => ({ type: APP_LOAD }),
}

export const storageMiddleware = ({ getState }) => (next) => (action) => {
  if (action.type === APP_LOAD) {
    AsyncStorage.getItem(STORAGE_LOCATION)
      .then((stringData) => {
        var storeValue = JSON.parse(stringData);
        if (storeValue) {
          storeValue.app.showloader = false;
          storeValue.app.showImageGallery = false;
          storeValue.app.imagesOfGallery = [];
          if (storeValue.app.appStatus) {
            storeValue.app.appStatus.status = 'splash';
          } else {
            storeValue.app = {};
            storeValue.app.appStatus = {};
            storeValue.app.appStatus.status = 'splash';
          }
        }
        next({ type: APP_LOAD, store: storeValue || { app: {} } })
      })
      .catch(console.log)
  } else {
    next(action)

    if (action.storage === 'local') {
      const state = getState()
      AsyncStorage.setItem(STORAGE_LOCATION, JSON.stringify(state))
    }
  }
}

export default storageMiddleware
