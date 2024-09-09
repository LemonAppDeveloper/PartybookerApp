import React, { Component } from 'react';
import {
    View, Text, ScrollView, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Keyboard, Image, Platform,
    BackHandler, StatusBar, Linking
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableWithoutFeedback } from 'react-native';
import Apis from '../util/constant';

class SignUpScreen extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            fullName: '',
            password: '',
            repeatPassword: '',
            WrongEmail: '0',
            WrongFullName: '0',
            WrongPassword: '0',
            WrongrepeatPassword: '0',
            WrongTP: '0',
            modalVisible: false,
            modalURL: '',
            input: React.createRef(),
            ischeckedTP: false,
            detailsAdded: false,
        };
    }

    componentDidMount() {
        this.props.setLoader(false);
    }
    async componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    async componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = async () => {
        this.props.navigation.goBack()
    };

    callValidations() {
        let v1 = false, v2 = false, v3 = false, v4 = false, v5 = false;
        if (this.state.fullName !== '') {
            v1 = true
        }
        if (this.state.email !== '') {
            v2 = true
        }
        if (this.state.password !== '') {
            v3 = true
        }
        if (this.state.repeatPassword.length !== 0) {
            v5 = true
        }

        console.log("V1 : ", v1 + "..FULLNAME.." + this.state.fullName);
        console.log("V2 : ", v2 + "....Email..." + this.state.email);
        console.log("V3 : ", v3 + "...password.." + this.state.password);
        console.log("V5 : ", v5 + "...repeatpass.." + this.state.repeatPassword);
        console.log("V522 : ", (v1 = true && v2 == true && v3 == true && v5 == true));
        if (v1 = true && v2 == true && v3 == true && v5 == true) {
            this.setState({ detailsAdded: true })
        } else
            this.setState({ detailsAdded: false })
    }

    async validateForm() {
        let one, two, three, four, five, six, seven;
        if (this.state.fullName == '' || this.state.fullName.length > 50) {
            this.setState({ WrongFullName: '1' });
            one = false;
        } else { this.setState({ WrongFullName: '0' }); }

        if (this.state.email == '') {
            this.setState({ WrongEmail: '1' });
            two = false
        } else { this.setState({ WrongEmail: '0' }); }

        if (this.state.password == '' || this.state.password.length < 8) {
            this.setState({ WrongPassword: '1' });
            three = false
        } else { this.setState({ WrongPassword: '0' }); }

        if (this.state.password !== this.state.repeatPassword) {
            this.setState({ WrongrepeatPassword: '1' });
            five = false
        } else { this.setState({ WrongrepeatPassword: '0' }); }

        if (!this.state.ischeckedTP) {
            this.setState({ WrongTP: '1' });
            six = false
        } else { this.setState({ WrongTP: '0' }); }

        console.log("Email : ", this.state.WrongEmail)
        console.log("FullName : ", this.state.WrongFullName)
        console.log("PASS : ", this.state.WrongPassword)
        console.log("rpEA : ", this.state.WrongrepeatPassword)
        console.log("rpEA : ", this.state.WrongTP)

        console.log("ONE : ", (one == false))
        console.log("TWo : ", (two == false))
        console.log("THREE : ", (three == false))
        console.log("FOUr : ", (four == false))
        console.log("FIVE : ", (five == false))
        console.log("SIX : ", (six == false))

        if (one == false || two == false || three == false || four == false || five == false || six == false) return

        this.props.setLoader(true);

        var that = this;
        var data = {
            name: this.state.fullName,
            email: this.state.email,
            device_type: Platform.OS == "ios" ? '2' : '1',
            role: '3',
            password: this.state.password,
            password_confirmation: this.state.repeatPassword
        };

        var result = await AuthCtrl.doEmailSignUp(data).catch(obj => {
            this.props.setLoader(false);
            var code = obj.success;

            ErrorCtrl.showError({
                msg: obj.message,
            });
            return false;
        });

        this.props.setLoader(false);

        if (result) {
            AsyncStorage.setItem('Logout', 'no');
            this.props.SetSelectionTYpeOFUSer('normal');
            that.props.setUserDetails(result);
            that.props.navigation.push('OrganizeParty')
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
                <StatusBar animated={true} backgroundColor={'white'} barStyle={'dark-content'} showHideTransition={'fade'}
                    hidden={false} />
                <View
                    style={{
                        width: wp('100%'), height: hp('100%'),
                        resizeMode: 'cover',
                        backgroundColor: Colors.white
                    }}>
                    <View style={{
                        height: 60, flexDirection: 'row',
                        justifyContent: 'flex-start', alignItems: 'center',

                    }}>
                        <TouchableOpacity style={{
                            width: 50, height: 50, justifyContent: 'center',
                            marginLeft: 20
                        }}
                            onPress={() => this.props.navigation.goBack()}
                        >
                            <Image source={{ uri: 'back' }}
                                style={{
                                    width: 18, height: 14,
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
                        }}>Let’s sign you up</Text>
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
                                alignSelf: 'center',
                                paddingTop: 20, paddingBottom: 20,
                                justifyContent: 'space-between',
                            }}>
                                <View style={{
                                    height: '100%',
                                    marginTop: 30
                                }}>
                                    <Text style={CommonStyles.userButtonText_Black}>Email Address</Text>
                                    <View style={{ height: 5 }} />
                                    <Input
                                        placeholder='Email Address'
                                        rightIcon={
                                            this.state.email !== '' && <Icon
                                                name="close-circle"
                                                size={24}
                                                onPress={() => this.setState({
                                                    email: '', detailsAdded: false,
                                                    WrongEmail: '0'
                                                })}
                                                color={Colors.midGray} />
                                        }
                                        containerStyle={[CommonStyles.containerStyle_inp,
                                        { borderColor: this.state.WrongEmail == '1' ? Colors.danger : Colors.borderGray }]}
                                        inputContainerStyle={[CommonStyles.inputContainerStyle_inp, {}]}
                                        inputStyle={[CommonStyles.userButtonInput_Black, {}]}
                                        returnKeyType="next"
                                        onSubmitEditing={event => {
                                            this.refs.nameIn.focus();
                                        }}
                                        blurOnSubmit={false}
                                        autoFocus={false}
                                        autoCorrect={false}
                                        value={this.state.email}
                                        onChangeText={(email) => {
                                            this.setState({ email })
                                            this.callValidations();
                                        }}
                                    />
                                    {this.state.WrongEmail == '1' &&
                                        <Text style={[CommonStyles.txt2, { color: Colors.danger, marginTop: 7 }]}>
                                            Email address must only contain the following characters "@ . _"</Text>}
                                    <View style={{ height: hp(2.5) }} />
                                    <Text style={CommonStyles.userButtonText_Black}>Full Name</Text>
                                    <View style={{ height: 5 }} />
                                    <Input
                                        placeholder='Full Name'
                                        ref="nameIn"
                                        rightIcon={
                                            this.state.fullName !== '' && <Icon
                                                name="close-circle"
                                                size={24}
                                                onPress={() => this.setState({
                                                    fullName: '', detailsAdded: false,
                                                    WrongFullName: '0'
                                                })}
                                                color={Colors.midGray} />
                                        }
                                        containerStyle={[CommonStyles.containerStyle_inp,
                                        { borderColor: this.state.WrongFullName == '1' ? Colors.danger : Colors.borderGray }]}
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
                                        onChangeText={(fullName) => {
                                            this.setState({ fullName })
                                            this.callValidations();
                                        }}
                                    />
                                    {this.state.WrongFullName == '1' &&
                                        <Text style={[CommonStyles.txt2, { color: Colors.danger, marginTop: 7 }]}>
                                            Please enter the FullName or must not be grater than 50 char</Text>}
                                    <View style={{ height: hp(2.5) }} />
                                    <Text style={CommonStyles.userButtonText_Black}>Password</Text>
                                    <View style={{ height: 5 }} />
                                    <Input
                                        placeholder='Password'
                                        ref="passwordIn"
                                        rightIcon={
                                            this.state.password !== '' && <Icon
                                                name="close-circle"
                                                size={24}
                                                onPress={() => this.setState({
                                                    password: '', detailsAdded: false,
                                                    WrongPassword: '0'
                                                })}
                                                color={Colors.midGray} />
                                        }
                                        containerStyle={[CommonStyles.containerStyle_inp,
                                        { borderColor: this.state.WrongPassword !== '0' ? Colors.danger : Colors.borderGray }]}
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
                                        onChangeText={(password) => {
                                            this.setState({ password })
                                            this.callValidations();
                                        }}
                                    />
                                    {this.state.WrongPassword == '1' &&
                                        <Text style={[CommonStyles.txt2, { color: Colors.danger, marginTop: 7 }]}>
                                            Password must not be blank or must not be less than 8 char</Text>}
                                    <View style={{ height: hp(2.5) }} />
                                    <Text style={CommonStyles.userButtonText_Black}>Repeat Password</Text>
                                    <View style={{ height: 5 }} />
                                    <Input
                                        placeholder='Repeat Password'
                                        ref="repeatpasswordIn"
                                        rightIcon={
                                            this.state.repeatPassword !== '' && <Icon
                                                name="close-circle"
                                                size={24}
                                                onPress={() => {
                                                    this.setState({
                                                        repeatPassword: '', detailsAdded: false,
                                                        WrongrepeatPassword: '0'
                                                    })
                                                }}
                                                color={Colors.midGray} />
                                        }
                                        containerStyle={[CommonStyles.containerStyle_inp,
                                        { borderColor: this.state.WrongrepeatPassword == '1' ? Colors.danger : Colors.borderGray }]}
                                        inputContainerStyle={CommonStyles.inputContainerStyle_inp}
                                        inputStyle={CommonStyles.userButtonInput_Black}
                                        secureTextEntry={true}
                                        value={this.state.repeatPassword}
                                        onChangeText={(repeatPassword) => {
                                            this.setState({ repeatPassword });
                                            repeatPassword !== '' ? this.callValidations() :
                                                this.setState({ detailsAdded: false })
                                        }}
                                        returnKeyType="done"
                                        onSubmitEditing={() => Keyboard.dismiss()}
                                    />
                                    {this.state.WrongrepeatPassword == '1' &&
                                        <Text style={[CommonStyles.txt2, { color: Colors.danger, marginTop: 7 }]}>
                                            Password did not match</Text>}
                                    <View style={{ height: hp(3) }} />
                                    <View style={{
                                        width: '90%',
                                        justifyContent: 'flex-start',
                                        flexDirection: 'row', alignItems: 'flex-start',
                                    }}>
                                        <Icon
                                            name={this.state.ischeckedTP ? "checkmark-circle" : 'checkmark-circle-outline'}
                                            size={32}
                                            onPress={() => {
                                                this.setState({
                                                    ischeckedTP: !this.state.ischeckedTP,
                                                    WrongTP: '0'
                                                })
                                            }}
                                            color={this.state.ischeckedTP ? Colors.success : Colors.borderGray} />

                                        <View style={{ marginLeft: 15 }}>
                                            <Text style={[CommonStyles.userButtonText_Black, {
                                                color: Colors.textColor2,
                                                fontWeight: '500',
                                                fontFamily: fonts.fontPoppinsSemiBold,
                                                marginTop: 2
                                            }]}>Terms & Conditions</Text>
                                            <TouchableWithoutFeedback>
                                                <Text style={[CommonStyles.userButtonText_Black, {
                                                    marginTop: 10,
                                                    color: Colors.darkGray,
                                                    fontSize: 14,
                                                }]}>I have read and agree to the
                                                    <TouchableWithoutFeedback style={[CommonStyles.userButtonText_Black, {}]}
                                                        onPress={() => { Linking.openURL(Apis.TERMS_CONDITION) }}>
                                                        <Text style={{
                                                            color: Colors.textColor, fontWeight: '500',
                                                            fontFamily: fonts.fontPoppinsSemiBold,
                                                        }}> Terms of Use, </Text>
                                                    </TouchableWithoutFeedback>
                                                    <TouchableWithoutFeedback
                                                        onPress={() => { Linking.openURL(Apis.PRIVACY_POLICY) }}>
                                                        <Text style={{
                                                            color: Colors.textColor, fontWeight: '500',
                                                            fontFamily: fonts.fontPoppinsSemiBold
                                                        }}>Privacy Policy,</Text>
                                                    </TouchableWithoutFeedback>
                                                    <Text style={{
                                                        color: Colors.darkGray,
                                                    }}> and </Text>
                                                    <TouchableWithoutFeedback
                                                        onPress={() => { Linking.openURL(Apis.INTERNET_SECURITY) }}>
                                                        <Text style={{
                                                            color: Colors.textColor,
                                                            fontWeight: '500',
                                                            fontFamily: fonts.fontPoppinsSemiBold
                                                        }}>Internet Security Information Policy.</Text>
                                                    </TouchableWithoutFeedback>
                                                </Text>
                                            </TouchableWithoutFeedback>
                                        </View>
                                    </View>
                                    {this.state.WrongTP == '1' &&
                                        <Text style={[CommonStyles.txt2, { color: Colors.danger, marginTop: 7 }]}>
                                            Accept Terms and Conditions</Text>}
                                    <View style={{ height: hp(3.5) }} />
                                    {this.state.detailsAdded ?
                                        <TouchableOpacity
                                            onPress={() => this.validateForm()}>
                                            <LinearGradient
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                                colors={['#7111DC', '#F85D47', '#FEAC46']}
                                                style={CommonStyles.userGradButton}
                                            >
                                                <Text style={[CommonStyles.userButtonText]}>Create an Account</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                        : <View style={[CommonStyles.userGradButton, {
                                            backgroundColor: Colors.borderGray,
                                            marginBottom: 20
                                        }]}>
                                            <Text style={[CommonStyles.userButtonText]}>Create an Account</Text>
                                        </View>
                                    }
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
        SetSelectionTYpeOFUSer: data => dispatch(appActions.SetSelectionTYpeOFUSer(data)),

    };
}

export default connect(
    null, mapDispatchToProps
)(SignUpScreen);
