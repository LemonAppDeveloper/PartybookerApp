import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, Platform } from 'react-native';
import CommonStyles from '../styles/CommonStyles';
import { Colors, fonts } from '../Components/theme';
import { connect } from 'react-redux';
import { actions as appActions } from "../AppState/actions/appActions";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SQIPCardEntry, SQIPCore } from 'react-native-square-in-app-payments';

class CardDetailsList extends Component {
    constructor() {
        super();
        this.state = {
            webID: '',
            namee: ''
        };
        this.onStartCardEntry = this.onStartCardEntry.bind(this);
        this.onCardNonceRequestSuccess = this.onCardNonceRequestSuccess.bind(this);
    }

    async componentWillMount() {
        // SQIPCore.setSquareApplicationId('sq0idp-59-PEXuwBATCMDBkXI5cww');
        SQIPCore.setSquareApplicationId('sandbox-sq0idb-NTOBxaCL7jJjvFNdIJ3P7Q');

        if (Platform.OS === 'ios') {
            await SQIPCardEntry.setIOSCardEntryTheme({
                saveButtonFont: {
                    size: 25,
                },
                saveButtonTitle: 'Order 💳 ',
                keyboardAppearance: 'Light',
                saveButtonTextColor: {
                    r: 255,
                    g: 0,
                    b: 125,
                    a: 0.5,
                },
            });
        }
    }

    async componentDidMount() {
        // SQIPCore.setSquareApplicationId('sq0idp-59-PEXuwBATCMDBkXI5cww');
        SQIPCore.setSquareApplicationId('sandbox-sq0idb-NTOBxaCL7jJjvFNdIJ3P7Q');

        this.props.setLoader(false);
        if (Platform.OS === 'ios') {
            await SQIPCardEntry.setIOSCardEntryTheme({
                saveButtonFont: {
                    size: 25,
                },
                saveButtonTitle: 'Pay 💳 ',
                keyboardAppearance: 'Light',
                saveButtonTextColor: {
                    r: 255,
                    g: 0,
                    b: 125,
                    a: 0.5,
                },
            });

        }
    }

    onCardEntryComplete() {
        // Update UI to notify user that the payment flow is completed
    }
    async onCardNonceRequestSuccess(cardDetails) {
        try {
            await SQIPCardEntry.completeCardEntry(
                this.onCardEntryComplete(),
            );
        } catch (ex) {
            await SQIPCardEntry.showCardNonceProcessingError(ex.message);
        }
    }

    onCardEntryCancel() {
        console.log("Card cancel ")
    }

    async onStartCardEntry() {
        const cardEntryConfig = {
            collectPostalCode: true,
        };

        await SQIPCardEntry.startCardEntryFlow(
            cardEntryConfig,
            this.onCardNonceRequestSuccess,
            this.onCardEntryCancel,
        );
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
                            fontFamily: fonts.fontPoppinsRegular,
                            fontSize: 20,
                            height: hp('10%'),
                            justifyContent: 'center',
                            textAlignVertical: 'center'
                        }}>Details</Text>
                    </View>

                    <TouchableOpacity onPress={() => this.onStartCardEntry()}
                        style={{
                            width: '80%', alignSelf: 'center', height: 60,
                            borderRadius: 12, borderWidth: 1, borderColor: Colors.violet, backgroundColor: Colors.lightGray
                        }}>
                        <Text style={[CommonStyles.txt3, { fontSize: 14 }]}>CAll PAyment</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
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
)(CardDetailsList);
