import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Platform, TouchableOpacity, FlatList } from 'react-native';
import CommonStyles from '../styles/CommonStyles';
import { connect } from 'react-redux';
import { actions as appActions } from "../AppState/actions/appActions";
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Colors } from '../Components/theme';
import LinearGradient from 'react-native-linear-gradient';
import { ProdCtrl } from '../Controller/ProductController';
import { ErrorCtrl } from '../Controller/ErrorController';


class PreviousParties extends Component {
    constructor(props) {
        super(props)
        this.state = {
            prevousPartyDetail: [],
            getAllCategoryList: [],
        }
    }

    componentDidMount() {
        this.getAllCategories()
        this.callPreviousParties()
    }

    updateText(updateAp) {
        this.props.setLoader(false);
        this.getAllCategories()
        this.callPreviousParties()
    }

    async getAllCategories() {
        var that = this;

        var result = await ProdCtrl.getAllCategories().catch(obj => {
            ErrorCtrl.showError({
                msg: obj.data,
            })
            return false;
        });

        if (result) {
            this.setState({ getAllCategoryList: result.data });
        }
    }

    async callPreviousParties() {
        var that = this;
        this.props.setLoader(false);

        var result = await ProdCtrl.PreviousParties().catch(obj => {
            this.props.setLoader(false);
            var code = obj.success;
            if (obj.data !== 'Party details not available.') {
                ErrorCtrl.showError({
                    msg: obj.data,
                });
            }
            return false;
        });
        this.props.setLoader(false);

        if (result) {
            this.setState({ prevousPartyDetail: result.data });
        }
    }

    async finalCategory(ct_id) {
        let nameee = '';
        if (this.state.getAllCategoryList.length > 0)
            for (let i = 0; i < this.state.getAllCategoryList.length; i++) {
                if (ct_id == this.state.getAllCategoryList[i].id) {
                    nameee = this.state.getAllCategoryList[i].category_name
                }
            }
        alert(nameee)
    }

    renderItemTypeView = ({ item, index }) => {
        return (
            <View style={{ backgroundColor: 'white', padding: 20, marginBottom: 10 }}>
                <View style={styles.vie2}>
                    <Text style={CommonStyles.txt1}>{item.event_title}</Text>
                    <Text style={[CommonStyles.txt2, { color: item.booking_status_color }]}>{item.booking_status_title}</Text>
                </View>
                <View style={[styles.vie3, { marginTop: 20 }]}>
                    <View style={styles.vie4}>
                        <Image source={{ uri: 'bookmark' }} style={{ width: 24, height: 24 }} resizeMode='contain' />
                        <Text style={[CommonStyles.txt1, { color: Colors.textColor, marginLeft: 12 }]}>
                            Ref. {item.booking_number}</Text>
                    </View>
                    <View style={{ height: 0.5, backgroundColor: Colors.borderGray }}></View>
                    <View style={styles.vie4}>
                        <Ionicons name='location-outline' size={24} color={Colors.darkGray} />
                        <Text style={[CommonStyles.txt1, { color: Colors.textColor, marginLeft: 12 }]}
                            numberOfLines={1}>{item.vendor_name}</Text>
                    </View>
                    <View style={{ height: 0.7, backgroundColor: Colors.borderGray }}></View>

                    <View style={styles.vie4}>
                        <Image source={{ uri: 'calendar' }} style={{ width: 24, height: 24 }} resizeMode='contain' />
                        <Text style={[CommonStyles.txt1, { color: Colors.textColor, marginLeft: 12 }]}>{item.date_time}</Text>
                    </View>
                    <View style={{ height: 0.5, backgroundColor: Colors.borderGray }}></View>
                    <View style={{
                        justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', width: '100%',
                        paddingRight: 15
                    }}>
                        <View style={[styles.vie4, { width: '65%' }]}>
                            <Image source={{ uri: 'money' }} style={{ width: 24, height: 24 }} resizeMode='contain' />
                            <Text style={[CommonStyles.txt1, { color: Colors.textColor, marginLeft: 12 }]}>{item.amount}</Text>
                        </View>
                        <Text style={[CommonStyles.txt1, { color: item.payment_status_color, marginLeft: 12 }]}>
                            {item.payment_status_title}</Text>
                    </View>
                </View>
                <TouchableOpacity style={[styles.vie3, {
                    padding: 15, marginTop: 15, alignItems: 'center',
                    borderColor: Colors.midGray, borderWidth: 1.5
                }]}
                    onPress={() => {
                        this.props.navigation.navigate('MyPartyNewDesign', {
                            partyDetail: item,
                            id: item.event_id,
                            index: index
                        })
                    }}>
                    <Text style={[CommonStyles.txt1, { color: Colors.textColor, }]}>View My Party</Text>
                </TouchableOpacity>
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
                paddingTop: Platform.OS == "ios" ? 15 : 10
            }} >
                <View style={styles.vie1}>
                    <TouchableOpacity style={{ height: 46, width: 46, alignItems: 'center', justifyContent: 'center', }}
                        onPress={() => {
                            this.props.navigation.goBack()
                        }}>
                        <Ionicons name='arrow-back' size={30} color={Colors.textColor} />
                    </TouchableOpacity>
                    <Text style={[CommonStyles.txt3, { fontWeight: '400', fontSize: 20, width: '80%', textAlign: 'center' }]}>
                        Previous Parties</Text>
                </View>
                <View style={{ width: '100%', height: '80%', backgroundColor: Colors.lightGray }}>
                    {this.state.prevousPartyDetail.length > 0 ?
                        <FlatList
                            ref={(ref) => { this.list3 = ref; }}
                            onScrollToIndexFailed={(error) => {
                                this.list3.scrollToOffset({ offset: error.averageItemLength * error.index, animated: true });
                                setTimeout(() => {
                                    if (this.state.prevousPartyDetail.length !== 0 && this.list3 !== null) {
                                        this.list3.scrollToIndex({ index: error.index, animated: true });
                                    }
                                }, 100);
                            }}
                            data={this.state.prevousPartyDetail}
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
                        <View style={[CommonStyles.txt4, {
                            textAlign: 'center',
                            alignSelf: 'center',
                            verticalAlign: 'middle',
                            textAlignVertical: 'center',
                            height: '100%',
                            fontSize: 16,
                            alignContent: 'center',
                            justifyContent: 'center',
                        }]}><Text style={[CommonStyles.txt6, { fontSize: 16, }]}>Party details not available.</Text>
                        </View>
                    }
                </View>
                <TouchableOpacity style={{
                    width: '99%', height: '12%', justifyContent: 'center', alignItems: 'center',
                    padding: 20
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
        height: '8%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 15
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
)(PreviousParties);
