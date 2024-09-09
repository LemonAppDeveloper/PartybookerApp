import React, { Component } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Keyboard,
    ImageBackground, Image, Platform, Alert
} from 'react-native';
import CommonStyles from '../styles/CommonStyles';
import { Colors, fonts } from '../Components/theme';
import { AuthCtrl } from '../Controller/AuthController';
import { connect } from 'react-redux';
import { actions as appActions } from "../AppState/actions/appActions";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { ErrorCtrl } from '../Controller/ErrorController';

class ForgotPassword2 extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            fullName: '',
            password: '',
            code1: '',
            code2: '',
            code3: '',
            code4: '',
            code5: '',
            code6: '',
            wrongCcode1: '',
            wrongCcode2: '',
            wrongCcode3: '',
            wrongCcode4: '',
            wrongCcode5: '',
            wrongCcode6: '',
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

    async validateForm() {
        if (this.state.email == '') {
            alert("Please add your email.")
            return
        }
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
            <SafeAreaView style={CommonStyles.container}>
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
                                keyboardShouldPersistTaps={'always'}
                                style={{ height: '100%', width: '100%' }}
                                contentContainerStyle={{ paddingBottom: wp(5), flexGrow: 1 }}>
                                <View style={styles.vie1}>
                                    <View style={[styles.vie2, {}]}>
                                        <TouchableOpacity style={{ paddingBottom: 20 }} onPress={() =>
                                            this.props.navigation.goBack()}>
                                            <Icon name='arrow-back-outline' color={Colors.white} size={30} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ paddingBottom: 20 }}
                                            onPress={() =>
                                                console.log("")}>
                                            <Text style={[CommonStyles.txt1, { color: Colors.white }]}>Resend</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{
                                        justifyContent: 'space-around', alignContent: 'center', height: '80%',
                                        width: '100%'
                                    }}>
                                        <View>
                                            <Text style={styles.txt1}>Enter 6 digit code</Text>
                                            <View style={{ height: hp(2.5) }} />
                                            <Text style={[CommonStyles.txt1, { color: 'white', paddingRight: 15 }]}>
                                                Enter the 6 digit OTP code we sent via SMS</Text>
                                            <View style={{ height: hp(2.5) }} />
                                            <View style={{ height: hp(3.5) }} />
                                            <View style={styles.vie3}>
                                                <TextInput
                                                    placeholder="1"
                                                    style={[this.state.wrongCcode1 == '0' ?
                                                        CommonStyles.userInput : CommonStyles.userInputError,
                                                    { textAlign: 'center' }]}
                                                    placeholderTextColor={Colors.white}
                                                    paddingHorizontal={15}
                                                    underlineColorAndroid="transparent"
                                                    returnKeyType={"next"}
                                                    ref="ccode1"
                                                    inputMode='numeric'
                                                    blurOnSubmit={false}
                                                    autoFocus={false}
                                                    autoCorrect={false}
                                                    maxLength={1}
                                                    value={this.state.code1}
                                                    onChangeText={text => {
                                                        this.setState({
                                                            code1: text,
                                                        });
                                                    }}
                                                    onSubmitEditing={event => { this.refs.ccode2.focus(); }}
                                                />
                                                <TextInput
                                                    placeholder="2"
                                                    style={[this.state.wrongCcode2 == '0' ?
                                                        CommonStyles.userInput : CommonStyles.userInputError_code,
                                                    { textAlign: 'center' }]}
                                                    placeholderTextColor={Colors.white}
                                                    paddingHorizontal={15}
                                                    underlineColorAndroid="transparent"
                                                    returnKeyType={"next"}
                                                    ref="ccode2"
                                                    inputMode='numeric'
                                                    blurOnSubmit={false}
                                                    autoFocus={false}
                                                    autoCorrect={false}
                                                    maxLength={1}
                                                    value={this.state.code2}
                                                    onChangeText={text => {
                                                        this.setState({
                                                            code2: text,
                                                        });
                                                    }}
                                                    onSubmitEditing={event => { this.refs.ccode3.focus(); }}
                                                />
                                                <TextInput
                                                    placeholder="3"
                                                    style={[this.state.wrongCcode3 == '0' ?
                                                        CommonStyles.userInput : CommonStyles.userInputError,
                                                    { textAlign: 'center' }]}
                                                    placeholderTextColor={Colors.white}
                                                    paddingHorizontal={15}
                                                    underlineColorAndroid="transparent"
                                                    returnKeyType={"next"}
                                                    ref="ccode3"
                                                    inputMode='numeric'
                                                    blurOnSubmit={false}
                                                    autoFocus={false}
                                                    autoCorrect={false}
                                                    maxLength={1}
                                                    value={this.state.code3}
                                                    onChangeText={text => {
                                                        this.setState({
                                                            code3: text,
                                                        });
                                                    }}
                                                    onSubmitEditing={event => { this.refs.ccode4.focus(); }}
                                                />
                                                <TextInput
                                                    placeholder="4"
                                                    style={[this.state.wrongCcode4 == '0' ?
                                                        CommonStyles.userInput : CommonStyles.userInputError,
                                                    { textAlign: 'center' }]}
                                                    placeholderTextColor={Colors.white}
                                                    paddingHorizontal={15}
                                                    underlineColorAndroid="transparent"
                                                    returnKeyType={"next"}
                                                    ref="ccode4"
                                                    inputMode='numeric'
                                                    blurOnSubmit={false}
                                                    autoFocus={false}
                                                    autoCorrect={false}
                                                    maxLength={1}
                                                    value={this.state.code4}
                                                    onChangeText={text => {
                                                        this.setState({
                                                            code4: text,
                                                        });
                                                    }}
                                                    onSubmitEditing={event => { this.refs.ccode5.focus(); }}
                                                />
                                                <TextInput
                                                    placeholder="5"
                                                    style={[this.state.wrongCcode5 == '0' ?
                                                        CommonStyles.userInput : CommonStyles.userInputError,
                                                    { textAlign: 'center' }]}
                                                    placeholderTextColor={Colors.white}
                                                    paddingHorizontal={15}
                                                    underlineColorAndroid="transparent"
                                                    returnKeyType={"next"}
                                                    ref="ccode5"
                                                    blurOnSubmit={false}
                                                    autoFocus={false}
                                                    autoCorrect={false}
                                                    inputMode='numeric'
                                                    maxLength={1}
                                                    value={this.state.code5}
                                                    onChangeText={text => {
                                                        this.setState({
                                                            code5: text,
                                                        });
                                                    }}
                                                    onSubmitEditing={event => { this.refs.ccode6.focus(); }}
                                                />
                                                <TextInput
                                                    placeholder="6"
                                                    style={[this.state.wrongCcode6 == '0' ?
                                                        CommonStyles.userInput : CommonStyles.userInputError,
                                                    { textAlign: 'center' }]}
                                                    placeholderTextColor={Colors.white}
                                                    paddingHorizontal={15}
                                                    underlineColorAndroid="transparent"
                                                    returnKeyType={"done"}
                                                    ref="ccode6"
                                                    inputMode='numeric'
                                                    blurOnSubmit={false}
                                                    autoFocus={false}
                                                    autoCorrect={false}
                                                    maxLength={1}
                                                    value={this.state.code6}
                                                    onChangeText={text => {
                                                        this.setState({
                                                            code6: text,
                                                        });
                                                    }}
                                                    onSubmitEditing={event => { Keyboard.dismiss() }}
                                                />
                                            </View>

                                        </View>

                                        <View style={{ height: hp(5) }} />
                                        <TouchableOpacity style={styles.tp1} onPress={() => {
                                            this.props.navigation.navigate('ForgotPassword3')
                                        }}>
                                            <Text style={[CommonStyles.txt1, { color: Colors.white }]}>Continue</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                </ImageBackground>
            </SafeAreaView>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    vie3: {
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row'
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
)(ForgotPassword2);
