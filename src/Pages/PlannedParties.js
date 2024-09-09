import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Platform, TouchableOpacity, FlatList, Alert } from 'react-native';
import CommonStyles from '../styles/CommonStyles';
import { connect } from 'react-redux';
import { actions as appActions } from "../AppState/actions/appActions";
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Colors } from '../Components/theme';
import LinearGradient from 'react-native-linear-gradient';
import { ProdCtrl } from '../Controller/ProductController';
import { ErrorCtrl } from '../Controller/ErrorController';

class PlannedParties extends Component {
    constructor(props) {
        super(props)
        this.state = {
            plannedPartyDetails: [],
        }
    }

    componentDidMount() {
        this.callPlannedParties();
    }

    updateText(updatee) {
        console.log('updateText')
        console.log('updatee', updatee)
        this.props.setLoader(false);
        this.callPlannedParties();
    }

    async callPlannedParties() {
        var that = this;
        this.props.setLoader(false);

        var result = await ProdCtrl.PLannedParties().catch(obj => {
            this.props.setLoader(false);

            var code = obj.success;
            if (obj.data !== 'Party details not available.') {
                console.log('obj.data', obj.data)
                ErrorCtrl.showError({
                    msg: obj.data,
                });
            }
            return false;
        });
        this.props.setLoader(false);

        if (result) {
            this.setState({ plannedPartyDetails: [] });
            this.setState({ plannedPartyDetails: result.data });
        }
    }

    async cancelBookingAPi(item, index) {
        var that = this;
        this.props.setLoader(true);

        let data = {
            device_type: Platform.OS == "ios" ? '2' : '1',
            id: item.id
        }
        console.log("Data or cancel booking :", data);
        var result = await ProdCtrl.CancelBookingParty(data).catch(obj => {
            this.props.setLoader(false);
            var code = obj.success;
            ErrorCtrl.showError({
                msg: obj.data,
            });
            return false;
        });
        this.props.setLoader(false);
        console.log("CANcel PARTY :", result)
        if (result) {
            this.callPlannedParties();
        }
    }


    renderItemTypeView = ({ item, index }) => {
        return (
            <View style={{ backgroundColor: 'white', padding: 20, marginBottom: 10 }}>
                <View style={styles.vie2}>
                    <Text style={CommonStyles.txt1}>{item.event_title}</Text>
                    {item.booking_status == '' ?
                        null :
                        item.booking_status !== 'pending' ?
                            <Text style={[CommonStyles.txt2, { color: Colors.success }]}>Confirmed Party</Text>
                            :
                            <Text style={[CommonStyles.txt2, { color: Colors.danger }]}>Pending Confirmation</Text>
                    }
                </View>
                <View style={[styles.vie3, { marginTop: 20 }]}>
                    {item.booking_number !== '' && <View style={styles.vie4}>
                        <Image source={{ uri: 'bookmark' }} style={{ width: 24, height: 24 }} resizeMode='contain' />
                        <Text style={[CommonStyles.txt1, { color: Colors.textColor, marginLeft: 12 }]}>
                            Ref. {item.booking_number}</Text>
                    </View>}
                    {item.booking_number !== '' && <View style={{ height: 0.5, backgroundColor: Colors.borderGray }}></View>}
                    <View style={styles.vie4}>
                        <Ionicons name='location-outline' size={24} color={Colors.darkGray} />
                        <Text style={[CommonStyles.txt1, {
                            width: '90%', color: Colors.textColor, marginLeft: 12,
                            flexWrap: 'wrap'
                        }]} numberOfLines={1}>{item.event_location}</Text>
                    </View>
                    <View style={{ height: 0.7, backgroundColor: Colors.borderGray }}></View>

                    <View style={styles.vie4}>
                        <Image source={{ uri: 'calendar' }} style={{ width: 24, height: 24 }} resizeMode='contain' />
                        <Text style={[CommonStyles.txt1, { color: Colors.textColor, marginLeft: 12 }]}>{item.date_time}</Text>
                    </View>

                    {item.amount !== '' && <View style={{ height: 0.5, backgroundColor: Colors.borderGray }}></View>}
                    <View style={{
                        justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center',
                        width: '100%', paddingRight: 15
                    }}>
                        {item.amount !== '' && <View style={[styles.vie4, { width: '65%' }]}>
                            <Image source={{ uri: 'money' }} style={{ width: 24, height: 24 }} resizeMode='contain' />
                            <Text style={[CommonStyles.txt1, { color: Colors.textColor, marginLeft: 12 }]}>{item.amount}</Text>
                        </View>}
                        {item.payment_status !== 2 && <Text style={[CommonStyles.txt1, { color: Colors.textColor, marginLeft: 12 }]}>
                            {item.payment_status == '1' ? 'Paid' : 'Not Paid'}</Text>}

                    </View>
                </View>
                <TouchableOpacity style={[styles.vie3, {
                    padding: 15, marginTop: 15, alignItems: 'center',
                    borderColor: Colors.midGray, borderWidth: 1.5
                }]}
                    onPress={() => {
                        this.props.navigation.navigate('MyPartyNewDesign', {
                            partyDetail: item,
                            id: item.id_event,
                            //id: item.id,
                            index: index
                        })
                    }}>
                    <Text style={[CommonStyles.txt1, { color: Colors.textColor, }]}>View my Party</Text>
                </TouchableOpacity>

                {item.booking_number !== '' && <TouchableOpacity style={{
                    marginTop: 20, width: '100%',
                    justifyContent: 'center', alignItems: 'center'
                }}
                    onPress={() => {
                        this.cancelBookingAPi(item, index);
                    }}>
                    <Text style={[CommonStyles.txt1, { color: Colors.textColor, }]}>Cancel Party</Text>
                </TouchableOpacity>}
            </View>
        )
    }


    render() {
        return (
            <SafeAreaView style={{
                justifyContent: 'space-between',
                alignItems: "center",
                backgroundColor: 'white',
                height: '100%',
                paddingTop: Platform.OS == "ios" ? 15 : 10,
            }} >
                <View style={styles.vie1}>
                    <TouchableOpacity style={{ height: 46, width: 46, alignItems: 'center', justifyContent: 'center', }}
                        onPress={() => {
                            this.props.navigation.goBack()
                        }}>
                        <Ionicons name='arrow-back' size={30} color={Colors.textColor} />
                    </TouchableOpacity>
                    <Text style={[CommonStyles.txt3, { fontWeight: '400', fontSize: 20, width: '80%', textAlign: 'center' }]}>
                        Planned Parties</Text>
                </View>
                <View style={{ width: '100%', height: '80%', backgroundColor: Colors.lightGray }}>
                    {this.state.plannedPartyDetails.length > 0 ?
                        <FlatList
                            ref={(ref) => { this.list3 = ref; }}
                            onScrollToIndexFailed={(error) => {
                                this.list3.scrollToOffset({ offset: error.averageItemLength * error.index, animated: true });
                                setTimeout(() => {
                                    if (this.state.plannedPartyDetails.length !== 0 && this.list3 !== null) {
                                        this.list3.scrollToIndex({ index: error.index, animated: true });
                                    }
                                }, 100);
                            }}
                            data={this.state.plannedPartyDetails}
                            renderItem={this.renderItemTypeView.bind(this)}
                            keyExtractor={(item) => "_#" + item.id}
                            extraData={this.state}
                            snapToAlignment={'center'}
                            contentContainerStyle={
                                {
                                    elevation: 13,
                                }
                            }
                        />
                        :
                        <View style={{
                            width: '100%', height: '100%', alignItems: 'center', verticalAlign: 'center',
                            justifyContent: 'center', alignContent: 'center'
                        }}>
                            <Text style={[CommonStyles.txt4, {
                                textAlign: 'center',
                                fontSize: 16
                            }]}>Party details not available.</Text>
                        </View>
                    }
                </View>
                <TouchableOpacity style={{
                    width: '99%', height: '12%', justifyContent: 'center',
                    alignItems: 'center', padding: 20,
                }}
                    onPress={() => {
                        this.props.navigation.navigate('OrganizePartyStartPage', {
                            updateText: (newText) => this.updateText(newText)
                        })
                    }}>
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        colors={['#7111DC', '#F85D47', '#FEAC46']}
                        style={CommonStyles.userGradButton}
                    >
                        <Text style={[CommonStyles.userButtonText]}>Plan a party</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </SafeAreaView >
        )
    }
};

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'
    },
    vie1: {
        width: '100%',
        height: '6%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 15
    },
    vie2: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%'
    },
    vie3: {
        width: '100%',
        shadowColor: 'rgba(112, 144, 176, 0.12)',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4,
        borderRadius: 12,
        borderWidth: 0.5,
        borderColor: Colors.borderGray,
        backgroundColor: 'white',
    },
    vie4: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        padding: 12,
    },
});


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
)(PlannedParties);
