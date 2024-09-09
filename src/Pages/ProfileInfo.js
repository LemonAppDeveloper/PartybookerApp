import React, { Component } from 'react';
import {
    View, Text, ScrollView, Alert, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Keyboard, Image,
    Platform, PermissionsAndroid, Linking
} from 'react-native';
import CommonStyles from '../styles/CommonStyles';
import { Colors, fonts } from '../Components/theme';
import { AuthCtrl } from '../Controller/AuthController';
import { connect } from 'react-redux';
import { actions as appActions } from "../AppState/actions/appActions";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { Input } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import { ErrorCtrl } from '../Controller/ErrorController';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

class ProfileInfo extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            fullName: '',
            password: '',
            repeatPassword: '',
            modalVisible: false,
            modalURL: '',
            input: React.createRef(),
            ischeckedTP: false,
            anyDataAdded: true,
            resultData: {},
            profile_image: '',
            profile_image_url: '',
            profile_imagesFileName: '',
            profile_imagesFileName_new: '',
            passingImagee: '',
            passingImagee2: {}
        };
    }

    componentDidMount() {
        this.props.setLoader(false);
        this.getProfileData();
    }

    async getProfileData() {
        this.props.setLoader(true);
        var result = await AuthCtrl.getProfileDetails().catch(obj => {
            this.props.setLoader(false);
            var code = obj.success;

            ErrorCtrl.showError({
                msg: obj.message,
            });
            return false;
        });

        this.props.setLoader(false);
        if (result) {
            this.setState({
                resultData: result.data,
                fullName: result.data.name,
                email: result.data.email,
                profile_image: result.data.profile_image,
                anyDataAdded: true
            })
        } else {
            this.setState({ anyDataAdded: false })
        }
    }

    async validateForm() {
        if (this.state.fullName == '') {
            alert("Please add your Name.")
            return
        }

        if (this.state.fullName.length > 50) {
            alert("Name must not be grater than 50 char")
            return
        }

        if (this.state.email == '') {
            alert("Please add your email.")
            return
        }

        if (this.state.password !== '' && this.state.password !== this.state.repeatPassword) {
            alert("Password doesn't match.")
            return
        }
        this.props.setLoader(true);

        var that = this;
        let body = new FormData();
        body.append('name', this.state.fullName);
        body.append('email', this.state.email);
        body.append('device_type', Platform.OS == "ios" ? '2' : '1');
        body.append('password', this.state.password);
        body.append('repeat_password', this.state.repeatPassword);
        var data = {
            name: this.state.fullName,
            email: this.state.email,
            device_type: Platform.OS == "ios" ? '2' : '1',
            password: this.state.password,
            repeat_password: this.state.repeatPassword
        };

        if (this.state.profile_imagesFileName_new !== '') {
            data.profile_image = this.state.profile_imagesFileName_new;

            body.append('profile_image',
                {
                    uri: Platform.OS === 'android' ? this.state.profile_image : this.state.profile_image.replace('file://', ''),
                    type: ' image/jpeg',
                    name: this.state.profile_image.replace(/^.*[\\\/]/, '')
                });
        }

        var result = await AuthCtrl.updateProfileDetailUSer(body).catch(obj => {
            this.props.setLoader(false);
            var code = obj.success;
            ErrorCtrl.showError({
                msg: obj.message,
            });
            return false;
        });

        this.props.setLoader(false);

        if (result) {
            Alert.alert(
                "",
                result.message,
                [
                    { text: 'OK', onPress: () => { this.props.navigation.goBack() } }
                ],
                { cancelable: false }
            );
        }
    }

    requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs camera permission',
                    },
                );

                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else return true;
    };

    requestExternalWritePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'External Storage Write Permission',
                        message: 'App needs write permission',
                    },
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
            }
            return false;
        } else return true;
    };

    launchCamera = async () => {
        let options = {
            mediaType: 'photo',
            maxWidth: 500,
            maxHeight: 500,
            includeBase64: true
        };
        let isCameraPermitted = this.requestCameraPermission();
        let isStoragePermitted = this.requestExternalWritePermission();
        if (isCameraPermitted && isStoragePermitted) {
            launchCamera(options, response => {
                if (response.didCancel) {
                    alert('User cancelled camera picker');
                    return;
                } else if (response.errorCode == 'camera_unavailable') {
                    alert('Camera not available on device');
                    return;
                } else if (response.errorCode == 'permission') {
                    if (Platform.OS == 'ios') {
                        Linking.openURL('app-settings:');
                    } else {
                        alert('Permission not satisfied');
                    }
                    return;
                } else if (response.errorCode == 'others') {
                    alert(response.errorMessage);
                    return;
                }
                this.setState({
                    profile_image: response.assets[0].uri,
                    profile_imagesFileName: response.assets[0].fileName,
                    profile_imagesFileName_new: { uri: 'data:image/jpeg;base64,' + response.assets[0].base64 },
                });
            });
        }
    };

    launchImageLibrary = () => {
        let options = {
            title: 'You can choose one image',
            maxWidth: 500,
            maxHeight: 500,
            noData: true,
            mediaType: 'photo',
            storageOptions: {
                skipBackup: true,
            },
            selectionLimit: 1,
            includeBase64: true
        };

        launchImageLibrary(options, response => {
            if (response.didCancel) {
                alert('User cancelled camera picker');
                return;
            } else if (response.errorCode == 'camera_unavailable') {
                alert('Camera not available on device');
                return;
            } else if (response.errorCode == 'permission') {
                alert('Permission not satisfied');
                return;
            } else if (response.errorCode == 'others') {
                alert(response.errorMessage);
                return;
            }

            this.setState({
                profile_image: response.assets[0].uri,
                profile_imagesFileName: response.assets[0].fileName,
                profile_imagesFileName_new: { uri: 'data:image/jpeg;base64,' + response.assets[0].base64 },
            });
        });
    };

    render() {
        return (
            <SafeAreaView style={[CommonStyles.container, {
                justifyContent: 'space-between',
                alignItems: "center",
                backgroundColor: 'black',
                height: '100%',
                paddingTop: Platform.OS == "ios" ? 15 : 0,
            }]} >
                <View
                    style={{
                        width: wp('100%'), height: hp('100%'),
                        resizeMode: 'cover',
                        backgroundColor: Colors.white
                    }}>
                    <View style={{
                        height: '10%', flexDirection: 'row',
                        justifyContent: 'flex-start', alignItems: 'center'
                    }}>
                        <TouchableOpacity style={{
                            width: wp('20%'), height: hp('10%'), justifyContent: 'center',
                            alignItems: 'center',
                        }}
                            onPress={() => {
                                this.props.navigation.goBack();
                                if (this.props.route.hasOwnProperty('params') &&
                                    this.props.route.params !== undefined &&
                                    (this.props.route.params.hasOwnProperty('updateText'))) {
                                    this.props.route.params.updateText('profileUpdate');
                                }
                            }
                            }
                        >
                            <Image source={{ uri: 'back' }}
                                style={{
                                    width: 24, height: 24,
                                }} resizeMode='contain' />
                        </TouchableOpacity>
                        <Text style={{
                            width: '70%',
                            textAlign: 'center',
                            color: Colors.black,
                            fontFamily: fonts.fontPoppinsSemiBold,
                            fontSize: 22,
                            justifyContent: 'center',
                            textAlignVertical: 'center'
                        }}>Profile Information</Text>
                    </View>

                    <KeyboardAvoidingView
                        behavior={Platform.OS == "ios" ? "padding" : "height"}
                        style={{
                            height: '90%', width: '100%',
                        }}
                    >
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            keyboardShouldPersistTaps={'handled'}
                            contentContainerStyle={{ paddingBottom: wp(5), flexGrow: 1 }}>
                            <View style={{
                                height: '100%', width: '90%',
                                alignSelf: 'center', paddingTop: 20, paddingBottom: 20,
                                justifyContent: 'space-between'
                            }}>
                                <View style={{
                                    height: '100%',
                                    marginTop: 30
                                }}>
                                    <View style={{
                                        height: 100, width: 100, justifyContent: 'center',
                                        alignItems: 'center', backgroundColor: 'white',
                                        alignSelf: 'center', marginBottom: 20
                                    }}>
                                        <Image
                                            source={{
                                                uri: this.state.profile_image == '' ?
                                                    this.state.resultData.profile_image == '' ? 'profile' :
                                                        this.state.resultData.profile_image : this.state.profile_image
                                            }}
                                            style={{ height: 100, width: 100, borderRadius: 50 }}
                                            resizeMode='cover' />

                                        <TouchableOpacity style={{
                                            height: 100, width: 100, borderRadius: 50, zIndex: 20, position: 'absolute',
                                            backgroundColor: 'rgba(0,0,0,0.4)',
                                            alignItems: 'center', justifyContent: 'center'
                                        }} onPress={() => {
                                            Alert.alert(
                                                'Select a Profile photo',
                                                'Choose galary or camera for take picture',
                                                [
                                                    { text: 'Cancel', onPress: () => { } },
                                                    { text: 'Gallery', onPress: () => this.launchImageLibrary() },
                                                    { text: 'Camera', onPress: () => this.launchCamera() },
                                                ],
                                                { cancelable: true },
                                            );
                                        }}>
                                            <Icon name='camera-outline' size={32} color={Colors.white} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={[CommonStyles.userButtonText_Black, { marginBottom: 10 }]}>Full Name</Text>
                                    <Input
                                        placeholder='Full Name'
                                        ref="nameIn"
                                        rightIcon={
                                            this.state.fullName !== '' && <Icon
                                                name="close-circle"
                                                size={24}
                                                onPress={() => this.setState({ fullName: '' })}
                                                color={Colors.midGray} />
                                        }
                                        containerStyle={CommonStyles.containerStyle_inp}
                                        inputContainerStyle={CommonStyles.inputContainerStyle_inp}
                                        inputStyle={CommonStyles.userButtonInput_Black}
                                        returnKeyType="next"
                                        onSubmitEditing={event => {
                                            this.refs.passwordIn.focus();
                                        }}
                                        blurOnSubmit={false}
                                        autoFocus={false}
                                        autoCorrect={false}
                                        value={this.state.fullName}
                                        onChangeText={(fullName) => this.setState({ fullName })}
                                    />
                                    <View style={{ height: hp(2.5) }} />
                                    <Text style={[CommonStyles.userButtonText_Black, { marginBottom: 10 }]}>Email Address</Text>
                                    <Input
                                        placeholder='Email Address'
                                        containerStyle={CommonStyles.containerStyle_inp}
                                        inputContainerStyle={[CommonStyles.inputContainerStyle_inp, {}]}
                                        inputStyle={CommonStyles.userButtonInput_Black}
                                        returnKeyType="next"
                                        onSubmitEditing={event => {
                                            this.refs.nameIn.focus();
                                        }}
                                        disabled={true}
                                        blurOnSubmit={false}
                                        autoFocus={false}
                                        autoCorrect={false}
                                        value={this.state.email}
                                        onChangeText={(email) => this.setState({ email })}
                                    />
                                    <View style={{ height: hp(2.5) }} />

                                    <Text style={[CommonStyles.userButtonText_Black, { marginBottom: 10 }]}>Password</Text>
                                    <Input
                                        placeholder='Password'
                                        ref="passwordIn"
                                        rightIcon={
                                            this.state.password !== '' && <Icon
                                                name="close-circle"
                                                size={24}
                                                onPress={() => this.setState({ password: '' })}
                                                color={Colors.midGray} />
                                        }
                                        containerStyle={CommonStyles.containerStyle_inp}
                                        inputContainerStyle={CommonStyles.inputContainerStyle_inp}
                                        inputStyle={CommonStyles.userButtonInput_Black}
                                        secureTextEntry={true}
                                        returnKeyType="next"
                                        onSubmitEditing={event => {
                                            this.refs.repeatpasswordIn.focus();
                                        }}
                                        blurOnSubmit={false}
                                        autoFocus={false}
                                        autoCorrect={false}
                                        value={this.state.password}
                                        onChangeText={(password) => this.setState({ password })}
                                    />

                                    <View style={{ height: hp(2.5) }} />
                                    <Text style={[CommonStyles.userButtonText_Black, { marginBottom: 10 }]}>Repeat Password</Text>
                                    <Input
                                        placeholder='Repeat Password'
                                        ref="repeatpasswordIn"
                                        rightIcon={
                                            this.state.repeatPassword !== '' && <Icon
                                                name="close-circle"
                                                size={24}
                                                onPress={() => this.setState({ repeatPassword: '' })}
                                                color={Colors.midGray} />
                                        }
                                        containerStyle={CommonStyles.containerStyle_inp}
                                        inputContainerStyle={CommonStyles.inputContainerStyle_inp}
                                        inputStyle={CommonStyles.userButtonInput_Black}
                                        secureTextEntry={true}
                                        value={this.state.repeatPassword}
                                        onChangeText={(repeatPassword) => this.setState({ repeatPassword })}
                                        returnKeyType="done"
                                        onSubmitEditing={() => Keyboard.dismiss()}
                                    />

                                    <View style={{ height: hp(3) }} />

                                    <View style={{ height: hp(3.5) }} />
                                    {this.state.anyDataAdded ?
                                        <TouchableOpacity
                                            style={{ paddingBottom: 20 }}
                                            onPress={() => this.validateForm()}>
                                            <LinearGradient
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                                colors={['#7111DC', '#F85D47', '#FEAC46']}
                                                style={CommonStyles.userGradButton}
                                            >
                                                <Text style={[CommonStyles.userButtonText]}>Save Changes</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                        :
                                        <View style={{
                                            width: '100%', height: 60, justifyContent: 'center', alignItems: 'center',
                                            padding: 20,
                                            backgroundColor: Colors.borderGray,
                                            borderRadius: 12, marginBottom: 20
                                        }}>
                                            <Text style={[CommonStyles.userButtonText]}>Save Changes</Text>
                                        </View>
                                    }
                                    <View style={{ height: hp(2.5) }} />
                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </SafeAreaView >
        )
    }
};

function mapDispatchToProps(dispatch) {
    return {
        updateAppState: data => dispatch(appActions.updateAppState(data)),
        setLoader: data => dispatch(appActions.setLoader(data)),
        setUserDetails: data => dispatch(appActions.setUserDetails(data)),
    };
}

export default connect(
    null, mapDispatchToProps
)(ProfileInfo);
