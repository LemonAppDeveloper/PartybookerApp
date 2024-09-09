
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Keyboard, Image, Platform }
    from 'react-native';
import CommonStyles from '../styles/CommonStyles';
import { Colors, fonts } from '../Components/theme';
import moment from 'moment';

import { connect } from 'react-redux';
import { actions as appActions } from "../AppState/actions/appActions";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { Input } from '@rneui/themed';


const OtpVerify = (props) => {
    const input = React.createRef();

    const num1 = useRef(null);
    const num2 = useRef(null);
    const num3 = useRef(null);
    const num4 = useRef(null);
    const updateRef = ref => {
        num2.current = ref.current;
    };

    const calculateTimeLeft = () => {
        let eventTime = '1626573600';
        let currentTime = (Math.floor(Date.now() / 1000)).toString();
        let leftTime = eventTime - currentTime;
        let duration = moment.duration(leftTime, 'seconds');
        let interval = 1000;
        if (duration.asSeconds() <= 0) {
            clearInterval(interval);
            //window.location.reload(true); //#skip the cache and reload the page from the server
        }
        duration = moment.duration(duration.asSeconds() - 1, 'seconds');
        return (duration.days() + ' Days ' + duration.hours() + ' Hours ' + duration.minutes() + ' Minutes ' + duration.seconds() + ' Seconds');
    }

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
    });


    return (
        <View style={[CommonStyles.container, {
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
                    padding: 20, justifyContent: 'flex-start'
                }}>
                    <TouchableOpacity style={{
                        width: wp('15%'), height: hp('10%'), justifyContent: 'center',
                    }}
                        onPress={() => props.navigation.goBack()}
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
                        fontSize: 20,
                        height: hp('10%'),
                        textAlignVertical: 'center',
                        justifyContent: 'center',
                    }}>OTP Confirmation</Text>
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
                            height: '100%', width: '100%',
                            alignSelf: 'center',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            padding: 20

                        }}>
                            <Text style={styles.txt_1}>1:15</Text>
                            <Text style={styles.txt_2}>We sent the code verification to{"\n"}your mobile number</Text>
                            <TouchableOpacity style={{ width: '100%', height: 60, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={[styles.txt_2, { fontWeight: '500', color: Colors.flatViolet, marginTop: 0 }]}>
                                    Send again</Text>
                            </TouchableOpacity>

                            <View style={{
                                flexDirection: 'row', justifyContent: 'flex-start',
                                alignItems: 'center', height: '50%'
                            }}>
                                <Input
                                    ref={num1}
                                    containerStyle={styles.con1}
                                    inputContainerStyle={styles.con2}
                                    inputStyle={styles.con3}
                                    returnKeyType="next"
                                    maxLength={1}
                                    keyboardType='decimal-pad'
                                    onSubmitEditing={event => {
                                        num2.current.focus();
                                    }}
                                    blurOnSubmit={false}
                                    autoFocus={false}
                                    autoCorrect={false}
                                />
                                <Input
                                    ref={num2}
                                    maxLength={1}
                                    containerStyle={[styles.con1, { marginLeft: 20 }]}
                                    inputContainerStyle={styles.con2}
                                    inputStyle={styles.con3}
                                    returnKeyType="next"
                                    onSubmitEditing={event => {
                                        num3.current.focus();
                                    }}
                                    keyboardType='decimal-pad'
                                    blurOnSubmit={false}
                                    autoFocus={false}
                                    autoCorrect={false}
                                />
                                <Input
                                    ref={num3}
                                    maxLength={1}
                                    containerStyle={[styles.con1, { marginLeft: 20 }]}
                                    inputContainerStyle={styles.con2}
                                    inputStyle={styles.con3}
                                    keyboardType='decimal-pad'
                                    returnKeyType="next"
                                    onSubmitEditing={event => {
                                        num4.current.focus();
                                    }}
                                    blurOnSubmit={false}
                                    autoFocus={false}
                                    autoCorrect={false}
                                />
                                <Input
                                    ref={num4}
                                    maxLength={1}
                                    containerStyle={[styles.con1, { marginLeft: 20 }]}
                                    inputContainerStyle={styles.con2}
                                    inputStyle={styles.con3}
                                    returnKeyType="done"
                                    keyboardType='decimal-pad'
                                    onSubmitEditing={event => {
                                        Keyboard.dismiss()
                                    }}
                                    blurOnSubmit={false}
                                    autoFocus={false}
                                    autoCorrect={false}
                                />
                            </View>
                            <TouchableOpacity
                                style={{ width: '100%' }}
                                onPress={() => {
                                    props.navigation.push('OrganizeParty')
                                }}>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    colors={['#7111DC', '#F85D47', '#FEAC46']}
                                    style={CommonStyles.userGradButton}
                                >
                                    <Text style={[CommonStyles.userButtonText]}>VALIDATE</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'
    },
    txt_1: {
        fontSize: 40,
        fontFamily: fonts.fontPoppinsBold,
        color: Colors.textColor,
        textAlign: 'center'
    },
    txt_2: {
        fontSize: 14,
        fontFamily: fonts.fontPoppinsRegular,
        fontWeight: '300',
        color: Colors.darkGray,
        textAlign: 'center',
        marginTop: 10,
    },
    con1: {
        width: 60,
        height: 60,
        backgroundColor: 'rgba(255, 205, 178, 0.30)',
        borderWidth: 1,
        borderRadius: 12,
        borderColor: Colors.orange4
    },
    con2: {
        width: 20,
        height: 60,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        textAlignVertical: 'center'
    },
    con3: {
        height: 60,
        alignSelf: 'center'
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
)(OtpVerify);
