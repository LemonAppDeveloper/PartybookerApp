import React, { Component } from 'react';
import {
    View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, TouchableOpacity, ImageBackground, Image,
    Platform, Keyboard, StatusBar, Dimensions, FlatList, UIManager, LayoutAnimation, Alert, Share
} from 'react-native';
import CommonStyles from '../styles/CommonStyles';
import { Colors, fonts } from '../Components/theme';
import { connect } from 'react-redux';
import { actions as appActions } from "../AppState/actions/appActions";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { Input } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import IconF from 'react-native-vector-icons/Feather';
import IconO from 'react-native-vector-icons/Octicons';
import Modal from 'react-native-modal';
import { Dropdown } from 'react-native-material-dropdown-v2';
import { ErrorCtrl } from '../Controller/ErrorController';
import { ProdCtrl } from '../Controller/ProductController';
import CustomRatingBar from '../util/CustomRatingBar';
import RenderHtml, { RenderHTMLSource, defaultSystemFonts } from 'react-native-render-html';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { appStore } from "../../App";


class VendorDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appUserDetails: '',
            vndorDetailList: [],
            vendorInfo: {},
            vendor_gallery: [],
            vendor_plans: [],
            vendor_review: [],
            vendor_attribute: [],
            vendor_product: [],
            vendor_FAQ: [],
            vendor_CMS: [],
            vendor_CMS_Policy: [],
            vendor_CMS_TC: [],
            sortBytype: '2',
            openModalReview: false,
            ratingNamesList: [],
            isAccordianOpen: false,
            userTypeSleected: '0',
            tellComment: '',
            isImageAvailable: false,
            OpenAmenitiesMOdal: false,
            openVendorDetailPlan: {},
            openVendorDetailPRoduct: {},
            openModalForPLan: false,
            openModalForPRoduct: false,
            openVendorDetailPRoductImage: [],
            counterQuantity: '1',
            upn: '',
            expanded: false,
            expandedID: '',

            profile_image: '',
            profile_image_url: '',
            profile_imagesFileName: '',
            profile_imagesFileName_new: '',

            profile_image2: '',
            profile_image_url2: '',
            profile_imagesFileName2: '',
            profile_imagesFileName_new2: '',

            ratingNumberr: '0',
            categoryIDAfterSelect: '',
            partyDetail: [],
            partyName: 'Choose a Party',
            noPartyCreated: false,
            areadType: [],
            url: ''
        }
    }

    componentDidMount() {
        this.callVendoDetails(this.props.route.params.ID);
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        let userDetails = appStore.getState().app.userDetails;
        this.setState({ appUserDetails: userDetails })
        console.log('AppUSerDetails : ', userDetails);
        this.getAllPartyCreated();
    }

    onShare = async () => {
        try {
            const result = await Share.share({
                //message: this.state.vendorInfo.name, // Message to share
                url: this.state.url
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // Shared with activity type of result.activityType
                } else {
                    // Shared
                }
            } else if (result.action === Share.dismissedAction) {
                // Dismissed
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    updateText() {
        this.callVendoDetails(this.props.route.params.ID);
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        let userDetails = appStore.getState().app.userDetails;
        this.setState({ appUserDetails: userDetails })
        console.log('AppUSerDetails : ', userDetails);
        this.getAllPartyCreated();
    }

    onChangeHandler2(value, index, item) {
        console.log("value On Change : ", value);
        console.log("Index On Change : ", index);
        console.log("Item On Change : ", item);
        this.setState({
            categoryIDAfterSelect: item[index].id,
            partyName: value,
            partyDetail: item[index]
        })
    }

    async validateForm() {
        console.log("APPUSERRRR :: ", this.state.appUserDetails);

        this.props.setLoader(true);

        var that = this;
        let body = new FormData();
        body.append('device_type', Platform.OS == "ios" ? '2' : '1');
        body.append('id', this.state.vendorInfo.id);
        //body.append('id', this.state.appUserDetails.id);
        body.append('send_as', this.state.userTypeSleected == '1' ? this.state.appUserDetails.name : 'anonymous');
        body.append('rating', this.state.ratingNumberr);
        body.append('review', this.state.tellComment);
        var data = {
            device_type: Platform.OS == "ios" ? '2' : '1',
            id: this.state.vendorInfo.id,
            //id: this.state.appUserDetails.id,
            send_as: this.state.userTypeSleected == '1' ? this.state.appUserDetails.name : 'anonymous',
            rating: this.state.ratingNumberr,
            review: this.state.tellComment,
        };

        if (this.state.profile_imagesFileName_new !== '') {
            body.append('review_image_0',
                {
                    uri: Platform.OS === 'android' ? this.state.profile_image : this.state.profile_image.replace('file://', ''),
                    type: ' image/jpeg',
                    name: this.state.profile_image.replace(/^.*[\\\/]/, '')
                });
            data.review_image_0 = this.state.profile_image;
        }
        if (this.state.profile_imagesFileName_new2 !== '') {
            body.append('review_image_1',
                {
                    uri: Platform.OS === 'android' ? this.state.profile_image2 : this.state.profile_image2.replace('file://', ''),
                    type: ' image/jpeg',
                    name: this.state.profile_image2.replace(/^.*[\\\/]/, '')
                });
            data.review_image_1 = this.state.profile_image2;
        }
        console.log('body:', body)
        var result = await ProdCtrl.AddReviewItem(body).catch(obj => {
            this.props.setLoader(false);
            var code = obj.success;
            ErrorCtrl.showError({
                msg: obj.message,
            });
            return false;
        });
        this.props.setLoader(false);

        if (result) {
            console.log('result:', result)
            this.setState({ openModalReview: false })
            Alert.alert(
                "",
                'Review Added',
                [
                    { text: 'OK', onPress: () => { this.setState({ openModalReview: false }) } }
                ],
                { cancelable: true }
            );
            this.callVendoDetails(this.props.route.params.ID);
        }
    }

    requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs camera permission',
                    },
                );
                // If CAMERA Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else return true;
    };

    requestExternalWritePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'External Storage Write Permission',
                        message: 'App needs write permission',
                    },
                );
                // If WRITE_EXTERNAL_STORAGE Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                // alert('Write permission err', err);
            }
            return false;
        } else return true;
    };

    launchCamera = async () => {
        let options = {
            mediaType: 'photo',
            maxWidth: 500,
            maxHeight: 500,
            includeBase64: true,
            selectionLimit: 2,
        };
        let isCameraPermitted = this.requestCameraPermission();
        let isStoragePermitted = this.requestExternalWritePermission();
        if (isCameraPermitted && isStoragePermitted) {
            launchCamera(options, response => {
                if (response.didCancel) {
                    alert('User cancelled camera picker');
                    return;
                } else if (response.errorCode == 'camera_unavailable') {
                    alert('Camera not available on device');
                    return;
                } else if (response.errorCode == 'permission') {
                    if (Platform.OS == 'ios') {
                        Linking.openURL('app-settings:');
                    } else {
                        alert('Permission not satisfied');
                    }
                    return;
                } else if (response.errorCode == 'others') {
                    alert(response.errorMessage);
                    return;
                }

                this.setState({ isImageAvailable: true })
                for (let i = 0; i < response.assets.length; i++) {
                    if (response.assets.length == 1) {
                        if (this.state.profile_image == '') {
                            this.setState({
                                profile_image: response.assets[0].uri,
                                profile_imagesFileName: response.assets[0].fileName,
                                profile_imagesFileName_new: { uri: 'data:image/jpeg;base64,' + response.assets[0].base64 },
                            });
                        } else {
                            this.setState({
                                profile_image2: response.assets[0].uri,
                                profile_imagesFileName2: response.assets[0].fileName,
                                profile_imagesFileName_new2: { uri: 'data:image/jpeg;base64,' + response.assets[0].base64 },
                            })
                        }
                    }
                    else {
                        if (i === 0) {
                            this.setState({
                                profile_image: response.assets[i].uri,
                                profile_imagesFileName: response.assets[i].fileName,
                                profile_imagesFileName_new: { uri: 'data:image/jpeg;base64,' + response.assets[i].base64 },
                            });
                        }
                        if (i == 1) {
                            this.setState({
                                profile_image2: response.assets[i].uri,
                                profile_imagesFileName2: response.assets[i].fileName,
                                profile_imagesFileName_new2: { uri: 'data:image/jpeg;base64,' + response.assets[i].base64 },
                            })
                        }
                    }
                }
            });
        }
    };

    launchImageLibrary = () => {
        let options = {
            title: 'You can choose one image',
            maxWidth: 500,
            maxHeight: 500,
            noData: true,
            mediaType: 'photo',
            storageOptions: {
                skipBackup: true,
            },
            selectionLimit: 2,
            includeBase64: true
        };

        launchImageLibrary(options, response => {
            if (response.didCancel) {
                alert('User cancelled camera picker');
                return;
            } else if (response.errorCode == 'camera_unavailable') {
                alert('Camera not available on device');
                return;
            } else if (response.errorCode == 'permission') {
                alert('Permission not satisfied');
                return;
            } else if (response.errorCode == 'others') {
                alert(response.errorMessage);
                return;
            }

            this.setState({ isImageAvailable: true })
            for (let i = 0; i < response.assets.length; i++) {
                if (response.assets.length == 1) {
                    if (this.state.profile_image == '') {
                        this.setState({
                            profile_image: response.assets[0].uri,
                            profile_imagesFileName: response.assets[0].fileName,
                            profile_imagesFileName_new: { uri: 'data:image/jpeg;base64,' + response.assets[0].base64 },
                        });
                    } else {
                        this.setState({
                            profile_image2: response.assets[0].uri,
                            profile_imagesFileName2: response.assets[0].fileName,
                            profile_imagesFileName_new2: { uri: 'data:image/jpeg;base64,' + response.assets[0].base64 },
                        })
                    }
                } else {
                    if (i === 0) {
                        this.setState({
                            profile_image: response.assets[i].uri,
                            profile_imagesFileName: response.assets[i].fileName,
                            profile_imagesFileName_new: { uri: 'data:image/jpeg;base64,' + response.assets[i].base64 },
                        });
                    }
                    if (i == 1) {
                        this.setState({
                            profile_image2: response.assets[i].uri,
                            profile_imagesFileName2: response.assets[i].fileName,
                            profile_imagesFileName_new2: { uri: 'data:image/jpeg;base64,' + response.assets[i].base64 },
                        })
                    }
                }
            }
        });
    };

    async callVendoDetails(ID) {
        var that = this;
        this.props.setLoader(true);

        console.log("Vendor_ID===", ID);
        let data = { id: ID, device_type: Platform.OS == 'ios' ? '2' : '1' }
        console.log('data:', data);
        var result = await ProdCtrl.getVendorDetail(data).catch(obj => {
            this.props.setLoader(false);
            var code = obj.success;
            ErrorCtrl.showError({
                msg: obj.message,
            });
            return false;
        });
        this.props.setLoader(false);

        if (result) {
            let finalone = result.data;
            let detailRate = [{ id: 1, value: finalone.info.name },
            { id: 1, value: 'Anonymous' }]
            this.setState({
                vndorDetailList: finalone,
                vendorInfo: finalone.info,
                vendor_gallery: finalone.vendor_gallery,
                // vendor_plans: finalone.vendor_plans,
                vendor_review: finalone.vendor_review,
                // vendor_product: finalone.vendor_product,
                vendor_attribute: finalone.vendor_attribute,
                vendor_FAQ: finalone.vendor_faq,
                vendor_CMS: finalone.vendor_cms,
                ratingNamesList: detailRate,
                url: finalone.url
            })
            console.log("VEndor att : ", finalone.vendor_attribute);
            for (let i = 0; i < finalone.vendor_cms.length; i++) {
                if (finalone.vendor_cms[i].slug == "privacy-policy")
                    this.setState({ vendor_CMS_Policy: finalone.vendor_cms[i].description })
                if (finalone.vendor_cms[i].slug == "terms--conditions")
                    this.setState({ vendor_CMS_TC: finalone.vendor_cms[i].description })
            }

            let vendorPlan = finalone.vendor_plans;
            vendorPlan.forEach(function (obj) {
                obj.isLiked = obj.is_favorite;
            });
            this.setState({ vendor_plans: vendorPlan })
            console.log("Pplan Chnage Image : ", vendorPlan);
            let vendorProduct = finalone.vendor_product
            vendorProduct.forEach(function (obj) {
                obj.isLiked = obj.is_favorite;
            });
            this.setState({ vendor_product: vendorProduct })
        }
    }

    renderChildren = (item, index) => {
        return (
            <View style={[this.getChildrenStyle(), {
                width: '47%'
            }]} key={item.id}>
                <View style={{}}>
                    <Image
                        onError={() => { }}
                        style={{ height: '100%', width: '100%', borderRadius: 12 }}
                        source={{
                            uri: item.image_url,
                        }}
                        resizeMode={'cover'}
                    />
                </View>
            </View>
        );
    };

    renderChildrenProduct = (item, index) => {
        return (
            <View
                style={{
                    width: (Dimensions.get('screen').width - 50) / 2,
                    height: (Dimensions.get('screen').height - 100) / 5.5,
                    backgroundColor: 'gray',
                    marginRight: 5,
                    marginTop: 4,
                    marginBottom: 4,
                    borderRadius: 18,
                }}
                key={item.id}>
                <View style={styles.avatarImage}>
                    <Image
                        onError={() => { }}
                        style={{ height: '100%', width: '100%', borderRadius: 12 }}
                        source={{
                            uri: item.image_url,
                        }}
                        resizeMode='cover'
                    />
                </View>
            </View>
        );
    };

    getChildrenStyle = () => ({
        width: (Dimensions.get('screen').width - 18) / 2,
        backgroundColor: 'gray',
        margin: 5,
        marginTop: 10,
        borderRadius: 18,
        height: (Dimensions.get('screen').height - 100) / 5.5,
    });

    getChildrenStyleFoImae = () => {
        return {
            width: (Dimensions.get('screen').width - 50) / 2,
            height: Number(Math.random() * 20 + 12) * 5,
            backgroundColor: 'gray',
            marginRight: 5,
            marginTop: 4,
            marginBottom: 4,
            borderRadius: 18,
        };
    };

    ratingNumber(ratingNumberr) {
        this.setState({ ratingNumberr: ratingNumberr })
    }

    renderTypePlans = ({ item, index }) => {

        return (
            <View style={[styles.vie15, { marginBottom: (this.state.vendor_plans.length - 1) == index ? 20 : 0, width: '99%' }]}>
                <Text style={[CommonStyles.txt1, { color: Colors.textColor, fontFamily: fonts.fontPoppinsMedium }]}>
                    {item.plan_name}</Text>
                <ImageBackground source={{ uri: item.plan_image_url }}
                    style={{
                        backgroundColor: Colors.borderGray, width: '100%', height: 150, borderRadius: 12, marginTop: 10
                    }}
                    imageStyle={{ borderRadius: 12 }}
                    resizeMode='cover' >
                    <TouchableOpacity style={{ alignSelf: 'flex-end', marginRight: 10, marginTop: 10 }}
                        onPress={() => {
                            this.checkLike(item, item.id, 'plan', item.isLiked ? 'unlike' : 'like');
                        }}>
                        <Icon name={item.isLiked ? 'heart-sharp' : 'heart-outline'} size={24}
                            color={!item.isLiked ? Colors.white : Colors.danger} />
                    </TouchableOpacity>
                </ImageBackground>
                <Text style={[CommonStyles.txt4, { marginTop: 10 }]}>
                    ${item.plan_amount !== '' ? parseFloat(item.plan_amount).toFixed(2) : item.plan_amount}</Text>
                {item.plan_title !== '' && <Text style={[CommonStyles.txt2,
                { color: Colors.darkGray, fontWeight: '400', marginTop: 5 }]}>{item.plan_title}</Text>}
                {item.plan_sub_title !== '' && <Text style={[CommonStyles.txt2,
                { color: Colors.midGray, fontWeight: '400', marginTop: 5 }]}>({item.plan_sub_title})</Text>}
                {item.plan_description !== '' && <Text style={[CommonStyles.txt4,
                { color: Colors.darkGray, fontSize: 14, marginTop: 15 }]}>{item.plan_description}</Text>}
                <TouchableOpacity style={{ width: '100%', padding: 5, justifyContent: 'center', alignItems: 'flex-end' }}
                    onPress={() => { this.setState({ openVendorDetailPlan: item, openModalForPLan: true }) }}>
                    <Text style={[CommonStyles.txt4, { color: Colors.danger, fontSize: 12, marginTop: 15 }]}>
                        View Breakdown</Text>
                </TouchableOpacity>
            </View>
        )
    }

    checkLike(item, id, type, likeType) {
        let vendorProduct = type == 'product' ? this.state.vendor_product : this.state.vendor_plans
        vendorProduct.forEach(function (obj) {
            if (obj.id == id)
                obj.isLiked = !obj.isLiked;
        });

        if (type == 'product')
            this.setState({ vendor_product: vendorProduct })
        else
            this.setState({ vendor_plans: vendorProduct })

        this.islikeunlikeAPI(type, id)
    }

    async islikeunlikeAPI(type, id) {
        var that = this;
        let data = {
            id: id,
            type: type
        }
        var result = await ProdCtrl.LikeUnlikeVendorDetail(data).catch(obj => {
            var code = obj.success;
            ErrorCtrl.showError({
                msg: obj.message,
            });
            return false;
        });
    }

    toggleExpand = (item) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({ expandedID: item.id });
    }

    renderItemFAQ = ({ item, index }) => {
        return (
            <View style={[styles.vie15, { marginBottom: (this.state.vendor_FAQ.length - 1) == index ? 20 : 0, width: '99%' }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Text style={[CommonStyles.txt4, { fontSize: 12, color: Colors.darkGray, width: '80%', flexWrap: 'wrap' }]}>
                        {item.question}</Text>
                    <TouchableOpacity style={{ height: 55, width: '10%', justifyContent: 'center', alignItems: 'center', }}
                        onPress={() => {
                            this.setState({ expanded: !this.state.expanded });
                            this.toggleExpand(item)
                        }}>
                        <Icon name={(this.state.expandedID == item.id) ? "chevron-up" : "chevron-down"} size={22}
                            color={Colors.textColor} />
                    </TouchableOpacity>
                </View>
                {(this.state.expandedID == item.id) &&
                    <View style={{ width: '96%' }}>
                        <Text style={[CommonStyles.txt4, {
                            fontSize: 12, color: Colors.textColor, width: '100%', flexWrap: 'wrap',
                        }]}>{item.answer}</Text>
                    </View>
                }
            </View>
        )
    }

    renderTypePRoducts = ({ item, index }) => {
        return (
            <View style={[styles.vie15, { marginBottom: (this.state.vendor_product.length - 1) == index ? 20 : 0, width: '99%' }]}>
                <Text style={[CommonStyles.txt1, { color: Colors.textColor, fontFamily: fonts.fontPoppinsMedium }]}>
                    {item.title}</Text>
                <ImageBackground source={{ uri: item.image_url }} style={{
                    backgroundColor: Colors.borderGray, width: '100%',
                    height: 150, borderRadius: 12, marginTop: 10
                }}
                    imageStyle={{ borderRadius: 12 }}
                    resizeMode='cover' >
                    <TouchableOpacity style={{ alignSelf: 'flex-end', marginRight: 10, marginTop: 10 }} onPress={() => {
                        this.checkLike(item, item.id, 'product', item.isLiked ? 'unlike' : 'like');
                    }}>
                        <Icon name={item.isLiked ? 'heart-sharp' : 'heart-outline'} size={24}
                            color={!item.isLiked ? Colors.white : Colors.danger} />
                    </TouchableOpacity>
                </ImageBackground>


                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                    <Text style={[CommonStyles.txt4, { marginTop: 10, width: '50%' }]}>
                        ${item.price !== '' ? parseFloat(item.price).toFixed(2) : item.price}</Text>
                </View>
                <Text style={[CommonStyles.txt4, { color: Colors.darkGray, fontSize: 14, marginTop: 15 }]}>
                    {item.description}</Text>
                <TouchableOpacity style={{ width: '100%', padding: 5, justifyContent: 'center', alignItems: 'flex-end' }}
                    onPress={() => {
                        this.setState({
                            openVendorDetailPRoduct: item, openModalForPRoduct: true,
                            openVendorDetailPRoductImage: item.product_image
                        })
                    }}>
                    <Text style={[CommonStyles.txt4, { color: Colors.danger, fontSize: 12, marginTop: 15 }]}>
                        View Breakdown</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderItemType = ({ item, index }) => {
        return (
            <View style={[styles.vie14, {}]}>
                <Text style={[CommonStyles.txt1, {
                    color: Colors.black
                    , fontFamily: fonts.fontPoppinsMedium, flexWrap: 'wrap'
                }]} numberOfLines={2}>"{item.review}"</Text>
                <View style={{
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                    width: '100%'
                }}>
                    <Text style={[CommonStyles.txt6, { fontFamily: fonts.fontPoppinsRegular, flexWrap: 'wrap', width: '48%' }]}
                        numberOfLines={1}>{item.full_name}</Text>
                    <Text style={[CommonStyles.txt6, { fontFamily: fonts.fontPoppinsRegular, flexWrap: 'wrap', }]}
                        numberOfLines={1}>Rating:
                        <Text style={{ fontWeight: '500', fontFamily: fonts.fontPoppinsMedium }}> {item.rating}/5</Text>
                    </Text>
                </View>
            </View>
        )
    }

    renderModalItem = ({ item, index }) => {
        return (
            <View style={{
                justifyContent: 'flex-start', width: '47%',
                flexDirection: 'row', alignItems: 'flex-start',
                marginLeft: index % 2 == 0 ? 5 : 10, alignContent: 'flex-start',
            }}>
                <View style={{ flexDirection: 'row', width: '80%', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Icon name='bed-outline' size={24} color={Colors.textColor} />
                    <Text style={[CommonStyles.txt2, { color: Colors.darkGray, fontWeight: '400', marginLeft: 10 }]}>
                        {item.quantity}</Text>
                    <Text style={[CommonStyles.txt2, {
                        flexWrap: 'wrap', color: Colors.darkGray, fontWeight: '400',
                        marginLeft: 5
                    }]}
                        numberOfLines={1}  >{item.attribute_name}</Text>
                </View>
            </View>
        )
    }

    increase = () => {
        let counter = parseInt(this.state.counterQuantity);
        this.setState({ counterQuantity: counter + 1 })
    };

    decrease() {
        let counter = parseInt(this.state.counterQuantity);
        if (counter === 1) {
            alert("You reach the minimum quantity");
            return;
        }
        this.setState({ counterQuantity: counter - 1 })
    };

    reset = () => {
        this.setState({ counterQuantity: 0 })
    };

    async callBookNowVendor(typee) {
        // api/cart/add
        var that = this;

        if (this.state.noPartyCreated) {
            Alert.alert(
                'No Party Created!',
                'You haven’t created a party yet, would you like to create one?',
                [
                    {
                        text: 'YES', onPress: () => {
                            // page to create party 
                            this.setState({ openModalForPLan: false, openModalForPRoduct: false })
                            this.props.navigation.navigate('OrganizePartyStartPage',
                                { updateText: (newText) => this.updateText(newText) }
                            )
                        }
                    },
                    { text: 'No Thanks', onPress: () => { console.log("cancel...") } },
                ],
                { cancelable: true },
            );
            return
        }

        if (this.state.categoryIDAfterSelect == '') {
            alert("Choose a party to book an event")
            return
        }

        let data = {
            // id: ID,
            device_type: Platform.OS == 'ios' ? '2' : '1',
            type: typee,
            event_id: this.state.categoryIDAfterSelect
        }
        if (typee == 'product') {
            data.id = this.state.openVendorDetailPRoduct.id,
                data.quantity = this.state.counterQuantity
        } else
            data.id = this.state.openVendorDetailPlan.id

        console.log('api/cart/add:', data)
        var result = await ProdCtrl.AddtoCartFromVendorPage(data).catch(obj => {
            this.props.setLoader(false);

            var code = obj.success;
            if (obj.message == 'You haven’t created a party yet, would you like to create one?') {
                Alert.alert(
                    'No Party Created!',
                    obj.message,
                    [
                        {
                            text: 'YES', onPress: () => {
                                // page to create party 
                                this.props.navigation.navigate('OrganizePartyStartPage')
                            }
                        },
                        { text: 'No Thanks', onPress: () => { console.log("cancel...") } },
                    ],
                    { cancelable: true },
                );
            } else
                Alert.alert(
                    'Alert',
                    obj.message,
                    [{ text: 'OK', onPress: () => { console.log("cancel...") } },
                    ],
                    { cancelable: true },
                );
            return false;
        });
        this.props.setLoader(false);

        if (result) {
            this.props.setLoader(false);
            this.props.navigation.navigate('MyPartyNewDesign', {
                id: this.state.categoryIDAfterSelect,
                updateText: (newText) => this.updateText(newText)
            })
            //should share the ID hee to open the same ID on the next page - the ID of selected party
        }
    }

    tagsStyles = {
        body: {
            whiteSpace: 'normal',
            color: Colors.darkGray,
            fontFamily: fonts.fontPoppinsRegular,

        },
        a: {
            color: Colors.darkGray,
            fontFamily: fonts.fontPoppinsRegular,
        }
    };

    async getAllPartyCreated() {
        console.log('getAllPartyCreatedAPI')
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
            console.log("My Party Detail List : ", result.data.info == null)
            if (result.data.info == null) {
                this.setState({ noPartyCreated: true })
            }
            this.setState({ areadType: [] })
            let resusltt = result.data.info.map(v => ({ ...v, value: v.event_title }));
            this.setState({
                areadType: resusltt,
                noPartyCreated: false
            })
            this.props.setLoader(false);
        }
    }

    render() {
        return (
            <View style={{ width: '100%', height: '100%' }}>

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
                            justifyContent: 'flex-start',
                            alignItems: "center",
                            backgroundColor: 'white',
                            height: '100%'
                        }]}>
                            <StatusBar hidden />
                            <ImageBackground
                                source={{ uri: this.state.vendorInfo.banner_url }}
                                style={styles.background}
                                imageStyle={styles.image}
                                resizeMode="cover"
                            >
                                <View style={styles.overlay} />
                                <View style={styles.headerContainer}>
                                    <Icon
                                        name="arrow-back-outline"
                                        size={30}
                                        color={Colors.white}
                                        onPress={() => {
                                            this.props.navigation.goBack()
                                            if (this.props.route.hasOwnProperty('params') &&
                                                this.props.route.params !== undefined &&
                                                (this.props.route.params.hasOwnProperty('updateText'))) {
                                                this.props.route.params.updateText('vendor');
                                            }
                                        }}
                                    />

                                    <View style={styles.textContainer}>
                                        <Text
                                            numberOfLines={2}
                                            ellipsizeMode='end'
                                            style={[CommonStyles.txt5, styles.text]}>{this.state.vendorInfo.name}</Text>
                                    </View>

                                    <Icon
                                        name="share-social-outline"
                                        size={30}
                                        color={Colors.white}
                                        style={styles.shareIcon}
                                        onPress={this.onShare} />
                                </View>
                            </ImageBackground>

                            {/* View gallery Images */}
                            {(this.state.vendor_gallery !== null && this.state.vendor_gallery.length > 0) &&
                                <View style={{
                                    width: '90%', justifyContent: 'flex-start', alignItems: 'flex-start',
                                    marginTop: 25, marginBottom: 15
                                }}>
                                    <FlatList
                                        data={(this.state.vendor_gallery.length > 3) ?
                                            this.state.vendor_gallery.slice(0, 3) : this.state.vendor_gallery}
                                        renderItem={({ item, index }) => this.renderChildren(item, index)}
                                        keyExtractor={(item) => item.id}
                                        extraData={this.state}
                                        numColumns='2'
                                        scrollEnabled={true}
                                        nestedScrollEnabled={true}
                                        columnWrapperStyle={{
                                            width: '100%',
                                        }}
                                        contentContainerStyle={{
                                        }}
                                    />
                                </View>
                            }
                            {(this.state.vendor_gallery !== null && this.state.vendor_gallery.length > 0) &&
                                <TouchableOpacity style={{
                                    width: '90%', justifyContent: 'center', alignItems: 'center',
                                    height: 50, borderRadius: 12, borderWidth: 1.5,
                                    borderColor: Colors.midGray,
                                    marginTop: 10, marginBottom: 15
                                }}
                                    onPress={() => {
                                        this.props.navigation.navigate('ViewGalleryVendor', {
                                            "InfoD": this.state.vendorInfo,
                                            "Gallery": this.state.vendor_gallery
                                        })
                                    }}>
                                    <Text style={[CommonStyles.txt1, {
                                        fontFamily: fonts.fontPoppinsMedium,
                                        color: Colors.black
                                    }]}>View Gallery</Text>
                                </TouchableOpacity>}
                            {(this.state.vendor_attribute !== null && this.state.vendor_attribute.length > 0) &&
                                <View style={{ width: '100%' }}>
                                    <View style={{
                                        marginTop: 12, marginBottom: 10, width: '100%', height: 10,
                                        backgroundColor: Colors.borderGray
                                    }}></View>
                                    <Text style={[CommonStyles.txt1, {
                                        alignSelf: 'flex-start', paddingLeft: 20, color: Colors.textColor,
                                        fontFamily: fonts.fontPoppinsMedium,
                                        marginTop: 20
                                    }]}>What this place offers</Text>
                                </View>}

                            {(this.state.vendor_attribute !== null && this.state.vendor_attribute.length > 0) &&
                                <FlatList
                                    data={this.state.vendor_attribute.length > 5 ?
                                        this.state.vendor_attribute.slice(0, 6) : this.state.vendor_attribute}
                                    renderItem={this.renderModalItem.bind(this)}
                                    keyExtractor={(item) => item.id}
                                    extraData={this.state}
                                    numColumns='2'
                                    scrollEnabled={true}
                                    nestedScrollEnabled={true}
                                    columnWrapperStyle={{
                                        alignItems: 'flex-start',
                                        marginTop: 10,
                                        width: '100%',
                                        alignSelf: 'center',
                                    }}
                                    contentContainerStyle={{
                                        marginTop: 10, paddingBottom: 20,
                                        paddingLeft: 10
                                    }}
                                />
                            }
                            {(this.state.vendor_attribute !== null && this.state.vendor_attribute.length > 0) &&
                                <TouchableOpacity style={{
                                    width: '90%', justifyContent: 'center', alignItems: 'center',
                                    height: 50, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.midGray,
                                    marginBottom: 15
                                }} onPress={() => this.setState({ OpenAmenitiesMOdal: true })}>
                                    <Text style={[CommonStyles.txt1, { color: Colors.textColor }]}>See All Amenities</Text>
                                </TouchableOpacity>}
                            <View style={{
                                marginTop: 12, marginBottom: 10, width: '100%', height: 10,
                                backgroundColor: Colors.borderGray
                            }}></View>
                            <View style={{ width: '90%', justifyContent: 'flex-start' }}>
                                <View style={[styles.vie13, { marginTop: 10 }]}>
                                    <Icon name={'location-outline'} size={24} color={Colors.midGray} />
                                    <Text style={[CommonStyles.txt2, { fontSize: 14, color: Colors.darkGray }]}>
                                        {this.state.vendorInfo.category}</Text>
                                </View>
                                <View style={[styles.vie13, { marginTop: 10 }]}>
                                    <Image source={{ uri: 'timer' }} style={{ height: 24, width: 24 }} />
                                    <Text style={[CommonStyles.txt2, {
                                        fontWeight: '400', fontSize: 14,
                                        color: Colors.darkGray
                                    }]}>{this.state.vendorInfo.timing}</Text>
                                </View>

                                <View style={[styles.vie13, { justifyContent: 'flex-start', marginTop: 10 }]}>
                                    <Icon name={(this.state.vendorInfo.avg_rating >= 1) ? 'star' : (this.state.vendorInfo.avg_rating >= 0.5 ? 'star-half' : 'star-outline')} size={24} color={Colors.warning} />
                                    <View style={{ width: 10 }}></View>
                                    <Icon name={(this.state.vendorInfo.avg_rating >= 2) ? 'star' : (this.state.vendorInfo.avg_rating >= 1.5 ? 'star-half' : 'star-outline')} size={24} color={Colors.warning} />
                                    <View style={{ width: 10 }}></View>
                                    <Icon name={(this.state.vendorInfo.avg_rating >= 3) ? 'star' : (this.state.vendorInfo.avg_rating >= 2.5 ? 'star-half' : 'star-outline')} size={24} color={Colors.warning} />
                                    <View style={{ width: 10 }}></View>
                                    <Icon name={(this.state.vendorInfo.avg_rating >= 4) ? 'star' : (this.state.vendorInfo.avg_rating >= 3.5 ? 'star-half' : 'star-outline')} size={24} color={Colors.warning} />
                                    <View style={{ width: 10 }}></View>
                                    <Icon name={(this.state.vendorInfo.avg_rating >= 5) ? 'star' : (this.state.vendorInfo.avg_rating >= 4.5 ? 'star-half' : 'star-outline')} size={24} color={Colors.warning} />
                                </View>

                                <Text style={[CommonStyles.txt4, { fontSize: 14, color: Colors.black, marginTop: 15 }]}>
                                    Overview</Text>
                                <Text style={[CommonStyles.txt1, {
                                    fontWeight: '300', color: Colors.darkGray, marginTop: 5,
                                    fontFamily: fonts.fontPoppinsLight
                                }]}>{this.state.vendorInfo.description}</Text>

                                <View style={{
                                    justifyContent: 'space-between', width: '100%', alignItems: 'center', flexDirection: 'row',
                                    marginTop: 10,
                                    marginBottom: 10
                                }}>
                                    <Text style={[CommonStyles.txt4, { fontSize: 14, }]}>Reviews</Text>
                                    <TouchableOpacity onPress={() => {
                                        this.props.navigation.navigate('AllReviewPage', {
                                            'vendorInfo': this.state.vendorInfo,
                                            'vendorReview': this.state.vendor_review
                                        })
                                    }}>
                                        <Text style={[CommonStyles.txt2, { color: Colors.orange2 }]}>View all</Text>
                                    </TouchableOpacity>
                                </View>
                                <FlatList
                                    ref={(ref) => { this.list3 = ref; }}
                                    onScrollToIndexFailed={(error) => {
                                        this.list3.scrollToOffset({
                                            offset: error.averageItemLength * error.index, animated: true
                                        });
                                        setTimeout(() => {
                                            if (this.state.vendor_review.length !== 0 && this.list3 !== null) {
                                                this.list3.scrollToIndex({ index: error.index, animated: true });
                                            }
                                        }, 100);
                                    }}
                                    data={this.state.vendor_review}
                                    renderItem={this.renderItemType.bind(this)}
                                    keyExtractor={(item) => "_#" + item.id}
                                    extraData={this.state}
                                    showsHorizontalScrollIndicator={false}
                                    horizontal={true}
                                    snapToAlignment={'center'}
                                />
                                <TouchableOpacity style={{
                                    width: '100%', justifyContent: 'center', alignItems: 'center',
                                    height: 50, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.midGray,
                                    marginTop: 20, marginBottom: 20
                                }} onPress={() => { this.setState({ openModalReview: true }) }}>
                                    <Text style={[CommonStyles.txt1, { color: Colors.textColor }]}>Add Review</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                marginTop: 10, marginBottom: 10, width: '100%', height: 10,
                                backgroundColor: Colors.borderGray
                            }}></View>
                            <Text style={[CommonStyles.txt7, {
                                paddingLeft: 20, paddingTop: 15, alignSelf: 'flex-start',
                                paddingLeft: 20, color: Colors.textColor
                            }]}>Select what best suits you</Text>
                            <View style={[styles.vie11, { width: '90%' }]}>
                                <TouchableOpacity style={this.state.sortBytype == '1' ? styles.vie12 : styles.vie10}
                                    onPress={() => {
                                        this.setState({ sortBytype: '1' });
                                    }}>
                                    <Text style={[CommonStyles.txt1, {
                                        color: this.state.sortBytype == '1' ?
                                            Colors.white : Colors.midGray
                                    }]}>Package</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.sortBytype == '2' ? styles.vie12 : styles.vie10}
                                    onPress={() => {
                                        this.setState({ sortBytype: '2' });
                                    }}>
                                    <Text style={[CommonStyles.txt1, {
                                        color: this.state.sortBytype == '2' ?
                                            Colors.white : Colors.midGray
                                    }]}>Single Product</Text>
                                </TouchableOpacity>
                            </View>

                            {this.state.sortBytype == '1' ?
                                <View style={{ width: '100%', padding: 20 }}>
                                    <FlatList
                                        ref={(ref) => { this.list3 = ref; }}
                                        onScrollToIndexFailed={(error) => {
                                            this.list3.scrollToOffset({
                                                offset: error.averageItemLength * error.index, animated: true
                                            });
                                            setTimeout(() => {
                                                if (this.state.vendor_plans.length !== 0 && this.list3 !== null) {
                                                    this.list3.scrollToIndex({ index: error.index, animated: true });
                                                }
                                            }, 100);
                                        }}
                                        data={this.state.vendor_plans}
                                        renderItem={this.renderTypePlans.bind(this)}
                                        keyExtractor={(item) => "_#" + item.id}
                                        extraData={this.state}
                                        showsHorizontalScrollIndicator={false}
                                        snapToAlignment={'center'}
                                    />
                                </View>
                                :
                                <View style={{ width: '100%', padding: 20 }}>
                                    <FlatList
                                        ref={(ref) => { this.list3 = ref; }}
                                        onScrollToIndexFailed={(error) => {
                                            this.list3.scrollToOffset({
                                                offset: error.averageItemLength * error.index, animated: true
                                            });
                                            setTimeout(() => {
                                                if (this.state.vendor_product.length !== 0 && this.list3 !== null) {
                                                    this.list3.scrollToIndex({ index: error.index, animated: true });
                                                }
                                            }, 100);
                                        }}
                                        data={this.state.vendor_product}
                                        renderItem={this.renderTypePRoducts.bind(this)}
                                        keyExtractor={(item) => "_#" + item.id}
                                        extraData={this.state}
                                        showsHorizontalScrollIndicator={false}
                                        snapToAlignment={'center'}
                                    />
                                </View>
                            }
                            {this.state.vendor_FAQ !== null && this.state.vendor_FAQ.length > 0 &&
                                <View style={{ width: '100%' }}>
                                    <View style={{
                                        marginTop: 10, marginBottom: 10, width: '100%', height: 10,
                                        backgroundColor: Colors.borderGray
                                    }}></View>
                                    <Text style={[CommonStyles.txt4, {
                                        alignSelf: 'flex-start',
                                        paddingLeft: 20, fontSize: 14
                                    }]}>Frequently asked questions</Text>
                                    <View style={{ width: '100%', padding: 20 }}>
                                        <FlatList
                                            ref={(ref) => { this.list3 = ref; }}
                                            onScrollToIndexFailed={(error) => {
                                                this.list3.scrollToOffset({
                                                    offset: error.averageItemLength * error.index, animated: true
                                                });
                                                setTimeout(() => {
                                                    if (this.state.vendor_FAQ.length !== 0 && this.list3 !== null) {
                                                        this.list3.scrollToIndex({ index: error.index, animated: true });
                                                    }
                                                }, 100);
                                            }}
                                            data={this.state.vendor_FAQ}
                                            renderItem={this.renderItemFAQ.bind(this)}
                                            keyExtractor={(item) => "_#" + item.id}
                                            extraData={this.state}
                                            showsHorizontalScrollIndicator={false}
                                            snapToAlignment={'center'}
                                        />
                                    </View>
                                </View>}
                            {this.state.vendor_CMS_Policy !== null && this.state.vendor_CMS_Policy !== '' &&
                                <View style={{ width: '100%' }}>
                                    <View style={{
                                        marginTop: 10, marginBottom: 10, width: '100%', height: 10,
                                        backgroundColor: Colors.borderGray
                                    }}></View>
                                    <Text style={[CommonStyles.txt4, {
                                        alignSelf: 'flex-start',
                                        paddingLeft: 20, fontSize: 14
                                    }]}>Vendor Policy</Text>
                                    <View style={{ width: '100%', padding: 20 }}>
                                        <RenderHtml
                                            contentWidth={wp('90%')}
                                            source={{ html: this.state.vendor_CMS_Policy }}
                                            tagsStyles={this.tagsStyles}
                                            systemFonts={['Poppins-Light', 'Poppins-Regular']}
                                        />
                                    </View>
                                </View>}
                            {this.state.vendor_CMS_TC !== null && this.state.vendor_CMS_TC !== '' &&
                                <View style={{ width: '100%' }}>
                                    <View style={{
                                        marginTop: 10, marginBottom: 10, width: '100%', height: 10,
                                        backgroundColor: Colors.borderGray
                                    }}></View>
                                    <Text style={[CommonStyles.txt4, {
                                        alignSelf: 'flex-start',
                                        paddingLeft: 20, fontSize: 14
                                    }]}>Terms & Condition</Text>
                                    <View style={{ width: '100%', padding: 20 }}>
                                        <RenderHtml
                                            contentWidth={'100%'}
                                            source={{ html: this.state.vendor_CMS_TC }}
                                            tagsStyles={this.tagsStyles}
                                            systemFonts={['Poppins-Light', 'Poppins-Regular']}
                                        />
                                    </View>
                                </View>}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView >

                <Modal
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    isVisible={this.state.openModalReview}
                    PresentationStyle="overFullScreen"
                    coverScreen={false}
                    backdropOpacity={0.8}
                    style={{
                        alignSelf: "center",
                        justifyContent: 'flex-end',
                        width: '100%',
                        height: '60%',
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
                        height: '85%',
                        padding: 20,
                    }}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS == "ios" ? "padding" : "height"}
                            style={{
                                height: '100%', width: '100%',
                            }}
                        >
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                keyboardShouldPersistTaps={'always'}
                                contentContainerStyle={{ flexGrow: 1 }}
                            >
                                <View style={{ width: '100%', }}>
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
                                                <Text style={[CommonStyles.txt4, { fontSize: 18 }]}>Overall Rating</Text>
                                                <TouchableOpacity onPress={() => {
                                                    this.setState({ openModalReview: false })
                                                }}>
                                                    <Icon name='close' size={24} color={Colors.textColor} />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'flex-start' }}>
                                                <CustomRatingBar ratingNumber={(ratingNumber) => this.ratingNumber(ratingNumber)} />
                                            </View>
                                            <View style={{
                                                width: '100%', height: 2, marginTop: 20, marginBottom: 20,
                                                backgroundColor: Colors.borderGray
                                            }}></View>
                                            <View style={[styles.vie1, { marginBottom: 15 }]}>
                                                <TouchableOpacity style={{
                                                    width: '100%', flexDirection: 'row',
                                                    justifyContent: 'space-between', alignItems: 'center'
                                                }}
                                                    onPress={() => this.setState({ isAccordianOpen: !this.state.isAccordianOpen })}>
                                                    {this.state.userTypeSleected == 0 ?
                                                        <Text style={styles.txt3}>Send as</Text>
                                                        : this.state.userTypeSleected == 1 ?
                                                            <View style={{
                                                                width: '80%', flexDirection: 'row',
                                                                justifyContent: 'flex-start', alignItems: 'center',
                                                            }}>
                                                                <Image source={{ uri: this.state.appUserDetails.profile_image }} style={{ height: 24, width: 24, borderRadius: 12, borderWidth: 0.5, borderColor: Colors.midGray }} />
                                                                <Text style={[styles.txt3, { marginLeft: 10 }]}>
                                                                    {this.state.appUserDetails.name}</Text>
                                                            </View>
                                                            : <View style={{
                                                                width: '80%', flexDirection: 'row',
                                                                justifyContent: 'flex-start', alignItems: 'center',
                                                            }}>
                                                                <Icon name='person-circle-outline' size={24}
                                                                    color={Colors.darkGray} />
                                                                <Text style={[styles.txt3, { marginLeft: 10 }]}>Anonymous</Text>
                                                            </View>
                                                    }
                                                    <IconF name={this.state.isAccordianOpen ? 'chevron-up' : 'chevron-down'}
                                                        size={24} color={Colors.darkGray} />
                                                </TouchableOpacity>
                                                {this.state.isAccordianOpen &&
                                                    <View style={{
                                                        borderTopWidth: 1, borderTopColor: Colors.borderGray,
                                                        marginTop: 15
                                                    }}>
                                                        <TouchableOpacity style={{
                                                            width: '100%', flexDirection: 'row',
                                                            justifyContent: 'flex-start', alignItems: 'center', paddingTop: 20,
                                                            paddingBottom: 10
                                                        }} onPress={() => this.setState({
                                                            userTypeSleected: '1',
                                                            isAccordianOpen: false
                                                        })}>
                                                            <Image source={{ uri: this.state.appUserDetails.profile_image }}
                                                                style={{ height: 24, width: 24, borderRadius: 12, borderWidth: 0.5, borderColor: Colors.midGray }} />
                                                            <Text style={[styles.txt3, { marginLeft: 10 }]}>
                                                                {this.state.appUserDetails.name}</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={{
                                                            width: '100%', flexDirection: 'row',
                                                            justifyContent: 'flex-start', alignItems: 'center', paddingTop: 10,
                                                            paddingBottom: 10
                                                        }} onPress={() => this.setState({
                                                            isAccordianOpen: false,
                                                            userTypeSleected: '2'
                                                        })}>
                                                            <Icon name='person-circle-outline' size={24} color={Colors.darkGray} />
                                                            <Text style={[styles.txt3, { marginLeft: 10 }]}>Anonymous</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                }
                                            </View>

                                            <Input
                                                placeholder='Tell us what you think'
                                                containerStyle={[CommonStyles.containerStyle_inp,
                                                {
                                                    borderWidth: 2, width: '100%', height: 150, backgroundColor: Colors.white,
                                                    flexWrap: 'wrap'
                                                }]}
                                                inputContainerStyle={[CommonStyles.inputContainerStyle_inp,
                                                { backgroundColor: Colors.white, }]}
                                                inputStyle={[CommonStyles.userButtonInput_Black,
                                                { backgroundColor: Colors.white, }]}
                                                returnKeyType="next"
                                                onSubmitEditing={event => {
                                                    Keyboard.dismiss()
                                                }}
                                                // multiline
                                                cursorColor={Colors.danger}
                                                blurOnSubmit={false}
                                                underlineColorAndroid={Colors.white}
                                                autoFocus={false}
                                                autoCorrect={true}
                                                value={this.state.tellComment}
                                                onChangeText={(tellComment) => this.setState({ tellComment })}
                                            />

                                            {/* {this.state.isImageAvailable && */}
                                            <View style={[styles.vie13, { justifyContent: 'space-evenly', }]}>
                                                {this.state.profile_image !== '' &&
                                                    <Image source={{ uri: this.state.profile_image }}
                                                        style={{ width: '48%', height: 160, borderRadius: 12, marginTop: 20 }}
                                                        resizeMode='cover' />}
                                                {this.state.profile_image2 !== '' &&
                                                    <Image source={{ uri: this.state.profile_image2 }}
                                                        style={{ width: '48%', height: 160, borderRadius: 12, marginTop: 20 }}
                                                        resizeMode='cover' />}
                                            </View>
                                            {/* } */}
                                            <TouchableOpacity style={styles.vie2} onPress={() => {
                                                Alert.alert(
                                                    'Select a Profile photo',
                                                    //body
                                                    'Choose galary or camera for take picture',
                                                    [
                                                        { text: 'Cancel', onPress: () => { } },
                                                        { text: 'Gallery', onPress: () => this.launchImageLibrary() },
                                                        { text: 'Camera', onPress: () => this.launchCamera() },
                                                    ],
                                                    { cancelable: true },
                                                );
                                            }}>
                                                <IconO name='upload' size={24} color={Colors.textColor} />
                                                <Text style={[styles.txt4, { fontSize: 12, color: '#737373', marginTop: 10 }]}>You can drag or drop the file you want to upload.</Text>
                                                <View style={styles.vie3}>
                                                    <Text style={[styles.txt3, { color: Colors.white }]}>Add Files</Text>
                                                </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{ width: '100%', marginTop: 20 }}
                                                onPress={() => this.validateForm()}>
                                                <LinearGradient
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 1 }}
                                                    colors={['#7111DC', '#F85D47', '#FEAC46']}
                                                    style={CommonStyles.userGradButton}
                                                >
                                                    <Text style={[CommonStyles.userButtonText]}>Submit</Text>
                                                </LinearGradient>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                </Modal>

                {/* Amenities */}
                <Modal
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    isVisible={this.state.OpenAmenitiesMOdal}
                    onBackdropPress={() => { this.setState({ OpenAmenitiesMOdal: false }) }}
                    onSwipeComplete={() => { this.setState({ OpenAmenitiesMOdal: false }) }}
                    swipeDirection={["down"]}
                    PresentationStyle="overFullScreen"
                    coverScreen={false}
                    backdropOpacity={0.8}
                    style={{
                        alignSelf: "center",
                        justifyContent: 'flex-end',
                        width: '100%',
                        height: '60%',
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
                        height: '65%',
                        padding: 20,
                    }}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS == "ios" ? "padding" : "height"}
                            style={{
                                height: '100%', width: '100%',
                            }}
                        >
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                keyboardShouldPersistTaps={'always'}
                                contentContainerStyle={{ flexGrow: 1 }}
                            >
                                <View style={{ width: '100%', }}>
                                    <View style={{
                                        width: '100%', justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>

                                            <View style={{
                                                justifyContent: 'center', alignItems: 'center', height: 3,
                                                width: 61, marginBottom: 15, backgroundColor: '#cccccc'
                                            }}></View>
                                            <TouchableOpacity style={{
                                                width: 50, height: 50,
                                                alignSelf: 'flex-end',
                                                alignItems: 'flex-end'
                                            }} onPress={() => { this.setState({ OpenAmenitiesMOdal: false }) }}>
                                                <Icon name='close' size={32} color={Colors.textColor} />
                                            </TouchableOpacity>
                                            <View style={{ width: '100%', marginTop: 10 }}>
                                                <Text style={[CommonStyles.txt1, {
                                                    color: Colors.textColor,
                                                    fontFamily: fonts.fontPoppinsMedium,
                                                }]}>What this Place Offers</Text>
                                                {(this.state.vendor_attribute !== null &&
                                                    this.state.vendor_attribute.length > 0) &&
                                                    <FlatList
                                                        data={this.state.vendor_attribute}
                                                        renderItem={this.renderModalItem.bind(this)}
                                                        keyExtractor={(item) => item.id}
                                                        extraData={this.state}
                                                        numColumns='2'
                                                        scrollEnabled={true}
                                                        nestedScrollEnabled={true}
                                                        columnWrapperStyle={{
                                                            alignItems: 'flex-start',
                                                            marginTop: 10,
                                                            width: '100%',
                                                            alignSelf: 'center',
                                                        }}
                                                        contentContainerStyle={{
                                                            marginTop: 10, paddingBottom: 20,
                                                        }}
                                                    />
                                                }
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                </Modal>

                {/* Vendor PLan Single detail */}
                <Modal
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    isVisible={this.state.openModalForPLan}
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
                                keyboardShouldPersistTaps={'always'}
                                contentContainerStyle={{ flexGrow: 1 }}
                                style={{
                                    width: '100%',
                                }}
                            >
                                <View style={{
                                    width: '100%', height: '75%'
                                }}>

                                    <View style={{
                                        width: '100%', justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>

                                            <View style={{
                                                justifyContent: 'center', alignItems: 'center', height: 3,
                                                width: 61, marginBottom: 15, backgroundColor: '#cccccc'
                                            }}></View>
                                            <TouchableOpacity style={{
                                                width: 50, height: 50,
                                                alignSelf: 'flex-end',
                                                alignItems: 'flex-end'
                                            }} onPress={() => { this.setState({ openModalForPLan: false }) }}>
                                                <Icon name='close' size={32} color={Colors.textColor} />
                                            </TouchableOpacity>
                                            <View style={{ width: '100%', }}>
                                                <Text style={[CommonStyles.txt4, {}]}>
                                                    {this.state.openVendorDetailPlan.plan_name}</Text>
                                                <Text style={[CommonStyles.txt4, { marginTop: 5, marginBottom: 5 }]}>
                                                    ${this.state.openVendorDetailPlan.plan_amount}</Text>
                                                {this.state.openVendorDetailPlan.plan_title !== '' &&
                                                    <Text style={[CommonStyles.txt2, {
                                                        color: Colors.darkGray,
                                                        fontWeight: '400', marginTop: 5
                                                    }]}>{this.state.openVendorDetailPlan.plan_title}</Text>}
                                                {this.state.openVendorDetailPlan.plan_sub_title !== '' &&
                                                    <Text style={[CommonStyles.txt2, { color: Colors.midGray, fontWeight: '400', marginTop: 5 }]}>({this.state.openVendorDetailPlan.plan_sub_title})</Text>}
                                                {this.state.openVendorDetailPlan.plan_description !== '' &&
                                                    <Text style={[CommonStyles.txt7, { color: Colors.darkGray, marginTop: 5 }]}>
                                                        {this.state.openVendorDetailPlan.plan_description}</Text>}

                                                {!this.state.noPartyCreated &&
                                                    <View style={[CommonStyles.containerStyle_inp,
                                                    {
                                                        width: '100%',
                                                        alignItems: 'center', justifyContent: 'center',
                                                        marginTop: 20
                                                    }]}
                                                    >
                                                        <View style={{
                                                            zIndex: 100, position: 'absolute',
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
                                                            itemCount='2'
                                                            dropdownPosition={0}
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
                                                            <Icon name={"chevron-down"} size={22} color={Colors.textColor} />
                                                        </TouchableOpacity>
                                                    </View>}

                                                <TouchableOpacity style={{
                                                    width: '100%',
                                                    marginTop: 30
                                                }}
                                                    onPress={() => this.callBookNowVendor('plan')}>
                                                    <LinearGradient
                                                        start={{ x: 0, y: 0 }}
                                                        end={{ x: 1, y: 1 }}
                                                        colors={['#7111DC', '#F85D47', '#FEAC46']}
                                                        style={CommonStyles.userGradButton}
                                                    >
                                                        <Text style={[CommonStyles.userButtonText]}>Book Now</Text>
                                                    </LinearGradient>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                </Modal>

                {/* Vendor Product Single detail */}
                <Modal
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    isVisible={this.state.openModalForPRoduct}
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
                                keyboardShouldPersistTaps={'always'}
                                contentContainerStyle={{ flexGrow: 1 }}
                                style={{
                                    width: '100%',
                                }}
                            >
                                <View style={{
                                    width: '100%', height: '70%'
                                }}>

                                    <View style={{
                                        width: '100%', justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>

                                            <View style={{
                                                justifyContent: 'center', alignItems: 'center', height: 3,
                                                width: 61, marginBottom: 15, backgroundColor: '#cccccc'
                                            }}></View>
                                            <TouchableOpacity style={{
                                                width: 50, height: 50,
                                                alignSelf: 'flex-end',
                                                alignItems: 'flex-end'
                                            }} onPress={() => {
                                                this.setState({
                                                    openModalForPRoduct: false,
                                                    counterQuantity: '1'
                                                })
                                            }}>
                                                <Icon name='close' size={32} color={Colors.textColor} />
                                            </TouchableOpacity>
                                            <View style={{ width: '100%', }}>
                                                {this.state.openVendorDetailPRoduct.title !== '' &&
                                                    <Text style={[CommonStyles.txt4, {}]}>
                                                        {this.state.openVendorDetailPRoduct.title}</Text>}
                                                {this.state.openVendorDetailPRoduct.price !== '' &&
                                                    <Text style={[CommonStyles.txt4, { marginTop: 5, marginBottom: 5 }]}>
                                                        ${this.state.openVendorDetailPRoduct.price !== '' ?
                                                            parseFloat(this.state.openVendorDetailPRoduct.price).toFixed(2) :
                                                            this.state.openVendorDetailPRoduct.price}</Text>}
                                                {this.state.openVendorDetailPRoduct.description !== '' &&
                                                    <Text style={[CommonStyles.txt7, { color: Colors.darkGray, marginBottom: 20 }]}>
                                                        {this.state.openVendorDetailPRoduct.description}</Text>}

                                                {!this.state.noPartyCreated &&
                                                    <View style={[CommonStyles.containerStyle_inp,
                                                    {
                                                        width: '100%',
                                                        alignItems: 'center', justifyContent: 'center',
                                                        marginTop: 20, marginBottom: 30,
                                                    }]}
                                                    >
                                                        <View style={{
                                                            zIndex: 100, position: 'absolute',
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
                                                            itemCount='3'
                                                            dropdownPosition={0}
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
                                                            <Icon name={"chevron-down"} size={22} color={Colors.textColor} />
                                                        </TouchableOpacity>
                                                    </View>}

                                                {(this.state.openVendorDetailPRoductImage !== null &&
                                                    this.state.openVendorDetailPRoductImage.length > 0) &&
                                                    <View style={{
                                                        width: '100%',
                                                        paddingBottom: 15
                                                    }}>
                                                        <FlatList
                                                            data={this.state.openVendorDetailPRoductImage}
                                                            renderItem={({ item, index }) => this.renderChildrenProduct(item, index)}
                                                            keyExtractor={(item) => item.id}
                                                            extraData={this.state}
                                                            numColumns='2'
                                                            scrollEnabled={true}
                                                            nestedScrollEnabled={true}
                                                            columnWrapperStyle={{
                                                                alignItems: 'flex-start',
                                                                width: '100%',
                                                                alignSelf: 'center',
                                                            }}
                                                            contentContainerStyle={{
                                                            }}
                                                        />
                                                    </View>
                                                }
                                                <View style={{
                                                    width: '100%', flexDirection: 'row',
                                                    justifyContent: 'space-between', alignItems: 'center', marginBottom: 10,
                                                }}>
                                                    <Text style={[CommonStyles.txt4, { fontSize: 16 }]}>Quantity</Text>
                                                    <View style={styles.vie16}>
                                                        <TouchableOpacity style={[styles.vie17]}
                                                            onPress={() => { this.decrease() }}>
                                                            <Icon name='remove' size={20} color={Colors.midGray} />
                                                        </TouchableOpacity>
                                                        <View style={styles.vie18}></View>
                                                        <Text style={[CommonStyles.txt4, {
                                                            fontSize: 14, width: '16%',
                                                            alignSelf: 'center', alignItems: 'center', textAlign: 'center'
                                                        }]}>{this.state.counterQuantity}</Text>
                                                        <View style={styles.vie18}></View>
                                                        <TouchableOpacity style={[styles.vie17]}
                                                            onPress={() => {
                                                                this.setState({ counterQuantity: parseInt(this.state.counterQuantity) + 1 })
                                                            }}>
                                                            <Icon name='add' size={20} color={Colors.textColor} />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                <TouchableOpacity style={{ width: '100%', marginTop: 20 }}
                                                    onPress={() => this.callBookNowVendor('product')}>
                                                    <LinearGradient
                                                        start={{ x: 0, y: 0 }}
                                                        end={{ x: 1, y: 1 }}
                                                        colors={['#7111DC', '#F85D47', '#FEAC46']}
                                                        style={CommonStyles.userGradButton}
                                                    >
                                                        <Text style={[CommonStyles.userButtonText]}>Book Now</Text>
                                                    </LinearGradient>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                </Modal>
            </View>
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
    txt3: {
        fontFamily: fonts.fontPoppinsMedium,
        fontWeight: '500',
        fontSize: 14,
        color: Colors.darkGray,
    },
    vie13: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    vie3: {
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6F10DD',
        borderRadius: 12,
        height: 50,
        marginTop: 15
    },
    vie14: {
        width: 234,
        height: 90,
        borderRadius: 10,
        borderWidth: 0,
        borderColor: 'rgba(16, 227, 131, 0.3)',
        elevation: 10,
        shadowColor: 'rgba(17, 11, 44, 0.4)',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4,
        backgroundColor: 'white',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: 10,
        margin: 10
    },
    vie15: {
        width: '100%',
        borderRadius: 10,
        borderWidth: 0,
        borderColor: 'rgba(16, 227, 131, 0.3)',
        elevation: 4,
        shadowColor: 'rgba(17, 11, 44, 0.4)',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        backgroundColor: 'white',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: 10,
        alignContent: 'center',
        alignSelf: 'center',
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
        width: '48.5%',
        height: '100%',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    vie10: {
        width: '48.5%',
        height: '100%',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    vie1: {
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.midGray
    },
    vie2: {
        width: '100%',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.borderGray,
        height: 170,
        borderStyle: 'dashed',
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    vie16: {
        borderRadius: 8,
        borderWidth: 1,
        width: "60%",
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderColor: Colors.midGray,
    },
    vie17: {
        width: '18%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    vie18: {
        width: 1.5,
        height: 48,
        backgroundColor: Colors.midGray
    },

    background: {
        width: '100%',
        height: 200,
    },
    image: {
        borderBottomRightRadius: 12,
        borderBottomLeftRadius: 12,
    },
    overlay: {
        position: 'absolute',
        zIndex: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        height: 200,
        borderBottomRightRadius: 12,
        borderBottomLeftRadius: 12,
        width: '100%',
    },
    headerContainer: {
        flexDirection: 'row',
        zIndex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start', // set icon (back/share) align to text like, top, center, bottom
        position: 'absolute',
        top: 130,
        left: 20,
        right: 20,
    },
    textContainer: {
        flex: 1,
        marginLeft: 20,
    },
    text: {
        color: Colors.white,
        flexWrap: 'wrap',
        width: '100%',
    },
    shareIcon: {
        marginLeft: 12,
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
)(VendorDetail);
