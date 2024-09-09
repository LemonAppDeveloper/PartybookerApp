import React, { Component } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, ImageBackground, Image, Platform
} from 'react-native';
import CommonStyles from '../styles/CommonStyles';
import { Colors, fonts } from '../Components/theme';
import { connect } from 'react-redux';
import { actions as appActions } from "../AppState/actions/appActions";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class ForgotPassword4 extends Component {
    constructor() {
        super();
        this.state = {
            input: React.createRef(),
        };
    }

    componentDidMount() {
        this.props.setLoader(false);
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
                            }} >
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
                                            <Text style={styles.txt1}>Password reset email sent!</Text>
                                            <View style={{ height: hp(1.5) }} />
                                            <Text style={[CommonStyles.txt1, { color: 'white', paddingRight: 15 }]}>
                                                Please check your e-mail address for your new password</Text>
                                            <View style={{ height: hp(1.5) }} />
                                            <Image source={{ uri: 'mail' }} style={[styles.img1, { alignSelf: 'center' }]}
                                                resizeMode='contain' />
                                            <View style={{ height: hp(3.5) }} />
                                        </View>

                                        <View style={{ height: hp(5) }} />
                                        <TouchableOpacity style={styles.tp1} onPress={() => {
                                            this.props.navigation.navigate('signin')
                                        }}>
                                            <Text style={[CommonStyles.txt1, { color: Colors.white }]}>Continue</Text>
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
)(ForgotPassword4);
