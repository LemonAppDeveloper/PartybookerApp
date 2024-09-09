import React, { Component } from 'react';
import {
    View, Text, ScrollView, SafeAreaView, KeyboardAvoidingView, Keyboard, Image, Platform, Alert
} from 'react-native';
import CommonStyles from '../styles/CommonStyles';
import { Colors, fonts } from '../Components/theme';
import { AuthCtrl } from '../Controller/AuthController';
import { connect } from 'react-redux';
import { actions as appActions } from "../AppState/actions/appActions";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Input } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import { ErrorCtrl } from '../Controller/ErrorController';


class ChangePassword extends Component {
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
            oldPasswod: '',
            newPassword: '',
            confPassword: '',
        };
    }

    componentDidMount() {
        this.props.setLoader(false);
    }

    async validateForm() {
        if (this.state.newPassword == this.state.oldPasswod) {
            alert("Old Password and New password can not be the same.")
            return
        }
        if (this.state.oldPasswod == '' || this.state.oldPasswod.length < 8) {
            alert("Please add valid Password with length of min 8 char.")
            return
        }
        if (this.state.newPassword == '' || this.state.newPassword.length < 8) {
            alert("Please add valid Password with length of min 8 char.")
            return
        }
        if (this.state.newPassword == this.state.confPassword) {
            alert("Passwords doesn't match.")
            return
        }
        this.props.setLoader(true);

        var data = {
            current_password: this.state.oldPasswod,
            password: this.state.newPassword,
            password_confirmation: this.state.confPassword,
            device_type: Platform.OS == "ios" ? '2' : '1',

        };
        var result = await AuthCtrl.doResetPassword(data).catch(obj => {
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
                "SENT",
                result.message,
                [
                    { text: 'OK', onPress: () => { this.props.navigation.goBack() } }
                ],
                { cancelable: false }
            );
        }
    }


    render() {
        return (
            <SafeAreaView style={[CommonStyles.container, {
                justifyContent: 'space-between',
                alignItems: "center",
                backgroundColor: 'black',
                height: '100%'
            }]} >
                <View
                    style={{
                        width: wp('100%'), height: hp('100%'),
                        resizeMode: 'cover',
                        backgroundColor: Colors.white
                    }}>
                    <View style={{
                        height: '10%', flexDirection: 'row',
                        padding: 20
                    }}>
                        <TouchableOpacity style={{
                            width: wp('20%'), height: hp('10%'), justifyContent: 'center',
                        }}
                            onPress={() => this.props.navigation.goBack()}
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
                            height: hp('10%'),
                            justifyContent: 'center',
                            textAlignVertical: 'center'
                        }}>Change Password</Text>
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
                                justifyContent: 'center'
                            }}>
                                <View style={{
                                    height: '100%',
                                    marginTop: 50,
                                    height: '80%',
                                }}>

                                    <Text style={[CommonStyles.userButtonText_Black, { marginBottom: 5 }]}>Old Password</Text>
                                    <Input
                                        placeholder='Old Password'
                                        rightIcon={
                                            this.state.oldPasswod !== '' && <Icon
                                                name="close-circle"
                                                size={24}
                                                onPress={() => this.setState({ oldPasswod: '' })}
                                                color={Colors.midGray} />
                                        }
                                        containerStyle={CommonStyles.containerStyle_inp}
                                        inputContainerStyle={CommonStyles.inputContainerStyle_inp}
                                        inputStyle={CommonStyles.userButtonInput_Black}
                                        returnKeyType="next"
                                        onSubmitEditing={event => {
                                            this.refs.passwordInput.focus();
                                        }}
                                        blurOnSubmit={false}
                                        autoFocus={false}
                                        autoCorrect={false}
                                        value={this.state.oldPasswod}
                                        onChangeText={(oldPasswod) => this.setState({ oldPasswod })}
                                    />

                                    <View style={{ height: hp(3.5) }} />
                                    <Text style={[CommonStyles.userButtonText_Black, { marginBottom: 5 }]}>New Password</Text>
                                    <Input
                                        placeholder='New Password'
                                        rightIcon={
                                            this.state.newPassword !== '' && <Icon
                                                name="close-circle"
                                                size={24}
                                                onPress={() => this.setState({ newPassword: '' })}
                                                color={Colors.midGray} />
                                        }
                                        containerStyle={CommonStyles.containerStyle_inp}
                                        ref="passwordInput"
                                        inputContainerStyle={CommonStyles.inputContainerStyle_inp}
                                        inputStyle={CommonStyles.userButtonInput_Black}
                                        returnKeyType="next"
                                        onSubmitEditing={event => {
                                            this.refs.passwordInput2.focus();
                                        }}
                                        blurOnSubmit={false}
                                        autoFocus={false}
                                        autoCorrect={false}
                                        value={this.state.newPassword}
                                        onChangeText={(newPassword) => this.setState({ newPassword })}
                                    />
                                    <View style={{ height: hp(3.5) }} />

                                    <Text style={[CommonStyles.userButtonText_Black, { marginBottom: 5 }]}>Confirm New Password</Text>
                                    <Input
                                        placeholder='Confirm New Password'
                                        ref="passwordInput2"
                                        rightIcon={
                                            this.state.confPassword !== '' && <Icon
                                                name="close-circle"
                                                size={24}
                                                onPress={() => this.setState({ confPassword: '' })}
                                                color={Colors.midGray} />
                                        }
                                        containerStyle={CommonStyles.containerStyle_inp}
                                        inputContainerStyle={CommonStyles.inputContainerStyle_inp}
                                        inputStyle={CommonStyles.userButtonInput_Black}
                                        returnKeyType="done"

                                        onSubmitEditing={event => { Keyboard.dismiss() }}
                                        blurOnSubmit={false}
                                        autoFocus={false}
                                        autoCorrect={false}
                                        value={this.state.confPassword}
                                        onChangeText={(confPassword) => this.setState({ confPassword })}
                                    />

                                </View>
                                <View style={{ height: hp(3.5) }} />
                                <TouchableOpacity
                                    onPress={() => this.validateForm()}>

                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        colors={['#7111DC', '#F85D47', '#FEAC46']}
                                        style={CommonStyles.userGradButton}
                                    >
                                        <Text style={[CommonStyles.userButtonText]}>SUBMIT</Text>
                                    </LinearGradient>

                                </TouchableOpacity>
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
)(ChangePassword);
