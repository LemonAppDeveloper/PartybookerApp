import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, TouchableOpacity, FlatList, } from 'react-native';
import CommonStyles from '../styles/CommonStyles';
import { connect } from 'react-redux';
import { actions as appActions } from "../AppState/actions/appActions";
import { Colors } from '../Components/theme';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ProdCtrl } from '../Controller/ProductController';
import { ErrorCtrl } from '../Controller/ErrorController';

class AllReviewPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            vendorInfo: [],
            vendorReview: [],
            sortBytype: '1',
            sortByatingNUmber: '5'
        }
    }

    componentDidMount() {
        if (this.props.route.hasOwnProperty('params') && this.props.route.params !== undefined
            && this.props.route.params.hasOwnProperty('vendorInfo')) {
            this.setState({ vendorInfo: this.props.route.params.vendorInfo })
            this.getAlleviews(this.props.route.params.vendorInfo.id);
        }
    }

    async getAlleviews(ID) {
        this.props.setLoader(true);
        let data = {
            'device_type': Platform.OS == "ios" ? '2' : '1',
            'id_vendor': ID
        }
        var result = await ProdCtrl.getAllVendorreviews(data).catch(obj => {
            this.props.setLoader(false);
            var code = obj.success;
            ErrorCtrl.showError({
                msg: obj.message,
            });
            return false;
        });
        this.props.setLoader(false);
        if (result) {
            this.setState({ vendorReview: result.data.review_info })
        }
    }

    renderReviewType = ({ item, index }) => {
        if ((item.rating !== null && parseInt(item.rating) == this.state.sortByatingNUmber))
            return (
                <View style={styles.vie3}>
                    <View style={[styles.vie2, { marginTop: 10, flexDirection: 'row', justifyContent: 'flex-start' }]}>
                        <Ionicons name={(item.rating !== null && parseInt(item.rating) > 0) ? 'star' : 'star-outline'} size={24}
                            color={Colors.warning} />
                        <View style={{ width: 10 }}></View>
                        <Ionicons name={(item.rating !== null && parseInt(item.rating) > 1) ? 'star' : 'star-outline'} size={24}
                            color={Colors.warning} />
                        <View style={{ width: 10 }}></View>
                        <Ionicons name={(item.rating !== null && parseInt(item.rating) > 2) ? 'star' : 'star-outline'} size={24}
                            color={Colors.warning} />
                        <View style={{ width: 10 }}></View>
                        <Ionicons name={(item.rating !== null && parseInt(item.rating) > 3) ? 'star' : 'star-outline'} size={24}
                            color={Colors.warning} />
                        <View style={{ width: 10 }}></View>
                        <Ionicons name={(item.rating !== null && parseInt(item.rating) > 4) ? 'star' : 'star-outline'} size={24}
                            color={Colors.warning} />
                    </View>
                    <Text style={[CommonStyles.txt2, { color: Colors.textColor, fontWeight: 400, marginTop: 10 }]}>
                        {item.created_at}</Text>
                    <Text style={[CommonStyles.txt4, { fontSize: 14, marginTop: 10 }]}>{item.review}</Text>
                    <Text style={[CommonStyles.txt2, { color: Colors.textColor, fontWeight: 400, marginTop: 10 }]}>
                        {item.full_name}</Text>
                </View>
            )
    }

    render() {
        return (
            <SafeAreaView style={{
                justifyContent: 'flex-start',
                alignItems: "center",
                backgroundColor: 'white',
                height: '100%',
                width: '100%',
                paddingHorizontal: 20,
                paddingVertical: 20, marginBottom: 20
            }} >
                <View style={styles.vie1}>
                    <TouchableOpacity style={{
                        height: 46, width: 46, marginLeft: 10, alignItems: 'flex-start',
                        justifyContent: 'center',
                    }}
                        onPress={() => {
                            this.props.navigation.goBack()
                        }}>
                        <Ionicons name='arrow-back' size={30} color={Colors.textColor} />
                    </TouchableOpacity>
                    <Text style={[CommonStyles.txt3, { fontWeight: '400', fontSize: 20, textAlign: 'center', width: '70%' }]}>
                        All Reviews</Text>
                </View>
                <View style={styles.vie2}>
                    <Text style={[CommonStyles.txt4, { fontSize: 18, color: Colors.success }]}>
                        {(Object.keys(this.state.vendorInfo).length > 0 && (this.state.vendorInfo.avg_rating !== null
                        )) ? parseFloat(this.state.vendorInfo.avg_rating).toFixed(1)
                            : 0}<Text style={[CommonStyles.txt4, { fontSize: 14 }]}>/5 Excellent
                        </Text>
                    </Text>
                    <View style={[styles.vie2, { marginTop: 10, flexDirection: 'row' }]}>
                        <Ionicons name={(this.state.vendorInfo.avg_rating !== null &&
                            parseInt(this.state.vendorInfo.avg_rating) > 0) ? 'star' : 'star-outline'} size={24} color={Colors.warning} />
                        <View style={{ width: 10 }}></View>
                        <Ionicons name={(this.state.vendorInfo.avg_rating !== null &&
                            parseInt(this.state.vendorInfo.avg_rating) > 1) ? 'star' : 'star-outline'} size={24} color={Colors.warning} />
                        <View style={{ width: 10 }}></View>
                        <Ionicons name={(this.state.vendorInfo.avg_rating !== null &&
                            parseInt(this.state.vendorInfo.avg_rating) > 2) ? 'star' : 'star-outline'} size={24} color={Colors.warning} />
                        <View style={{ width: 10 }}></View>
                        <Ionicons name={(this.state.vendorInfo.avg_rating !== null &&
                            parseInt(this.state.vendorInfo.avg_rating) > 3) ? 'star' : 'star-outline'} size={24} color={Colors.warning} />
                        <View style={{ width: 10 }}></View>
                        <Ionicons name={(this.state.vendorInfo.avg_rating !== null &&
                            parseInt(this.state.vendorInfo.avg_rating) > 4) ? 'star' : 'star-outline'} size={24} color={Colors.warning} />
                    </View>
                    <View style={[styles.vie11, { width: '96%' }]}>
                        <TouchableOpacity style={this.state.sortBytype == '1' ? styles.vie12 : styles.vie10} onPress={() => {
                            this.setState({ sortBytype: '1', sortByatingNUmber: '5' });
                        }}>
                            <Text style={[CommonStyles.txt1,
                            { color: this.state.sortBytype == '1' ? Colors.white : Colors.midGray }]}>5 Star</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={this.state.sortBytype == '2' ? styles.vie12 : styles.vie10} onPress={() => {
                            this.setState({ sortBytype: '2', sortByatingNUmber: '4' });
                        }}>
                            <Text style={[CommonStyles.txt1,
                            { color: this.state.sortBytype == '2' ? Colors.white : Colors.midGray }]}>4 Star</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={this.state.sortBytype == '3' ? styles.vie12 : styles.vie10} onPress={() => {
                            this.setState({ sortBytype: '3', sortByatingNUmber: '3' });
                        }}>
                            <Text style={[CommonStyles.txt1,
                            { color: this.state.sortBytype == '3' ? Colors.white : Colors.midGray }]}>3 Star</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={this.state.sortBytype == '4' ? styles.vie12 : styles.vie10} onPress={() => {
                            this.setState({ sortBytype: '4', sortByatingNUmber: '2' });
                        }}>
                            <Text style={[CommonStyles.txt1,
                            { color: this.state.sortBytype == '4' ? Colors.white : Colors.midGray }]}>2 Star</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={this.state.sortBytype == '5' ? styles.vie12 : styles.vie10} onPress={() => {
                            this.setState({ sortBytype: '5', sortByatingNUmber: '1' });
                        }}>
                            <Text style={[CommonStyles.txt1,
                            { color: this.state.sortBytype == '5' ? Colors.white : Colors.midGray }]}>1 Star</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: '75%', width: '96%', marginTop: 10, marginBottom: 20 }}>
                        <FlatList
                            ref={(ref) => { this.list3 = ref; }}
                            onScrollToIndexFailed={(error) => {
                                this.list3.scrollToOffset({ offset: error.averageItemLength * error.index, animated: true });
                                setTimeout(() => {
                                    if (this.state.vendorReview.length !== 0 && this.list3 !== null) {
                                        this.list3.scrollToIndex({ index: error.index, animated: true });
                                    }
                                }, 100);
                            }}
                            data={this.state.vendorReview}
                            renderItem={this.renderReviewType.bind(this)}
                            keyExtractor={(item) => "_#" + item.id}
                            extraData={this.state}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            snapToAlignment={'center'}
                            style={{ padding: 5 }}
                        />
                    </View>
                </View>
            </SafeAreaView >
        )
    }
};

const styles = StyleSheet.create({
    vie1: {
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
    },
    vie2: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    vie11: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        backgroundColor: Colors.lightGray,
        borderRadius: 12,
        height: 45,
        marginTop: 20
    },
    vie12: {
        backgroundColor: Colors.orange3,
        width: '19%',
        height: '100%',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    vie10: {
        width: '19%',
        height: '100%',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    vie3: {
        width: '100%',
        borderRadius: 10,
        borderWidth: 0.7,
        borderColor: '#7090B01F',
        elevation: 3,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4,
        backgroundColor: 'white',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: 10,
        marginTop: 10,
        marginBottom: 10
    }
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
)(AllReviewPage);