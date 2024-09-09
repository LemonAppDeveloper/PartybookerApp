import React, { Component } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, Image, Platform, TouchableOpacity, FlatList, KeyboardAvoidingView,
    ScrollView
} from 'react-native';
import CommonStyles from '../styles/CommonStyles';
import { connect } from 'react-redux';
import { actions as appActions } from "../AppState/actions/appActions";
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Colors, fonts } from '../Components/theme';
import LinearGradient from 'react-native-linear-gradient';
import { ProdCtrl } from '../Controller/ProductController';
import { ErrorCtrl } from '../Controller/ErrorController';
import Modal from 'react-native-modal';
import { Dropdown } from 'react-native-material-dropdown-v2';
import { heightPercentageToDP } from 'react-native-responsive-screen';

class FavouriteParties extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedCategoryId: '',
            categoryInfoAPI: [],
            FavListInfoAPI: [],
            openModalForSelect: false,
            partyName: 'Choose a Party',
            areadType: [{
                id: 0,
                value: 'Area 1'
            }, {
                id: 1,
                value: 'Area 2'
            }],
            categoryIDAfterSelect: '',
            SHOWTRANSCREEN: false
        }
    }

    componentDidMount() {
        this.getMyfavList();
        this.getAllPartyCreated()
    }

    async getOnlyFavListData(ID) {
        var that = this;
        this.props.setLoader(true);


        let data = {};
        if (ID !== '') {
            data.id_category = ID
        }

        var result = await ProdCtrl.GetAllFavData(data).catch(obj => {
            this.props.setLoader(false);
            var code = obj.success;
            ErrorCtrl.showError({
                msg: obj.message,
            });
            return false;
        });
        this.setState({
            FavListInfoAPI: [],
        })

        this.props.setLoader(false);
        if (result) {
            console.log("result", result)
            if (result.data.favorite_info == null) {
                return
            } else {
                let resultF = result.data;
                console.log("resultF", resultF)
                let vendorProduct = resultF.favorite_info
                vendorProduct.forEach(function (obj) {
                    obj.isSelected = false;
                });
                console.log("vendorProduct", vendorProduct)
                this.setState({ FavListInfoAPI: vendorProduct })
            }

        }
    }

    // New
    async getMyfavList() {
        this.props.setLoader(true);

        let data = { id_category: this.state.selectedCategoryId };
        console.log("data: ", data);

        try {
            var result = await ProdCtrl.GetAllFavData(data);
            this.setState({
                categoryInfoAPI: [],
                FavListInfoAPI: [],
            });

            if (result) {
                console.log('getMyfavList_result: ', result);
                let resultF = result.data;
                this.setState({
                    categoryInfoAPI: resultF.category,
                });
                let vendorProduct = resultF.favorite_info;
                if (vendorProduct) {
                    vendorProduct.forEach(function (obj) {
                        obj.isSelected = false;
                    });
                    this.setState({ FavListInfoAPI: vendorProduct });
                } else {
                    this.setState({ FavListInfoAPI: [] });
                }
            }
        } catch (obj) {
            var code = obj.success;
            ErrorCtrl.showError({
                msg: obj.message,
            });
        } finally {
            this.props.setLoader(false);
        }
    }

    async callDeleteParty() {
        if (this.state.FavListInfoAPI.length == 0) {
            alert("Nothing to Delete");
            this.props.setLoader(false);
            return;
        }

        this.props.setLoader(true);

        try {
            let deleteData = [];
            for (let i = 0; i < this.state.FavListInfoAPI.length; i++) {
                if (this.state.FavListInfoAPI[i].isSelected) {
                    deleteData.push(this.state.FavListInfoAPI[i].id);
                }
            }

            if (deleteData.length <= 0) {
                alert("Please select the data to delete");
                return;
            }

            let data = { id: deleteData.toString(), type: 'remove' };
            var result = await ProdCtrl.DEletePartyList(data);

            if (result) {
                this.getMyfavList();
            }
        } catch (obj) {
            var code = obj.success;
            ErrorCtrl.showError({
                msg: obj.message,
            });
        } finally {
            this.props.setLoader(false);
        }
    }

    renderItemType = ({ item, index }) => {
        return (
            <TouchableOpacity style={[styles.vie7, {
                justifyContent: 'flex-start', alignItems: 'center',
                alignContent: 'center'
            }]}
                onPress={() => {
                    this.setState({ selectedCategoryId: item.id })
                    this.getOnlyFavListData(item.id)
                }}>
                <View style={[(this.state.selectedCategoryId == item.id) ?
                    styles.vie5 : styles.vie6, {}]}>
                    <Image source={{ uri: item.category_icon_url }} style={styles.img3} resizeMode='contain' />
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

    renderItemTypeDetails = ({ item, index }) => {
        return (
            <View style={styles.vie4}>
                <TouchableOpacity onPress={() => {
                    let editableComparatorIndexes = [...this.state.FavListInfoAPI];
                    editableComparatorIndexes[index].isSelected = !editableComparatorIndexes[index].isSelected;

                    this.setState({ FavListInfoAPI: editableComparatorIndexes });
                }}>
                    <Ionicons name={item.isSelected ? 'checkmark-circle' : 'ellipse-outline'} size={34}
                        color={item.isSelected ? Colors.success : Colors.borderGray} />
                </TouchableOpacity>
                <Image source={{ uri: item.plan_info !== null ? item.plan_info.plan_image_url : item.product_info.image_url }}
                    style={styles.img1} resizeMode='cover' />
                <View style={{ marginLeft: 20 }}>
                    {/* <Text style={[CommonStyles.txt1, { color: Colors.textColor }]}>{item.vendor_info[0].name}</Text> */}
                    <Text style={[CommonStyles.txt1, { color: Colors.textColor }]}>
                        {item.plan_info !== null ? item.plan_info.plan_name : item.product_info.title}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[CommonStyles.txt2, { color: Colors.midGray, fontWeight: '400' }]}>
                            {item.vendor_info[0].name}</Text>
                        {/* <Text style={[CommonStyles.txt2, { color: Colors.midGray, fontWeight: '400' }]}>{item.vendor_info[0].timing}</Text> */}
                    </View>
                </View>
            </View>
        )
    }

    async getAllPartyCreated() {
        this.props.setLoader(true);

        var result = await ProdCtrl.getAllMyPartyList().catch(obj => {
            this.props.setLoader(false);
            var code = obj.success;
            ErrorCtrl.showError({
                msg: obj.message,
            });
            return false;
        });
        this.props.setLoader(false);

        if (result) {
            console.log('getAllPartyCreated_result: ', result)
            let resusltt = result.data.info.map(v => ({ ...v, value: v.event_title }));
            this.setState({ areadType: [] })
            this.setState({
                areadType: resusltt,
            })
        }
    }

    onChangeHandler2(value, index, item) {
        this.setState({
            categoryIDAfterSelect: item[index].id,
            partyName: value,
            partyDetail: item[index]
        })
    }

    async callFavToCart() {
        this.props.setLoader(true);
        let deleteData = [];
        for (let i = 0; i < this.state.FavListInfoAPI.length; i++) {
            if (this.state.FavListInfoAPI[i].isSelected) {
                deleteData.push(this.state.FavListInfoAPI[i].id)
            }
        }

        if (deleteData.length <= 0) {
            alert("Please Choose a Party product or package!!!")
            //alert("Please select the data to delete")
            this.props.setLoader(false);
            return
        }
        if (this.state.categoryIDAfterSelect == '') {
            alert("Please Choose a Party!!!")
            this.props.setLoader(false);
            return
        }

        // fav_info id(id), id_event(id) from api/event/get
        let data = { id: deleteData.toString(), id_event: this.state.categoryIDAfterSelect };
        console.log('callFavToCart_data', data)

        var result = await ProdCtrl.getADdToFAvCART(data).catch(obj => {
            this.props.setLoader(false);
            var code = obj.success;
            ErrorCtrl.showError({
                msg: obj.message,
            });
            return false;
        });
        this.props.setLoader(false);

        if (result) {
            this.setState({ openModalForSelect: false, SHOWTRANSCREEN: true });
        }
    }

    render() {
        return (
            <SafeAreaView style={{
                justifyContent: 'space-between',
                alignItems: "center",
                backgroundColor: 'white',
                height: '100%',
                paddingTop: Platform.OS == "ios" ? 20 : 10

            }} >
                {this.state.SHOWTRANSCREEN &&
                    <View style={{
                        width: '100%', height: heightPercentageToDP('100%'),
                        backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2, position: 'absolute',
                        justifyContent: 'space-between', alignItems: 'center',
                    }}>
                        <View style={{ height: '80%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../assets/checkmark.png')} style={{ height: 89, width: 89 }} />
                            <Text style={[CommonStyles.txt4, {
                                color: Colors.white, textAlign: 'center',
                                marginTop: 15
                            }]}>Successfully added{"\n"}to Party</Text>
                        </View>
                        <TouchableOpacity style={{
                            width: '100%', height: '10%',
                            justifyContent: 'center', alignItems: 'center', padding: 20, marginTop: 5,
                            marginBottom: 30
                        }}
                            onPress={() => { this.props.navigation.goBack() }}>
                            <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                colors={['#7111DC', '#F85D47', '#FEAC46']}
                                style={CommonStyles.userGradButton}
                            >
                                <Text style={[CommonStyles.userButtonText]}>Continue</Text>
                            </LinearGradient>

                        </TouchableOpacity>
                    </View>
                }
                <View style={styles.vie1}>
                    <TouchableOpacity style={{ height: 46, width: 46, alignItems: 'center', justifyContent: 'center', }}
                        onPress={() => {
                            this.props.navigation.goBack()
                        }}>
                        <Ionicons name='arrow-back' size={30} color={Colors.textColor} />
                    </TouchableOpacity>
                    <Text style={[CommonStyles.txt3, { fontWeight: '400', fontSize: 20, textAlign: 'center' }]}>
                        Favourites</Text>
                    <TouchableOpacity style={{ height: 46, width: 46, alignItems: 'center', justifyContent: 'center', }}
                        onPress={() => { this.callDeleteParty() }}>
                        <Image source={{ uri: 'delete' }} style={{ width: 24, height: 24 }} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
                <View style={{
                    width: '100%', height: '72%', paddingLeft: 20, paddingTop: 20, paddingBottom: 20,
                    justifyContent: 'flex-start'
                }}>
                    <Text style={[CommonStyles.txt1, { marginBottom: 20 }]}>Categories</Text>
                    <View style={{
                        flexDirection: 'row', justifyContent: 'flex-start',
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity style={[styles.vie7, {}]}
                            onPress={() => {
                                this.setState({ selectedCategoryId: '' })
                                this.getOnlyFavListData('')
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
                                this.list3.scrollToOffset({ offset: error.averageItemLength * error.index, animated: true });
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
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            snapToAlignment={'center'}
                        />
                    </View>
                    <View style={{ height: 20, width: '100%' }}></View>
                    {this.state.FavListInfoAPI.length !== 0 ?
                        <FlatList
                            ref={(ref) => { this.list3 = ref; }}
                            onScrollToIndexFailed={(error) => {
                                this.list3.scrollToOffset({ offset: error.averageItemLength * error.index, animated: true });
                                setTimeout(() => {
                                    if (this.state.FavListInfoAPI.length !== 0 && this.list3 !== null) {
                                        this.list3.scrollToIndex({ index: error.index, animated: true });
                                    }
                                }, 100);
                            }}
                            data={this.state.FavListInfoAPI}
                            renderItem={this.renderItemTypeDetails.bind(this)}
                            keyExtractor={(item) => "_#" + item.id}
                            extraData={this.state}
                            showsHorizontalScrollIndicator={false}
                            snapToAlignment={'center'}
                        />
                        :
                        <Text style={[CommonStyles.txt3, {
                            verticalAlign: 'middle',
                            height: '80%', width: '100%', justifyContent: 'center',
                            alignSelf: 'center', alignItems: 'center', textAlign: 'center'
                        }]}>Nothing to show.</Text>
                    }
                </View>
                <TouchableOpacity style={{
                    width: '100%', height: '10%', justifyContent: 'center', alignItems: 'center',
                    padding: 20, marginTop: 5
                }}
                    onPress={() => {
                        this.state.FavListInfoAPI.length == 0 ?
                            alert('Nothing to Add')
                            : this.setState({ openModalForSelect: true })
                    }}>
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        colors={['#7111DC', '#F85D47', '#FEAC46']}
                        style={CommonStyles.userGradButton}
                    >
                        <Text style={[CommonStyles.userButtonText]}>Add to my party</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <Modal
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    isVisible={this.state.openModalForSelect}
                    onBackdropPress={() => { this.setState({ openModalForSelect: false }) }}
                    onSwipeComplete={() => { this.setState({ openModalForSelect: false }) }}
                    swipeDirection={["down"]}
                    PresentationStyle="overFullScreen"
                    coverScreen={false}
                    backdropOpacity={0.8}
                    style={{
                        alignSelf: "center",
                        justifyContent: 'flex-end',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(21, 17, 62, 0.3)',
                        alignItems: 'center',
                        marginBottom: 0
                    }}>
                    <View style={{
                        backgroundColor: Colors.white,
                        width: "100%",
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: '55%',
                        padding: 20,

                    }}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS == "ios" ? "padding" : "height"}
                            style={{
                                height: '100%', width: '100%',
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
                                        width: '100%', height: '100%', justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                        <View style={{ height: '80%', width: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>
                                            <View style={{
                                                justifyContent: 'center', alignItems: 'center', height: 3, width: 61,
                                                backgroundColor: '#cccccc'
                                            }}></View>
                                            <View style={{
                                                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                                                width: '100%', height: 50, marginTop: 10
                                            }}>
                                                <Text style={[CommonStyles.txt3, { fontWeight: '400', fontSize: 20 }]}>
                                                    Add to My Party</Text>
                                            </View>
                                            <View style={[CommonStyles.containerStyle_inp,
                                            { width: '100%', marginTop: 20, alignItems: 'center', justifyContent: 'center' }]}>
                                                <Text style={{
                                                    zIndex: 100, position: 'absolute',
                                                    left: 30,
                                                    fontFamily: fonts.fontPoppinsRegular,
                                                    fontSize: 14,
                                                    fontWeight: '400',
                                                    color: Colors.textColor,
                                                    borderBottomColor: 'transparent',
                                                    borderBottomWidth: 0,
                                                    paddingTop: 10,
                                                    paddingBottom: 10,
                                                    paddingRight: 20,
                                                    color: Colors.textColor
                                                }}>{this.state.partyName}</Text>
                                                <Dropdown
                                                    data={this.state.areadType}
                                                    fontSize={14}
                                                    containerStyle={{
                                                        height: 65,
                                                        width: '90%',
                                                        justifyContent: 'center',
                                                        borderColor: 'rgba(24, 31, 41,0.1)',
                                                        zIndex: 2,
                                                        overflow: 'hidden',
                                                        borderBottomColor: 'transparent',
                                                        borderBottomWidth: 0,
                                                    }}
                                                    value={this.state.partyName}
                                                    baseColor={"#00000000"}
                                                    textColor={Colors.white}
                                                    itemTextStyle={{
                                                        fontFamily: fonts.fontPoppinsRegular, fontSize: 14,
                                                        fontWeight: '400',
                                                        color: Colors.textColor, borderBottomColor: 'transparent',
                                                        borderBottomWidth: 0,
                                                    }}
                                                    itemCount={4}
                                                    dropdownPosition={0}
                                                    itemColor={Colors.darkGray}
                                                    selectedItemColor={Colors.textColor}
                                                    disabledItemColor={Colors.borderGray}
                                                    onChangeText={(value, index, data) =>
                                                        this.onChangeHandler2(value, index, data)}
                                                    inputContainerStyle={{
                                                        width: '100%', height: 50,
                                                        marginTop: -24,
                                                        paddingLeft: 15,
                                                        borderBottomColor: 'transparent',
                                                        borderBottomWidth: 0,
                                                    }}
                                                    pickerStyle={{
                                                        marginTop: 36, marginLeft: 0, paddingLeft: 15,
                                                        width: '89.3%',
                                                        borderBottomLeftRadius: 12,
                                                        borderBottomRightRadius: 12,
                                                        borderWidth: 0.5,
                                                        borderBottomColor: 'rgba(24, 31, 41,0.1)',
                                                        borderLeftColor: 'rgba(24, 31, 41,0.1)',
                                                        borderRightColor: 'rgba(24, 31, 41,0.1)',
                                                        borderTopColor: '#00000000',
                                                    }}
                                                />
                                                <TouchableOpacity style={{
                                                    position: 'absolute',
                                                    right: 5,
                                                }}>
                                                    <Ionicons name={"chevron-down"} size={22} color={Colors.textColor} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <TouchableOpacity style={{
                                            width: '100%', height: '10%',
                                            justifyContent: 'center', alignItems: 'center',
                                            marginTop: 15
                                        }}
                                            onPress={() => {
                                                this.callFavToCart();
                                            }}>
                                            <LinearGradient
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                                colors={['#7111DC', '#F85D47', '#FEAC46']}
                                                style={CommonStyles.userGradButton}
                                            >
                                                <Text style={[CommonStyles.userButtonText]}>Add to my party</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                        <View style={{ height: 10, width: '100%' }}></View>
                                    </View>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                </Modal>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10
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
    img3: {
        height: 24,
        width: 24,
        alignSelf: 'center'
    },
    vie7: {
        marginRight: 20,
    },
    img1: {
        borderRadius: 12,
        width: 55,
        height: 55,
        backgroundColor: '#c4c4c4',
        marginLeft: 10
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
)(FavouriteParties);