import { appStore } from "../../App";
import { actions as appActions } from "../AppState/actions/appActions";
import Apis, * as CONSTANT from "../util/constant";
import axios from "axios";
import { ErrorCtrl } from './ErrorController';

class ProductController {

    constructor() {
    }

    CreateEventOne() {
        let userDetails = appStore.getState().app.userDetails;
        if (userDetails == null || Object.keys(userDetails).length == 0)
            return
        //let data = {};
        let headers = {
            Authorization: 'Bearer ' + userDetails.access_token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        return new Promise(async function (resolve, reject) {
            let response = await axios.get(Apis.PAST_ORDERS + "?api_version=1.0", {
                headers: headers
            }).catch(e => {
                appStore.dispatch(appActions.setLoader(false));
                ErrorCtrl.showError({
                    msg: e.message
                });
                return false;
            });

            if (response.data.success) {
                var homeProductLists = response.data.data;
                resolve(homeProductLists);
            } else {
                appStore.dispatch(appActions.setLoader(false));
                reject(response.data);
            }
        });
    }

    getAllCategories() {
        let userDetails = appStore.getState().app.userDetails;

        if (userDetails == null || Object.keys(userDetails).length == 0)
            return
        let data = { action: 'get' };

        let headers = {
            Authorization: 'Bearer ' + userDetails.access_token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        return new Promise(async function (resolve, reject) {
            let response = await axios.post(Apis.GET_CATEGORY, data, {
                headers: headers
            }).catch(e => {
                //appStore.dispatch(appActions.setLoader(false));
                ErrorCtrl.showError({
                    msg: e.message
                });
                return false;
            });
            if (response.data.status) {
                var homeProductLists = response.data;
                resolve(homeProductLists);
            } else {
                //appStore.dispatch(appActions.setLoader(false));
                reject(response.data);
            }
        });
    }

    getAllSubCategories() {
        let userDetails = appStore.getState().app.userDetails;
        if (userDetails == null || Object.keys(userDetails).length == 0)
            return
        //let data = { action: 'get' };
        let headers = {
            Authorization: 'Bearer ' + userDetails.access_token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        return new Promise(async function (resolve, reject) {
            let response = await axios.get(Apis.GET_SUB_CATEGORY,
                //data,
                {
                    headers: headers
                }).catch(e => {
                    appStore.dispatch(appActions.setLoader(false));
                    ErrorCtrl.showError({
                        msg: e.message
                    });
                    return false;
                });
            if (response.data.status) {
                var homeProductLists = response.data;
                resolve(homeProductLists);
            } else {
                appStore.dispatch(appActions.setLoader(false));
                reject(response.data);
            }
        });
    }

    getAllMyPartyList() {
        let userDetails = appStore.getState().app.userDetails;
        if (userDetails == null || Object.keys(userDetails).length == 0)
            return
        let data = {};

        console.log('acces_token:', userDetails.access_token)

        let headers = {
            Authorization: 'Bearer ' + userDetails.access_token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        return new Promise(async function (resolve, reject) {
            let response = await axios.post(Apis.GET_EVENT, data, {
                headers: headers
            }).catch(e => {
                //appStore.dispatch(appActions.setLoader(false));
                ErrorCtrl.showError({
                    msg: e.message
                });
                return false;
            });

            if (response.data) {
                var homeProductLists = response.data;
                resolve(homeProductLists);
            } else {
                //appStore.dispatch(appActions.setLoader(false));
                reject(response.data);
            }
        });
    }

    getAllVendorProfileDiscoverPage(data) {
        let userDetails = appStore.getState().app.userDetails;
        if (userDetails == null || Object.keys(userDetails).length == 0)
            return

        let headers = {
            Authorization: 'Bearer ' + userDetails.access_token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        return new Promise(async function (resolve, reject) {
            let response = await axios.post(Apis.VENDOR_GET_PROFILESS, data, {
                headers: headers
            }).catch(e => {
                appStore.dispatch(appActions.setLoader(false));
                ErrorCtrl.showError({
                    msg: e.message
                });
                return false;
            });
            if (response.data.status) {
                appStore.dispatch(appActions.setLoader(false));
                var homeProductLists = response.data;
                resolve(homeProductLists);
            } else {
                appStore.dispatch(appActions.setLoader(false));
                reject(response);
            }
        });
    }

    createPartyEvent(data) {
        let userDetails = appStore.getState().app.userDetails;

        if (userDetails == null || Object.keys(userDetails).length == 0)
            return
        let headers = {
            Authorization: 'Bearer ' + userDetails.access_token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        return new Promise(async function (resolve, reject) {
            let response = await axios.post(Apis.CREATE_EVENT, data, {
                headers: headers
            }).catch(e => {
                appStore.dispatch(appActions.setLoader(false));
                ErrorCtrl.showError({
                    msg: e.message
                });
                return false;
            });

            if (response.data.status) {
                var homeProductLists = response.data;
                resolve(homeProductLists);
            } else {
                appStore.dispatch(appActions.setLoader(false));
                reject(response.data);
            }
        });
    }

    DeleteCreatedParty(data) {
        let userDetails = appStore.getState().app.userDetails;
        if (userDetails == null || Object.keys(userDetails).length == 0)
            return
        let headers = {
            Authorization: 'Bearer ' + userDetails.access_token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        return new Promise(async function (resolve, reject) {
            let response = await axios.post(Apis.DELETE_EVENT, data, {
                headers: headers
            }).catch(e => {
                appStore.dispatch(appActions.setLoader(false));
                ErrorCtrl.showError({
                    msg: e.message
                });
                return false;
            });

            if (response.data.status) {
                var homeProductLists = response.data;
                resolve(homeProductLists);
            } else {
                appStore.dispatch(appActions.setLoader(false));
                reject(response.data);
            }
        });
    }

    getVendorDetail(data) {
        let userDetails = appStore.getState().app.userDetails;
        if (userDetails == null || Object.keys(userDetails).length == 0)
            return
        let headers = {
            Authorization: 'Bearer ' + userDetails.access_token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        return new Promise(async function (resolve, reject) {
            let response = await axios.post(Apis.VENDOR_DETAIL, data, {
                headers: headers
            }).catch(e => {
                appStore.dispatch(appActions.setLoader(false));
                ErrorCtrl.showError({
                    msg: e.message
                });
                return false;
            });

            if (response.data.status) {
                var homeProductLists = response.data;
                resolve(homeProductLists);
            } else {
                appStore.dispatch(appActions.setLoader(false));
                reject(response.data);
            }
        });
    }

    getAllVendorreviews(data) {
        let userDetails = appStore.getState().app.userDetails;
        if (userDetails == null || Object.keys(userDetails).length == 0)
            return
        let headers = {
            Authorization: 'Bearer ' + userDetails.access_token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        return new Promise(async function (resolve, reject) {
            let response = await axios.post(Apis.VENDOR_CUSTOMER_REVIEW, data, {
                headers: headers
            }).catch(e => {
                appStore.dispatch(appActions.setLoader(false));
                ErrorCtrl.showError({
                    msg: e.message
                });
                return false;
            });
            if (response.data.status) {
                var homeProductLists = response.data;
                resolve(homeProductLists);
            } else {
                appStore.dispatch(appActions.setLoader(false));
                reject(response.data);
            }
        });
    }

    getAllCartPartyDetail(data) {
        let userDetails = appStore.getState().app.userDetails;
        if (userDetails == null || Object.keys(userDetails).length == 0)
            return
        let headers = {
            Authorization: 'Bearer ' + userDetails.access_token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        return new Promise(async function (resolve, reject) {
            let response = await axios.post(Apis.VENDOR_CART_GET, data, {
                headers: headers
            }).catch(e => {
                appStore.dispatch(appActions.setLoader(false));
                ErrorCtrl.showError({
                    msg: e.message
                });
                return false;
            });

            if (response.data.status) {
                var homeProductLists = response.data;
                resolve(homeProductLists);
            } else {
                appStore.dispatch(appActions.setLoader(false));
                reject(response.data);
            }
        });
    }

    DeleteMySortListData(data) {
        let userDetails = appStore.getState().app.userDetails;
        if (userDetails == null || Object.keys(userDetails).length == 0)
            return

        let headers = {
            Authorization: 'Bearer ' + userDetails.access_token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        return new Promise(async function (resolve, reject) {
            let response = await axios.post(Apis.VENDOR_CART_REMOVE, data, {
                headers: headers
            }).catch(e => {

                appStore.dispatch(appActions.setLoader(false));
                ErrorCtrl.showError({
                    msg: e.message
                });
                return false;
            });
            if (response.data.status) {
                var homeProductLists = response.data;
                resolve(homeProductLists);
            } else {
                appStore.dispatch(appActions.setLoader(false));
                reject(response.data);
            }
        });
    }

    ConfirmBookingFromSortlist(data) {
        let userDetails = appStore.getState().app.userDetails;
        if (userDetails == null || Object.keys(userDetails).length == 0)
            return

        let headers = {
            Authorization: 'Bearer ' + userDetails.access_token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        return new Promise(async function (resolve, reject) {
            let response = await axios.post(Apis.CONFIRM_BOOKING, data, {
                headers: headers
            }).catch(e => {

                appStore.dispatch(appActions.setLoader(false));
                ErrorCtrl.showError({
                    msg: e.message
                });
                return false;
            });
            if (response.data.status) {
                var homeProductLists = response.data;
                resolve(homeProductLists);
            } else {
                appStore.dispatch(appActions.setLoader(false));
                reject(response.data);
            }
        });
    }

    CAncelBookingAfterSortlist(data) {
        let userDetails = appStore.getState().app.userDetails;
        if (userDetails == null || Object.keys(userDetails).length == 0)
            return

        let headers = {
            Authorization: 'Bearer ' + userDetails.access_token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        return new Promise(async function (resolve, reject) {
            let response = await axios.post(Apis.CANCEL_BOOKING, data, {
                headers: headers
            }).catch(e => {
                appStore.dispatch(appActions.setLoader(false));
                ErrorCtrl.showError({
                    msg: e.message
                });
                return false;
            });
            if (response.data.status) {
                var homeProductLists = response.data;
                resolve(homeProductLists);
            } else {
                appStore.dispatch(appActions.setLoader(false));
                reject(response.data);
            }
        });
    }

    AddtoCartFromVendorPage(data) {
        let userDetails = appStore.getState().app.userDetails;
        if (userDetails == null || Object.keys(userDetails).length == 0)
            return

        let headers = {
            Authorization: 'Bearer ' + userDetails.access_token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        return new Promise(async function (resolve, reject) {
            let response = await axios.post(Apis.VENDOR_CART_ADD, data, {
                headers: headers
            }).catch(e => {
                appStore.dispatch(appActions.setLoader(false));
                ErrorCtrl.showError({
                    msg: e.message
                });
                return false;
            });
            if (response.data.status) {
                var homeProductLists = response.data;
                resolve(homeProductLists);
            } else {
                appStore.dispatch(appActions.setLoader(false));
                reject(response.data);
            }
        });
    }

    PLannedParties() {
        let userDetails = appStore.getState().app.userDetails;
        if (userDetails == null || Object.keys(userDetails).length == 0)
            return

        let headers = {
            Authorization: 'Bearer ' + userDetails.access_token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        return new Promise(async function (resolve, reject) {
            let response = await axios.post(Apis.PLANEED_PARTIES, '', {
                headers: headers
            }).catch(e => {
                appStore.dispatch(appActions.setLoader(false));
                ErrorCtrl.showError({
                    msg: e.message
                });
                return false;
            });
            if (response.data.status) {
                var homeProductLists = response.data;
                resolve(homeProductLists);
            } else {
                appStore.dispatch(appActions.setLoader(false));
                reject(response.data);
            }
        });
    }

    PreviousParties() {
        let userDetails = appStore.getState().app.userDetails;
        if (userDetails == null || Object.keys(userDetails).length == 0)
            return

        let headers = {
            Authorization: 'Bearer ' + userDetails.access_token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        return new Promise(async function (resolve, reject) {
            let response = await axios.post(Apis.PREVIOUS_PARTIES, '', {
                headers: headers
            }).catch(e => {
                appStore.dispatch(appActions.setLoader(false));
                ErrorCtrl.showError({
                    msg: e.message
                });
                return false;
            });
            if (response.data.status) {
                var homeProductLists = response.data;
                resolve(homeProductLists);
            } else {
                appStore.dispatch(appActions.setLoader(false));
                reject(response.data);
            }
        });
    }

    CancelBookingParty(data) {
        let userDetails = appStore.getState().app.userDetails;
        if (userDetails == null || Object.keys(userDetails).length == 0)
            return
        let headers = {
            Authorization: 'Bearer ' + userDetails.access_token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        return new Promise(async function (resolve, reject) {
            let response = await axios.post(Apis.VENDOR_CART_CANCEL_BOOKING, data, {
                headers: headers
            }).catch(e => {
                appStore.dispatch(appActions.setLoader(false));
                ErrorCtrl.showError({
                    msg: e.message
                });
                return false;
            });
            if (response.data.status) {
                var homeProductLists = response.data;
                resolve(homeProductLists);
            } else {
                appStore.dispatch(appActions.setLoader(false));
                reject(response.data);
            }
        });
    }

    LikeUnlikeVendorDetail(data) {
        let userDetails = appStore.getState().app.userDetails;
        if (userDetails == null || Object.keys(userDetails).length == 0)
            return

        let headers = {
            Authorization: 'Bearer ' + userDetails.access_token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        return new Promise(async function (resolve, reject) {
            let response = await axios.post(Apis.VENDOR_FAVLIST_ADD_UPDATE, data, {
                headers: headers
            }).catch(e => {

                appStore.dispatch(appActions.setLoader(false));
                ErrorCtrl.showError({
                    msg: e.message
                });
                return false;
            });
            if (response.data.status) {
                var homeProductLists = response.data;
                resolve(homeProductLists);
            } else {
                appStore.dispatch(appActions.setLoader(false));
                reject(response.data);
            }
        });
    }

    GetAllFavData(data) {
        let userDetails = appStore.getState().app.userDetails;
        if (userDetails == null || Object.keys(userDetails).length == 0)
            return
        let headers = {
            Authorization: 'Bearer ' + userDetails.access_token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        return new Promise(async function (resolve, reject) {
            let response = await axios.post(Apis.MY_FAVORITE_ALL, data, {
                headers: headers
            }).catch(e => {
                appStore.dispatch(appActions.setLoader(false));
                ErrorCtrl.showError({
                    msg: e.message
                });
                return false;
            });
            if (response.data.status) {
                var homeProductLists = response.data;
                resolve(homeProductLists);
            } else {
                appStore.dispatch(appActions.setLoader(false));
                reject(response.data);
            }
        });
    }

    DEletePartyList(data) {
        let userDetails = appStore.getState().app.userDetails;
        if (userDetails == null || Object.keys(userDetails).length == 0)
            return
        let headers = {
            Authorization: 'Bearer ' + userDetails.access_token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        return new Promise(async function (resolve, reject) {
            let response = await axios.post(Apis.DELETE_FAVORITE_ALL, data, {
                headers: headers
            }).catch(e => {
                appStore.dispatch(appActions.setLoader(false));
                ErrorCtrl.showError({
                    msg: e.message
                });
                return false;
            });
            if (response.data.status) {
                var homeProductLists = response.data;
                resolve(homeProductLists);
            } else {
                appStore.dispatch(appActions.setLoader(false));
                reject(response.data);
            }
        });
    }

    getADdToFAvCART(data) {
        let userDetails = appStore.getState().app.userDetails;
        if (userDetails == null || Object.keys(userDetails).length == 0)
            return
        let headers = {
            Authorization: 'Bearer ' + userDetails.access_token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        return new Promise(async function (resolve, reject) {
            let response = await axios.post(Apis.ADD_TO_FAVORITE_ALL, data, {
                headers: headers
            }).catch(e => {
                appStore.dispatch(appActions.setLoader(false));
                ErrorCtrl.showError({
                    msg: e.message
                });
                return false;
            });
            if (response.data.status) {
                var homeProductLists = response.data;
                resolve(homeProductLists);
            } else {
                appStore.dispatch(appActions.setLoader(false));
                reject(response.data);
            }
        });
    }

    NotificationUpdate(data) {
        let userDetails = appStore.getState().app.userDetails;
        if (userDetails == null || Object.keys(userDetails).length == 0)
            return
        let headers = {
            Authorization: 'Bearer ' + userDetails.access_token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        return new Promise(async function (resolve, reject) {
            let response = await axios.post(Apis.NOTFICATION_UPDATE, data, {
                headers: headers
            }).catch(e => {
                appStore.dispatch(appActions.setLoader(false));
                ErrorCtrl.showError({
                    msg: e.message
                });
                return false;
            });
            if (response.data.status) {
                var homeProductLists = response.data;
                resolve(homeProductLists);
            } else {
                appStore.dispatch(appActions.setLoader(false));
                reject(response.data);
            }
        });
    }

    NotificationListNotify(data) {
        let userDetails = appStore.getState().app.userDetails;
        if (userDetails == null || Object.keys(userDetails).length == 0)
            return
        let headers = {
            Authorization: 'Bearer ' + userDetails.access_token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        return new Promise(async function (resolve, reject) {
            let response = await axios.post(Apis.NOTFICATION_GET, data, {
                headers: headers
            }).catch(e => {
                //appStore.dispatch(appActions.setLoader(false));
                ErrorCtrl.showError({
                    msg: e.message
                });
                return false;
            });
            if (response.data.status) {
                var homeProductLists = response.data;
                resolve(homeProductLists);
            } else {
                //appStore.dispatch(appActions.setLoader(false));
                reject(response.data);
            }
        });
    }

    ConfirmPaymentCardDetailSquare(data) {
        let userDetails = appStore.getState().app.userDetails;
        if (userDetails == null || Object.keys(userDetails).length == 0)
            return
        let headers = {
            Authorization: 'Bearer ' + userDetails.access_token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        return new Promise(async function (resolve, reject) {
            let response = await axios.post(Apis.SQUARE_PAYMENT, data, {
                headers: headers
            }).catch(e => {
                appStore.dispatch(appActions.setLoader(false));
                ErrorCtrl.showError({
                    msg: e.message
                });
                return false;
            });
            if (response.data.status) {
                var homeProductLists = response.data;
                resolve(homeProductLists);
            } else {
                appStore.dispatch(appActions.setLoader(false));
                reject(response.data);
            }
        });
    }

    NotificationRead(data) {
        let userDetails = appStore.getState().app.userDetails;
        if (userDetails == null || Object.keys(userDetails).length == 0)
            return
        let headers = {
            Authorization: 'Bearer ' + userDetails.access_token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        return new Promise(async function (resolve, reject) {
            let response = await axios.post(Apis.NOTFICATION_DETAIL, data, {
                headers: headers
            }).catch(e => {
                appStore.dispatch(appActions.setLoader(false));
                ErrorCtrl.showError({
                    msg: e.message
                });
                return false;
            });
            if (response.data.status) {
                var homeProductLists = response.data;
                resolve(homeProductLists);
            } else {
                appStore.dispatch(appActions.setLoader(false));
                reject(response.data);
            }
        });
    }

    AddReviewItem(data) {
        let userDetails = appStore.getState().app.userDetails;
        if (userDetails == null || Object.keys(userDetails).length == 0)
            return
        let headers = {
            Authorization: 'Bearer ' + userDetails.access_token,
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
        };

        return new Promise(async function (resolve, reject) {
            let response = await axios.post(Apis.VENDOR_CUSTOMER_ADD_REVIEW, (data), {
                headers: headers
            }).catch(e => {
                appStore.dispatch(appActions.setLoader(false));
                ErrorCtrl.showError({
                    msg: e.message
                });
                return false;
            });
            if (response.data.status) {
                var homeProductLists = response.data;
                resolve(homeProductLists);
            } else {
                appStore.dispatch(appActions.setLoader(false));
                reject(response.data);
            }
        });
    }
}
export const ProdCtrl = new ProductController();
