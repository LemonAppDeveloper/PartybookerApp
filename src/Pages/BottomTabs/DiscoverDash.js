import React, { Component } from 'react';
import {
    View, Text, StyleSheet, ImageBackground, Image, Platform, ScrollView, StatusBar, FlatList, TouchableOpacity, Keyboard,
    Dimensions
} from 'react-native';
import CommonStyles from '../../styles/CommonStyles';
import { connect } from 'react-redux';
import { actions as appActions } from "../../AppState/actions/appActions";
import { Colors } from '../../Components/theme';
import Ionicons from 'react-native-vector-icons/Ionicons'
import IconAnt from 'react-native-vector-icons/AntDesign'
import { ProdCtrl } from '../../Controller/ProductController';
import { ErrorCtrl } from '../../Controller/ErrorController';
import { Input } from '@rneui/themed';
import Modal from 'react-native-modal';
import FitImage from 'react-native-fit-image';

class DiscoverDash extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            activeSlide: '1',
            StartSelected: '0',
            selectedCategoryId: '',
            isCreatedPartyBefore: false,
            partyCreatedList: [],
            selectionMethod: '2',
            categoryIDAfterSelect: '',
            filterBydropdown: false,
            sortByDropDown: false,
            whichSortBySelected: '',
            sortByValueList: [{
                id: 0,
                name: 'Relevance',
                isSelected: false
            }, {
                id: 'latest',
                name: 'Latest - Oldest',
                isSelected: false
            }, {
                id: 'oldest',
                name: 'Oldest - Latest',
                isSelected: false
            }, {
                id: 'most_booked',
                name: 'Most Booked',
                isSelected: false
            }, {
                id: 'A-Z',
                name: 'Alphabetically A-Z',
                isSelected: false
            }, {
                id: 'Z-A',
                name: 'Alphabetically Z-A',
                isSelected: false
            },
            ],
            ratingSeleted: '0',
            ratingShown: true,
            categoriesList: [],
            viewByList: [],
            valueOfUnread: '0',
            eventId: '',
            lastEventLocation: '',
            locationFilterIgnore: '',
        }
        this.inputRef = React.createRef();
    }

    componentDidMount() {
        this.callCategories();
        this.getPartyDetailCAll();
        this.getAllNotificationAPI();
        this.getVendorDetails('', '', '', '');
    }

    // Call every time when show tab
    componentDidUpdate(prevProps) {
        // If the tab index changes to DiscoverDash, call the necessary APIs
        if (this.props.index === 0 && prevProps.index !== 0) {
            console.log('prevProps.index !== 0')
            this.setState({ eventId: '' })
            this.callCategories();
            this.getPartyDetailCAll();
            this.getAllNotificationAPI();
            this.getVendorDetails('', '', '', '');
        }

        /**
         * From MyParty "Add More" First call componentDidMount but nothing found
         * Redirect from DiscoverDash'componentDidMount to DiscoverDash's componentDidUpdate
         * where we are getting event id and location
         */
        // Additionally, if the id has been updated, ensure getPartyDetailCAll is called with the new id
        if (prevProps.id !== this.props.id) {
            console.log('this.props.id')
            const { id } = this.props;
            const { eventLocation } = this.props;
            if (id) {
                console.log('Received updated ID in componentDidUpdate2:', id);
                console.log('Received updated Location in componentDidUpdate2:', eventLocation);
                this.setState({
                    eventId: id,
                    lastEventLocation: eventLocation // Update lastEventLocation directly with eventLocation
                });
                setTimeout(() => {
                    this.getVendorDetails('', '', id, '');
                }, 3000);
            }
        }
    }

    // Notification read - unread counter 
    async getAllNotificationAPI() {
        console.log('getAllNotificationAPI')
        let data = {};
        var result = await ProdCtrl.NotificationListNotify(data).catch(obj => {
            console.log("notificationObj", obj);
            return false;
        });

        let valueOfUnread = '0'
        if (result) {
            for (let i = 0; i < result.data.length; i++) {
                if (result.data[i].is_read == 0) {
                    valueOfUnread++;
                }
            }
            this.setState({ valueOfUnread: valueOfUnread })
            console.log('unread:', valueOfUnread)
        }
    }

    async getPartyDetailCAll() {
        console.log('getPartyDetailAPI')
        var result = await ProdCtrl.getAllMyPartyList().catch(obj => {
            var code = obj.success;
            ErrorCtrl.showError({
                msg: obj.message,
            });
            return false;
        });

        if (result) {
            if (result.data.info !== null && result.data.info.length > 0) {
                this.setState({ isCreatedPartyBefore: true, partyCreatedList: result.data.info })
                const lastEventLocation1 = result.data.info[result.data.info.length - 1].event_location;
                console.log('lastEventLocation1:', lastEventLocation1)
                //const { eventId } = this.state;
                console.log('eventId:', this.state.eventId)
                console.log('eventLocation:', this.state.lastEventLocation)
                console.log('locationFilterIgnore:', this.state.locationFilterIgnore)

                if (this.state.eventId == '' && this.state.locationFilterIgnore != '1') {
                    //if (this.state.eventId == '') {
                    console.log('if_event_id_blank')
                    this.setState({ lastEventLocation: lastEventLocation1 })
                    //this.setState({ lastEventLocation: this.state.eventLocation })
                } else {
                    console.log('else_event_id_not_blank')
                    this.setState({ lastEventLocation: this.state.lastEventLocation })
                }

                //this.getVendorDetails('', '', '', '');
            }
            else {
                console.log('getPartyDetailCAll_else')
                //this.props.setLoader(false)
                this.setState({ isCreatedPartyBefore: false, partyCreatedList: [] })
                this.setState({ lastEventLocation: 'All' });
                this.getVendorDetails('', '', '', '1');
            }
            //this.props.setLoader(false)
        }
    }

    async callCategories() {
        console.log('callCategoriesAPI')
        var result = await ProdCtrl.getAllCategories().catch(obj => {
            //this.props.setLoader(false);
            var code = obj.success;
            ErrorCtrl.showError({
                msg: obj.message,
            });
            return false;
        });
        //this.props.setLoader(false);

        if (result) {
            this.setState({ categoriesList: [] })
            this.setState({
                categoriesList: result.data,

            })
            //this.getVendorDetails('', '', '', '');
        }
    }

    // location_filter_ignore: 1 = all vendor
    // location_filter_ignore: '' = specific vendor
    async getVendorDetails(IDD, rating, eventId, locationFilterIgnore) {
        console.log('getVendorDetailsAPI');
        //this.props.setLoader(false); // Show loader
        this.props.setLoader(true); // Show loader

        // Set state here, do not change it else event location text not update
        this.setState({ locationFilterIgnore });

        let data = {
            category: IDD,
            rating: rating === '' ? this.state.StartSelected : rating,
            sort_by: this.state.whichSortBySelected,
            search: this.state.email,
            id_event: eventId,
            location_filter_ignore: locationFilterIgnore
        };
        console.log('getVendorDetailsAPI_sort', data);

        try {
            console.log('getVendorDetails_try')
            var result = await ProdCtrl.getAllVendorProfileDiscoverPage(data);

            if (result && result.data.vendor_info) {
                console.log('getVendorDetails_if')
                //this.props.setLoader(false); // Hide loader
                let arrayObj = result.data.vendor_info;
                arrayObj.forEach((obj) => {
                    obj.isLiked = false;
                });
                console.log('VendorSize:', arrayObj.length)
                this.setState({ viewByList: arrayObj });
            } else {
                console.log('getVendorDetails_else')
                //this.props.setLoader(false); // Hide loader
                this.setState({ viewByList: [] });
            }

            if (this.state.locationFilterIgnore == "1") {
                this.setState({ lastEventLocation: 'All' });
            }
        } catch (error) {
            console.log('getVendorDetails_catch')
            console.error('Error fetching vendor details:', error);
            this.setState({ viewByList: [] });
            //this.props.setLoader(false); // Hide loader
            if (error.data && error.data.message) {
                ErrorCtrl.showError({ msg: error.data.message });
            }
        } finally {
            console.log('getVendorDetails_finally')
            //this.props.setLoader(false); // Hide loader
            //this.setState({ locationFilterIgnore });
        }
    }

    renderItemType = ({ item, index }) => {
        return (
            <TouchableOpacity style={[styles.vie7, {
                justifyContent: 'flex-start',
                alignItems: 'center', alignContent: 'center',
            }]}
                onPress={() => {
                    this.setState({ selectedCategoryId: index + 1, categoryIDAfterSelect: item.id })
                    console.log('categories item click')
                    if (this.state.eventId == '' && this.state.lastEventLocation != 'All') {
                        this.getVendorDetails(item.id, '', '', '')
                    } else if (this.state.lastEventLocation == 'All') {
                        this.getVendorDetails(item.id, '', '', '1')
                    } else {
                        this.getVendorDetails(item.id, '', this.state.eventId, '')
                    }
                }}>
                <View style={[(this.state.selectedCategoryId == index + 1) ?
                    styles.vie5 : styles.vie6, {}]}>
                    <Image tintColor={Colors.white} source={{ uri: item.category_icon }} style={styles.img3}
                        resizeMode='contain' />
                </View>
                <Text
                    numberOfLines={1} ellipsizeMode='tail'
                    style={[CommonStyles.txt2, {
                        color: this.state.selectedCategoryId == index + 1 ? Colors.orange3 : Colors.midGray,
                        fontWeight: '400',
                        width: 60, textAlign: 'center',
                    }]}>
                    {item.category_name}</Text>
            </TouchableOpacity>
        )
    }

    renderItemTypeView = ({ item, index }) => {
        return (
            <View style={[styles.vie14, {}]}>
                <FitImage
                    source={{ uri: item.banner_url }}
                    style={[styles.img6, { zIndex: 2, }]}
                    borderTopLeftRadius={20} borderTopRightRadius={20}
                    resizeMode='cover' />

                <View style={[styles.vie4, {
                    zIndex: 11, borderTopStartRadius: 20, borderTopEndRadius: 20, position: 'absolute',
                    backgroundColor: 'rgba(18, 0, 39, 0.3)', height: 180
                }]}>
                </View>
                <View style={[styles.vie4, { zIndex: 99, marginTop: 10, position: 'absolute', padding: 10, }]}>
                    <Text style={[CommonStyles.txt1, { color: Colors.white }]}>{item.name}</Text>
                </View>

                <View style={{ padding: 10, width: '100%' }}>
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
                    <Text style={[CommonStyles.txt1, { height: 50, fontWeight: '300', marginTop: 10 }]} numberOfLines={2}
                    >{item.description}</Text>
                    <TouchableOpacity style={{
                        marginTop: 10, width: '100%', height: 50, borderRadius: 12,
                        borderColor: Colors.midGray, borderWidth: 1, justifyContent: 'center', alignItems: 'center'
                    }}
                        onPress={() => {
                            this.props.propss.navigation.navigate('VendorDetail', {
                                'ID': item.id,
                                updateText: (newText) => this.updateText(newText)
                            })
                        }}>
                        <Text style={[CommonStyles.txt1, { color: Colors.textColor }]}>View Details</Text>
                    </TouchableOpacity>
                </View >
            </View >
        )
    }

    renderItemTypeViewVERT = ({ item, index }) => {
        return (
            <View style={[styles.vie12, { padding: 10, }]}>
                <ImageBackground
                    source={{ uri: item.banner_url }}
                    resizeMode='cover'
                    style={styles.img5}
                    imageStyle={{ borderRadius: 12, }}
                />
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
                <Text style={[CommonStyles.txt1, { fontWeight: '300', marginTop: 10, width: '100%' }]}
                    numberOfLines={2}>{item.description}</Text>
                <TouchableOpacity style={{
                    marginTop: 10, width: '100%', height: 60, borderRadius: 12,
                    borderColor: Colors.midGray, borderWidth: 1, justifyContent: 'center', alignItems: 'center'
                }}
                    onPress={() => {
                        console.log('id===', item.id)
                        this.props.propss.navigation.navigate('VendorDetail', {
                            'ID': item.id,
                            updateText: (newText) => this.updateText(newText)
                        })
                    }}>
                    <Text style={[CommonStyles.txt1, { color: Colors.textColor }]}>View Details</Text>
                </TouchableOpacity>
            </View>

        )
    }

    updateText(valuesPass) {
        console.log("How to pass??", "What to pass ?")
        console.log("What was pass??", valuesPass)
        if (valuesPass == 'Notification') {
            this.getAllNotificationAPI()
        } else if (valuesPass == 'partyCreated') {
            this.callCategories();
            this.getPartyDetailCAll();
            this.getVendorDetails('', '', '', '')
        } else {
            this.callCategories();
            this.getPartyDetailCAll();
            //this.getVendorDetails('', '', '', '',);
            console.log("lastEventLocation??", this.state.lastEventLocation)
            if (this.state.eventId == '' && this.state.lastEventLocation != 'All') {
                this.getVendorDetails('', '', '', '') //api call
            } else if (this.state.lastEventLocation == 'All') {
                this.getVendorDetails('', '', '', '1')
            } else {
                this.getVendorDetails('', '', this.state.eventId, '')
            }
        }
    }

    renderItemOrder = ({ item, index }) => {
        return (
            <TouchableOpacity style={{
                justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center',
                marginBottom: 10
            }}
                onPress={() => {
                    console.log('id===', item.id)
                    this.setState({ whichSortBySelected: item.id }, () => {
                        if (this.state.eventId == '' && this.state.lastEventLocation != 'All') {
                            this.getVendorDetails(this.state.categoryIDAfterSelect, '', '', '')
                        } else if (this.state.lastEventLocation == 'All') {
                            this.getVendorDetails(this.state.categoryIDAfterSelect, '', '', '1')
                        } else {
                            this.getVendorDetails(this.state.categoryIDAfterSelect, '', this.state.eventId, '')
                        }
                    });
                }}>
                {/* 1 */}
                <View style={{ justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', width: '86%' }}>
                    <Text style={[CommonStyles.txt2, { fontWeight: '400', color: Colors.textColor }]}>{item.name}</Text>
                </View>
                <Ionicons name={this.state.whichSortBySelected == item.id ? 'radio-button-on' : 'radio-button-off'}
                    size={24} color={
                        this.state.whichSortBySelected == item.id ? Colors.startYellow : Colors.midGray} />
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={[CommonStyles.container, {
                justifyContent: 'flex-start',
                alignItems: "center",
                backgroundColor: Colors.lightGray,
                height: '90%',
                width: '100%',
            }]} >
                <StatusBar animated={true} backgroundColor={'white'} barStyle={'dark-content'} showHideTransition={'fade'}
                    hidden={false} />

                <View style={[styles.vie1, { padding: 20, }]}>
                    <Image source={{ uri: 'maingg' }} style={styles.img1} resizeMode='contain' />

                    <View style={{
                        flexDirection: 'row', alignItems: 'center', marginHorizontal: 12, flex: 1
                    }}>
                        <Image source={{ uri: 'location_act' }} style={{ height: 22, width: 22 }} resizeMode='contain' />
                        <View style={{ flex: 1, paddingHorizontal: 6 }}>
                            <Text numberOfLines={2} ellipsizeMode='tail'
                                style={{ color: 'black' }}>
                                {this.state.lastEventLocation ? this.state.lastEventLocation : 'All'}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={{
                                paddingEnd: 12,
                                paddingVertical: 12
                            }} onPress={() => {
                                this.getVendorDetails('', '', '', '1');
                                this.setState({ lastEventLocation: 'All' });
                            }}>
                            <Image source={{ uri: 'cancel' }} style={{ height: 18, width: 18 }}
                                resizeMode='contain' />
                        </TouchableOpacity>
                    </View>

                    <View style={{
                        justifyContent: 'flex-end', width: '10%', alignItems: 'flex-end', flexDirection: 'row',
                    }}>
                        <TouchableOpacity style={[styles.vie2, {}]}
                            onPress={() => {
                                this.props.propss.navigation.navigate('NotificationAPIPage',
                                    { updateText: (newText) => this.updateText(newText) }
                                );
                            }}>
                            <Image source={{ uri: this.state.valueOfUnread > 0 ? 'notification_alert' : 'notification' }}
                                style={{
                                    height: 24, width: 24
                                }} resizeMode='contain' />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    style={{ height: '80%', width: '100%' }}>
                    <View style={{ height: '100%', width: '100%', }}>
                        <TouchableOpacity style={styles.vie8} onPress={() => {
                            this.props.propss.navigation.navigate('OrganizePartyStartPage',
                                { updateText: (newText) => this.updateText(newText) }
                            );
                        }}>
                            <Image source={require('../../assets/svg/ddds.png')}
                                style={{
                                    width: Dimensions.get('screen').width - 40,
                                    height: Dimensions.get('window').height > 600 ? Dimensions.get('window').height / 1.8 :
                                        Dimensions.get('window').height / 1.5,
                                    borderRadius: 12
                                }}
                                resizeMethod='resize'
                                resizeMode='stretch' />
                        </TouchableOpacity>
                        <View style={[styles.vie15, { marginTop: 10 }]}>
                            <Input
                                placeholder='Search'
                                leftIcon={
                                    <Ionicons name='search' size={24} color={Colors.black} />
                                }
                                leftIconContainerStyle={{ backgroundColor: Colors.lightGray }}
                                containerStyle={[CommonStyles.containerStyle_inp, {
                                    height: 51, borderWidth: 2, width: '68%',
                                    backgroundColor: Colors.lightGray, borderBottomWidth: Platform.OS == "ios" ? 1 : 1,
                                    borderBottomColor: Colors.borderGray
                                }]}
                                inputContainerStyle={[CommonStyles.inputContainerStyle_inp, {
                                    borderBottomWidth: 0,
                                    backgroundColor: Colors.lightGray
                                }]}
                                inputStyle={[CommonStyles.userButtonInput_Black, {
                                    backgroundColor: Colors.lightGray, borderBottomColor: Colors.darkViolet,
                                    borderBottomWidth: 0,
                                    fontSize: 14
                                }]}
                                placeholderTextColor={Colors.midGray}
                                returnKeyType="done"
                                onSubmitEditing={event => {
                                    Keyboard.dismiss()
                                    if (this.state.eventId == '' && this.state.lastEventLocation != 'All') {
                                        this.getVendorDetails(this.state.categoryIDAfterSelect, '', '', '')
                                    } else if (this.state.lastEventLocation == 'All') {
                                        this.getVendorDetails(this.state.categoryIDAfterSelect, '', '', '1')
                                    } else {
                                        this.getVendorDetails(this.state.categoryIDAfterSelect, '', this.state.eventId, '')
                                    }
                                }}
                                blurOnSubmit={false}
                                underlineColorAndroid={Colors.lightGray}
                                autoFocus={false}
                                autoCorrect={false}
                                value={this.state.email}
                                onChangeText={(email) => {
                                    this.setState({ email })
                                    console.log('email', email)
                                    // Set a timeout to check if the text is empty after a short delay
                                    setTimeout(() => {
                                        if (email === '') {
                                            if (this.state.eventId == '' && this.state.lastEventLocation != 'All') {
                                                this.getVendorDetails(this.state.categoryIDAfterSelect, '', '', '')
                                            } else if (this.state.lastEventLocation == 'All') {
                                                this.getVendorDetails(this.state.categoryIDAfterSelect, '', '', '1')
                                            } else {
                                                this.getVendorDetails(this.state.categoryIDAfterSelect, '', this.state.eventId,
                                                    '')
                                            }
                                            this.inputRef.current.blur();
                                        }
                                    }, 300); // 300ms delay
                                }}
                                ref={this.inputRef}
                            />
                            <TouchableOpacity style={[CommonStyles.userInput_image, {
                                height: 51, justifyContent: 'center',
                                alignItems: 'center'
                            }]} onPress={() => { this.setState({ filterBydropdown: true }) }}>
                                <Image source={{ uri: 'filter' }} style={styles.img2} resizeMode='contain' />
                            </TouchableOpacity>
                            <TouchableOpacity style={[CommonStyles.userInput_image, { height: 51, padding: 10 }]}
                                onPress={() => { this.setState({ sortByDropDown: true }) }}>
                                <Image source={{ uri: 'sort' }} style={styles.img2} resizeMode='contain' />
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.vie4, { paddingLeft: 20, paddingRight: 20 }]}>
                            <Text style={[CommonStyles.txt1, { fontSize: 14 }]}>Categories</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 20,
                            paddingLeft: 20, paddingBottom: 20
                        }}>
                            <TouchableOpacity style={[styles.vie7, {
                            }]}
                                onPress={() => {
                                    console.log('All click')
                                    this.setState({ selectedCategoryId: '', categoryIDAfterSelect: '' })
                                    if (this.state.eventId == '' && this.state.lastEventLocation != 'All') {
                                        this.getVendorDetails('', '', '', '')
                                    } else if (this.state.lastEventLocation == 'All') {
                                        this.getVendorDetails('', '', '', '1')
                                    } else {
                                        this.getVendorDetails('', '', this.state.eventId, '')
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
                                        if (this.state.categoriesList.length !== 0 && this.list3 !== null) {
                                            this.list3.scrollToIndex({ index: error.index, animated: true });
                                        }
                                    }, 100);
                                }}
                                data={this.state.categoriesList}
                                renderItem={this.renderItemType.bind(this)}
                                keyExtractor={(item) => "_#" + item.id}
                                extraData={this.state}
                                showsHorizontalScrollIndicator={false}
                                horizontal={true}
                                snapToAlignment={'center'}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>

                        <View style={[styles.vie4, { marginBottom: 20, paddingLeft: 20, paddingRight: 20 }]}>
                            <Text style={CommonStyles.txt1}>View by</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity style={this.state.selectionMethod !== '1' ? styles.vie9 : styles.vie10}
                                    onPress={() => { this.setState({ selectionMethod: '1' }) }}>
                                    <Image source={{ uri: 'grid1' }} resizeMode='contain' style={{
                                        height: 18, width: 18,
                                        tintColor: this.state.selectionMethod !== '1' ? Colors.midGray : Colors.orange3
                                    }} />
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.selectionMethod !== '2' ? styles.vie11 : styles.vie10}
                                    onPress={() => { this.setState({ selectionMethod: '2' }) }}>
                                    <Image source={{ uri: 'list' }} resizeMode='contain' style={{
                                        height: 18, width: 18,
                                        tintColor: this.state.selectionMethod !== '2' ? Colors.midGray : Colors.orange3
                                    }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {(this.state.viewByList.length !== 0) ?
                            <View style={{
                                width: '100%',
                                paddingLeft: 20,
                                paddingRight: this.state.selectionMethod !== '1' ? 20 : 0
                            }}>
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
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    data={this.state.viewByList}
                                    renderItem={this.state.selectionMethod !== '1' ?
                                        this.renderItemTypeViewVERT.bind(this) : this.renderItemTypeView.bind(this)}
                                    keyExtractor={(item) => "_#" + item.id}
                                    extraData={this.state}
                                    horizontal={this.state.selectionMethod === '1'}
                                    snapToAlignment={'center'}
                                    scrollEnabled={this.state.selectionMethod === '1'} // Enable scroll only for '1'
                                    contentContainerStyle={{
                                        elevation: 13,
                                    }}
                                />
                            </View>
                            :
                            <View style={{ width: '100%', marginTop: 20, height: 100 }}>
                                <Text style={[CommonStyles.txt5, {
                                    fontSize: 16, textAlign: 'center',
                                    color: Colors.textColor
                                }]}>Nothing to show.</Text>
                            </View>
                        }
                    </View>
                </ScrollView>

                <Modal
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    isVisible={this.state.filterBydropdown}
                    onBackdropPress={() => { this.setState({ filterBydropdown: false }) }}
                    onSwipeComplete={() => { this.setState({ filterBydropdown: false }) }}
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
                        marginBottom: -10
                    }}>
                    <View style={{
                        backgroundColor: Colors.white,
                        width: "100%",
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 20,
                        paddingBottom: 30
                    }}>
                        <View style={{ width: '100%', }}>
                            <View style={{
                                height: 5, width: 80, backgroundColor: Colors.midGray,
                                borderRadius: 20, alignSelf: 'center',
                            }}></View>
                            <View style={{
                                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                                width: '100%', height: 50,
                            }}>
                                <Text style={[CommonStyles.txt3, { fontWeight: '400', fontSize: 20 }]}>Filter by</Text>
                                <TouchableOpacity onPress={() => {
                                    this.setState({ filterBydropdown: false })
                                }}
                                    style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                                    <Ionicons name="close" size={24} color={Colors.fontColor3} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps={'handled'}>

                                <View style={{ height: '100%', }}>
                                    <View style={{
                                        justifyContent: 'space-between',
                                        flexDirection: 'row', alignItems: 'center', marginTop: 10
                                    }}>
                                        <Text style={[CommonStyles.txt4, { fontSize: 14 }]}>Rating</Text>
                                        <TouchableOpacity style={{ width: '30%', alignItems: 'flex-end' }} onPress={() => {
                                            this.setState({
                                                StartSelected: '0'
                                            })
                                            if (this.state.eventId == '' && this.state.lastEventLocation != 'All') {
                                                this.getVendorDetails(this.state.categoryIDAfterSelect, '0', '', '')
                                            } else if (this.state.lastEventLocation == 'All') {
                                                this.getVendorDetails(this.state.categoryIDAfterSelect, '0', '', '1')
                                            } else {
                                                this.getVendorDetails(this.state.categoryIDAfterSelect, '0',
                                                    this.state.eventId, '')
                                            }
                                        }}>
                                            <Text style={[CommonStyles.txt2, { fontWeight: '400' }]}>
                                                {this.state.ratingShown ? 'Clear' : 'Show'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {this.state.ratingShown ?
                                        <View style={{ width: '100%', marginTop: 15 }}>
                                            {/* //1 */}
                                            <TouchableOpacity style={{
                                                justifyContent: 'space-between', flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                                onPress={() => {
                                                    this.setState({
                                                        StartSelected: '5'
                                                    })
                                                    if (this.state.eventId == '' && this.state.lastEventLocation != 'All') {
                                                        this.getVendorDetails(this.state.categoryIDAfterSelect, '5', '', '')
                                                    } else if (this.state.lastEventLocation == 'All') {
                                                        this.getVendorDetails(this.state.categoryIDAfterSelect, '5', '', '1')
                                                    } else {
                                                        this.getVendorDetails(this.state.categoryIDAfterSelect, '5',
                                                            this.state.eventId, '')
                                                    }
                                                }}>
                                                {/* 1 */}
                                                <View style={{
                                                    justifyContent: 'space-evenly', flexDirection: 'row',
                                                    alignItems: 'flex-start', width: '70%'
                                                }}>
                                                    <IconAnt name='star' size={24} color={Colors.startYellow} />
                                                    <IconAnt name='star' size={24} color={Colors.startYellow} />
                                                    <IconAnt name='star' size={24} color={Colors.startYellow} />
                                                    <IconAnt name='star' size={24} color={Colors.startYellow} />
                                                    <IconAnt name='star' size={24} color={Colors.startYellow} />
                                                </View>
                                                <Ionicons name={this.state.StartSelected == '5' ?
                                                    'radio-button-on' : 'radio-button-off'} size={24} color={
                                                        this.state.StartSelected == '5' ? Colors.startYellow : Colors.midGray} />
                                            </TouchableOpacity>

                                            {/* 2 */}
                                            <TouchableOpacity style={{
                                                justifyContent: 'space-between', flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                                onPress={() => {
                                                    this.setState({ StartSelected: '4' })
                                                    if (this.state.eventId == '' && this.state.lastEventLocation != 'All') {
                                                        this.getVendorDetails(this.state.categoryIDAfterSelect, '4', '', '')
                                                    } else if (this.state.lastEventLocation == 'All') {
                                                        this.getVendorDetails(this.state.categoryIDAfterSelect, '4', '', '1')
                                                    } else {
                                                        this.getVendorDetails(this.state.categoryIDAfterSelect, '4',
                                                            this.state.eventId, '')
                                                    }
                                                }}>

                                                {/* 1 */}
                                                <View style={{
                                                    justifyContent: 'space-evenly', flexDirection: 'row',
                                                    alignItems: 'flex-start', width: '70%'
                                                }}>
                                                    <IconAnt name='star' size={24} color={Colors.startYellow} />
                                                    <IconAnt name='star' size={24} color={Colors.startYellow} />
                                                    <IconAnt name='star' size={24} color={Colors.startYellow} />
                                                    <IconAnt name='star' size={24} color={Colors.startYellow} />
                                                    <IconAnt name='staro' size={24} color={Colors.midGray} />
                                                </View>
                                                <Ionicons name={this.state.StartSelected == '4' ?
                                                    'radio-button-on' : 'radio-button-off'} size={24} color={
                                                        this.state.StartSelected == '4' ? Colors.startYellow : Colors.midGray
                                                    } />
                                            </TouchableOpacity>

                                            {/* 3 */}
                                            <TouchableOpacity style={{
                                                justifyContent: 'space-between', flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                                onPress={() => {
                                                    this.setState({ StartSelected: '3' })
                                                    if (this.state.eventId == '' && this.state.lastEventLocation != 'All') {
                                                        this.getVendorDetails(this.state.categoryIDAfterSelect, '3', '', '')
                                                    } else if (this.state.lastEventLocation == 'All') {
                                                        this.getVendorDetails(this.state.categoryIDAfterSelect, '3', '', '1')
                                                    } else {
                                                        this.getVendorDetails(this.state.categoryIDAfterSelect, '3',
                                                            this.state.eventId, '')
                                                    }
                                                }}>
                                                {/* 1 */}
                                                <View style={{
                                                    justifyContent: 'space-evenly', flexDirection: 'row',
                                                    alignItems: 'flex-start', width: '70%'
                                                }}>
                                                    <IconAnt name='star' size={24} color={Colors.startYellow} />
                                                    <IconAnt name='star' size={24} color={Colors.startYellow} />
                                                    <IconAnt name='star' size={24} color={Colors.startYellow} />
                                                    <IconAnt name='staro' size={24} color={Colors.midGray} />
                                                    <IconAnt name='staro' size={24} color={Colors.midGray} />
                                                </View>
                                                <Ionicons name={this.state.StartSelected == '3' ?
                                                    'radio-button-on' : 'radio-button-off'} size={24} color={
                                                        this.state.StartSelected == '3' ? Colors.startYellow : Colors.midGray} />
                                            </TouchableOpacity>
                                            {/* 4 */}
                                            <TouchableOpacity style={{
                                                justifyContent: 'space-between', flexDirection: 'row',
                                                alignItems: 'center'
                                            }}
                                                onPress={() => {
                                                    this.setState({ StartSelected: '2' })
                                                    if (this.state.eventId == '' && this.state.lastEventLocation != 'All') {
                                                        this.getVendorDetails(this.state.categoryIDAfterSelect, '2', '', '')
                                                    } else if (this.state.lastEventLocation == 'All') {
                                                        this.getVendorDetails(this.state.categoryIDAfterSelect, '2', '', '1')
                                                    } else {
                                                        this.getVendorDetails(this.state.categoryIDAfterSelect, '2',
                                                            this.state.eventId, '')
                                                    }
                                                }}>
                                                {/* 1 */}
                                                <View style={{
                                                    justifyContent: 'space-evenly', flexDirection: 'row',
                                                    alignItems: 'flex-start', width: '70%'
                                                }}>
                                                    <IconAnt name='star' size={24} color={Colors.startYellow} />
                                                    <IconAnt name='star' size={24} color={Colors.startYellow} />
                                                    <IconAnt name='staro' size={24} color={Colors.midGray} />
                                                    <IconAnt name='staro' size={24} color={Colors.midGray} />
                                                    <IconAnt name='staro' size={24} color={Colors.midGray} />
                                                </View>
                                                <Ionicons name={this.state.StartSelected == '2' ?
                                                    'radio-button-on' : 'radio-button-off'} size={24} color={
                                                        this.state.StartSelected == '2' ? Colors.startYellow : Colors.midGray
                                                    } />
                                            </TouchableOpacity>
                                            {/* 5 */}
                                            <TouchableOpacity style={{
                                                justifyContent: 'space-between', flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                                onPress={() => {
                                                    this.setState({ StartSelected: '1' })
                                                    if (this.state.eventId == '' && this.state.lastEventLocation != 'All') {
                                                        this.getVendorDetails(this.state.categoryIDAfterSelect, '1', '', '')
                                                    } else if (this.state.lastEventLocation == 'All') {
                                                        this.getVendorDetails(this.state.categoryIDAfterSelect, '1', '', '1')
                                                    } else {
                                                        this.getVendorDetails(this.state.categoryIDAfterSelect, '1',
                                                            this.state.eventId, '')
                                                    }
                                                }}>
                                                {/* 1 */}
                                                <View style={{
                                                    justifyContent: 'space-evenly', flexDirection: 'row',
                                                    alignItems: 'flex-start', width: '70%'
                                                }}>
                                                    <IconAnt name='star' size={24} color={Colors.startYellow} />
                                                    <IconAnt name='staro' size={24} color={Colors.midGray} />
                                                    <IconAnt name='staro' size={24} color={Colors.midGray} />
                                                    <IconAnt name='staro' size={24} color={Colors.midGray} />
                                                    <IconAnt name='staro' size={24} color={Colors.midGray} />

                                                </View>
                                                <Ionicons name={this.state.StartSelected == '1' ?
                                                    'radio-button-on' : 'radio-button-off'} size={24} color={
                                                        this.state.StartSelected == '1' ? Colors.startYellow : Colors.midGray
                                                    } />
                                            </TouchableOpacity>
                                        </View>
                                        : null
                                    }
                                </View>
                            </ScrollView>
                        </View>
                    </View >
                </Modal >

                <Modal
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    isVisible={this.state.sortByDropDown}
                    onBackdropPress={() => { this.setState({ sortByDropDown: false }) }}
                    onSwipeComplete={() => { this.setState({ sortByDropDown: false }) }}
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
                        marginBottom: -10
                    }}>
                    <View style={{
                        backgroundColor: Colors.white,
                        width: "100%",
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 20,
                    }}>
                        <View style={{ width: '100%', }}>
                            <View style={{
                                height: 5, width: 80, backgroundColor: Colors.midGray, borderRadius: 20,
                                alignSelf: 'center',
                            }}></View>
                            <View style={{
                                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%',
                                height: 50,
                            }}>
                                <Text style={[CommonStyles.txt3, { fontWeight: '400', fontSize: 20 }]}>Sort by</Text>
                                <TouchableOpacity onPress={() => {
                                    this.setState({ chooseSevicePopup: false, sortByDropDown: false })
                                }}
                                    style={{ width: 50, height: 50, alignItems: 'flex-end', justifyContent: 'center' }}>
                                    <Ionicons name="close" size={24} color={Colors.fontColor3} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                keyboardShouldPersistTaps={'handled'}>
                                <View style={{ height: '100%', }}>

                                    <View style={{
                                        justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center',
                                        marginTop: 15
                                    }}>
                                        <FlatList
                                            ref={(ref) => { this.list = ref; }}
                                            onScrollToIndexFailed={(error) => {
                                                this.list.scrollToOffset({
                                                    offset: error.averageItemLength * error.index,
                                                    animated: true
                                                });
                                                setTimeout(() => {
                                                    if (this.state.sortByValueList.length !== 0 && this.list !== null) {
                                                        this.list.scrollToIndex({ index: error.index, animated: true });
                                                    }
                                                }, 100);
                                            }}
                                            data={this.state.sortByValueList}
                                            renderItem={this.renderItemOrder.bind(this)}
                                            keyExtractor={(item) => item.id}
                                            extraData={this.state}
                                            showsVerticalScrollIndicator={false}
                                            showsHorizontalScrollIndicator={false}
                                        />
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </View >
        )
    }
};

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'
    },
    vie1: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 80,
        marginTop: 10
    },
    img1: {
        height: 120,
        width: 140,
        marginLeft: 10
    },
    img2: {
        height: 28,
        width: 28
    },
    img10: {
        height: 24,
        width: 24
    },
    vie2: {
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    vie3: {
        padding: 20,
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#00fff0'
    },
    vie4: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    img4: {
        height: 450,
        width: '100%',
        justifyContent: 'center'
    },
    vie8: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    vie9: {
        height: 32,
        width: 40,
        borderTopStartRadius: 4,
        borderBottomLeftRadius: 4,
        backgroundColor: Colors.borderGray,
        justifyContent: 'center',
        alignItems: 'center'
    },
    vie11: {
        height: 32,
        width: 40,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
        backgroundColor: Colors.borderGray,
        justifyContent: 'center',
        alignItems: 'center'
    },
    vie10: {
        height: 32,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center'
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
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFF',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 13,
        position: 'relative'
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
        width: 213,
        alignItems: 'center',
        marginBottom: 20,
        marginRight: 20,
        elevation: 13,
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
    img6: {
        width: '100%',
        height: 180
    },
    vie15: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    vie16: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 20
    },
    vie17: {
        width: '24%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    img7: {
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    fitImage: {
        borderRadius: 20,
    },
    fitImageWithSize: {
        height: 100,
        width: 30,
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
)(DiscoverDash);


