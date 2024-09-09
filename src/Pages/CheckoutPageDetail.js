import React, { Component } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Image, Platform,
    FlatList
} from 'react-native';
import CommonStyles from '../styles/CommonStyles';
import { Colors, fonts } from '../Components/theme';
import { connect } from 'react-redux';
import { actions as appActions } from "../AppState/actions/appActions";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { ErrorCtrl } from '../Controller/ErrorController';
import Dates from 'react-native-dates';
import moment from 'moment';
import { ProdCtrl } from '../Controller/ProductController';
import {
    SQIPCardEntry, SQIPCore
} from 'react-native-square-in-app-payments';

class CheckoutPageDetail extends Component {
    constructor() {
        super();
        this.onStartCardEntry = this.onStartCardEntry.bind(this);
        this.onCardNonceRequestSuccess = this.onCardNonceRequestSuccess.bind(this);
        this.state = {
            sortListedData: [],
            partyDetail: [],
            categoryNameD: '',
            cardName: '',
            cardNumber: '',
            getTotalAmouonttt: '',
            dateExp: '',
            cvcNUm: '',
            date: '',
            focus: 'startDate',
            startDate: '',
            endDate: '',
            displayedDate: new Date(),
            iSdateClicked: false,
            party_info: [],
            CardDetails: '',
            totalAmountValue: '',
        };
    }

    async callIOSDESIGN() {
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

    updateText(nxx) {
        this.props.setLoader(false);

        if (this.props.route.hasOwnProperty('params') && this.props.route.params !== undefined
            && this.props.route.params.hasOwnProperty('sortListIdSelect')) {

            this.setState({ sortListedData: this.props.route.params.sortListIdSelect })
            console.log("Total amount data : 96 : ", this.props.route.params.sortListIdSelect);
            this.getTotalAmount(this.props.route.params.sortListIdSelect)
        }
        if (this.props.route.hasOwnProperty('params') && this.props.route.params !== undefined
            && this.props.route.params.hasOwnProperty('party_info')) {

            this.setState({ party_info: this.props.route.params.party_info })
        }
        if (this.props.route.hasOwnProperty('params') && this.props.route.params !== undefined
            && this.props.route.params.hasOwnProperty('categoryName')) {
            this.setState({ categoryNameD: this.props.route.params.categoryName })
        }
        if (this.props.route.hasOwnProperty('params') && this.props.route.params !== undefined
            && this.props.route.params.hasOwnProperty('partyDetailList')) {

            this.setState({ partyDetail: this.props.route.params.partyDetailList })
        }

        this.callIOSDESIGN()
    }

    componentDidMount() {
        this.props.setLoader(false);

        if (this.props.route.hasOwnProperty('params') && this.props.route.params !== undefined
            && this.props.route.params.hasOwnProperty('sortListIdSelect')) {
            this.setState({ sortListedData: this.props.route.params.sortListIdSelect })
            console.log("Total amount data : 122 : ", this.props.route.params.sortListIdSelect);
            this.getTotalAmount(this.props.route.params.sortListIdSelect)
        }
        if (this.props.route.hasOwnProperty('params') && this.props.route.params !== undefined
            && this.props.route.params.hasOwnProperty('party_info')) {

            this.setState({ party_info: this.props.route.params.party_info })
        }
        if (this.props.route.hasOwnProperty('params') && this.props.route.params !== undefined
            && this.props.route.params.hasOwnProperty('categoryName')) {
            this.setState({ categoryNameD: this.props.route.params.categoryName })
        }
        if (this.props.route.hasOwnProperty('params') && this.props.route.params !== undefined
            && this.props.route.params.hasOwnProperty('partyDetailList')) {

            this.setState({ partyDetail: this.props.route.params.partyDetailList })
        }

        this.callIOSDESIGN();
    }

    onCardEntryComplete() {
    }

    async onCardNonceRequestSuccess(cardDetails) {
        this.setState({ CardDetails: cardDetails.card.lastFourDigits });
        try {
            let permittedValues2 = [];
            let sortlisted = this.state.sortListedData;
            for (let i = 0; i < sortlisted.length; i++) {
                if (sortlisted[i].isSelected) {
                    permittedValues2.push(sortlisted[i].id)
                }
            }
            this.props.setLoader(true);

            var that = this;
            var data = {
                device_type: Platform.OS == "ios" ? '2' : '1',
                id_cart: permittedValues2.toString(),
                sourceId: cardDetails.nonce,
                verificationToken: ''
            };
            var result = await ProdCtrl.ConfirmPaymentCardDetailSquare(data).catch(obj => {
                this.props.setLoader(false);
                var code = obj.success;
                ErrorCtrl.showError({
                    msg: obj.message,
                });
                return false;
            });

            this.props.setLoader(false);

            if (result) {
                this.validateForm(result.data.id)
            }

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

    renderItemTypeDetails = ({ item, index }) => {
        if (item.isSelected) {
            return (
                <View style={{ width: '100%', marginBottom: 10 }}>
                    <View style={[styles.vie1, { marginTop: 0 }]}>
                        <Text style={[CommonStyles.txt4, { fontSize: 14, color: Colors.darkGray, width: '30%' }]}>Vendor</Text>
                        <Text style={[CommonStyles.txt4, { textAlign: 'right', fontSize: 14, width: '65%', marginLeft: 10 }]}>
                            {item.vendor_info[0].name}</Text>
                    </View>
                    <View style={[styles.vie1, { marginTop: 10 }]}>
                        <Text style={[CommonStyles.txt4, { fontSize: 14, color: Colors.darkGray, width: '30%' }]}>
                            {item.plan_info == null ? 'Product' : 'Plan'}</Text>
                        <Text style={[CommonStyles.txt4, { textAlign: 'right', fontSize: 14, width: '65%', marginLeft: 10 }]}>
                            {item.plan_info == null ? item.product_info[0].title : item.plan_info[0].plan_name}
                            ($ {item.plan_info == null ?
                                parseFloat(item.product_info[0].price).toFixed(2) :
                                parseFloat(item.plan_info[0].plan_amount).toFixed(2)})</Text>
                    </View>
                </View>
            )
        }
    }

    getTotalAmount(DATTA) {
        let totalAmount = '0';

        let sortlisted = DATTA;

        console.log("Total amount data : 239 : ", DATTA);
        for (let i = 0; i < sortlisted.length; i++) {

            if (sortlisted[i].isSelected) {
                if (sortlisted[i].plan_info !== null)
                    (totalAmount) = parseFloat((totalAmount)) + parseFloat(sortlisted[i].plan_info[0].plan_amount);
                else
                    (totalAmount) = parseFloat((totalAmount)) + parseFloat(sortlisted[i].price);
            }
        }
        // item.plan_info == null ? item.price : item.plan_info[0].plan_amount
        this.setState({ getTotalAmouonttt: '$' + parseFloat(totalAmount).toFixed(2) })
        return '$' + parseFloat(totalAmount).toFixed(2);
    }

    async PAYNOW_Square() {
    }

    async validateForm(ID_TOKEN) {
        let permittedValues2 = [];
        let sortlisted = this.state.sortListedData;
        for (let i = 0; i < sortlisted.length; i++) {
            if (sortlisted[i].isSelected) {
                permittedValues2.push(sortlisted[i].id)
            }
        }
        this.props.setLoader(true);

        var that = this;
        var data = {
            device_type: Platform.OS == "ios" ? '2' : '1',
            id_events: this.state.partyDetail.id,
            id_cart: permittedValues2.toString(),
            id_payment_token: ID_TOKEN
        };
        var result = await ProdCtrl.ConfirmBookingFromSortlist(data).catch(obj => {
            this.props.setLoader(false);
            var code = obj.success;

            ErrorCtrl.showError({
                msg: obj.message,
            });
            return false;
        });

        this.props.setLoader(false);

        if (result) {
            if (this.props.route.hasOwnProperty('params') &&
                this.props.route.params !== undefined && (this.props.route.params.hasOwnProperty('updateText'))) {
                this.props.navigation.navigate('PaymentSuccessfulPAge', {
                    updateText: (newText) => this.updateText(newText),
                    sortListIdSelect: this.props.route.params.sortListIdSelect,
                    partyDetailList: this.props.route.params.partyDetailList,
                    party_info: this.props.route.params.party_info,
                    categoryName: this.props.route.params.categoryName,
                    getTotalAmouonttt: this.state.getTotalAmouonttt,
                    CardDetails: this.state.CardDetails
                })
            } else {
                this.props.navigation.navigate('PaymentSuccessfulPAge', {
                    sortListIdSelect: this.props.route.params.sortListIdSelect,
                    partyDetailList: this.props.route.params.partyDetailList,
                    party_info: this.props.route.params.party_info,
                    categoryName: this.props.route.params.categoryName,
                    CardDetails: this.state.CardDetails,
                    getTotalAmouonttt: this.state.getTotalAmouonttt,
                    updateText: (newText) => this.updateText(newText)
                })
            }
        }
    }

    render() {
        const isDateBlocked = (date) =>
            date.isBefore(moment(), 'day');

        const onDatesChange = ({ startDate, endDate, focusedInput }) =>
            this.setState({ ...this.state, focus: focusedInput }, () =>
                this.setState({ ...this.state, startDate, endDate })
            );

        const onDateChange = ({ date }) =>
            this.setState({ ...this.state, date });
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
                        height: 60, flexDirection: 'row',
                        alignItems: 'center', justifyContent: 'flex-start',
                        paddingLeft: 20, width: '100%',
                    }}>
                        <TouchableOpacity style={{
                            width: 46, height: 46, justifyContent: 'center',
                        }}
                            onPress={() => this.props.navigation.goBack()}
                        >
                            <Image source={{ uri: 'back' }}
                                style={{
                                    width: 24, height: 24,
                                }} resizeMode='contain' />
                        </TouchableOpacity>
                        <View style={{ width: '70%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{
                                color: Colors.black,
                                fontFamily: fonts.fontPoppinsRegular,
                                fontSize: 20,
                            }}>Checkout</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 20, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={[CommonStyles.txt3, { fontFamily: fonts.fontPoppinsMedium }]}>Party Summary</Text>
                        <Text style={[CommonStyles.txt1, { fontWeight: '300' }]}>Please double check before proceeding.</Text>
                    </View>
                    <View style={{ backgroundColor: Colors.lightGray, width: '100%', height: 12, marginTop: 15 }}></View>

                    {this.state.iSdateClicked ?
                        <View style={{
                            position: 'absolute',
                            zIndex: 3,
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            width: '100%', height: '100%', justifyContent: 'center',
                            padding: 20
                        }}>
                            <Icon
                                name="close-circle"
                                size={32}
                                onPress={() => this.setState({ iSdateClicked: false })}
                                style={{
                                    alignSelf: 'flex-end', marginRight: 10, textAlignVertical: 'bottom',
                                    marginBottom: 10
                                }}
                                color={Colors.midGray} />
                            <Text style={{
                                width: '45%', color: Colors.orange3, paddingLeft: 10,
                                fontFamily: fonts.fontPoppinsRegular
                            }}>{this.state.date && this.state.date.format('MMM D')}
                            </Text>
                            <Dates
                                date={this.state.date}
                                onDatesChange={onDateChange}
                                isDateBlocked={isDateBlocked}
                            />
                            <View style={{ width: '100%', marginTop: 20 }}>
                                <TouchableOpacity style={{
                                    width: '100%', height: 60, justifyContent: 'center', alignItems: 'center',
                                    marginBottom: 20
                                }}
                                    onPress={() => { this.setState({ iSdateClicked: false }) }}>
                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        colors={['#7111DC', '#F85D47', '#FEAC46']}
                                        style={CommonStyles.userGradButton}
                                    >
                                        <Text style={[CommonStyles.userButtonText]}>Choose this date</Text>
                                    </LinearGradient>

                                </TouchableOpacity>

                            </View>
                        </View>
                        : null}

                    <KeyboardAvoidingView
                        behavior={Platform.OS == "ios" ? "padding" : "height"}
                        style={{
                            height: '78%', width: '100%',
                        }}
                    >
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            keyboardShouldPersistTaps={'handled'}
                            contentContainerStyle={{ paddingBottom: wp(5), flexGrow: 1 }}>
                            <View style={{
                                width: '100%', height: '100%',
                                alignSelf: 'flex-start', paddingTop: 20, paddingBottom: 20,
                                justifyContent: 'flex-start',
                            }}>
                                <View style={{ width: '100%', padding: 20 }}>
                                    <Text style={[CommonStyles.txt4, { fontSize: 16 }]}>Party Details</Text>
                                    <View style={styles.vie1}>
                                        <Text style={[CommonStyles.txt4,
                                        { fontSize: 14, color: Colors.darkGray, width: '30%' }]}>Party Name</Text>
                                        <Text style={[CommonStyles.txt4,
                                        { textAlign: 'right', fontSize: 14, width: '68%', marginLeft: 10 }]}>
                                            {this.state.partyDetail.event_title}</Text>
                                    </View>
                                    <View style={styles.vie1}>
                                        <Text style={[CommonStyles.txt4,
                                        { fontSize: 14, color: Colors.darkGray, width: '30%' }]}>Party Address</Text>
                                        <Text style={[CommonStyles.txt4,
                                        { textAlign: 'right', fontSize: 14, width: '68%', marginLeft: 10, flexWrap: 'wrap' }]}
                                            numberOfLines={2}>{this.state.partyDetail.event_location}</Text>
                                    </View>
                                    <View style={styles.vie1}>
                                        <Text style={[CommonStyles.txt4, { fontSize: 14, color: Colors.darkGray, width: '30%' }]}>Party Date</Text>
                                        <Text style={[CommonStyles.txt4, { textAlign: 'right', fontSize: 14, width: '68%', marginLeft: 10 }]}>
                                            {this.state.partyDetail.event_date}</Text>
                                    </View>
                                    <View style={styles.vie1}>
                                        <Text style={[CommonStyles.txt4, { fontSize: 14, color: Colors.darkGray, width: '30%' }]}>Party To Date</Text>
                                        <Text style={[CommonStyles.txt4, { textAlign: 'right', fontSize: 14, width: '68%', marginLeft: 10 }]}>
                                            {this.state.partyDetail.event_to_date}</Text>
                                    </View>
                                    <View style={styles.vie1}>
                                        <Text style={[CommonStyles.txt4, { fontSize: 14, color: Colors.darkGray, width: '30%' }]}>Category</Text>
                                        <Text style={[CommonStyles.txt4, { textAlign: 'right', fontSize: 14, width: '68%', marginLeft: 10 }]}>
                                            {(this.state.party_info !== null &&
                                                this.state.party_info.length !== 0) ? this.state.party_info[0].category_name : ''}</Text>
                                    </View>

                                    <Text style={[CommonStyles.txt4, { fontSize: 16, marginTop: 20 }]}>Booking Lists</Text>
                                </View>
                                <View style={{ width: '100%', paddingLeft: 20, paddingRight: 20 }}>

                                    <FlatList
                                        ref={(ref) => { this.list3 = ref; }}
                                        onScrollToIndexFailed={(error) => {
                                            this.list3.scrollToOffset({ offset: error.averageItemLength * error.index, animated: true });
                                            setTimeout(() => {
                                                if (this.state.categorieDetails.length !== 0 && this.list3 !== null) {
                                                    this.list3.scrollToIndex({ index: error.index, animated: true });
                                                }
                                            }, 100);
                                        }}
                                        data={this.state.sortListedData}
                                        renderItem={this.renderItemTypeDetails.bind(this)}
                                        keyExtractor={(item) => "_#" + item.id}
                                        extraData={this.state}
                                        showsHorizontalScrollIndicator={false}
                                        snapToAlignment={'center'}
                                    />
                                </View>
                                <View style={{ backgroundColor: Colors.lightGray, width: '100%', height: 12, marginTop: 15 }}></View>
                                <View style={[styles.vie1, { paddingLeft: 20, paddingRight: 20 }]}>
                                    <Text style={[CommonStyles.txt4, { fontSize: 18, color: Colors.darkGray, width: '30%' }]}>Total</Text>
                                    <Text style={[CommonStyles.txt4, { textAlign: 'right', width: '68%', marginLeft: 10 }]}>
                                        {this.state.getTotalAmouonttt}</Text>
                                </View>
                                <View style={{ backgroundColor: Colors.lightGray, width: '100%', height: 12, marginTop: 15 }}></View>
                                <TouchableOpacity
                                    style={{ padding: 20 }}
                                    onPress={() => {
                                        this.onStartCardEntry()
                                    }
                                    }>
                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        colors={['#7111DC', '#F85D47', '#FEAC46']}
                                        style={[CommonStyles.userGradButton, {}]}
                                    >
                                        <Text style={[CommonStyles.userButtonText]}>Pay Now</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </SafeAreaView>
        )
    }
};

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'
    },
    vie1: {
        width: '100%',
        marginTop: 15,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
    },
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
)(CheckoutPageDetail);
