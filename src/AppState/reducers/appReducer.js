import {
    UPDATE_APP_STATE,
    SHOW_LOADER,
    SAVE_USER_DETAILS,
    SAVE_FIRST_TIME_LOGIN,
    SAVE_USER_TYPE_DETAILS,
    RESET_STORE
} from "../actions";

import { APP_LOAD } from '../middleware/storageMiddleware';

const AppReducer = (state = { appStatus: { status: 'splash' } }, action) => {

    switch (action.type) {
        case APP_LOAD:
            return { ...state, ...action.store.app }
        case UPDATE_APP_STATE:
            return { ...state, appStatus: action.data }
        case SHOW_LOADER:
            return { ...state, showloader: action.showloader }
        case SAVE_USER_DETAILS:
            return { ...state, userDetails: action.data }
        case SAVE_USER_TYPE_DETAILS:
            return { ...state, userTypeDetails: action.data }
        case SAVE_FIRST_TIME_LOGIN:
            return { ...state, userFirstLogin: action.data }
        case RESET_STORE:
            return { ...state.app, ...action.data }
        default:
            return state;
    }
}

export default AppReducer;