import {
  UPDATE_APP_STATE,
  SHOW_LOADER,
  SAVE_USER_DETAILS,
  SAVE_USER_TYPE_DETAILS,
  SAVE_FIRST_TIME_LOGIN,
  RESET_STORE
} from './index';

export const actions = {

  updateAppState: (data) => ({
    type: UPDATE_APP_STATE,
    data: data,
  }),
  setLoader: (value = false) => ({
    type: SHOW_LOADER,
    showloader: value
  }),
  setUserDetails: (value = {}) => ({
    type: SAVE_USER_DETAILS,
    data: value,
    storage: 'local'
  }),
  SetSelectionTYpeOFUSer: (value = {}) => ({
    type: SAVE_USER_TYPE_DETAILS,
    data: value,
    storage: 'local'
  }),
  setFirstTimeLogin: (value = {}) => ({
    type: SAVE_FIRST_TIME_LOGIN,
    data: value,
    storage: 'local'
  }),
  resetStore: (value = {}) => ({
    type: RESET_STORE,
    data: value,
    storage: 'local'
  }),
}


