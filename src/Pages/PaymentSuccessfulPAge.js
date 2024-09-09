import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import CommonStyles from '../styles/CommonStyles';
import { Colors, fonts } from '../Components/theme';
import { connect } from 'react-redux';
import { actions as appActions } from "../AppState/actions/appActions";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

class PaymentSuccessfulPAge extends Component {
    constructor() {
        super();
        this.state = {
            sortListedData: [],
            partyDetail: [],
            categoryNameD: '',
            cardName: '',
            getTotalAmouonttt: '',
            CardDetails: '',
            cardNumber: '',
            dateExp: '',
            cvcNUm: '',
            date: '',
            focus: 'startDate',
            startDate: '',
            endDate: '',
            displayedDate: new Date(),
            iSdateClicked: false,
        };
    }

    componentDidMount() {
        this.props.setLoader(false);

        if (this.props.route.hasOwnProperty('params') && this.props.route.params !== undefined
            && this.props.route.params.hasOwnProperty('sortListIdSelect')) {
            this.setState({ sortListedData: this.props.route.params.sortListIdSelect })
        }
        if (this.props.route.hasOwnProperty('params') && this.props.route.params !== undefined
            && this.props.route.params.hasOwnProperty('categoryName')) {
            this.setState({ categoryNameD: this.props.route.params.categoryName })
        }
        if (this.props.route.hasOwnProperty('params') && this.props.route.params !== undefined
            && this.props.route.params.hasOwnProperty('partyDetailList')) {
            this.setState({ partyDetail: this.props.route.params.partyDetailList })
        }
        if (this.props.route.hasOwnProperty('params') && this.props.route.params !== undefined
            && this.props.route.params.hasOwnProperty('CardDetails')) {
            this.setState({ CardDetails: this.props.route.params.CardDetails })
        }

        if (this.props.route.hasOwnProperty('params') && this.props.route.params !== undefined
            && this.props.route.params.hasOwnProperty('getTotalAmouonttt')) {
            this.setState({ getTotalAmouonttt: this.props.route.params.getTotalAmouonttt })
        }
    }

    updateText(nxx) {
        //nothing
    }

    async validateForm() {
        if (this.props.route.hasOwnProperty('params') &&
            this.props.route.params !== undefined && (this.props.route.params.hasOwnProperty('updateText'))) {
            this.props.route.params.updateText('Updated!');
        }
        this.props.navigation.navigate('MyPartyNewDesign', { updateText: (newText) => this.updateText(newText) });
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
                        width: '100%',
                        height: 60, flexDirection: 'row',
                        justifyContent: 'flex-start', alignItems: 'center',
                        paddingLeft: 20
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
                        <View style={{
                            width: '70%',
                            textAlign: 'center', justifyContent: 'center',
                            textAlignVertical: 'center',
                        }}>
                            <Text style={{
                                textAlign: 'center',
                                color: Colors.black,
                                fontFamily: fonts.fontPoppinsRegular,
                                fontSize: 20,
                                justifyContent: 'center',
                                textAlignVertical: 'center'
                            }}>Payment Successful</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 40, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Icon
                            name={"checkmark-circle"}
                            size={40}
                            color={Colors.success} />
                        <Text style={[CommonStyles.txt3, { fontFamily: fonts.fontPoppinsMedium }]}>Your party is confirmed!</Text>
                        <Text style={[CommonStyles.txt1, { fontWeight: '300', marginTop: 5 }]}>
                            We’ll email you a receipt for each invoice</Text>
                        <Text style={[CommonStyles.txt2, {
                            marginLeft: 20, marginRight: 20, textAlign: 'center',
                            paddingLeft: 20, paddingRight: 20, marginTop: 5
                        }]}>
                            Note: Please wait for at least 24 hours for the vendor to confirm your booking.</Text>
                    </View>
                    <View style={{ backgroundColor: Colors.lightGray, width: '100%', height: 12, marginTop: 15 }}></View>

                    <View style={{ width: '100%', padding: 20 }}>
                        <View style={styles.vie1}>
                            <Text style={[CommonStyles.txt4, { fontSize: 14, color: Colors.darkGray, width: '30%' }]}>
                                Party Name</Text>
                            <Text style={[CommonStyles.txt4, {
                                textAlign: 'right', fontSize: 14, width: '68%', marginLeft: 10,
                                flexWrap: 'wrap'
                            }]} numberOfLines={2}>{this.state.partyDetail.event_title}</Text>
                        </View>
                        <View style={styles.vie1}>
                            <Text style={[CommonStyles.txt4, { fontSize: 14, color: Colors.darkGray, width: '30%' }]}>
                                Card Details</Text>
                            <Text style={[CommonStyles.txt4, { textAlign: 'right', fontSize: 14, width: '68%', marginLeft: 10 }]}>
                                {this.state.CardDetails}</Text>
                        </View>
                        <View style={styles.vie1}>
                            <Text style={[CommonStyles.txt4, { fontSize: 14, color: Colors.darkGray, width: '30%' }]}>Total</Text>
                            <Text style={[CommonStyles.txt4, { textAlign: 'right', fontSize: 14, width: '68%', marginLeft: 10 }]}>
                                {this.state.getTotalAmouonttt}</Text>
                        </View>

                        <TouchableOpacity
                            style={{ marginTop: 15 }}
                            onPress={() => this.validateForm()}>
                            <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                colors={['#7111DC', '#F85D47', '#FEAC46']}
                                style={CommonStyles.userGradButton}
                            >
                                <Text style={[CommonStyles.userButtonText]}>Return to My Parties</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
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
)(PaymentSuccessfulPAge);
