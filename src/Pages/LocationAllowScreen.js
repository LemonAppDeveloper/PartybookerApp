import React, { Component } from 'react';
import {
    View, Text, ImageBackground, Image, Platform, TouchableOpacity, PermissionsAndroid, NativeModules, BackHandler
} from 'react-native';
import CommonStyles from '../styles/CommonStyles';
import { Colors, fonts } from '../Components/theme';
import { connect } from 'react-redux';
import { actions as appActions } from "../AppState/actions/appActions";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS } from 'react-native-permissions'
import { authentication } from '../Components/Firebase_config';
import { firebase, signiInwithPopup } from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNAndroidLocationEnabler, { isLocationEnabled, promptForEnableLocationIfNeeded }
    from 'react-native-android-location-enabler';
import { appStore } from "../../App";

const { RNTwitterSignIn } = NativeModules;
class LocationAllowScreen extends Component {
    constructor(props) {
        super(props);
        (this.state = {
            latitude: '',
            longitude: '',
            TwitterApiKey: 'IXgYohzcLxmmzFBPC5euzXzBs',
            TwitterSecretKey: 'BR4D8pkdCrWeZsw29v4AdFIjyL63mM0DGZStvrhhqA4db2qi3i',
        })
    }

    _newTwitlogin = () => {
        RNTwitterSignIn.init(this.state.TwitterApiKey, this.state.TwitterSecretKey)
        RNTwitterSignIn.logIn()
            .then(function (loginData) {
                var accessToken = firebase.auth
                    .TwitterAuthProvider
                    .credential(
                        loginData.authToken,
                        loginData.authTokenSecret
                    );

                firebase.auth()
                    .signInAndRetrieveDataWithCredential(accessToken)
                    .then(function (data) {
                        var user = firebase.auth().currentUser;
                    })
                    .catch(function (error) {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        var email = error.email;
                        var credential = error.credential;

                        if (errorCode === 'auth/account-exists-with-different-credential') {
                            // Email already associated with another account.
                        }
                    })
            }).catch(function (error) {
                console.log("Error first function: ", error);
            })
    }

    signInWithTwitter = () => {
        var prov = firebase.auth.TwitterAuthProvider();
        const provider = firebase.auth.TwitterAuthProvider();
        signiInwithPopup(authentication, firebase.auth.TwitterAuthProvider())
            .then((res) => {
                console.log(res);
            }).catch((err) => {
                console.log(err)
            });
        var accessToken = firebase.auth
            .TwitterAuthProvider
            .credential(
                this.state.TwitterApiKey,
                this.state.TwitterSecretKey
            );
    }

    componentDidMount() {
        console.log("LOADER STAE : ", appStore.getState().app.showloader)
    }

    async componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    async componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton = async () => {
        // BackHandler.exitApp();
        this.props.navigation.goBack()
    };

    getLocation() {
        if (Platform.OS === 'android') {
            this.requestLocationPermissions()
        } else {
            try {
                const locatonPermisionRequest = request(PERMISSIONS.IOS.LOCATION_ALWAYS);
                if (locatonPermisionRequest == 'blocked') {
                    console.log("for IOS Blocked");
                } else {
                    console.log("for IOS")
                    this.props.setLoader(true);
                    this.getOneTimeLocation();
                }
            } catch (error) {
                console.log("error First 113..");
                console.log(error);
                this.props.setLoader(false);
            }
        }
    }

    async requestLocationPermissions() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Location Permission',
                    'message': 'PartyBookr needs access to your location',
                    buttonPositive: 'YES'
                }
            )

            console.log("GRANTEDD : ", granted);
            console.log("GRANTEDD : ", PermissionsAndroid.RESULTS);
            console.log("GRANTEDD : ", granted == PermissionsAndroid.RESULTS.DENIED);
            console.log("GRANTEDD : ", granted == PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN);
            console.log("GRANTEDD : ", granted == PermissionsAndroid.RESULTS.GRANTED);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                this.props.setLoader(true);
                const checkEnabled = await isLocationEnabled();
                if (checkEnabled) {
                    this._getCurrentLocation()
                } else {
                    this.enableGPS();
                }
                console.log("Location permission granted")
            } else {
                console.log("Location permission denied")
                console.log("Ask Enble Location On Device")
                const checkEnabled = await isLocationEnabled();
                console.log('checkEnabled 138 ', checkEnabled)
                if (checkEnabled) {
                    console.log('checkEnabled Called Again 139 : ', checkEnabled)
                    this.props.setLoader(false);
                    // this._getCurrentLocation();
                    // move to new screen
                    AsyncStorage.setItem('LatLongAdded', 'no')
                    var that = this;
                    this.props.setLoader(false);
                    let data = { status: 'auth' }
                    that.props.updateAppState(data);
                } else { this.enableGPS() }
            }
        } catch (err) {
            console.warn(err)
        }
    }

    _getCurrentLocation = () => {
        console.log("163")
        Geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Log latitude and longitude
                console.log("Latitude: ", latitude);
                console.log("Longitude: ", longitude);

                this.setState({
                    latitude: latitude,
                    longitude: longitude,
                });
                this.props.setLoader(false);
                AsyncStorage.setItem('LatLongAdded', 'yes')
                var that = this;
                this.props.setLoader(false);
                let data = { status: 'auth' }
                that.props.updateAppState(data);
            },
            (error) => {
                this.setState({ error: error.message })
            },
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
        );
    }

    requestLocationPermission = async () => {
        try {
            const locatonPermisionRequest = await Platform.OS == "ios" ? request : PermissionsAndroid.request(
                Platform.OS == "ios"
                    ? PERMISSIONS.IOS.LOCATION_ALWAYS
                    : PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );

            console.log("LocationPermission2 : ", (locatonPermisionRequest === PermissionsAndroid.RESULTS.GRANTED))
            if (locatonPermisionRequest == 'blocked') {
                console.log("Blockeddd")
            } else {
                console.log("else not Blockeddd")

                if (Platform.OS === 'android' && (locatonPermisionRequest !== PermissionsAndroid.RESULTS.GRANTED)) {
                    const checkEnabled = await isLocationEnabled();
                    console.log('checkEnabled', checkEnabled)
                    if (checkEnabled) {
                        console.log('checkEnabled Called Again : ', checkEnabled)
                        this.props.setLoader(true);
                        this.getOneTimeLocation();
                    } else { this.enableGPS() }
                }
                else {
                    this.props.setLoader(true);
                    this.getOneTimeLocation();
                }
            }
        } catch (error) {
            console.log("error First..");
            console.log(error);
            this.props.setLoader(false);
        } finally {
            // this.props.setLoader(false);
        }
    };

    getOneTimeLocation = () => {
        console.log("LOADER STAE 3rd: ", appStore.getState().app.showloader)

        Geolocation.getCurrentPosition(
            position => {
                console.log("IS IT")
                console.log("IS IT : ", position)
                console.log("LOADER STAE 2nd: ", appStore.getState().app.showloader)
                const currentLongitude = JSON.stringify(position.coords.longitude);
                const currentLatitude = JSON.stringify(position.coords.latitude);

                this.setState({
                    latitude: currentLatitude,
                    longitude: currentLongitude,
                });

                AsyncStorage.setItem('LatLongAdded', 'yes')
                var that = this;
                this.props.setLoader(false);
                let data = { status: 'auth' }
                that.props.updateAppState(data);
            },
            error => {
                this.props.setLoader(false);
                console.log("Error Location : ", error)
                this.enableGPS()
            },
            {
                // enableHighAccuracy: true,
                // timeout: 30000,
                // enableHighAccuracy: false,
                // // maximumAge: 1000,
                // showLocationDialog: true,
            },
        );
    };

    enableGPS = async () => {
        this.props.setLoader(true);
        if (Platform.OS === 'android') {
            try {
                const enableResult = await promptForEnableLocationIfNeeded();
                console.log('enableResult', enableResult);
                // this.getOneTimeLocation();
                this.props.setLoader(false);
                this._getCurrentLocation()
                // The user has accepted to enable the location services
                // data can be :
                //  - "already-enabled" if the location services has been already enabled
                //  - "enabled" if user has clicked on OK button in the popup
            } catch (error) {
                this.props.setLoader(false);
                if (error instanceof Error) {
                    console.log(error.message);
                    // The user has not accepted to enable the location services or something went wrong during the process
                    // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
                    // codes :
                    //  - ERR00 : The user has clicked on Cancel button in the popup
                    //  - ERR01 : If the Settings change are unavailable
                    //  - ERR02 : If the popup has failed to open
                    //  - ERR03 : Internal error
                }
            }
        }

    };
    render() {
        return (
            <View style={[CommonStyles.container, {
                justifyContent: 'space-between',
                alignItems: "center",
                backgroundColor: 'black',
                height: '100%'
            }]} >
                <ImageBackground source={{ uri: 'back_bg' }}
                    style={{
                        width: wp('100%'), height: hp('100%'),
                        resizeMode: 'cover',
                    }}>

                    <Image source={{ uri: 'top2' }}
                        style={{
                            width: wp('40%'), height: hp('40%'),
                            resizeMode: 'contain',
                            position: 'absolute',
                            top: -20,
                            left: 0
                        }} />
                    <Image source={{ uri: 'bottom_ri' }}
                        style={{
                            width: wp('50%'), height: hp('50%'),
                            resizeMode: 'cover',
                            position: 'absolute',
                            bottom: -20,
                            right: 0
                        }} />

                    {/*  */}
                    <View style={{
                        height: hp('15%'), width: wp('100%'),
                        alignSelf: 'flex-end',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        padding: 15
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                var that = this;
                                let data = {
                                    status: 'auth'
                                }
                                that.props.updateAppState(data);
                            }} style={{ padding: 10 }}>
                            <Text style={{
                                fontFamily: fonts.fontPoppinsRegular,
                                fontSize: 18,
                                color: Colors.white
                            }}>Skip</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        height: hp('60%'), width: wp('100%'),
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        padding: 15,
                        marginTop: 20
                    }}>
                        <TouchableOpacity>
                            <Text style={{
                                fontFamily: fonts.fontPoppinsBold,
                                fontSize: 40,
                                color: Colors.white,
                                letterSpacing: 1.2
                            }}>Let's plan{"\n"}your event.</Text>
                            <Text style={{
                                fontFamily: fonts.fontPoppinsRegular,
                                fontSize: 16,
                                fontWeight: '500',
                                color: Colors.offWhite,
                                marginTop: 15
                            }}>Find everything you need{"\n"}for an awesome event.</Text>
                        </TouchableOpacity>
                        <View style={{ width: '100%', alignSelf: 'center' }}>
                            <TouchableOpacity style={{
                                borderColor: Colors.midGray,
                                borderRadius: 12,
                                borderWidth: 1.5,
                                height: 60,
                                justifyContent: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }}
                                onPress={() => {
                                    // this.requestLocationPermission();
                                    this.getLocation();
                                }}>
                                <Text style={{
                                    fontFamily: fonts.fontPoppinsRegular,
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: Colors.white,
                                    textAlign: 'center'
                                }}>Allow location</Text>
                            </TouchableOpacity>
                            <Text style={{
                                fontFamily: fonts.fontPoppinsRegular,
                                fontSize: 14,
                                fontWeight: '400',
                                color: Colors.lightGray,
                                marginTop: 15,
                                padding: 10,
                                textAlign: 'center'
                            }}>By granting access to your location, we can narrow down vendors available to you.</Text>
                        </View>
                    </View>
                </ImageBackground>
            </View >
        )
    }
};


function mapDispatchToProps(dispatch) {
    return {
        updateAppState: (data) => dispatch(appActions.updateAppState(data)),
        setUserDetails: (data) => dispatch(appActions.setUserDetails(data)),
        setLoader: data => dispatch(appActions.setLoader(data)),
    }
}


function mapStateToProps(state) {
    return {
        userDetails: state.app.userDetails
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LocationAllowScreen);


