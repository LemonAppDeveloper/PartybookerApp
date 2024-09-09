import React, { Component } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, Image, Platform, TouchableOpacity, FlatList, KeyboardAvoidingView, ScrollView,
    Keyboard
} from 'react-native';
import CommonStyles from '../../styles/CommonStyles';
import { connect } from 'react-redux';
import { actions as appActions } from "../../AppState/actions/appActions";
import { Colors } from '../../Components/theme';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Input } from '@rneui/themed';
import { ProdCtrl } from '../../Controller/ProductController';
import { ErrorCtrl } from '../../Controller/ErrorController';

class SearchDash extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchtext: '',
            selectedCategoryId: '',
            categoryInfoAPI: [],
            viewByList: [],
            DataNotFound: false,
            isEventFound: false
        }
        this.inputRef = React.createRef();
    }

    componentDidMount() {
        this.callCategories();
        this.getPartyDetailAPI();
    }

    // Call every time when show tab
    componentDidUpdate(prevProps) {
        console.log('SearchDash_componentDidUpdate')
        // Only call APIs if the tab index changes to SearchDash
        if (this.props.index === 1 && prevProps.index !== 1) {
            this.callCategories();
            this.getPartyDetailAPI();
        }
    }

    async getPartyDetailAPI() {
        console.log('getPartyDetailAPI')
        var result = await ProdCtrl.getAllMyPartyList().catch(obj => {
            ErrorCtrl.showError({
                msg: obj.message,
            });
            return false;
        });

        if (result) {
            if (result.data.info !== null && result.data.info.length > 0) {
                this.setState({ isEventFound: true })
                this.getVendorDetails('', '');
            } else {
                this.setState({ isEventFound: false })
                this.getVendorDetails('', '1');
            }
        }
    }

    async callCategories() {
        //this.props.setLoader(true); // Show loader before starting the API call
        try {
            console.log('try1')
            const result = await ProdCtrl.getAllCategories();

            if (result) {
                this.setState({ categoryInfoAPI: result.data });
            }
        } catch (error) {
            //ErrorCtrl.showError({ msg: error.message });
            //this.props.setLoader(false);
        } finally {
            //this.props.setLoader(false); // Hide loader after the API call completes (either success or failure)
        }
    }

    async getVendorDetails(IDD, locationFilterIgnore) {
        this.props.setLoader(true); // Show loader before starting the API call

        let data = {
            'id_category': IDD,
            'search': this.state.searchtext,
            'location_filter_ignore': locationFilterIgnore
        };
        console.log('data', data)

        try {
            const result = await ProdCtrl.getAllVendorProfileDiscoverPage(data);

            if (result && result.data.vendor_info) {
                let arrayObj = result.data.vendor_info;
                arrayObj.forEach((obj) => {
                    obj.isLiked = false;
                });
                this.setState({ viewByList: arrayObj, DataNotFound: false });
            } else {
                this.setState({ DataNotFound: true, viewByList: [] });
            }
        } catch (error) {
            //ErrorCtrl.showError({ msg: error.message });
            this.setState({ DataNotFound: true, viewByList: [] });
            this.props.setLoader(false);
        } finally {
            this.props.setLoader(false); // Hide loader after the API call completes
        }
    }

    renderItemType = ({ item, index }) => {
        return (
            <TouchableOpacity style={[styles.vie7, { justifyContent: 'flex-start', alignItems: 'center', alignContent: 'center' }]}
                onPress={() => {
                    this.setState({ selectedCategoryId: item.id })
                    if (this.state.isEventFound) {
                        this.getVendorDetails(item.id, '')
                    } else {
                        this.getVendorDetails(item.id, '1')
                    }
                }}>
                <View style={[(this.state.selectedCategoryId == item.id) ?
                    styles.vie5 : styles.vie6, {}]}>
                    <Image source={{ uri: item.category_icon }} style={styles.img3} resizeMode='contain' />
                </View>
                <Text
                    numberOfLines={1} ellipsizeMode='tail'
                    style={[CommonStyles.txt2, {
                        fontWeight: '400',
                        textAlignVertical: 'center', textAlign: 'center',
                        color: this.state.selectedCategoryId == item.id ? Colors.orange3 : Colors.midGray
                        , width: 60, textAlign: 'center',
                    }]}>
                    {item.category_name}</Text>
            </TouchableOpacity>
        )
    }

    renderItemTypeView = ({ item, index }) => {
        return (
            <View style={[styles.vie12, { padding: 10 }]}>
                <Image source={{ uri: item.banner_url }} style={styles.img5} resizeMode='cover' />
                <View style={[styles.vie4, { marginTop: 10 }]}>
                    <Text style={[CommonStyles.txt1, { color: Colors.textColor }]}>{item.name}</Text>
                </View>

                <View style={[styles.vie13, { marginTop: 10 }]}>
                    <Ionicons name={'location-outline'} size={24} color={Colors.midGray} />
                    <Text style={[CommonStyles.txt2, { color: Colors.midGray }]}>{item.category}</Text>
                </View>
                <View style={[styles.vie13, { marginTop: 10 }]}>
                    <Image source={{ uri: 'timer' }} style={{ height: 24, width: 24 }} />
                    <Text style={[CommonStyles.txt2, { fontWeight: '400', color: Colors.midGray }]}>{item.timing}</Text>
                </View>
                <View style={[styles.vie13, { justifyContent: 'flex-start', marginTop: 10 }]}>
                    <Ionicons name={(item.avg_rating >= 1) ? 'star' : (item.avg_rating >= 0.5 ? 'star-half' : 'star-outline')} size={24} color={Colors.warning} />
                    <View style={{ width: 10 }}></View>
                    <Ionicons name={(item.avg_rating >= 2) ? 'star' : (item.avg_rating >= 1.5 ? 'star-half' : 'star-outline')} size={24} color={Colors.warning} />
                    <View style={{ width: 10 }}></View>
                    <Ionicons name={(item.avg_rating >= 3) ? 'star' : (item.avg_rating >= 2.5 ? 'star-half' : 'star-outline')} size={24} color={Colors.warning} />
                    <View style={{ width: 10 }}></View>
                    <Ionicons name={(item.avg_rating >= 4) ? 'star' : (item.avg_rating >= 3.5 ? 'star-half' : 'star-outline')} size={24} color={Colors.warning} />
                    <View style={{ width: 10 }}></View>
                    <Ionicons name={(item.avg_rating >= 5) ? 'star' : (item.avg_rating >= 4.5 ? 'star-half' : 'star-outline')} size={24} color={Colors.warning} />
                </View>
                <Text style={[CommonStyles.txt1, { fontWeight: '300', marginTop: 10 }]}
                    numberOfLines={2}>{item.description}</Text>
                <TouchableOpacity style={{
                    marginTop: 10, width: '100%', height: 60, borderRadius: 12,
                    borderColor: Colors.midGray, borderWidth: 1, justifyContent: 'center', alignItems: 'center'
                }}
                    onPress={() => {
                        // redierct to vendor detail?
                        this.props.propss.navigation.navigate('VendorDetail', { 'ID': item.id })
                    }}>
                    <Text style={[CommonStyles.txt1, { color: Colors.textColor }]}>View Details</Text>
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
                height: '90%',
                width: '100%',
                paddingTop: Platform.OS == "ios" ? 20 : 0
            }} >
                <View style={styles.vie1}>
                    <TouchableOpacity style={{ height: 46, width: 46, alignItems: 'center', justifyContent: 'center', }}
                        onPress={() => {
                            //this.props.navigation.goBack()
                        }}>
                    </TouchableOpacity>
                    <Text style={[CommonStyles.txt7, { color: 'black', fontSize: 18, textAlign: 'center' }]}>
                        Advanced Search</Text>
                    <TouchableOpacity style={{ height: 46, width: 46, alignItems: 'center', justifyContent: 'center', }}
                        onPress={() => {
                            //this.props.navigation.goBack()
                        }}>
                    </TouchableOpacity>
                </View>
                <KeyboardAvoidingView
                    behavior={Platform.OS == "ios" ? "padding" : "height"}
                    style={{
                        height: this.state.doesSearch ? '90%' : '90%', width: '100%',
                    }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        keyboardShouldPersistTaps={'handled'}
                        contentContainerStyle={{ flexGrow: 1 }}
                        style={{ height: '100%', width: '100%' }}>
                        <View style={{
                            width: '100%', height: '100%',
                        }}>
                            <View style={{
                                borderRadius: 12, borderColor: Colors.borderGray, borderWidth: 1,
                                backgroundColor: Colors.lightGray, margin: 20,
                            }}>
                                <Input
                                    placeholder='Search'
                                    leftIcon={
                                        <Ionicons name='search' size={24} color={Colors.black} />
                                    }
                                    leftIconContainerStyle={{ backgroundColor: Colors.lightGray }}
                                    containerStyle={[CommonStyles.containerStyle_inp,
                                    {
                                        height: 51, borderWidth: 2, width: '100%',
                                        backgroundColor: Colors.lightGray, borderBottomWidth: Platform.OS == "ios" ? 1 : 1,
                                        borderBottomColor: Colors.borderGray
                                    }]}
                                    inputContainerStyle={[CommonStyles.inputContainerStyle_inp,
                                    { borderBottomWidth: 0, backgroundColor: Colors.lightGray }]}
                                    inputStyle={[CommonStyles.userButtonInput_Black,
                                    {
                                        backgroundColor: Colors.lightGray, borderBottomColor: Colors.darkViolet,
                                        borderBottomWidth: 0
                                    }]}
                                    returnKeyType="done"
                                    onSubmitEditing={event => {
                                        Keyboard.dismiss()
                                        if (this.state.isEventFound) {
                                            this.getVendorDetails(this.state.selectedCategoryId, '')
                                        } else {
                                            this.getVendorDetails(this.state.selectedCategoryId, '1')
                                        }
                                    }}
                                    blurOnSubmit={false}
                                    underlineColorAndroid={Colors.lightGray}
                                    autoFocus={false}
                                    autoCorrect={false}
                                    placeholderTextColor={Colors.darkGray}
                                    value={this.state.searchtext}
                                    onChangeText={(searchtext) => {
                                        this.setState({ searchtext })
                                        // Set a timeout to check if the text is empty after a short delay
                                        setTimeout(() => {
                                            if (searchtext === '') {
                                                //this.getVendorDetails(this.state.selectedCategoryId, '');
                                                if (this.state.isEventFound) {
                                                    this.getVendorDetails(this.state.selectedCategoryId, '')
                                                } else {
                                                    this.getVendorDetails(this.state.selectedCategoryId, '1')
                                                }
                                                this.inputRef.current.blur();
                                            }
                                        }, 300); //delay
                                    }}
                                    ref={this.inputRef}
                                />
                            </View>
                            <View style={{ width: '100%', justifyContent: 'flex-start', marginTop: 20 }}>
                                <Text style={[CommonStyles.txt1, { marginBottom: 20, paddingLeft: 20 }]}>Categories</Text>
                                <View style={{
                                    flexDirection: 'row', justifyContent: 'flex-start',
                                    alignItems: 'center', paddingLeft: 20
                                }}>
                                    <TouchableOpacity style={[styles.vie7, {}]}
                                        onPress={() => {
                                            this.setState({ selectedCategoryId: '' })
                                            if (this.state.isEventFound) {
                                                this.getVendorDetails('', '')
                                            } else {
                                                this.getVendorDetails('', '1')
                                            }
                                        }}>
                                        <View style={[(this.state.selectedCategoryId == '') ?
                                            styles.vie5 : styles.vie6, {}]}>
                                            <Image source={{ uri: 'categories' }} style={styles.img3} resizeMode='contain' />
                                        </View>
                                        <Text style={[CommonStyles.txt2, {
                                            textAlign: 'center',
                                            color: this.state.selectedCategoryId == '' ? Colors.orange3 : Colors.midGray
                                        }]}>
                                            All</Text>
                                    </TouchableOpacity>
                                    <FlatList
                                        ref={(ref) => { this.list3 = ref; }}
                                        onScrollToIndexFailed={(error) => {
                                            this.list3.scrollToOffset({
                                                offset: error.averageItemLength * error.index,
                                                animated: true
                                            });
                                            setTimeout(() => {
                                                if (this.state.categoryInfoAPI.length !== 0 && this.list3 !== null) {
                                                    this.list3.scrollToIndex({ index: error.index, animated: true });
                                                }
                                            }, 100);
                                        }}
                                        data={this.state.categoryInfoAPI}
                                        renderItem={this.renderItemType.bind(this)}
                                        keyExtractor={(item) => "_#" + item.id}
                                        extraData={this.state}
                                        showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}
                                        horizontal={true}
                                        snapToAlignment={'center'}
                                    />
                                </View>
                                <View style={{ height: 10, width: '100%' }}></View>
                            </View>
                            <View style={{ width: '100%', marginTop: 10 }}>
                                <Text style={[CommonStyles.txt1, { paddingLeft: 20 }]}>Best Results</Text>
                                {this.state.viewByList !== null && this.state.viewByList.length > 0 ?
                                    <FlatList
                                        ref={(ref) => { this.list3 = ref; }}
                                        onScrollToIndexFailed={(error) => {
                                            this.list3.scrollToOffset({
                                                offset: error.averageItemLength * error.index,
                                                animated: true
                                            });
                                            setTimeout(() => {
                                                if (this.state.viewByList.length !== 0 && this.list3 !== null) {
                                                    this.list3.scrollToIndex({ index: error.index, animated: true });
                                                }
                                            }, 100);
                                        }}
                                        data={this.state.viewByList}
                                        renderItem={this.renderItemTypeView.bind(this)}
                                        keyExtractor={(item) => "_#" + item.id}
                                        extraData={this.state}
                                        snapToAlignment={'center'}
                                        scrollEnabled={false}
                                        contentContainerStyle={{ elevation: 13, padding: 20 }}
                                    />
                                    :
                                    <View style={{
                                        verticalAlign: 'middle',
                                        height: '75%', width: '100%', justifyContent: 'center',
                                        alignSelf: 'center', alignItems: 'center', textAlign: 'center',
                                    }}>
                                        <Text style={[CommonStyles.txt3, {}]}>No result found</Text>
                                    </View>
                                }
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
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
        height: '7%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10
    },

    img3: {
        height: 24,
        width: 24,
        alignSelf: 'center'
    },
    vie5: {
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.orange3,
        borderRadius: 15,
    },
    vie6: {
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.midGray,
        borderRadius: 15,
    },
    vie7: {
        marginRight: 20,
    },
    vie4: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    vie12: {
        shadowColor: 'rgba(112, 144, 176, 0.12)',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4,
        borderRadius: 12,
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.borderGray,
        alignItems: 'center',
        marginBottom: 20,
    },
    vie14: {
        shadowColor: 'rgba(112, 144, 176, 0.12)',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4,
        borderRadius: 20,
        justifyContent: 'flex-start',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        width: 300,
        alignItems: 'center',
        marginBottom: 20,
        marginRight: 20,
        position: 'relative'
    },
    vie13: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    img5: {
        borderRadius: 10,
        width: '100%',
        height: 180
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
)(SearchDash);


