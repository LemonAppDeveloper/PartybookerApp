
/***
COMMON STYLE USED BY COMPONENTS ACROSS APP
*/

import { StyleSheet, Platform } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors, fonts } from '../Components/theme';


export default (CommonStyles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: Colors.white
    },
    cc2: {
        height: '100%',
        width: '100%',
        paddingTop: Platform.OS == "ios" ? 30 : 0,
        paddingBottom: Platform.OS == "ios" ? 30 : 0
    },
    mainContainer: {
        height: '100%',
        width: '100%',

    },
    userInput_image: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.midGray,
        height: 55,
        fontFamily: fonts.fontPoppinsRegular,
        color: Colors.white,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 10,
        fontSize: wp(4)
    },
    userInput: {
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: Colors.midGray,
        height: hp(7.5),
        fontFamily: fonts.fontPoppinsRegular,
        color: Colors.white,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingTop: Platform.OS == "ios" ? 0 : 15,
        fontSize: wp(4)
    },
    userInputError: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.danger,
        height: hp(7.5),
        fontFamily: fonts.fontPoppinsRegular,
        color: Colors.white,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingTop: Platform.OS == "ios" ? 0 : 15,
        fontSize: wp(4)
    },
    userInputError_code: {
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.danger,
        height: hp(7.5),
        fontFamily: fonts.fontPoppinsRegular,
        color: Colors.white,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingTop: Platform.OS == "ios" ? 0 : 15,
        fontSize: wp(4)
    },
    userGradButton: {
        width: '100%',
        height: hp(7.5),
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    userGradButtonSwitch: {
        width: '50%',
        height: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    userGradButton_half: {
        width: '100%',
        height: hp(7.5),
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    userGradButton_half_top: {
        width: '100%',
        height: 150,
        borderTopRightRadius: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    userView: {
        borderRadius: wp(2),
        borderWidth: 1,
        borderColor: Colors.grey3,
        width: wp('87%'),
        height: hp(6),
        marginBottom: wp(3),
    },
    userButton: {
        borderRadius: wp(2),
        height: hp(8),
        alignItems: 'center',
        justifyContent: 'center',
    },

    pinkBttn: {
        borderRadius: wp(2),
        backgroundColor: Colors.pink,
        height: hp(6),
        alignItems: 'center',
        justifyContent: 'center',
    },

    settingsButton: {
        alignItems: 'center',
        justifyContent: 'space-between',
        width: wp('90%'),
        height: wp('10%'),
        backgroundColor: Colors.white,
        marginTop: wp(4),
        borderRadius: wp(2),
        flexDirection: 'row'
    },
    commonCard: {
        alignItems: 'center',
        width: wp('90%'),
        backgroundColor: Colors.white,
        borderRadius: wp(2),
    },
    userButtonText: {
        fontFamily: fonts.fontPoppinsRegular,
        color: Colors.white,
        fontSize: 14,
        fontWeight: '500'
    },
    userButtonText_Black: {
        fontFamily: fonts.fontPoppinsRegular,
        color: Colors.textColor,
        fontSize: wp(3.5),
    },
    userButtonInput_Black: {
        fontFamily: fonts.fontPoppinsRegular,
        color: Colors.textColor,
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 5,
        marginTop: 4
    },
    inputContainerStyle_inp: {
        backgroundColor: 'white',
        borderBottomColor: 'transparent',
        borderBottomWidth: 0,
        justifyContent: 'center',
    },
    containerStyle_inp: {
        borderRadius: 12,
        borderColor: Colors.borderGray,
        borderWidth: 1,
        width: '100%',
        height: 50,
    },
    containerStyle_input_2: {
        width: '100%',
        height: 50,
    },
    regularText: {
        fontFamily: fonts.fontPoppinsRegular,
        fontSize: wp(3.5),
    },
    boldText: {
        fontFamily: fonts.fontSF_Medium,
        fontSize: wp(4)
    },
    userRegularButton: {
        width: wp(18.75),
        height: hp(3.75),
        borderRadius: wp(2),
        alignItems: 'center',
        justifyContent: 'center'
    },
    sellerText: {
        fontFamily: fonts.fontSF_Medium,
        color: Colors.green,
        fontSize: wp(5),
        textTransform: 'capitalize'
    },
    sellerContainer: {
        width: wp('92%'),
        height: hp(6),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    sellingCarouselContainer: {
        width: wp('92%'),
        alignItems: 'center'
    },
    horizontalLine: {
        width: wp('92%'),
        backgroundColor: Colors.grey3,
        height: hp(0.1),
        alignSelf: 'center', marginBottom: wp(3)
    },
    freeShipping: {
        width: wp(20),
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: wp(5),
        left: wp(5),
        zIndex: 9000
    },
    arrowStyle: {
        width: wp(3),
        height: wp(1.75),
        resizeMode: 'contain',
        tintColor: Colors.black,
        transform: [{ rotate: '270deg' }]
    },
    txt1: {
        fontSize: 14,
        fontFamily: fonts.fontPoppinsRegular,
        fontWeight: '500',
        color: Colors.darkGray
    },
    txt2: {
        fontSize: 12,
        fontFamily: fonts.fontPoppinsRegular,
        fontWeight: '500',
        color: Colors.orange3
    },
    txt6: {
        fontSize: 12,
        fontFamily: fonts.fontPoppinsMedium,
        fontWeight: '400',
        color: Colors.textColor
    },
    txt3: {
        fontSize: 18,
        fontFamily: fonts.fontPoppinsRegular,
        fontWeight: '500',
        color: Colors.textColor
    },
    txt5: {
        fontSize: 20,
        fontFamily: fonts.fontPoppinsRegular,
        fontWeight: '400',
        color: Colors.white
    },
    txt4: {
        fontSize: 24,
        fontFamily: fonts.fontPoppinsMedium,
        fontWeight: '500',
        color: Colors.textColor
    },
    txt7: {
        fontSize: 14,
        fontFamily: fonts.fontPoppinsMedium,
        fontWeight: '500',
        color: Colors.textColor
    },
    txt8: {
        fontSize: 12,
        fontFamily: fonts.fontPoppinsMedium,
        fontWeight: '500',
        color: Colors.textColor
    },
}));