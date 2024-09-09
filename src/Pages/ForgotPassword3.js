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

class ForgotPassword3 extends Component {
    constructor() {
        super();
        this.state = {
            newPAssword: '',
            confimPassword: '',
            newPAsswordWrong: '',
            confimPasswordWrong: '',
            modalVisible: false,
            modalURL: '',
            input: React.createRef(),
            ischeckedTP: false,
            wrongPassword: '0',
            isNewPasswordDone: false
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
                                    </View>

                                    {this.state.isNewPasswordDone ?
                                        <View style={{
                                            justifyContent: 'space-around', alignContent: 'center', height: '80%',
                                            width: '100%'
                                        }}>
                                            <View style={[CommonStyles.userInput, {
                                                height: '50%', justifyContent: 'center',
                                                alignItems: 'center'
                                            }]} >
                                                <Icon name='checkmark-circle' color={Colors.white} size={80} />
                                                <View style={{ height: hp(1.5) }} />
                                                <Text style={styles.txt2}>Password change successfully</Text>
                                            </View>
                                            <View style={{ height: hp(5) }} />
                                            <TouchableOpacity style={styles.tp1}
                                                onPress={() => this.props.navigation.navigate('signin')}>
                                                <Text style={[CommonStyles.txt1, { color: Colors.white }]}>Continue</Text>
                                            </TouchableOpacity>
                                        </View>
                                        :
                                        <View style={{
                                            justifyContent: 'space-around', alignContent: 'center', height: '80%',
                                            width: '100%'
                                        }}>
                                            <View>
                                                <Text style={styles.txt1}>Enter new password</Text>
                                                <View style={{ height: hp(4.5) }} />
                                                <TextInput
                                                    placeholder="New Password"
                                                    style={this.state.newPAsswordWrong == '0' ?
                                                        CommonStyles.userInput : CommonStyles.userInputError}
                                                    placeholderTextColor={Colors.white}
                                                    paddingHorizontal={15}
                                                    underlineColorAndroid="transparent"
                                                    returnKeyType={"next"}
                                                    blurOnSubmit={false}
                                                    autoFocus={false}
                                                    autoCorrect={false}
                                                    ref="passwordInput"
                                                    value={this.state.newPAssword}
                                                    onChangeText={text => {
                                                        this.setState({
                                                            newPAssword: text,
                                                        });
                                                    }}
                                                    onSubmitEditing={event => { this.refs.ccode3.focus(); }}
                                                />
                                                <View style={{ height: hp(2.5) }} />
                                                <TextInput
                                                    placeholder="Confirm Password"
                                                    style={this.state.confimPasswordWrong == '0' ?
                                                        CommonStyles.userInput : CommonStyles.userInputError}
                                                    placeholderTextColor={Colors.white}
                                                    paddingHorizontal={15}
                                                    underlineColorAndroid="transparent"
                                                    returnKeyType={"done"}
                                                    ref="ccode3"
                                                    value={this.state.confimPassword}
                                                    onChangeText={text => {
                                                        this.setState({
                                                            confimPassword: text,
                                                        });
                                                    }}
                                                    onSubmitEditing={event => { Keyboard.dismiss() }}
                                                />
                                            </View>

                                            <View style={{ height: hp(5) }} />
                                            <TouchableOpacity style={styles.tp1}
                                                onPress={() => this.setState({ isNewPasswordDone: true })}>
                                                <Text style={[CommonStyles.txt1, { color: Colors.white }]}>Continue</Text>
                                            </TouchableOpacity>
                                        </View>
                                    }
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
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    txt1: {
        fontSize: 40,
        fontFamily: fonts.fontPoppinsBold,
        color: Colors.white,
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',
        letterSpacing: 1.2
    },
    txt2: {
        fontSize: 24,
        fontFamily: fonts.fontPoppinsMedium,
        fontWeight: '500',
        color: Colors.white,
        justifyContent: 'center',
        alignSelf: 'center',
        letterSpacing: 2
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
)(ForgotPassword3);


