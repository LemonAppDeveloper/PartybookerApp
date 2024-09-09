import React, { Component, useRef } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, Keyboard, Image, Platform, TouchableOpacity, ScrollView, KeyboardAvoidingView,
    Dimensions, Animated, UIManager, LayoutAnimation,
} from 'react-native';
import CommonStyles from '../styles/CommonStyles';
import { connect } from 'react-redux';
import { actions as appActions } from "../AppState/actions/appActions";
import { Colors, fonts } from '../Components/theme';
import LinearGradient from 'react-native-linear-gradient';
import { Input } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons'
import IconF from 'react-native-vector-icons/Feather';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import { Dropdown } from 'react-native-material-dropdown-v2';
import moment from 'moment';

import { SwipeListView } from 'react-native-swipe-list-view';
import { ProdCtrl } from '../Controller/ProductController';
import { ErrorCtrl } from '../Controller/ErrorController';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickers from 'react-native-ui-datepicker';

class MyPartyNewDesign extends Component {
    constructor(props) {
        super(props)
        this.state = {
            expanded: false,
            expandedID: '',
            selectedIDDash: '0',
            seletdIDPartyDetail: {},
            email: '',
            selectAllSelected: false,
            selectedSingle: false,
            selectedCategorySingles: [],
            selectedCategoryId: '0',
            isEditPaty: false,
            partyName: '',
            areadType: [{
                id: 0,
                value: 'Area 1'
            }, {
                id: 1,
                value: 'Area 2'
            }],
            sortBytype: '1',
            openModal: false,
            OpenDateDialogModal: false,
            categoryIDAfterSelect: '',
            partyDetail: [],
            date: '',
            focus: 'startDate',
            startDate: '',
            endDate: '',
            displayedDate: new Date(),
            //location states
            zipcode: '',
            state: '',
            city: '',
            address: '',
            lat: '',
            lng: '',
            country: '',
            countryCode: '',
            shotName: '',
            longName: '',
            markerData: {
                latitude: 25.2515407,
                longitude: 55.3015,
            },
            latt: '',
            lngg: '',
            myaddress: 'Add Location of the party',
            myPlaceColor: Colors.textColor,
            //end of location states
            allCategoryList: [],
            categoryIDOFnewSelection: '',
            category_name: '',
            showTime: false,
            setTime: new Date(),
            showTime2: false,
            setTime2: new Date(),
            setTimeLast: '',
            setTimeLast2: '',
            DetailID: '',
            cart_info: {},
            party_info: [],
            default_event: {},
            pendingInfo: [],
            shortlistInfo: [],
            confirmedInfo: [],
            pendingInfoDATA: [],
            shortlistInfoDATA: [],
            confirmedInfoDATA: [],
            isSliderOpen: false,
        }
    }

    callCompoFile() {
        this.callSubCategories();
        //this.callCategories();
        this.props.setLoader(false);

        console.log('id===', this.props.route.params.id)
        if (this.props.route.hasOwnProperty('params') && this.props.route.params !== undefined
            && this.props.route.params.hasOwnProperty('id')) {
            this.setState({ DetailID: this.props.route.params.id })
            this.callGetAllCartPartyDetail(this.props.route.params.id) //API
            this.setState({ selectedIDDash: this.props.route.params.id });
        } else {
            this.callGetAllCartPartyDetail('0')
        }

        if (this.props.route.hasOwnProperty('params') && this.props.route.params !== undefined
            && this.props.route.params.hasOwnProperty('partyDetail')) {
            this.setState({ seletdIDPartyDetail: this.props.route.params.partyDetail })
        }
    }

    componentDidMount() {
        this.callCompoFile()
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        setTimeout(() => {
            this.props.setLoader(false);
        }, 100);
    }

    componentWillUnmount() {
        this.callCompoFile()
        setTimeout(() => {
            this.props.setLoader(false);
        }, 100);
    }

    componentWillReceiveProps() {
        this.callCompoFile()
        setTimeout(() => {
            this.props.setLoader(false);
        }, 100);
    }

    updateText(nxx) {
        this.props.setLoader(true);

        this.callCompoFile()
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        this.setState({ selectAllSelected: false });
        setTimeout(() => {
            this.props.setLoader(false);
        }, 1000);
    }

    async callGetAllCartPartyDetail(ID) {
        var that = this;
        this.props.setLoader(true);
        let data = {
            device_type: Platform.OS == "ios" ? '2' : '1',
            id: ID == '0' ? '' : ID
        }
        console.log("Cart Party Detail : ", data);
        var result = await ProdCtrl.getAllCartPartyDetail(data).catch(obj => {
            this.props.setLoader(false);
            var code = obj.success;
            ErrorCtrl.showError({
                msg: obj.message,
            });
            return false;
        });
        this.props.setLoader(false);

        if (result) {
            let resuslttPending = [], resuslttSortList = [], resuslttConfirmed = [];
            if (result.data.cart_info.pending !== null)
                resuslttPending = result.data.cart_info.pending.map(v => ({ ...v, isSelected: false }));
            if (result.data.cart_info.shortlist !== null)
                resuslttSortList = result.data.cart_info.shortlist.map(v => ({ ...v, isSelected: false }));
            if (result.data.cart_info.confirmed !== null)
                resuslttConfirmed = result.data.cart_info.confirmed.map(v => ({ ...v, isSelected: false }));

            this.setState({ cart_info: null, party_info: [], default_event: null })
            this.setState({
                cart_info: result.data.cart_info,
                party_info: result.data.party_info,
                default_event: result.data.default_event,
                pendingInfo: resuslttPending,
                shortlistInfo: resuslttSortList,
                confirmedInfo: resuslttConfirmed,
                pendingInfoDATA: resuslttPending,
                shortlistInfoDATA: resuslttSortList,
                confirmedInfoDATA: resuslttConfirmed,

            })

            let dropArea = [...result.data.party_info]
            let resusltt = dropArea.map(v => ({ ...v, value: v.event_title }));

            this.setState({ areadType: [] })
            this.props.setLoader(false);

            this.setState({
                areadType: resusltt,
                categoryIDAfterSelect: result.data.default_event.id,
                partyName: result.data.default_event.event_title,
                partyDetail: result.data.default_event
            })
            var that = this;
            that.props.setLoader(false);
        }
    }

    async getAllPartyCreated() {
        var that = this;
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
            let resusltt = result.data.info.map(v => ({ ...v, value: v.event_title }));
            this.setState({ areadType: [] })
            this.setState({
                areadType: resusltt,
            })
            this.props.setLoader(false);
        }
    }

    async callCancelOrderApi() {
        var that = this;
        let permittedValues2 = [];
        let sortlisted = this.state.sortBytype == '2' ? this.state.pendingInfo : this.state.confirmedInfo;
        for (let i = 0; i < sortlisted.length; i++) {
            if (sortlisted[i].isSelected) {
                permittedValues2.push(sortlisted[i].id)
            }
        }
        this.props.setLoader(true);

        let data = {
            device_type: Platform.OS == 'ios' ? '2' : '1',
            id: permittedValues2.toString()
        }

        console.log('data_CancelBooking', data)
        var result = await ProdCtrl.CAncelBookingAfterSortlist(data).catch(obj => {
            this.props.setLoader(false);
            var code = obj.success;
            ErrorCtrl.showError({
                msg: obj.message,
            });
            return false;
        });
        this.props.setLoader(false);

        if (result) {
            alert(result.message);
            this.callCompoFile()
        }
        this.props.setLoader(false);
    }

    async callAPiToRemovePRo(ID) {
        var that = this;
        //this.props.setLoader(true);
        let data = {
            action: 'remove', device_type: Platform.OS == "ios" ? '2' : '1',
            'id': ID
        }
        var result = await ProdCtrl.DeleteMySortListData(data).catch(obj => {
            //this.props.setLoader(false);
            var code = obj.success;
            ErrorCtrl.showError({
                msg: obj.message,
            });
            return false;
        });
        //this.props.setLoader(false);
        if (result) {
            this.callCompoFile()
        }
    }

    async callCategories() {
        var that = this;
        var result = await ProdCtrl.getAllCategories().catch(obj => {
            this.props.setLoader(false);
            var code = obj.success;
            ErrorCtrl.showError({
                msg: obj.message,
            });
            return false;
        });
        this.props.setLoader(false);

        if (result) {
            this.props.setLoader(false);
            let resusltt = result.data.map(v => ({ ...v, value: v.category_name }));
            this.setState({ allCategoryList: [] })
            this.setState({ allCategoryList: resusltt, categoryIDOFnewSelection: resusltt[0].id })
        }
    }

    async callSubCategories() {
        //var that = this;
        this.props.setLoader(true);

        var result = await ProdCtrl.getAllSubCategories().catch(obj => {
            this.props.setLoader(false);
            //var code = obj.success;
            ErrorCtrl.showError({
                msg: obj.message,
            });
            return false;
        });
        this.props.setLoader(false);

        if (result) {
            let resusltt = result.data.map(v => ({ ...v, value: v.category_name }));
            this.setState({ allCategoryList: [] })
            this.setState({
                allCategoryList: resusltt,
                //categoryIDAfterSelect: resusltt[0].id //by-default set category id
            })
        }
    }

    async deletePArtyCurrent() {
        var that = this;
        let data = { id: this.state.categoryIDAfterSelect }
        var result = await ProdCtrl.DeleteCreatedParty(data).catch(obj => {
            this.props.setLoader(false);
            var code = obj.success;
            ErrorCtrl.showError({
                msg: obj.message,
            });
            return false;
        });
        this.props.setLoader(false);

        if (result) {
            alert(result.message);
            this.setState({ openModal: false, OpenDateDialogModal: false })
            this.props.propss.navigation.goBack()
            if (this.props.route.hasOwnProperty('params') &&
                this.props.route.params !== undefined &&
                (this.props.route.params.hasOwnProperty('updateText'))) {
                this.props.route.params.updateText('vendor');
            }
        }
    }

    async saveCurrentPartyChange() {
        this.props.setLoader(true);

        var that = this;
        var data = {
            id: this.state.categoryIDAfterSelect,
            title: this.state.partyDetail.event_title,
            location: this.state.address == '' ?
                this.state.partyDetail.event_location : this.state.address,
            event_date: this.state.startDate == '' ?
                this.state.partyDetail.event_date : this.state.startDate.format('YYYY-MM-DD'),
            event_to_date: this.state.endDate == '' ?
                this.state.partyDetail.event_to_date : this.state.endDate.format('YYYY-MM-DD'),
            //category: this.state.categoryIDOFnewSelection == '' ? this.state.partyDetail.event_category :
            category: this.state.categoryIDOFnewSelection == '' ? this.state.partyDetail.category :
                this.state.categoryIDOFnewSelection,
            lat: this.state.latt == '' ? this.state.partyDetail.latitude : this.state.latt,
            lng: this.state.lngg == '' ? this.state.partyDetail.longitude : this.state.lngg,
        };
        var result = await ProdCtrl.createPartyEvent(data).catch(obj => {
            this.props.setLoader(false);
            var code = obj.success;

            ErrorCtrl.showError({
                msg: obj.message,
            });
            return false;
        });

        this.props.setLoader(false);

        if (result) {
            alert(result.message);
            this.callCompoFile()
        }
        this.props.setLoader(false);
    }

    setDates = (dates) => {
        this.setState({
            ...dates,
        });
    };

    onChange = (event, selectedDate) => {
        const currentDate = moment(selectedDate).format('HH:mm:ss');
        this.setState({ showTime: false, showTime2: true, setTime: currentDate, setTimeLast: currentDate })
    };

    onChangeNext = (event, selectedDate) => {
        const currentDate = moment(selectedDate).format('HH:mm:ss');
        this.setState({ showTime2: false, setTime2: currentDate, setTimeLast2: currentDate })
    };

    renderItemType = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.vie7}
                onPress={() => {
                    this.setState({ selectedCategoryId: index })
                }}>
                <View style={[(this.state.selectedCategoryId == index) ?
                    styles.vie5 : styles.vie6, {}]}>
                    <Image source={item.imgg} style={styles.img3} resizeMode='contain' />
                </View>
                <Text style={[CommonStyles.txt2, {
                    textAlign: 'center',
                    color: this.state.selectedCategoryId == index ? Colors.orange3 : Colors.midGray
                }]}>
                    {item.text}</Text>
            </TouchableOpacity>
        )
    }

    onSelectDays(startt, endd) {

    }

    toggleExpand = (item) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (this.state.expanded)
            this.setState({ expanded: false });

        this.setState({ expanded: !this.state.expanded, expandedID: item.id });
    }

    renderItemTypeDetails = ({ item, index }) => {
        let InfoData = item.plan_info == null ? item.product_info : item.plan_info

        return (
            <View style={[styles.vie4, { paddingBottom: 10, zIndex: 200, backgroundColor: 'white', paddingLeft: 20 }]} >
                <TouchableOpacity onPress={() => {

                    let editableComparatorIndexes = this.state.sortBytype == '1' ? [...this.state.shortlistInfo] :
                        this.state.sortBytype == '2' ? [...this.state.pendingInfo] :
                            [...this.state.confirmedInfo];

                    editableComparatorIndexes[index].isSelected = !editableComparatorIndexes[index].isSelected;

                    if (this.state.sortBytype == '1')
                        this.setState({ shortlistInfo: editableComparatorIndexes });
                    if (this.state.sortBytype == '2')
                        this.setState({ pendingInfo: editableComparatorIndexes });
                    if (this.state.sortBytype == '3')
                        this.setState({ confirmedInfo: editableComparatorIndexes });

                    this.callSlecOne()
                }} style={{ width: '10%' }}>
                    {this.state.sortBytype == '1' && (
                        <Ionicons name={item.isSelected ? 'checkmark-circle' : 'ellipse-outline'} size={34}
                            color={item.isSelected ? Colors.success : Colors.borderGray} />
                    )}
                </TouchableOpacity>

                <Image source={{
                    uri: item.plan_info == null ? item.product_info[0].image_url : item.plan_info[0].plan_image_url
                }} style={styles.img1} resizeMode='cover' />
                <View style={{ marginLeft: 20, width: '50%' }}>
                    <TouchableOpacity style={{ justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', }}
                        onPress={() => {
                            if (item.product_info !== null && item.product_info[0].description !== '')
                                this.toggleExpand(item.product_info[0])
                        }}>
                        {/* <Text style={[CommonStyles.txt1, { color: Colors.textColor, width: '50%', marginRight: 10 }]}>{item.vendor_info[0].name}</Text> */}
                        <Text style={[CommonStyles.txt1, { color: Colors.textColor, width: '50%', marginRight: 10 }]}>
                            {item.plan_info == null ? item.product_info[0].title : item.plan_info[0].plan_name}</Text>
                        {item.product_info !== null && item.product_info[0].description !== '' &&
                            <Ionicons name={(this.state.expanded && this.state.expandedID == item.product_info[0].id)
                                ? "chevron-up" : "chevron-down"} size={22} color={Colors.textColor} />}
                    </TouchableOpacity>
                    {/* <Text style={[CommonStyles.txt2, { color: Colors.midGray, fontWeight: '400' }]} numberOfLines={1}>{item.plan_info == null ? item.product_info[0].title : item.plan_info[0].plan_name}</Text> */}
                    <Text style={[CommonStyles.txt2, { color: Colors.midGray, fontWeight: '400' }]} numberOfLines={1}>
                        {item.vendor_info[0].name}</Text>
                    <Text style={[CommonStyles.txt2, { color: Colors.midGray, fontWeight: '400' }]} numberOfLines={1}>
                        {item.plan_info == null ? 'Product' : 'Package'}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[CommonStyles.txt2, { color: Colors.midGray, fontWeight: '400' }]}>
                            {item.vendor_info[0].timing}</Text>
                    </View>
                    {(this.state.expanded && (item.product_info !== null && item.product_info[0].description !== '' &&
                        this.state.expandedID == item.product_info[0].id)) &&
                        <Text style={[CommonStyles.txt4, { fontSize: 12 }]}>{item.product_info[0].description}</Text>
                    }
                </View>
                <View style={{ marginRight: 20 }}>
                    <Text style={[CommonStyles.txt1, { color: Colors.textColor, marginRight: 10 }]} numberOfLines={1}>
                        ${item.plan_info == null ? item.price : item.plan_info[0].plan_amount}</Text>
                    {/* <Text style={[CommonStyles.txt1, { color: Colors.textColor, marginRight: 10 }]} numberOfLines={1}>${item.price}</Text> */}
                </View>
            </View>
        )
    }

    callSlectAll() {
        let editableComparatorIndexes = this.state.sortBytype == '1' ? [...this.state.shortlistInfo] :
            this.state.sortBytype == '2' ? [...this.state.pendingInfo] :
                [...this.state.confirmedInfo];
        for (let i = 0; i < editableComparatorIndexes.length; i++) {
            editableComparatorIndexes[i].isSelected = true;
        }
        if (this.state.sortBytype == '1')
            this.setState({ shortlistInfo: editableComparatorIndexes });
        if (this.state.sortBytype == '2')
            this.setState({ pendingInfo: editableComparatorIndexes });
        if (this.state.sortBytype == '3')
            this.setState({ confirmedInfo: editableComparatorIndexes });

        this.setState({ selectAllSelected: true });
    }

    callSlecOne() {
        let catee = [];
        let idCount = '';
        let editableComparatorIndexes = this.state.sortBytype == '1' ? [...this.state.shortlistInfo] :
            this.state.sortBytype == '2' ? [...this.state.pendingInfo] :
                [...this.state.confirmedInfo];
        this.setState({ selectedCategorySingles: [] });

        for (let i = 0; i < editableComparatorIndexes.length; i++) {
            if (editableComparatorIndexes[i].isSelected) {
                idCount++;
                catee.push(editableComparatorIndexes[i].id)
            } else idCount--;
        }

        this.setState({ selectedCategorySingles: catee });

        if (catee.length > 0)
            this.setState({ selectedSingle: true });
        else
            this.setState({ selectedSingle: false });

        console.log("editableComparatorIndexes.length", editableComparatorIndexes.length);
        if (editableComparatorIndexes.length == idCount) {
            this.setState({ selectAllSelected: true });
        } else this.setState({ selectAllSelected: false });
    }

    onChangeHandler2(value, index, item) {
        this.setState({
            categoryIDAfterSelect: item[index].id,
            partyName: value,
            partyDetail: item[index]
        })
        this.callGetAllCartPartyDetail(item[index].id)
    }

    onChangeHandler3(value, index, item) {
        this.setState({
            area: value,
            category_name: value,
            categoryIDOFnewSelection: item[index].id
        });
    }

    callSearchFilter() {
        const { email } = this.state;
        let dataa = this.state.sortBytype == '1' ? this.state.shortlistInfoDATA :
            this.state.sortBytype == '2' ? this.state.pendingInfoDATA :
                this.state.confirmedInfoDATA;

        if (email !== '') {
            const newData = dataa.filter(item => {
                const itemData = item.vendor_info[0].name ? item.vendor_info[0].name.toUpperCase() : ''.toUpperCase();
                const textData = email.toUpperCase();
                return itemData.indexOf(textData) > -1;
            })
            if (this.state.sortBytype == '1') this.setState({ shortlistInfo: newData })
            else if (this.state.sortBytype == '2') this.setState({ pendingInfo: newData })
            else if (this.state.sortBytype == '3') this.setState({ confirmedInfo: newData })
        } else {
            if (this.state.sortBytype == '1') this.setState({ shortlistInfo: this.state.shortlistInfoDATA })
            else if (this.state.sortBytype == '2') this.setState({ pendingInfo: this.state.pendingInfoDATA })
            else if (this.state.sortBytype == '3') this.setState({ confirmedInfo: this.state.confirmedInfoDATA })
        }
    }

    render() {
        const isDateBlocked = (date) => date.isBefore(moment(), 'day');

        const onDatesChange = ({ startDate, endDate, focusedInput }) =>
            this.setState({ ...this.state, focus: focusedInput }, () =>
                this.setState({ ...this.state, startDate, endDate })
            );

        const onDateChange = ({ date }) =>
            this.setState({ ...this.state, date });

        return (
            <SafeAreaView style={{
                flex: 1,
                justifyContent: 'flex-start',
                alignItems: "center",
                backgroundColor: 'white'
            }}>
                <View style={styles.vie1}>
                    <TouchableOpacity style={{ height: 46, width: 46, alignItems: 'center', justifyContent: 'center', }}
                        onPress={() => {
                            this.props.navigation.goBack()
                            if (this.props.route.hasOwnProperty('params') &&
                                this.props.route.params !== undefined &&
                                (this.props.route.params.hasOwnProperty('updateText'))) {
                                this.props.route.params.updateText('vendor');
                            }
                        }}>
                        <Ionicons name='arrow-back' size={30} color={Colors.textColor} />
                    </TouchableOpacity>
                    <Text style={[CommonStyles.txt3, { fontWeight: '400', fontSize: 20, textAlign: 'center' }]}>My Parties</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{ height: 46, width: 46, alignItems: 'center', justifyContent: 'center', }}
                            onPress={() => {
                                for (let i = 0; i < this.state.allCategoryList.length; i++) {
                                    //if (this.state.allCategoryList[i].id == this.state.partyDetail.event_category) {
                                    if (this.state.allCategoryList[i].id == this.state.partyDetail.category) {
                                        this.setState({ category_name: this.state.allCategoryList[i].category_name })
                                    }
                                }
                                this.setState({ openModal: true })
                            }}>
                            <Image source={{ uri: 'delete' }} style={{ width: 24, height: 24 }} resizeMode='contain' />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* start page without scroll */}
                <TouchableOpacity style={{ marginTop: 10 }}
                    onPress={() => { this.props.navigation.navigate('OrganizePartyStartPage') }}>
                    <Image source={{ uri: 'startog' }} style={{ width: Dimensions.get('screen').width, height: 90 }} />
                </TouchableOpacity>
                <View style={[styles.vie1, { paddingLeft: 20 }]}>
                    <Text style={[CommonStyles.txt1, { fontSize: 14 }]}>Party Details</Text>
                    <TouchableOpacity style={{ height: 46, width: 46, alignItems: 'flex-end', justifyContent: 'center', }}
                        onPress={() => {
                            for (let i = 0; i < this.state.allCategoryList.length; i++) {
                                //if (this.state.allCategoryList[i].id == this.state.partyDetail.event_category) {
                                if (this.state.allCategoryList[i].id == this.state.partyDetail.category) {
                                    this.setState({ category_name: this.state.allCategoryList[i].category_name })
                                }
                            }
                            this.setState({ openModal: true })
                        }}>
                        <Ionicons name='information-circle-outline' size={28} color={Colors.black} />
                    </TouchableOpacity>
                </View>
                {/* dropdow party done */}
                <View style={[CommonStyles.containerStyle_inp, {
                    width: '90%',
                    alignItems: 'center', justifyContent: 'center'
                }]}>
                    <View style={{
                        zIndex: 100,
                        position: 'absolute',
                        left: 20,
                        fontFamily: fonts.fontPoppinsRegular,
                        fontSize: 14,
                        height: 50,
                        paddingRight: 30,
                        justifyContent: 'center',
                        verticalAlign: 'middle',
                        alignSelf: 'center',
                        textAlignVertical: 'center',
                        fontWeight: '400',
                        color: Colors.textColor,
                        borderBottomColor: 'transparent',
                        borderBottomWidth: 0,
                        textAlign: 'center',
                        alignItems: 'center',
                        alignContent: 'center'
                    }}>
                        <Text style={{
                            fontFamily: fonts.fontPoppinsRegular,
                            fontSize: 14,
                            fontWeight: '400',
                            color: Colors.textColor,
                        }}>{this.state.partyName}</Text>
                    </View>
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
                            fontFamily: fonts.fontPoppinsRegular,
                            fontSize: 14,
                            fontWeight: '400',
                            color: Colors.textColor,
                            borderBottomColor: 'transparent',
                            borderBottomWidth: 0,
                        }}
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
                            marginTop: 36,
                            marginLeft: 0,
                            paddingLeft: 15,
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
                {/* vendord sorting */}
                <View style={[styles.vie11, { width: '90%' }]}>
                    <TouchableOpacity style={this.state.sortBytype == '1' ? styles.vie12 : styles.vie13} onPress={() => {
                        this.setState({ sortBytype: '1', isSliderOpen: false });
                    }}>
                        <Text style={[CommonStyles.txt1, {
                            color: this.state.sortBytype == '1' ? Colors.white : Colors.midGray
                        }]}>Shortlist</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={this.state.sortBytype == '2' ? styles.vie12 : styles.vie13} onPress={() => {
                        this.setState({ sortBytype: '2', isSliderOpen: false });
                    }}>
                        <Text style={[CommonStyles.txt1, {
                            color: this.state.sortBytype == '2' ? Colors.white : Colors.midGray
                        }]}>Pending</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={this.state.sortBytype == '3' ? styles.vie12 : styles.vie13} onPress={() => {
                        this.setState({ sortBytype: '3', isSliderOpen: false });
                    }}>
                        <Text style={[CommonStyles.txt1, {
                            color: this.state.sortBytype == '3' ? Colors.white : Colors.midGray
                        }]}>Confirmed</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 12, width: '100%', backgroundColor: Colors.lightGray, marginTop: 20, marginBottom: 20 }}>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS == "ios" ? "padding" : "height"}
                    style={{
                        height: hp('36%'), width: '100%',
                    }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        keyboardShouldPersistTaps={'handled'}
                        contentContainerStyle={{ flexGrow: 1 }}
                        style={{ height: '100%', width: '100%', marginBottom: Platform.OS === 'ios' ? 60 : 0, }}>
                        <View style={{
                            width: '100%', height: '100%',
                        }}>
                            <View style={{ width: '100%', height: '100%', justifyContent: 'flex-start' }}>

                                <View style={[styles.vie15, { padding: 10, }]}>
                                    <Input
                                        placeholder='Search'
                                        leftIcon={
                                            <Ionicons name='search' size={30} color={Colors.black} />
                                        }
                                        containerStyle={[CommonStyles.containerStyle_inp,
                                        { height: 51, borderWidth: 2, width: '100%', backgroundColor: Colors.white, }]}
                                        inputContainerStyle={[CommonStyles.inputContainerStyle_inp, {
                                            backgroundColor: Colors.white, borderBottomWidth: 2,
                                            borderBottomColor: Colors.borderGray, borderColor: Colors.borderGray
                                        }]}
                                        inputStyle={[CommonStyles.userButtonInput_Black, { backgroundColor: Colors.white, }]}
                                        returnKeyType="done"
                                        onSubmitEditing={event => {
                                            Keyboard.dismiss()
                                            this.callSearchFilter()
                                        }}
                                        blurOnSubmit={false}
                                        underlineColorAndroid={Colors.white}
                                        autoFocus={false}
                                        autoCorrect={false}
                                        value={this.state.email}
                                        onChangeText={(email) => this.setState({ email })}
                                    />
                                </View>

                                <View style={{ width: '100%' }}>
                                    {(this.state.sortBytype == '1' && this.state.shortlistInfo !== null &&
                                        this.state.shortlistInfo.length > 0)
                                        || (this.state.sortBytype == '2' && this.state.pendingInfo !== null &&
                                            this.state.pendingInfo.length > 0)
                                        || (this.state.sortBytype == '3' && this.state.confirmedInfo !== null &&
                                            this.state.confirmedInfo.length > 0) ?

                                        <View style={{ flex: 9 }}>
                                            <View style={{ flex: 7 }}>
                                                <SwipeListView
                                                    useFlatList={true}
                                                    data={this.state.sortBytype == '1' ? this.state.shortlistInfo :
                                                        this.state.sortBytype == '2' ? this.state.pendingInfo :
                                                            this.state.confirmedInfo}
                                                    keyExtractor={(item, index) => index}
                                                    renderItem={this.renderItemTypeDetails.bind(this)}
                                                    renderHiddenItem={({ item, index }) => (
                                                        <View>
                                                            {
                                                                this.state.sortBytype == '1' &&
                                                                <Animated.View style={{
                                                                    flexDirection: 'row',
                                                                    backgroundColor: 'red', height: 100,
                                                                    justifyContent: 'flex-end',
                                                                    alignItems: 'flex-end'
                                                                }}>
                                                                    <TouchableOpacity onPress={() => {
                                                                        if (this.state.sortBytype == '1')
                                                                            this.callAPiToRemovePRo(item.id)
                                                                    }}
                                                                        style={{
                                                                            width: '100%',
                                                                            alignItems: 'flex-end',
                                                                            justifyContent: 'center',
                                                                            height: 100,
                                                                        }}>
                                                                        <View style={{
                                                                            justifyContent: 'center',
                                                                            alignItems: 'center', paddingRight: 15
                                                                        }}>
                                                                            <IconF name='trash' size={24} color={Colors.white} />
                                                                            <Text style={[CommonStyles.txt2,
                                                                            { color: 'white', }]}>Remove</Text>
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                </Animated.View>
                                                            }
                                                        </View>
                                                    )}
                                                    rightOpenValue={this.state.sortBytype == '1' ? -100 : 0}
                                                    disableRightSwip={true}
                                                    scrollEnabled={false}
                                                    useAnimatedList
                                                    friction={20}
                                                    tension={100}
                                                    swipeToOpenVelocityContribution={20}
                                                    previewOpenValue={20}
                                                    onRowOpen={(rowKey, rowMap) => {
                                                        this.setState({ isSliderOpen: true });
                                                        if (this.state.isSliderOpen == false) {
                                                            rowMap[rowKey].closeRow()
                                                        } else { }
                                                    }}
                                                />
                                            </View>
                                        </View>
                                        :
                                        <View>
                                            <Text style={[CommonStyles.txt1, {
                                                color: Colors.textColor, alignSelf: 'center', textAlign: 'center'
                                            }]}>Nothing to show</Text>
                                        </View>
                                    }
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>


                {/* Bottom */}
                <View style={{
                    width: '100%', paddingHorizontal: 20, paddingVertical: 10, position: 'absolute', bottom: 0,
                    backgroundColor: 'white'
                }}>
                    {/* Select All */}
                    <View style={[styles.vie8, { marginBottom: 10, marginTop: 0, width: '90%', backgroundColor: '#ffffffff' }]}>
                        <TouchableOpacity style={{ justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}
                            onPress={() => { this.callSlectAll() }}>
                            <Ionicons name={this.state.selectAllSelected ? 'checkmark-circle' : 'ellipse-outline'} size={34}
                                color={this.state.selectAllSelected ? Colors.success : Colors.borderGray} />
                            <Text style={[CommonStyles.txt7, { fontSize: 16, marginLeft: 15 }]}>Select All</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Buttons */}
                    {(((this.state.sortBytype == '1' && this.state.shortlistInfo.length > 0)
                        || (this.state.sortBytype == '2' && this.state.pendingInfo.length > 0)
                        || (this.state.sortBytype == '3' && this.state.confirmedInfo.length > 0))
                        && (this.state.selectAllSelected || this.state.selectedSingle)) ?
                        <View style={{
                            flexDirection: 'row', justifyContent: 'space-between', width: '100%'
                        }}>
                            <TouchableOpacity
                                style={{ width: '45%', height: 55, justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => {
                                    if (this.state.sortBytype == '1') {
                                        let namee = '';
                                        for (let i = 0; i < this.state.allCategoryList.length; i++) {
                                            if (this.state.allCategoryList[i].id == this.state.partyDetail.category) {
                                                namee = this.state.allCategoryList[i].category_name;
                                            }
                                        }
                                        this.props.navigation.navigate('CheckoutPageDetail', {
                                            sortListIdSelect: this.state.shortlistInfo,
                                            partyDetailList: this.state.partyDetail,
                                            party_info: this.state.party_info,
                                            categoryName: namee,
                                            updateText: (newText) => this.updateText(newText)
                                        });
                                        this.setState({ selectAllSelected: false });
                                    } else {
                                        this.callCancelOrderApi();
                                    }
                                }}>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    colors={['#7111DC', '#F85D47', '#FEAC46']}
                                    style={CommonStyles.userGradButton}
                                >
                                    <Text style={[CommonStyles.userButtonText]}>
                                        {this.state.sortBytype == '1' ? 'Checkout' : 'Cancel Booking'}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Add More Button */}
                            <TouchableOpacity
                                style={{ width: '45%', height: 55, justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => {
                                    console.log('id!!!', this.state.categoryIDAfterSelect)
                                    console.log('eventlocation!!!', this.state.partyDetail.event_location)
                                    this.props.navigation.reset({
                                        index: 0,
                                        routes: [{
                                            name: 'discoverpage', // "discoverpage" name of main screen
                                            params: {
                                                id: this.state.categoryIDAfterSelect,
                                                eventLocation: this.state.partyDetail.event_location
                                            }
                                        }],
                                    });
                                }}>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    colors={['#7111DC', '#F85D47', '#FEAC46']}
                                    style={CommonStyles.userGradButton}
                                >
                                    <Text style={[CommonStyles.userButtonText]}>Add More</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={{
                            flexDirection: 'row', justifyContent: 'space-between', width: '100%'
                        }}>
                            <View style={{
                                width: '45%', height: 55, justifyContent: 'center', alignItems: 'center',
                                backgroundColor: this.state.sortBytype == '1' ? Colors.borderGray : 'rgba(246, 77, 71, 0.4)',
                                borderRadius: 12,
                            }}>
                                { }
                                <Text style={[CommonStyles.userButtonText]}>
                                    {this.state.sortBytype == '1' ? 'Checkout' : 'Cancel Booking'}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={{
                                    width: '45%', height: 55, justifyContent: 'center', alignItems: 'center'
                                }}
                                onPress={() => {
                                    this.props.setLoader(false);
                                    console.log('categoryIDAfterSelect:', this.state.categoryIDAfterSelect)
                                    console.log('eventlocation:', this.state.partyDetail.event_location)

                                    this.props.navigation.reset({
                                        index: 0,
                                        routes: [{
                                            name: 'discoverpage', // "discoverpage" name of main screen
                                            params: {
                                                id: this.state.categoryIDAfterSelect,
                                                eventLocation: this.state.partyDetail.event_location
                                            }
                                        }],
                                    });
                                }}>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    colors={['#7111DC', '#F85D47', '#FEAC46']}
                                    style={CommonStyles.userGradButton}
                                >
                                    <Text style={[CommonStyles.userButtonText]}>Add More</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    }
                </View>

                <Modal
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    isVisible={this.state.openModal}
                    onBackdropPress={() => { this.setState({ openModal: false }) }}
                    onSwipeComplete={() => { this.setState({ openModal: false }) }}
                    swipeDirection={["down"]}
                    presentationStyle='overFullScreen'
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
                        height: '75%',
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
                                <View style={{ width: '100%', height: '100%' }}>
                                    <View style={{
                                        width: '100%', height: '100%', justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                            <View style={{
                                                justifyContent: 'center', alignItems: 'center', height: 3,
                                                width: 61, backgroundColor: '#cccccc'
                                            }}></View>
                                            <View style={{
                                                flexDirection: 'row', justifyContent: 'space-between',
                                                alignItems: 'center', width: '100%', height: 50, marginTop: 10
                                            }}>
                                                <Text style={[CommonStyles.txt3, { fontWeight: '400', fontSize: 20 }]}>
                                                    Party Details</Text>
                                            </View>

                                            {/* Added */}
                                            <View style={[styles.vie3, { marginTop: 20 }]}>
                                                <View style={{ borderRadius: 12, borderColor: Colors.borderGray, borderWidth: 1, }}>
                                                    {/* Location */}
                                                    <View style={{
                                                        width: '100%', flexDirection: 'row',
                                                        justifyContent: 'flex-start', alignItems: 'flex-start',
                                                        paddingLeft: 10, marginBottom: 5, marginTop: 5
                                                    }}>
                                                        <View style={{
                                                            height: 50, justifyContent: 'center', alignItems: 'flex-start',
                                                        }}>
                                                            <Ionicons
                                                                name="location-outline"
                                                                size={24}
                                                                color={Colors.darkGray} />
                                                        </View>
                                                        <GooglePlacesAutocomplete
                                                            placeholder={this.state.partyDetail.event_location}
                                                            ref={this.myAddressRef}
                                                            disableScroll={false}
                                                            styles={{
                                                                textInput: {
                                                                    fontFamily: fonts.fontPoppinsRegular,
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    width: '70%',
                                                                    paddingLeft: 15,
                                                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                                    fontSize: wp(4),
                                                                    marginTop: 5,
                                                                    color: Colors.textColor
                                                                },
                                                                container: {
                                                                    overflow: 'visible'
                                                                },
                                                                description: { color: 'black' }
                                                            }}
                                                            textInputProps={{
                                                                placeholderTextColor: this.state.myPlaceColor
                                                            }}
                                                            minLength={3}
                                                            enableHighAccuracyLocation={true}
                                                            currentLocation={false}
                                                            fetchDetails={true}

                                                            listViewDisplayed={false}
                                                            query={{
                                                                // key: Platform.OS == 'ios' ? AppCtrl.IOS_GOOGLE_API_KEY : AppCtrl.ANDROID_GOOGLE_API_KEY,
                                                                key: 'AIzaSyBe4wpJ11h1ZivefTePLG0iIOOQMAfIo3g',
                                                                language: 'en',
                                                            }}
                                                            onFail={error => console.log(error)}
                                                            onNotFound={() => console.log('no results')}
                                                            onPress={(data, details = null) => {
                                                                var that = this;
                                                                that.setState({
                                                                    zipcode: '',
                                                                    state: '',
                                                                    city: '',
                                                                    address: '',
                                                                    lat: '',
                                                                    lng: '',
                                                                    country: '',
                                                                    countryCode: ''
                                                                })
                                                                var addressElement = details.address_components;
                                                                let tdata = {};
                                                                var street_number, route;
                                                                for (var i = 0; i <= addressElement.length - 1; i++) {
                                                                    for (var j = 0; j <= addressElement[i].types.length - 1; j++) {

                                                                        if (addressElement[i].types[j] === 'postal_code') {
                                                                            tdata['zip'] = addressElement[i].long_name
                                                                        }
                                                                        if (addressElement[i].types[j] === 'administrative_area_level_1') {
                                                                            tdata['state'] = addressElement[i].long_name
                                                                        }
                                                                        if (addressElement[i].types[j] === 'locality') {
                                                                            tdata['city'] = addressElement[i].long_name
                                                                        }
                                                                        if (addressElement[i].types[j] === "country") {
                                                                            tdata["country"] = addressElement[i].long_name
                                                                        }
                                                                        if (addressElement[i].types[j] === "country") {
                                                                            tdata["countryCode"] = addressElement[i].short_name
                                                                        }
                                                                        if (addressElement[i].types[j] === 'route') {
                                                                            route = addressElement[i].long_name
                                                                        }
                                                                        if (addressElement[i].types[j] === 'street_number') {
                                                                            street_number = addressElement[i].long_name
                                                                        }
                                                                    }
                                                                }

                                                                that.setState({
                                                                    zipcode: tdata.zip,
                                                                    state: tdata.state,
                                                                    city: tdata.city,
                                                                    address: details.formatted_address,
                                                                    lat: details.geometry.location.lat,
                                                                    lng: details.geometry.location.lng,
                                                                    country: tdata.country,
                                                                    countryCode: tdata.countryCode,
                                                                    shotName: details.address_components.length >= 0 ? details.address_components[0].short_name : '',
                                                                    longName: details.address_components.length >= 1 ? details.address_components[1].short_name : '',
                                                                })
                                                                this.setState({
                                                                    markerData:
                                                                        //  new AnimatedRegion
                                                                        ({
                                                                            latitude: details.geometry.location.lat,
                                                                            longitude: details.geometry.location.lng,
                                                                        }),
                                                                })
                                                                console.log('latitude', details.geometry.location.lat)
                                                                console.log('longitude', details.geometry.location.lng)
                                                                this.setState({ latt: details.geometry.location.lat })
                                                                this.setState({ lngg: details.geometry.location.lng })
                                                            }}
                                                        />
                                                    </View>

                                                    {/* Date */}
                                                    <View style={{ backgroundColor: Colors.borderGray, width: '100%', height: 1 }}></View>
                                                    <View style={{ backgroundColor: Colors.borderGray, width: '100%', height: 1 }}></View>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', }}>
                                                        <TouchableOpacity style={{
                                                            flexDirection: 'row', justifyContent: 'flex-start',
                                                            alignItems: 'center', paddingLeft: 10, width: '48%', height: 60
                                                        }}
                                                            onPress={() => {
                                                                this.setDates({
                                                                    OpenDateDialogModal: true,
                                                                })
                                                            }}>
                                                            <IconF
                                                                name="calendar"
                                                                size={24}
                                                                color={Colors.darkGray} />
                                                            {this.state.OpenDateDialogModal == false && (this.state.startDate !== '')
                                                                ?
                                                                <Text style={[CommonStyles.userButtonInput_Black, { paddingLeft: 10, }]}>
                                                                    {this.state.startDate && this.state.startDate.format('MMM D')}</Text> :
                                                                // <Text style={[CommonStyles.userButtonInput_Black, { paddingLeft: 10, }]}>{this.state.date && this.state.date.format('YYYY-MM-DD')}</Text> :
                                                                <Text style={[CommonStyles.userButtonInput_Black, { paddingLeft: 10, }]}>
                                                                    {moment(this.state.partyDetail.event_date).format('MMM D')}</Text>}
                                                        </TouchableOpacity>
                                                        <View style={{ backgroundColor: Colors.borderGray, width: 1, height: '100%' }}></View>
                                                        <TouchableOpacity style={{
                                                            flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',
                                                            paddingLeft: 10, width: '48%', height: 60
                                                        }}
                                                            onPress={() => {
                                                                this.setDates({
                                                                    OpenDateDialogModal: true,
                                                                })
                                                            }}>

                                                            <IconF
                                                                name="calendar"
                                                                size={24}
                                                                color={Colors.darkGray} />
                                                            {this.state.OpenDateDialogModal == false && (this.state.endDate !== '')
                                                                ?
                                                                <Text style={[CommonStyles.userButtonInput_Black, { paddingLeft: 10, }]}>
                                                                    {this.state.endDate && this.state.endDate.format('MMM D')}</Text> :

                                                                <Text style={[CommonStyles.userButtonInput_Black, { paddingLeft: 10, }]}>
                                                                    {moment(this.state.partyDetail.event_to_date).format('MMM D')}</Text>}
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={{ backgroundColor: Colors.borderGray, width: '100%', height: 1 }}></View>

                                                    <View style={{
                                                        flexDirection: 'row', width: '90%',
                                                        justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10
                                                    }} >
                                                        <IconM
                                                            name="fire"
                                                            size={26}

                                                            color={Colors.darkGray} />
                                                        <View style={{
                                                            zIndex: 100, position: 'absolute',
                                                            left: 50,
                                                            fontFamily: fonts.fontPoppinsRegular,
                                                            fontSize: 14,
                                                            height: 50,
                                                            paddingRight: 30,
                                                            justifyContent: 'center',
                                                            verticalAlign: 'middle',
                                                            alignSelf: 'center',
                                                            textAlignVertical: 'center',
                                                            fontWeight: '400',
                                                            color: Colors.textColor,
                                                            borderBottomColor: 'transparent',
                                                            borderBottomWidth: 0,
                                                            backgroundColor: 'white',
                                                        }}>
                                                            <Text style={{
                                                                fontFamily: fonts.fontPoppinsRegular,
                                                                fontSize: 14,
                                                                fontWeight: '400',
                                                                color: this.state.category_name == "Add Category" ?
                                                                    Colors.midGray : Colors.textColor

                                                            }}>{this.state.category_name}</Text>
                                                        </View>

                                                        <Dropdown
                                                            data={this.state.allCategoryList}
                                                            fontSize={14}
                                                            containerStyle={{
                                                                fontFamily: fonts.fontPoppinsRegular,
                                                                height: 65,
                                                                width: '90%',
                                                                justifyContent: 'center',
                                                                borderColor: 'rgba(24, 31, 41,0.1)',
                                                                zIndex: 2,
                                                                overflow: 'hidden',
                                                                borderBottomColor: 'transparent',
                                                                borderBottomWidth: 0,
                                                            }}
                                                            value={this.state.category_name}

                                                            baseColor={"#FFFFFF"}
                                                            textColor={this.state.category_name == "Add Category" ?
                                                                Colors.white : Colors.white}
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
                                                                this.onChangeHandler3(value, index, data)}
                                                            inputContainerStyle={{
                                                                width: '100%', height: 50,
                                                                marginTop: -24,
                                                                paddingLeft: 15,
                                                                borderBottomColor: 'transparent',
                                                                borderBottomWidth: 0,
                                                                fontFamily: fonts.fontPoppinsRegular,

                                                            }}
                                                            pickerStyle={{
                                                                marginTop: 36, marginLeft: -12, paddingLeft: 15,
                                                                width: '89.3%',
                                                                borderBottomLeftRadius: 12,
                                                                borderBottomRightRadius: 12,
                                                                borderWidth: 0.5,
                                                                borderBottomColor: 'rgba(24, 31, 41,0.1)',
                                                                borderLeftColor: 'rgba(24, 31, 41,0.1)',
                                                                borderRightColor: 'rgba(24, 31, 41,0.1)',
                                                                borderTopColor: '#00000000',
                                                                fontFamily: fonts.fontPoppinsRegular,
                                                            }}
                                                        />
                                                    </View>
                                                </View>
                                            </View>

                                        </View>

                                        <View style={{ width: '100%' }}>
                                            <TouchableOpacity style={[CommonStyles.userGradButton,
                                            { marginTop: 20, backgroundColor: Colors.danger }]}
                                                onPress={() => {
                                                    this.setState({ openModal: false, isEditPaty: true })
                                                    this.saveCurrentPartyChange()
                                                }}>
                                                <Text style={[CommonStyles.txt1, { color: Colors.white }]}>Save Changes</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[CommonStyles.userGradButton,
                                            { backgroundColor: Colors.midGray, marginTop: 20 }]}
                                                onPress={() => { this.deletePArtyCurrent() }}>
                                                <Text style={[CommonStyles.txt1, { color: Colors.textColor }]}>
                                                    Delete Party</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                </Modal>
                <Modal
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    isVisible={this.state.OpenDateDialogModal}
                    onBackdropPress={() => { this.setState({ OpenDateDialogModal: false }) }}
                    onSwipeComplete={() => { this.setState({ OpenDateDialogModal: false }) }}
                    swipeDirection={["down"]}
                    PresentationStyle="overFullScreen"
                    coverScreen={false}
                    backdropOpacity={0.8}
                    style={{
                        alignSelf: "center",
                        justifyContent: 'flex-end',
                        width: '100%',
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
                        padding: 20,
                    }}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS == "ios" ? "padding" : "height"}
                            style={{
                                width: '100%',
                            }}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                keyboardShouldPersistTaps={'handled'}
                                contentContainerStyle={{ flexGrow: 1 }}
                                style={{ width: '100%' }}>
                                <View style={{ width: '100%' }}>
                                    <View style={{
                                        width: '100%', justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                            <View style={{
                                                justifyContent: 'center', alignItems: 'center', height: 3,
                                                width: 61, backgroundColor: '#cccccc'
                                            }}></View>
                                            <View style={{
                                                flexDirection: 'row', justifyContent: 'space-between',
                                                alignItems: 'center', width: '100%', height: 50, marginTop: 10
                                            }}>
                                                <Text style={[CommonStyles.txt3, { fontWeight: '400', fontSize: 20 }]}>
                                                    Party Date Range</Text>
                                            </View>

                                            {/* Added */}
                                            <View style={[styles.container, {}]}>

                                                <View style={{
                                                    width: '100%', borderRadius: 12, borderWidth: 1,
                                                    borderColor: Colors.borderGray, justifyContent: 'space-evenly',
                                                    flexDirection: 'row', height: 60,
                                                    alignItems: 'center', marginBottom: 20
                                                }}>
                                                    <Text style={{
                                                        width: '45%', paddingLeft: 10,
                                                        fontFamily: fonts.fontPoppinsMedium, fontSize: 14, fontWeight: '500',
                                                        color: Colors.textColor
                                                    }}>From :
                                                        <Text style={{
                                                            color: Colors.orange3, paddingLeft: 10,
                                                            fontFamily: fonts.fontPoppinsRegular, fontSize: 14,
                                                            fontWeight: '500'
                                                        }}>  {this.state.startDate && this.state.startDate.format('MMM D')}</Text>
                                                    </Text>
                                                    <View style={{ width: 1, height: 60, backgroundColor: Colors.borderGray }}>

                                                    </View>
                                                    <Text style={{
                                                        width: '45%', paddingLeft: 10,
                                                        fontFamily: fonts.fontPoppinsMedium, fontSize: 14, fontWeight: '500', color: Colors.textColor
                                                    }}>To :
                                                        <Text style={{
                                                            color: Colors.orange3, paddingLeft: 10,
                                                            fontFamily: fonts.fontPoppinsRegular, fontSize: 14,
                                                            fontWeight: '500'
                                                        }}>  {this.state.endDate && this.state.endDate.format('MMM D')}</Text>
                                                    </Text>
                                                </View>
                                                <DateTimePickers
                                                    mode="range"
                                                    startDate={this.state.startDate}
                                                    endDate={this.state.endDate}
                                                    timePicker={false}
                                                    onChange={onDatesChange}
                                                    selectedItemColor={Colors.purple}
                                                    minDate={new Date()}
                                                    calendarTextStyle={CommonStyles.txt8}
                                                    selectedTextStyle={{
                                                        fontSize: 12,
                                                        fontFamily: fonts.fontPoppinsMedium,
                                                        fontWeight: '500', color: Colors.white
                                                    }}
                                                    headerTextStyle={CommonStyles.txt7}
                                                    headerButtonStyle={CommonStyles.txt7}
                                                    headerTextContainerStyle={CommonStyles.txt7}
                                                    headerButtonColor={Colors.textColor}
                                                    weekDaysTextStyle={{
                                                        fontSize: 12,
                                                        fontFamily: fonts.fontPoppinsRegular,
                                                        fontWeight: '500', color: Colors.textColor
                                                    }}
                                                    dayContainerStyle={[{
                                                        borderRadius: 4, fontFamily: fonts.fontPoppinsMedium,
                                                        fontSize: 12
                                                    }]}
                                                    displayFullDays={true}
                                                />
                                            </View >
                                        </View>

                                        <View style={{ width: '100%' }}>
                                            <TouchableOpacity style={{
                                                width: '100%', height: 60,
                                                justifyContent: 'center', alignItems: 'center',
                                            }}
                                                onPress={() => { this.setDates({ OpenDateDialogModal: false }) }}>
                                                <LinearGradient
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 1 }}
                                                    colors={['#7111DC', '#F85D47', '#FEAC46']}
                                                    style={CommonStyles.userGradButton}
                                                >
                                                    <Text style={[CommonStyles.userButtonText]}>Choose this date</Text>
                                                </LinearGradient>

                                            </TouchableOpacity>
                                            <TouchableOpacity style={[CommonStyles.userGradButton,
                                            { backgroundColor: Colors.danger, marginTop: 20 }]}
                                                onPress={() => { this.deletePArtyCurrent() }}>
                                                <Text style={[CommonStyles.txt1, { color: Colors.white }]}>Delete Party</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                </Modal>
                {this.state.showTime && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={this.state.setTime}
                        mode={'time'}
                        is24Hour={false}
                        onChange={this.onChange}
                    />
                )}
                {this.state.showTime2 && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={this.state.setTime2}
                        mode={'time'}
                        is24Hour={false}
                        onChange={this.onChangeNext}
                    />
                )}
            </SafeAreaView >
        )
    }
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexGrow: 1,
        marginTop: 20,
    },
    date: {
        marginTop: 50
    },
    focused: {
    },
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
        alignItems: 'flex-start',
        width: '100%',
    },
    vie8: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        width: '100%',
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
        width: '32.5%',
        height: '100%',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    vie13: {
        width: '32.5%',
        height: '100%',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    vie15: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    img2: {
        height: 30,
        width: 30
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
)(MyPartyNewDesign);


