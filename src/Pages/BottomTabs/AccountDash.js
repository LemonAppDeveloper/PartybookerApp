import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, Alert } from 'react-native';
import CommonStyles from '../../styles/CommonStyles';
import { connect } from 'react-redux';
import { actions as appActions } from "../../AppState/actions/appActions";
import { Colors, fonts } from '../../Components/theme';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity } from 'react-native';
import Apis from '../../util/constant';
import { appStore } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AccountDash extends Component {
    constructor(props) {
        super(props)
        this.state = {
            LOGINTYPE: true,
            getUSERDeatils: {},
        }
    }

    componentDidMount() {
        this.setState({ getUSERDeatils: appStore.getState().app.userDetails })
        let LoginType = appStore.getState().app.userTypeDetails;
        if (LoginType == 'google' || LoginType == 'fb') {
            this.setState({ LOGINTYPE: false })
        } else {
            this.setState({ LOGINTYPE: true })
        }
    }

    updateText(texttt) {
        this.setState({ getUSERDeatils: appStore.getState().app.userDetails })
    }

    async callcallRemoveLogin() {
        Alert.alert(
            "Sign Out",
            'Are you sure you want to Sign Out?',
            [
                { text: 'NO', onPress: () => { console.log("ok") } },
                {
                    text: 'YES', onPress: () => {

                        AsyncStorage.setItem('Logout', 'yes');
                        appStore.dispatch(appActions.updateAppState({
                            status: 'auth',
                            from: 'signin'
                        }));
                        appStore.dispatch(appActions.resetStore(null));
                    }
                }
            ],
            { cancelable: true }
        );
    }

    render() {
        return (
            <View style={[CommonStyles.container, {
                justifyContent: 'flex-start',
                alignItems: "flex-start",
                backgroundColor: 'white',
                height: '90%',
                width: '100%',
                padding: 20,
                marginTop: Platform.OS == "ios" ? 10 : 0
            }]} >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    style={{ height: '90%', width: '100%' }}>
                    <View style={{ height: '100%', width: '100%', }}>
                        <Text style={[CommonStyles.txt3, {
                            fontFamily: fonts.fontPoppinsMedium, color: Colors.black
                        }]}>Account</Text>
                        <Text style={[CommonStyles.txt1, {
                            fontWeight: '300', color: Colors.black,
                            fontFamily: fonts.fontPoppinsLight
                        }]}>
                            {this.state.getUSERDeatils.email}</Text>

                        {/* 1 */}
                        <Text style={[CommonStyles.txt1, {
                            marginTop: 20,
                            fontFamily: fonts.fontPoppinsMedium
                        }]}>Parties</Text>
                        <View style={[styles.vie1, { marginTop: 15 }]}>
                            <TouchableOpacity style={styles.vie2} onPress={() => {

                                this.props.propss.navigation.navigate('PlannedParties')
                            }}>
                                <Text style={[CommonStyles.txt1, { color: Colors.textColor, marginLeft: 12 }]}>Planned Parties</Text>
                                <View style={{ width: 48, height: 48, justifyContent: 'center', alignItems: 'center' }}>
                                    <Ionicons name='arrow-forward' size={24} color={Colors.darkGray} />
                                </View>
                            </TouchableOpacity>
                            <View style={{ height: 0.5, backgroundColor: Colors.borderGray }}></View>
                            <TouchableOpacity style={styles.vie2} onPress={() => {
                                this.props.propss.navigation.navigate('PreviousParties')
                            }}>
                                <Text style={[CommonStyles.txt1, { color: Colors.textColor, marginLeft: 12 }]}>Previous Parties</Text>
                                <View style={{ width: 48, height: 48, justifyContent: 'center', alignItems: 'center' }} >
                                    <Ionicons name='arrow-forward' size={24} color={Colors.darkGray} />
                                </View>
                            </TouchableOpacity>
                            <View style={{ height: 0.7, backgroundColor: Colors.borderGray }}></View>
                            <TouchableOpacity style={styles.vie2} onPress={() => {
                                this.props.propss.navigation.navigate('FavouriteParties')
                            }}>
                                <Text style={[CommonStyles.txt1, { color: Colors.textColor, marginLeft: 12 }]}>Favourites</Text>
                                <View style={{ width: 48, height: 48, justifyContent: 'center', alignItems: 'center' }} >
                                    <Ionicons name='arrow-forward' size={24} color={Colors.darkGray} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        {/* 2 */}

                        {/* 3 */}
                        <Text style={[CommonStyles.txt1, {
                            marginTop: 20,
                            fontFamily: fonts.fontPoppinsMedium
                        }]}>Settings</Text>
                        <View style={[styles.vie1, { marginTop: 15 }]}>
                            {this.state.LOGINTYPE &&
                                <TouchableOpacity style={styles.vie2} onPress={() => {
                                    this.props.propss.navigation.navigate('ProfileInfo', {
                                        updateText: (newText) => this.updateText(newText)
                                    });
                                }}>
                                    <Text style={[CommonStyles.txt1, { color: Colors.textColor, marginLeft: 12 }]}>Profile Information</Text>
                                    <View style={{ width: 48, height: 48, justifyContent: 'center', alignItems: 'center' }}>
                                        <Ionicons name='arrow-forward' size={24} color={Colors.darkGray} />
                                    </View>
                                </TouchableOpacity>
                            }
                            <View style={{ height: 0.5, backgroundColor: Colors.borderGray }}></View>
                            <TouchableOpacity style={styles.vie2} onPress={() => {
                                this.props.propss.navigation.navigate('NotificationListPage');
                            }}>
                                <Text style={[CommonStyles.txt1, { color: Colors.textColor, marginLeft: 12 }]}>Notifications</Text>
                                <View style={{ width: 48, height: 48, justifyContent: 'center', alignItems: 'center' }}>
                                    <Ionicons name='arrow-forward' size={24} color={Colors.darkGray} />
                                </View>
                            </TouchableOpacity>

                            <View style={{ height: 0.7, backgroundColor: Colors.borderGray }}></View>
                            <TouchableOpacity style={styles.vie2} onPress={() => {
                                this.props.propss.navigation.navigate('WebviewCall', {
                                    webID: Apis.CONTACT_US,
                                    namee: 'Contact Us'
                                })
                            }}>
                                <Text style={[CommonStyles.txt1, { color: Colors.textColor, marginLeft: 12 }]}>Help Center</Text>
                                <View style={{ width: 48, height: 48, justifyContent: 'center', alignItems: 'center' }}>
                                    <Ionicons name='arrow-forward' size={24} color={Colors.darkGray} />
                                </View>
                            </TouchableOpacity>
                            <View style={{ height: 0.5, backgroundColor: Colors.borderGray }}></View>
                            <View style={{ height: 0.5, backgroundColor: Colors.borderGray }}></View>
                            <TouchableOpacity style={styles.vie2} onPress={() => {
                                this.props.propss.navigation.navigate('WebviewCall', {
                                    webID: Apis.ABOUT_US,
                                    namee: 'About Us'
                                })
                            }}>
                                <Text style={[CommonStyles.txt1, { color: Colors.textColor, marginLeft: 12 }]}>About</Text>
                                <View style={{ width: 48, height: 48, justifyContent: 'center', alignItems: 'center' }}>
                                    <Ionicons name='arrow-forward' size={24} color={Colors.darkGray} />
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* 4 */}
                        <View style={[styles.vie1, {
                            marginTop: 15,
                            fontFamily: fonts.fontPoppinsMedium
                        }]}>
                            <TouchableOpacity style={styles.vie2}
                                onPress={() => {
                                    //logout api + delete saved data 
                                    this.callcallRemoveLogin()
                                }}>
                                <Text style={[CommonStyles.txt1, { color: Colors.danger, marginLeft: 12 }]}>Sign Out</Text>
                                <View style={{ width: 48, height: 48, justifyContent: 'center', alignItems: 'center' }}>
                                    <Ionicons name='arrow-forward' size={24} color={Colors.danger} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View >
        )
    }
};

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'
    },
    vie1: {
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
    vie2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
});


function mapDispatchToProps(dispatch) {
    return {
        updateAppState: data => dispatch(appActions.updateAppState(data)),
        setLoader: data => dispatch(appActions.setLoader(data)),
        setUserDetails: data => dispatch(appActions.setUserDetails(data)),
        SetSelectionTYpeOFUSer: data => dispatch(appActions.SetSelectionTYpeOFUSer(data)),

    }
}

export default connect(
    null,
    mapDispatchToProps
)(AccountDash);