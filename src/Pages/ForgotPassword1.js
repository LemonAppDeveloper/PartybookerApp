import React, { Component } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Keyboard,
    ImageBackground, Image, Platform, Alert
} from 'react-native';
import CommonStyles from '../styles/CommonStyles';
import { Colors, fonts } from '../Components/theme';
import { AuthCtrl } from '../Controller/AuthController';
import { connect } from 'react-redux';
import { actions as appActions } from "../AppState/actions/appActions";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ErrorCtrl } from '../Controller/ErrorController';

class ForgotPassword1 extends Component {
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
            wrongPassword: '0'
        };
    }

    componentDidMount() {
        this.props.setLoader(false);
    }

    validate(text) {
        const regexp =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regexp.test(text);
    }

    async validateForm() {
        if (!this.validate(this.state.email)) {
            this.setState({ wrongPassword: '1' })
            alert("Please add Correct Email")
            return
        } else this.setState({ wrongPassword: '0' })
        this.props.setLoader(true);

        var that = this;
        var data = {
            email: this.state.email,
            device_type: Platform.OS == "ios" ? '2' : '1',
            action: 'forgot-password'
        };

        var result = await AuthCtrl.forgotPassword(data).catch(obj => {
            this.props.setLoader(false);
            var code = obj.success;
            ErrorCtrl.showError({
                msg: obj.message.email,
            });
            return false;
        });

        this.props.setLoader(false);
        if (result) {
            Alert.alert(
                "SENT",
                result.message,
                [
                    {
                        text: 'OK', onPress: () => {
                            this.props.navigation.navigate('ForgotPassword4')
                        }
                    }
                ],
                { cancelable: false }
            );
        }
    }

    render() {
        return (
            <View style={CommonStyles.container}>
                <ImageBackground source={{ uri: 'back_bg' }}
                    style={{
                        width: wp('100%'), height: hp('100%'),
                        resizeMode: 'cover',
                    }}>

                    <Image source={{ uri: 'top1' }}
                        style={{
                            width: wp('35%'), height: hp('35%'),
                            resizeMode: 'contain',
                            position: 'absolute',
                            top: -20,
                            right: 0
                        }} />
                    <Image source={{ uri: 'bottom_1' }}
                        style={{
                            width: wp('50%'), height: hp('30%'),
                            resizeMode: 'cover',
                            position: 'absolute',
                            bottom: -20,
                            left: 0
                        }} />

                    <View style={{ height: '100%', width: '100%' }}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS == "ios" ? "padding" : "height"}
                            style={{
                                height: '100%', width: '100%',
                            }}
                        >
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                keyboardShouldPersistTaps='always'
                                style={{ height: '100%', width: '100%' }}
                                contentContainerStyle={{ paddingBottom: wp(5), flexGrow: 1 }}>
                                <View style={styles.vie1}>
                                    <View style={[styles.vie2, {}]}>
                                        <TouchableOpacity style={{ paddingBottom: 20 }} onPress={() =>
                                            this.props.navigation.navigate('signin')}>
                                            <Text style={[CommonStyles.txt1, { color: Colors.white }]}>Login</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{
                                        justifyContent: 'flex-start', alignContent: 'center', height: '80%',
                                        width: '100%'
                                    }}>
                                        <View>
                                            <Text style={styles.txt1}>Forgot Password</Text>
                                            <View style={{ height: hp(1.5) }} />
                                            <Text style={[CommonStyles.txt1, { color: 'white', paddingRight: 15 }]}>
                                                Enter your email address to receive reset password link</Text>
                                            <View style={{ height: hp(1.5) }} />
                                            <Image source={{ uri: 'mail' }} style={[styles.img1, { alignSelf: 'center' }]}
                                                resizeMode='contain' />
                                            <View style={{ height: hp(3.5) }} />
                                            <TextInput
                                                placeholder="Enter Email address"
                                                style={this.state.wrongPassword == '0' ?
                                                    CommonStyles.userInput : CommonStyles.userInputError}
                                                placeholderTextColor={Colors.white}
                                                paddingHorizontal={15}
                                                underlineColorAndroid="transparent"
                                                returnKeyType={"done"}
                                                ref="passwordInput"
                                                inputMode='email'
                                                keyboardType='email-address'
                                                value={this.state.email}
                                                onChangeText={text => {
                                                    this.setState({
                                                        email: text,
                                                    });
                                                }}
                                                onSubmitEditing={event => { Keyboard.dismiss() }}
                                            />
                                        </View>

                                        <View style={{ height: hp(5) }} />
                                        <TouchableOpacity style={styles.tp1} onPress={() => {
                                            this.validateForm()
                                        }}>
                                            <Text style={[CommonStyles.txt1, { color: Colors.white }]}>Send Email</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                </ImageBackground>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'
    },
    img1: {
        height: 120,
        width: '60%',
    },
    vie1: {
        height: '100%',
        width: '100%',
        padding: 20,
        justifyContent: "flex-start",
        alignItems: 'center'
    },
    vie2: {
        height: '20%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    txt1: {
        fontSize: 40,
        fontFamily: fonts.fontPoppinsBold,
        color: Colors.white,
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',
        letterSpacing: 1.2
    },
    tp1: {
        width: '100%',
        height: 65,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.violet,
        borderRadius: 12,
    }
});


function mapDispatchToProps(dispatch) {
    return {
        updateAppState: data => dispatch(appActions.updateAppState(data)),
        setLoader: data => dispatch(appActions.setLoader(data)),
        setUserDetails: data => dispatch(appActions.setUserDetails(data)),
    };
}

export default connect(
    null, mapDispatchToProps
)(ForgotPassword1);
