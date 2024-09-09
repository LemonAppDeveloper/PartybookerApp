import React, { Component } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Image, Platform } from 'react-native';
import CommonStyles from '../styles/CommonStyles';
import { Colors, fonts } from '../Components/theme';

import { AuthCtrl } from '../Controller/AuthController';
import { connect } from 'react-redux';
import { actions as appActions } from "../AppState/actions/appActions";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


class OrganizeParty extends Component {
    constructor() {
        super()
    }

    componentDidMount() {

    }

    async DoOrganizeParty() {
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
            that.props.setUserDetails(result);
            this.props.navigation.push('OtpVerify')
        }
    }


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
                    {/*  */}
                    <Image source={{ uri: 'top1' }}
                        style={{
                            width: wp('30%'), height: hp('30%'),
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
                            left: 0,
                        }} />

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
                                this.props.updateAppState('AppStack');
                            }}>
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
                        <View>
                            <Text style={{
                                fontFamily: fonts.fontPoppinsBold,
                                fontSize: 40,
                                color: Colors.white,
                                letterSpacing: 1.2
                            }}>Lets get this{"\n"}party started.</Text>
                            <Text style={{
                                fontFamily: fonts.fontPoppinsRegular,
                                fontSize: 16,
                                fontWeight: '500',
                                color: Colors.offWhite,
                                marginTop: 20,
                            }}>We will help you find what{"\n"}you’re looking for by setting up your{"\n"}party.</Text>
                        </View>
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
                                    var that = this;
                                    that.props.navigation.push('SettingPref');
                                }}>
                                <Text style={{
                                    fontFamily: fonts.fontPoppinsRegular,
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: Colors.white,
                                    textAlign: 'center'
                                }}>Organize your party</Text>
                            </TouchableOpacity>
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
)(OrganizeParty);
