import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, TouchableOpacity, Image, Platform, Keyboard }
    from 'react-native';
import CommonStyles from '../styles/CommonStyles';
import { Colors, fonts } from '../Components/theme';
import { connect } from 'react-redux';
import { actions as appActions } from "../AppState/actions/appActions";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { Input } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import IconF from 'react-native-vector-icons/Feather';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import { Dropdown } from 'react-native-material-dropdown-v2';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { ErrorCtrl } from '../Controller/ErrorController';
import { ProdCtrl } from '../Controller/ProductController';
import DateTimePickers from 'react-native-ui-datepicker';

class SettingPref extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventNme: '',
            isValueAdded: false,
            OpenDateDialogModal: false,
            date: '',
            focus: 'startDate',
            startDate: '',
            endDate: '',
            showTime: false,
            setTime: new Date(),
            showTime2: false,
            setTime2: new Date(),
            setTimeLast: '',
            setTimeLast2: '',
            allCategoryList: [],
            showTime2: false,
            setTime2: new Date(),
            setTimeLast2: '',
            allCategoryList: [],
            categoryIDAfterSelect: '',
            area: 'Add Category',
            category_name: 'Add Category',
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
            selection: {
                start: 0,
                end: 0
            }
        }
    }

    componentDidMount() {
        this.callSubCategories()

        setTimeout(() => {
            this.props.setLoader(false)
        }, 1000);
    }

    onChangeHandler2(value, index, item) {
        this.setState({
            area: value,
            category_name: value,
            categoryIDAfterSelect: item[index].id
        });
    }

    async callCategories() {
        var that = this;
        this.props.setLoader(true);

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
            // category_name
            let resusltt = result.data.map(v => ({ ...v, value: v.category_name }));
            this.setState({ allCategoryList: [] })
            this.setState({
                allCategoryList: resusltt,
            })
        }
    }

    async callSubCategories() {
        var that = this;
        this.props.setLoader(true);

        var result = await ProdCtrl.getAllSubCategories().catch(obj => {
            this.props.setLoader(false);
            var code = obj.success;
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
            })
        }
    }

    async validateForm() {
        if (this.state.eventNme == '') {
            alert("Please Add Event")
            return
        }
        if (this.state.address == '') {
            alert("Please Add Party address")
            return
        }
        if (this.state.startDate == '') {
            alert("Please Add date of party")
            return
        }
        if (this.state.endDate == '') {
            alert("Please Add End date of party")
            return
        }

        console.log('category', this.state.categoryIDAfterSelect)
        if (this.state.categoryIDAfterSelect == '') {
            alert("Please select Catgory of party")
            return
        }
        this.props.setLoader(true);

        console.log("latt : ", this.state.latt);
        console.log("lngg : ", this.state.lngg);
        var that = this;
        var data = {
            title: this.state.eventNme,
            location: this.state.address,
            event_date: this.state.startDate.format('YYYY-MM-DD'),
            event_to_date: this.state.endDate.format('YYYY-MM-DD'),
            category: this.state.categoryIDAfterSelect,
            lat: this.state.latt,
            lng: this.state.lngg
        };
        console.log("Data passed on event : ", data);

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
            this.props.updateAppState('AppStack');
        }
    }

    onChange = (event, selectedDate) => {
        const currentDate = moment(selectedDate).format('HH:mm:ss');
        this.setState({ showTime: false, showTime2: true, setTime: currentDate, setTimeLast: currentDate })
    };

    onChangeNextTime = (event, selectedDate) => {
        const currentDate = moment(selectedDate).format('HH:mm:ss');
        this.setState({ showTime2: false, setTime2: currentDate, setTimeLast2: currentDate })
    };

    setDates = (dates) => {
        this.setState({
            ...dates,
        });
    };

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
            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                style={{
                    height: '100%', width: '100%',
                }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    keyboardShouldPersistTaps={'handled'}
                    contentContainerStyle={{ flexGrow: 1 }}>

                    <View style={[CommonStyles.container, {
                        justifyContent: 'space-between',
                        alignItems: "center",
                        backgroundColor: 'white',
                        height: '100%'
                    }]} >

                        <View style={{
                            width: '100%',
                            padding: 20
                        }}>
                            <View style={{
                                justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center',
                                marginBottom: 20
                            }}>
                                <TouchableOpacity style={{
                                    width: wp('25%'), height: hp('10%'), justifyContent: 'center',
                                    alignItems: 'flex-start'
                                }}
                                    onPress={() => {
                                        this.props.navigation.goBack()
                                    }}>
                                    <Image source={{ uri: 'back' }}
                                        style={{
                                            width: 20, height: 20,
                                        }} resizeMode='contain' />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.txt1}>Let’s organize your party</Text>
                            <View style={{ height: hp(2.5) }} />
                            <Text style={styles.txt2}>Tell us more about your party (fill up all the details needed)</Text>

                            <View style={{ height: hp(2.5) }} />

                            <Input
                                placeholder='Add a title of the event*'
                                containerStyle={CommonStyles.containerStyle_inp}
                                inputContainerStyle={[CommonStyles.inputContainerStyle_inp, {}]}
                                inputStyle={CommonStyles.userButtonInput_Black}
                                returnKeyType="next"
                                onSubmitEditing={event => {
                                    Keyboard.dismiss()
                                }}
                                onChangeText={(text) => this.setState({ isValueAdded: true, eventNme: text })}
                                blurOnSubmit={false}
                                autoFocus={false}
                                autoCorrect={false}
                                placeholderTextColor={Colors.midGray}
                            />
                            <View style={{ height: hp(3.5) }} />

                            <View style={{ borderRadius: 12, borderColor: Colors.borderGray, borderWidth: 1, }}>
                                <View style={{
                                    width: '100%', flexDirection: 'row',
                                    justifyContent: 'flex-start', alignItems: 'flex-start',
                                    paddingLeft: 10, marginBottom: 5, marginTop: 5
                                }}>
                                    <View style={{
                                        height: 50, justifyContent: 'center', alignItems: 'flex-start',
                                    }}>
                                        <Icon
                                            name="location-outline"
                                            size={24}
                                            color={Colors.darkGray} />
                                    </View>
                                    <GooglePlacesAutocomplete
                                        placeholder={this.state.myaddress}
                                        ref={this.myAddressRef}
                                        disableScroll={false}
                                        numberOfLines={1}
                                        styles={{
                                            textInput: {
                                                alignItems: "center",
                                                justifyContent: "center",
                                                width: '70%',
                                                fontFamily: fonts.fontPoppinsRegular,
                                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                fontSize: wp(4),
                                                color: Colors.textColor, marginTop: 4
                                            },
                                            container: {
                                                overflow: 'visible',
                                            },
                                            description: { color: 'black' }
                                        }}

                                        textInputProps={{
                                            placeholderTextColor: this.state.myPlaceColor,
                                        }}
                                        autoFocus={false}
                                        minLength={3}
                                        enableHighAccuracyLocation={true}
                                        currentLocation={false}
                                        fetchDetails={true}
                                        listViewDisplayed={false}
                                        query={{
                                            key: 'AIzaSyBe4wpJ11h1ZivefTePLG0iIOOQMAfIo3g',
                                            language: 'en',
                                            // components: 'country:AE'
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

                                <View style={{ backgroundColor: Colors.borderGray, width: '100%', height: 1 }}></View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', }}>
                                    <TouchableOpacity style={{
                                        flexDirection: 'row', justifyContent: 'flex-start',
                                        alignItems: 'center', paddingLeft: 10, width: '48%', height: 60
                                    }}
                                        onPress={() => { this.setDates({ OpenDateDialogModal: true, }) }}>
                                        <IconF
                                            name="calendar"
                                            size={24}
                                            color={Colors.darkGray} />
                                        {this.state.OpenDateDialogModal == false && (this.state.startDate !== '')
                                            ?
                                            <Text style={[CommonStyles.userButtonInput_Black, { paddingLeft: 10, }]}>
                                                {this.state.startDate && this.state.startDate.format('MMM D')}</Text> :

                                            <Text style={[CommonStyles.userButtonInput_Black,
                                            { paddingLeft: 10, color: Colors.midGray }]}>Start date</Text>}
                                    </TouchableOpacity>
                                    <View style={{ backgroundColor: Colors.borderGray, width: 1, height: '100%' }}></View>
                                    <TouchableOpacity style={{
                                        flexDirection: 'row', justifyContent: 'flex-start',
                                        alignItems: 'center', paddingLeft: 10, width: '48%', height: 60
                                    }}
                                        onPress={() => {
                                            this.setDates({ OpenDateDialogModal: true, })
                                        }}>
                                        <IconF
                                            name="calendar"
                                            size={24}
                                            color={Colors.darkGray} />

                                        {this.state.OpenDateDialogModal == false && (this.state.endDate !== '') ?
                                            <Text style={[CommonStyles.userButtonInput_Black, { paddingLeft: 10, }]}>
                                                {this.state.endDate && this.state.endDate.format('MMM D')}</Text> :
                                            <Text style={[CommonStyles.userButtonInput_Black,
                                            { paddingLeft: 10, color: Colors.midGray }]}>End date</Text>}
                                    </TouchableOpacity>
                                </View>

                                <View style={{ backgroundColor: Colors.borderGray, width: '100%', height: 1 }}></View>

                                {/* Category DropDown */}
                                <View style={{
                                    flexDirection: 'row', width: '90%',
                                    justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10
                                }} >
                                    <IconM
                                        name="fire"
                                        size={26}
                                        color={Colors.darkGray} />
                                    <Text style={{
                                        zIndex: 100, position: 'absolute',
                                        left: 50,
                                        fontFamily: fonts.fontPoppinsRegular,
                                        fontSize: 14,
                                        fontWeight: '400',
                                        color: Colors.textColor,
                                        borderBottomColor: 'transparent',
                                        borderBottomWidth: 0,
                                        backgroundColor: 'white',
                                        color: this.state.category_name == "Add Category" ? Colors.midGray : Colors.textColor
                                    }}>{this.state.category_name}</Text>

                                    <Dropdown
                                        data={this.state.allCategoryList}
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
                                            fontFamily: fonts.fontPoppinsRegular
                                        }}
                                        value={this.state.category_name}
                                        baseColor={"#00000000"}
                                        textColor={'white'}
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
                                            fontFamily: fonts.fontPoppinsRegular
                                        }}
                                        pickerStyle={{
                                            marginTop: 36, marginLeft: -12, paddingLeft: 15,
                                            width: '89.3%',
                                            borderBottomLeftRadius: 12,
                                            fontFamily: fonts.fontPoppinsRegular,
                                            borderBottomRightRadius: 12,
                                            borderWidth: 0.5,
                                            borderBottomColor: 'rgba(24, 31, 41,0.1)',
                                            borderLeftColor: 'rgba(24, 31, 41,0.1)',
                                            borderRightColor: 'rgba(24, 31, 41,0.1)',
                                            borderTopColor: '#00000000',
                                        }}
                                        itemTextStyle={{
                                            fontFamily: fonts.fontPoppinsRegular,
                                            fontSize: 14,
                                            fontWeight: '400',
                                            color: Colors.textColor,
                                            borderBottomColor: 'transparent',
                                            borderBottomWidth: 0,
                                        }}
                                        labelContainerStyle={{
                                            fontFamily: fonts.fontPoppinsRegular,
                                            fontSize: 14,
                                        }}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={{ width: '90%', paddingBottom: 30 }}>
                            {this.state.isValueAdded ?
                                <TouchableOpacity
                                    onPress={() => this.validateForm()}
                                >
                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        colors={['#7111DC', '#F85D47', '#FEAC46']}
                                        style={[CommonStyles.userGradButton, { marginBottom: 20 }]}
                                    >
                                        <Text style={[CommonStyles.userButtonText]}>Continue</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                                :
                                <View style={[CommonStyles.userGradButton, {
                                    backgroundColor: Colors.borderGray,
                                    marginBottom: 20
                                }]}>
                                    <Text style={[CommonStyles.userButtonText]}>Continue</Text>
                                </View>
                            }
                        </View>

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
                                    }}
                                >
                                    <ScrollView
                                        showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}
                                        keyboardShouldPersistTaps={'handled'}
                                        contentContainerStyle={{ flexGrow: 1 }}
                                        style={{
                                            width: '100%'
                                        }}>
                                        <View style={{
                                            width: '100%',
                                        }}>
                                            <View style={{
                                                width: '100%',
                                                // height: '100%',
                                                justifyContent: 'space-between',
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
                                                            Select Date</Text>
                                                    </View>

                                                    {/* Added */}
                                                    <View style={[styles.container, {}]}>

                                                        <View style={{
                                                            width: '100%', borderRadius: 12, borderWidth: 0.5,
                                                            borderColor: Colors.borderGray, justifyContent: 'space-evenly',
                                                            flexDirection: 'row', height: 60, alignItems: 'center',
                                                            marginBottom: 20
                                                        }}>
                                                            <Text style={{
                                                                width: '45%', paddingLeft: 10,
                                                                fontFamily: fonts.fontPoppinsMedium, fontSize: 14,
                                                                fontWeight: '500', color: Colors.textColor
                                                            }}>From :
                                                                <Text style={{
                                                                    color: Colors.orange3, paddingLeft: 10,
                                                                    fontFamily: fonts.fontPoppinsRegular, fontSize: 14,
                                                                    fontWeight: '500'
                                                                }}>
                                                                    {this.state.startDate && this.state.startDate.format('MMM D')}</Text>
                                                            </Text>
                                                            <View style={{
                                                                width: 1, height: 60,
                                                                backgroundColor: Colors.borderGray
                                                            }}></View>
                                                            <Text style={{
                                                                width: '45%', paddingLeft: 10,
                                                                fontFamily: fonts.fontPoppinsMedium, fontSize: 14,
                                                                fontWeight: '500', color: Colors.textColor
                                                            }}>To :
                                                                <Text style={{
                                                                    color: Colors.orange3, paddingLeft: 10,
                                                                    fontFamily: fonts.fontPoppinsRegular, fontSize: 14,
                                                                    fontWeight: '500'
                                                                }}>
                                                                    {this.state.endDate && this.state.endDate.format('MMM D')}</Text>
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
                                                    {/* end */}
                                                </View>

                                                <View style={{ width: '100%' }}>
                                                    <TouchableOpacity style={{
                                                        width: '100%', height: 60, justifyContent: 'center', alignItems: 'center',
                                                        marginBottom: 20
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
                                onChange={this.onChangeNextTime}
                            />
                        )}
                    </View >
                </ScrollView>
            </KeyboardAvoidingView >
        )
    }
};

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'
    },
    txt1: {
        fontFamily: fonts.fontPoppinsRegular,
        fontWeight: '600',
        fontSize: 24,
        color: 'black',
    },
    txt2: {
        fontFamily: fonts.fontPoppinsRegular,
        fontWeight: '400',
        fontSize: 14,
        color: Colors.darkGray,

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
)(SettingPref);
