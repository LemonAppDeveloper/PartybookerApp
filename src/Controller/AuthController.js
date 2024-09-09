import { appStore } from '../../App';
import { actions as appActions } from '../AppState/actions/appActions';
import Apis, * as CONSTANT from '../util/constant';
import axios from 'axios';

import { appleAuth } from '@invertase/react-native-apple-authentication';

import FBSDK, {
  LoginManager,
  AccessToken,
  GraphRequestManager,
  GraphRequest,
} from 'react-native-fbsdk';
import { ErrorCtrl } from './ErrorController';
import { DeviceEventEmitter, Platform } from 'react-native';

class AuthController {
  constructor() { }

  DoLgout() {
    appStore.dispatch(appActions.setUserDetails(null))

    appStore.dispatch(appActions.updateAppState({
      status: 'auth',
      from: 'signin'
    }));
    appStore.dispatch(appActions.setUserDetails(null));
    appStore.dispatch(appActions.setUserDetails(undefined));
    appStore.dispatch(appActions.resetStore(null));
    appStore.dispatch(appActions.setLoader(false));
  }

  /*
    SIGNUP BY EMAIL
  */
  doEmailSignUp(data) {

    return new Promise(async function (resolve, reject) {

      let res = await axios.post(Apis.REGISTER, data)
        .catch(e => {
          appStore.dispatch(appActions.setLoader(false));
          ErrorCtrl.showError({
            msg: e.message,
          });
          return false;
        });

      if (res.data.status) {
        var result = res.data.data;
        resolve(result);
      } else {
        reject(res.data);
      }
    });
  }

  /*
    DO VERIFY OTP
  */
  verifyOTP(data) {
    data.action = 'verifyOTP';
    return new Promise(async function (resolve, reject) {
      let response = await axios.post(CONSTANT.APP_URL, data).catch(e => {
        appStore.dispatch(appActions.setLoader(false));
        ErrorCtrl.showError({
          msg: e.message,
        });
        return false;
      });
      if (response.data.serverResponse.isSuccess) {
        var result = response.data.result.profileDetails;
        resolve(result);
      } else {
        var message = response.data.serverResponse.message;
        reject(message);
      }
    });
  }

  /*
    RESEND OTP
  */
  resendOTP(data) {
    data.action = 'resendOTP';
    return new Promise(async function (resolve, reject) {
      let response = await axios.post(CONSTANT.APP_URL, data).catch(e => {
        appStore.dispatch(appActions.setLoader(false));
        ErrorCtrl.showError({
          msg: e.message,
        });
        return false;
      });
      if (response.data.serverResponse.isSuccess) {
        var result = response.data.result.profileDetails;
        resolve(result);
      } else {
        var message = response.data.serverResponse.message;
        reject(message);
      }
    });
  }

  /*
    API FOR FORGOT PASSWORD
  */
  forgotPassword(data) {

    return new Promise(async function (resolve, reject) {

      let response = await axios.post(Apis.FORGOT_PASSWORD, data)
        .catch(e => {
          appStore.dispatch(appActions.setLoader(false));
          ErrorCtrl.showError({
            msg: e.message,
          });
          return false;
        });
      if (response.data.status) {
        var result = response.data;
        resolve(result);
      } else {
        reject(response.data);
      }
    });
  }

  /*
    API FOR RESET BPASSSWORD
  */
  doResetPassword(data) {

    let userDetails = appStore.getState().app.userDetails;
    let headers = {
      Authorization: 'Bearer ' + userDetails.access_token,
      "Accept": "application/json",
      "Content-Type": "application/json",
    };
    return new Promise(async function (resolve, reject) {

      let response = await axios.post(Apis.CHANGE_PASSWORD, data)
        .catch(e => {
          appStore.dispatch(appActions.setLoader(false));

          ErrorCtrl.showError({
            msg: e.message,
          });
          return false;
        });

      if (response.data.status) {
        var result = response.data;
        resolve(result);
      } else {
        reject(response.data);
      }
    });
  }

  /*
    MANUAL LOGIN
  */
  doSignIn(data) {

    return new Promise(async function (resolve, reject) {
      let response = await axios.post(Apis.LOGIN, data).catch(e => {
        appStore.dispatch(appActions.setLoader(false));
        ErrorCtrl.showError({
          msg: e.message,
        });
        return false;
      });
      if (response.data.status) {
        var result = response.data.data;
        resolve(result);
      } else {
        reject(response.data);
      }
    });
  }

  // Login Social Media
  doSocialSignIn(data) {

    return new Promise(async function (resolve, reject) {
      let response = await axios.post(Apis.SOCIAL_LOGIN, data).catch(e => {
        appStore.dispatch(appActions.setLoader(false));

        ErrorCtrl.showError({
          msg: e.message,
        });
        return false;
      });
      if (response.data.status) {
        var result = response.data.data;
        resolve(result);
      } else {
        reject(response.data);
      }
    });
  }

  /***
   * LOGIN WITH APPLE
   */
  async doLoginWithApple() {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );
    if (credentialState === appleAuth.State.AUTHORIZED) {
      const { identityToken } = appleAuthRequestResponse;
      if (identityToken) {
        var socialResponse = {};
        socialResponse.email = appleAuthRequestResponse.email;
        socialResponse.id = appleAuthRequestResponse.user;
        socialResponse.fullName =
          appleAuthRequestResponse.fullName.givenName +
          ' ' +
          appleAuthRequestResponse.fullName.familyName;
        appStore.dispatch(appActions.setLoader(true));
        var loginData = await this.doLoginWithSocial(
          'appleLogin',
          socialResponse,
        ).catch(obj => {
          appStore.dispatch(appActions.setLoader(false));
          ErrorCtrl.showError({
            msg: obj.serverResponse.message,
          });
          return false;
        });
        if (loginData) {
          DeviceEventEmitter.emit('loginSuccess', {
            loginData,
          });
        }
      }
    }
  }

  /***
   * LOGIN WITH FACEBOOK
   */
  doLoginWithFacebook() {
    var that = this;
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      function (result) {

        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          that.getPublicData();
        }
      },
      function (error) {
        console.log(error);
      },
    );
  }

  /*
    GET PUBLIC DATA FROM FACEBOOK AFTER LOGIN
  */
  getPublicData() {
    var that = this;
    AccessToken.getCurrentAccessToken().then(data => {
      let accessToken = data.accessToken;

      const responseInfoCallback = async (error, result) => {
        if (error) {
          console.log(error);
        } else {
          var socialResponse = {};
          socialResponse.email = result.email;
          socialResponse.provider_id = result.id;
          socialResponse.name = result.name;
          socialResponse.provider = "facebook";
          appStore.dispatch(appActions.setLoader(true));
          var loginData = await this.doLoginWithSocial(
            socialResponse,
          ).catch(obj => {
            appStore.dispatch(appActions.setLoader(false));
            ErrorCtrl.showError({
              msg: obj.serverResponse.message,
            });
            return false;
          });
          if (loginData) {
            appStore.dispatch(appActions.setUserDetails(loginData));
            let data = { status: 'app' }
            DeviceEventEmitter.emit('loginSuccess', {
              loginData,
            });
            appStore.dispatch(appActions.updateAppState(data))
          }
        }
      };

      const infoRequest = new GraphRequest(
        '/me',
        {
          access_token: {
            string: accessToken,
          },
          parameters: {
            fields: {
              string: 'id,name,email,first_name,last_name,picture',
            },
          },
        },
        responseInfoCallback,
      );

      // Start the graph request.
      new GraphRequestManager().addRequest(infoRequest).start();
    });
  }

  /*
    LOGIN WITH SOCIAL 
  */
  doLoginWithSocial(socialResponse) {
    var data = {
      name: socialResponse.name,
      email: socialResponse.email,
      provider_id: socialResponse.provider_id,
      provider: socialResponse.provider,
      device_type: Platform.OS == "ios" ? '2' : '1',
      role: '3'
    };
    return new Promise(async function (resolve, reject) {
      let response = await axios.post(Apis.SOCIAL_LOGIN, data).catch(e => {
        appStore.dispatch(appActions.setLoader(false));
        ErrorCtrl.showError({
          msg: e.message,
        });
        return false;
      });
      if (response.data.status) {
        var result = response.data.data;
        resolve(result);
      } else {
        reject(response.data);
      }
    });
  }


  getProfileDetails() {

    let userDetails = appStore.getState().app.userDetails;
    let headers = {
      Authorization: 'Bearer ' + userDetails.access_token,
      "Accept": "application/json",
      "Content-Type": "application/json",
    };
    return new Promise(async function (resolve, reject) {

      let response = await axios.get(Apis.GET_PROFILE, { headers: headers })
        .catch(e => {
          appStore.dispatch(appActions.setLoader(false));
          ErrorCtrl.showError({
            msg: e.message,
          });
          return false;
        });
      if (response.data.status) {
        var result = response.data;
        resolve(result);
      } else {
        reject(response.data);
      }
    });
  }

  updateProfileDetailUSer(data) {

    let userDetails = appStore.getState().app.userDetails;
    let headers = {
      Authorization: 'Bearer ' + userDetails.access_token,
      "Accept": "application/json",
      'Content-Type': 'multipart/form-data'
    };

    return new Promise(async function (resolve, reject) {

      let response = await axios.post(Apis.UPDATE_PROFILE, data, { headers: headers })
        .catch(e => {
          appStore.dispatch(appActions.setLoader(false));
          ErrorCtrl.showError({
            msg: e.message,
          });
          return false;
        });
      if (response.data.status) {
        var result = response.data;
        resolve(result);
      } else {
        reject(response.data);
      }
    });
  }

  AddTOKENToAPI(data) {

    let userDetails = appStore.getState().app.userDetails;

    let headers = {
      Authorization: 'Bearer ' + userDetails.access_token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    return new Promise(async function (resolve, reject) {
      let response = await axios.post(Apis.UPDATE_NOTFICATION_UPDATE, data, {
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

export const AuthCtrl = new AuthController();
