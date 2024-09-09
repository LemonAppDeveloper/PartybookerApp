import React, { Component } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, BackHandler, KeyboardAvoidingView, Keyboard,
    ImageBackground, Image, Platform, Alert, NativeModules
} from 'react-native';
import CommonStyles from '../styles/CommonStyles';
import { Colors, fonts } from '../Components/theme';
import { AuthCtrl } from '../Controller/AuthController';
import { connect } from 'react-redux';
import { actions as appActions } from "../AppState/actions/appActions";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ErrorCtrl } from '../Controller/ErrorController';
import {
    LoginManager,
    AccessToken,
} from 'react-native-fbsdk';
import auth, { firebase } from '@react-native-firebase/auth';
import {
    GoogleSignin,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { RNTwitterSignIn } = NativeModules;

class SignINScreen extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            FirstName: '',
            LastName: '',
            uid: '',
            userPicture: '',
            userNamee: '',
            modalVisible: false,
            modalURL: '',
            chooseToSHow: '1',
            emailOrMobile: '',
            placeHolder1: 'Enter Email',
            wrongEmail: '0',
            wrongPassword: '0',
            isRememberMe: false,
            login_type: 'facebook',
            TwitterApiKey: 'IXgYohzcLxmmzFBPC5euzXzBs',
            TwitterSecretKey: 'BR4D8pkdCrWeZsw29v4AdFIjyL63mM0DGZStvrhhqA4db2qi3i',
            isPasswordVisible: false,
        };
    }

    componentDidMount() {
        this.props.setLoader(false);
        setTimeout(() => {
            this.props.setLoader(false);
        }, 1000);
        var that = this;
        AsyncStorage.getItem('Logout').then(value => {
            if (value == null || value == 'yes')
                that.props.setUserDetails(null);
        })

        AsyncStorage.getItem('EmailSaved').then(value => {
            if (value !== null)
                this.setState({ email: value });
        })
        AsyncStorage.getItem('PassSaved').then(value => {
            if (value !== null)
                this.setState({ password: value });
        })
        AsyncStorage.getItem('RemmeberMe').then(value => {
            if (value !== null && value == 'yes')
                this.setState({ isRememberMe: true });
            else this.setState({ isRememberMe: false });
        })

        if (this.props.userDetails !== undefined && Object.keys(this.props.userDetails).length !== 0) {
            console.log("Go to APPSTACK SIGNINNN: ", "1");
        } else {
            console.log("GOING TO DATA STACK SIGNINNN: ", "2");
        }
        this.props.setLoader(false);
    }

    async componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    async componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton = async () => {
        BackHandler.exitApp();
    };

    validate(text) {
        const regexp =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regexp.test(text);
    }

    async validateForm() {
        let one, two;
        if (!this.validate(this.state.email)) {
            this.setState({ wrongEmail: '1' })
            one = false;
        } else this.setState({ wrongEmail: '0' })
        if (this.state.password == '' || this.state.password.length < 8) {
            this.setState({ wrongPassword: '1' })
            two = false
        } else this.setState({ wrongPassword: '0' })

        if (one == false || two == false) return

        if (this.state.isRememberMe) {
            AsyncStorage.setItem('EmailSaved', this.state.email);
            AsyncStorage.setItem('PassSaved', this.state.password);
            AsyncStorage.setItem('RemmeberMe', 'yes');
        }

        this.props.setLoader(true);
        var that = this;
        var data = {
            email: this.state.email,
            password: this.state.password,
            device_type: Platform.OS == "ios" ? '2' : '1'
        };
        var result = await AuthCtrl.doSignIn(data).catch(obj => {
            this.props.setLoader(false);
            var code = obj.success;

            ErrorCtrl.showError({
                msg: obj.message,
            });
            return false;
        });

        this.setState({ wrongEmail: '2', wrongPassword: '2' })
        this.props.setLoader(false);

        if (result) {
            var that = this;
            this.setState({ wrongEmail: '0', wrongPassword: '0' })
            AsyncStorage.setItem('Logout', 'no');
            this.props.SetSelectionTYpeOFUSer('normal');
            that.props.setUserDetails(result);
            let data = { status: 'app' }
            this.props.setLoader(false);
            that.props.updateAppState(data);
        }
    }

    onSelectSwitch(index) {
        this.setState({ chooseToSHow: index })
        if (index == 1) {
            this.setState({ placeHolder1: 'Enter Email' })
        } else
            this.setState({ placeHolder1: 'Mobile Number' })
    }

    // FB
    fbAuth() {
        LoginManager.logInWithPermissions(['public_profile', 'email']).then(
            result => {
                if (result.isCancelled) {
                    console.log('Login was cancelled');
                } else {
                    AccessToken.getCurrentAccessToken().then(data => {
                        const { accessToken } = data;

                        const facebookCredential = auth.FacebookAuthProvider.credential(
                            data.accessToken,
                        );

                        auth()
                            .signInWithCredential(facebookCredential)
                            .then(user => {
                                console.log('ResponseFB', user);

                                this.setState({
                                    uid: user.user.uid,
                                    FirstName: user.additionalUserInfo.profile.first_name,
                                    LastName: user.additionalUserInfo.profile.last_name,
                                    email: user.additionalUserInfo.profile.email,

                                });
                                this.callLoginAPI('facebook');
                            })
                            .catch(e => {
                                Alert.alert(' ', e);
                            });
                    });
                }
            },
            function (error) {
                console.log('Login failed with error: ' + error);
            },
        );
    }

    async callLoginAPI(typee) {
        this.props.setLoader(true);
        var that = this;
        var data = {
            device_type: Platform.OS == "ios" ? '2' : '1',
            name: this.state.userNamee,
            email: this.state.email,
            role: '3',
            provider: typee,
            provider_id: this.state.uid,
        };
        var result = await AuthCtrl.doSocialSignIn(data).catch(obj => {
            this.props.setLoader(false);
            var code = obj.success;

            ErrorCtrl.showError({
                msg: obj.message,
            });
            return false;
        });

        this.setState({ wrongEmail: '2', wrongPassword: '2' })
        this.props.setLoader(false);

        if (result) {
            this.setState({ wrongEmail: '0', wrongPassword: '0' })
            AsyncStorage.setItem('Logout', 'no');
            that.props.setUserDetails(result);
            let data = { status: 'app' }
            that.props.updateAppState(data);
        }
    }

    async GoogleoonfigCall() {
        GoogleSignin.configure({
            androidClientId: '917731395508-lgd48vdvvh6v6corbodcocnkms014g3a.apps.googleusercontent.com',
            iosClientId: '917731395508-0s715a76999smvi6ro7i4pa00oca3rh3.apps.googleusercontent.com',
            offlineAccess: false,
            webClientId: '917731395508-lgd48vdvvh6v6corbodcocnkms014g3a.apps.googleusercontent.com'
        });
        GoogleSignin.hasPlayServices().then((hasPlayService) => {
            if (hasPlayService) {
                GoogleSignin.signIn().then((userInfo) => {
                    this.setState({
                        uid: userInfo.user.id,
                        FirstName: userInfo.user.givenname,
                        LastName: userInfo.user.familyname,
                        email: userInfo.user.email,
                        userPicture: userInfo.user.photo,
                        userNamee: userInfo.user.name,
                    });
                    this.callLoginAPI('google');
                }).catch((e) => {
                    console.log("ERROR IS: " + JSON.stringify(e));
                })
            }
        }).catch((e) => {
            console.log("ERROR IS: " + JSON.stringify(e));
        })
    }

    async twitterLoginClicked() {
        RNTwitterSignin.init(this.state.TwitterApiKey, this.state.TwitterSecretKey)
        RNTwitterSignin.logIn()
            .then(loginData => {
                console.log("LoginData", loginData);
            }).catch(error => {
                console.log("error", error)
            })
    }

    togglePasswordVisibility = () => {
        this.setState({ isPasswordVisible: !this.state.isPasswordVisible });
    };

    render() {
        const { isPasswordVisible, wrongPassword } = this.state;
        const inputContainerStyle = [
            styles.inputContainer,
            wrongPassword == '0' ? styles.inputContainerDefault : styles.inputContainerError,
        ];

        return (
            <View style={{
                justifyContent: 'space-between',
                alignItems: "center",
                height: '100%',
                width: '100%',
            }} >
                <ImageBackground source={{ uri: 'back2' }}
                    style={{
                        width: wp('100%'), height: hp('100%'),
                    }}>

                    <KeyboardAvoidingView
                        behavior={Platform.OS == "ios" ? "padding" : "height"}
                        style={{
                            height: '100%', width: '100%',
                        }}
                    >
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            keyboardShouldPersistTaps={'handled'}
                            contentContainerStyle={{ paddingBottom: wp(5), flexGrow: 1 }}>
                            <View style={{
                                height: '100%', width: '100%',
                                alignSelf: 'center',
                                justifyContent: 'space-between',
                                padding: 20
                            }}>
                                <View style={{ height: '10%' }}></View>
                                <View style={{ height: '90%', width: '100%', }}>
                                    <Text style={{
                                        fontFamily: fonts.fontPoppinsBold,
                                        fontSize: 40,
                                        color: Colors.white,
                                        letterSpacing: 1.2,
                                        paddingLeft: 10
                                    }}>Register or{"\n"}Sign In.</Text>
                                    <View style={{ height: hp(2.5) }} />
                                    <View style={{
                                        width: '100%',
                                        flexDirection: 'row',
                                        justifyContent: 'center', alignItems: 'center',
                                    }}>
                                        <TouchableOpacity style={{
                                            width: wp('24%'), height: hp('10%'),
                                            alignItems: 'center', justifyContent: 'center',
                                        }} onPress={() => {
                                            this.props.SetSelectionTYpeOFUSer('google');
                                            this.GoogleoonfigCall()
                                        }}>
                                            <Image source={{ uri: 'gmail_' }}
                                                style={{ width: 60, height: 60, }} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ height: hp(2.5) }} />
                                    <Text style={{
                                        fontFamily: fonts.fontPoppinsRegular,
                                        fontSize: 16,
                                        fontWeight: '500',
                                        color: Colors.white,
                                        textAlign: 'center',
                                    }}>or</Text>
                                    <View style={{ height: hp(1.5) }} />
                                    <View style={{ height: hp(1.5) }} />
                                    <View style={{}}>
                                        <TextInput
                                            placeholder={this.state.placeHolder1}
                                            style={this.state.wrongEmail == '0' ?
                                                CommonStyles.userInput : CommonStyles.userInputError}
                                            placeholderTextColor={Colors.white}
                                            paddingHorizontal={15}
                                            underlineColorAndroid="transparent"
                                            value={this.state.email}
                                            autoCapitalize="none"
                                            returnKeyType={"next"}
                                            keyboardType={'email-address'}
                                            onChangeText={text => {
                                                this.setState({
                                                    email: text,
                                                });
                                            }}
                                            blurOnSubmit={false}
                                            autoFocus={false}
                                            autoCorrect={false}
                                            onSubmitEditing={event => {
                                                this.refs.passwordInput.focus();
                                            }}
                                        />
                                        {this.state.wrongEmail == '1' ?
                                            <Text style={[CommonStyles.txt2, { color: Colors.white, marginTop: 7 }]}>
                                                Email address must only contain the following characters "@ . _"</Text> :
                                            this.state.wrongEmail == '2' ?
                                                <Text style={[CommonStyles.txt2, { color: Colors.white, marginTop: 7 }]}>
                                                    Email Address not found</Text> : null}
                                        <View style={{ height: hp(2.5) }} />
                                        <View style={inputContainerStyle}>
                                            <TextInput
                                                placeholder="Enter Password"
                                                style={this.state.wrongPassword == '0' ?
                                                    styles.userInput : styles.userInputError}
                                                placeholderTextColor={Colors.white}
                                                paddingHorizontal={15}
                                                underlineColorAndroid="transparent"
                                                secureTextEntry={!isPasswordVisible}
                                                returnKeyType={"done"}
                                                ref="passwordInput"
                                                blurOnSubmit={false}
                                                autoFocus={false}
                                                autoCorrect={false}
                                                value={this.state.password}
                                                onChangeText={text => {
                                                    this.setState({
                                                        password: text,
                                                    });
                                                }}
                                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                            />
                                            <TouchableOpacity onPress={this.togglePasswordVisibility} style={styles.icon}>
                                                <Icon name={isPasswordVisible ? 'visibility' : 'visibility-off'} size={24}
                                                    color="white" />
                                            </TouchableOpacity>
                                        </View>

                                        {this.state.wrongPassword == '1' ?
                                            <Text style={[CommonStyles.txt2, { color: Colors.white, marginTop: 7 }]}>
                                                Password must be at least 8 characters long</Text> :
                                            this.state.wrongPassword == '2' ?
                                                <Text style={[CommonStyles.txt2, { color: Colors.white, marginTop: 7 }]}>
                                                    Password does not match</Text> : null}
                                        <View style={{ height: hp(1.5) }} />
                                        <View style={{
                                            width: '100%', justifyContent: 'center', flexDirection: 'row', alignContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <TouchableOpacity style={{
                                                width: '50%',
                                                justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center',
                                            }}
                                                onPress={() => { this.setState({ isRememberMe: !this.state.isRememberMe }) }}>
                                                <Ionicons name={this.state.isRememberMe ?
                                                    'checkmark-circle' : 'checkmark-circle-outline'}
                                                    color={this.state.isRememberMe ? Colors.success : Colors.midGray} size={24} />
                                                <Text style={{
                                                    color: Colors.offWhite,
                                                    fontWeight: '300', marginLeft: 5, fontFamily: fonts.fontPoppinsThin,
                                                    fontSize: 14,
                                                }}>Remember me</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ width: '50%', alignItems: 'flex-end' }}
                                                onPress={() => {
                                                    this.props.navigation.navigate('ForgotPassword1');
                                                }}>
                                                <Text style={{
                                                    color: Colors.offWhite,
                                                    fontWeight: '300',
                                                    fontFamily: fonts.fontPoppinsThin,
                                                    fontSize: 14
                                                }}>Forgot Password?</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ height: hp(1.5) }} />
                                        <TouchableOpacity
                                            onPress={() => this.validateForm()}>
                                            <LinearGradient
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                                colors={['#7111DC', '#F85D47', '#FEAC46']}
                                                style={CommonStyles.userGradButton}
                                            >
                                                <Text style={[CommonStyles.userButtonText]}>Sign In</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>

                                        <View style={{ height: hp(2.5) }} />

                                        <View style={{
                                            flexDirection: 'row', justifyContent: 'center',
                                            alignItems: 'center'
                                        }} >
                                            <Text style={{
                                                color: Colors.offWhite,
                                                fontWeight: '300',
                                                fontFamily: fonts.fontPoppinsRegular,
                                                fontSize: 14,
                                            }}>Not yet registered?</Text>
                                            <TouchableOpacity onPress={() => this.props.navigation.push('signup')}>
                                                <Text style={[CommonStyles.userButtonText, {
                                                    textDecorationLine: 'underline', marginLeft: 10
                                                }]}>Sign up here</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </ImageBackground>
            </ View >
        )
    }
};

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: Colors.midGray,
        height: hp(7.5),
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    inputContainerDefault: {
        borderColor: Colors.midGray,
    },
    inputContainerError: {
        borderColor: Colors.danger,
    },
    userInput: {
        flex: 1,
        fontFamily: fonts.fontPoppinsRegular,
        color: Colors.white,
        paddingTop: Platform.OS === "ios" ? 0 : 15,
        fontSize: wp(4),
    },
    userInputError: {
        flex: 1,
        fontFamily: fonts.fontPoppinsRegular,
        color: Colors.white,
        paddingTop: Platform.OS === "ios" ? 0 : 15,
        fontSize: wp(4),
        borderColor: Colors.danger,
    },
    icon: {
        padding: 10,
    },
});


function mapDispatchToProps(dispatch) {
    return {
        updateAppState: data => dispatch(appActions.updateAppState(data)),
        setLoader: data => dispatch(appActions.setLoader(data)),
        setUserDetails: data => dispatch(appActions.setUserDetails(data)),
        SetSelectionTYpeOFUSer: data => dispatch(appActions.SetSelectionTYpeOFUSer(data)),
    };
}

export default connect(
    null, mapDispatchToProps
)(SignINScreen);
