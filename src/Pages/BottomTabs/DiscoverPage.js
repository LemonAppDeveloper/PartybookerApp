import React, { Component } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, BackHandler, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import { actions as appActions } from "../../AppState/actions/appActions";
import { Colors, fonts } from '../../Components/theme';
import DiscoverDash from './DiscoverDash';
import SearchDash from './SearchDash';
import AccountDash from './AccountDash';
import { BottomNavigation, configureFonts } from 'react-native-paper';
import messaging from '@react-native-firebase/messaging';
import { ErrorCtrl } from '../../Controller/ErrorController';
import { AuthCtrl } from '../../Controller/AuthController';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fontConfig = {
    web: {
        regular: {
            fontFamily: 'Poppins-Regular',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'Poppins-Medium',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'Poppins-Light',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'Poppins-Thin',
            fontWeight: 'normal',
        },
    },
    ios: {
        regular: {
            fontFamily: 'Poppins-Regular',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'Poppins-Medium',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'Poppins-Light',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'Poppins-Thin',
            fontWeight: 'normal',
        },
    },
    android: {
        regular: {
            fontFamily: 'Poppins-Regular',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'Poppins-Medium',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'Poppins-Light',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'Poppins-Thin',
            fontWeight: 'normal',
        },
    }
};

class DiscoverPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            index: 0,
            isOpen: true,
            drawer_d: false,
            setIndex: 0,
            isNotification: false,
            showProgress: true,
            indexName: 'ZegoFit',
            routes: [
                { key: 'chat', title: "Discover", icon: { uri: 'exp_' }, color: Colors.flatViolet, focusedIcon: { uri: 'exp_' }, unfocusedIcon: { uri: 'exp_' } },
                { key: 'food', title: "Search", icon: { uri: 'seach' }, color: Colors.midGray, focusedIcon: { uri: 'seach' }, unfocusedIcon: { uri: 'seach' } },
                { key: 'home', title: "Account", icon: { uri: 'profile' }, color: Colors.midGray, focusedIcon: { uri: 'profile' }, unfocusedIcon: { uri: 'profile' } }
            ],
            backPressCount: 0,
            id: null, // Store event ID here from MyParty and send it to DiscoverDash 
            location: null, // Store event Location here from MyParty and send it to DiscoverDash
        }
    }

    componentDidMount() {
        AsyncStorage.setItem('Logout', 'no');
        this.getFCMTokens()

        // Example code to get ID (Replace this with actual logic to fetch ID)
        const id = this.props.route.params?.id;
        const location = this.props.route.params?.eventLocation;
        if (id) {
            console.log('Received ID:', id);
            console.log('Received Location:', location);
            this.setState({ id });
            this.setState({ location });
        }
    }

    getFCMTokens = async () => {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
            console.log('Your Firebase Token is:', fcmToken);
            this.callAPITOKEN(fcmToken)
        } else {
            console.log('Failed', 'No token received');
        }
    };

    async callAPITOKEN(token) {
        let data = {
            device_type: Platform.OS == "ios" ? '2' : '1',
            notification_token: token
        }
        var result = await AuthCtrl.AddTOKENToAPI(data).catch(obj => {
            ErrorCtrl.showError({
                msg: obj.message,
            });
            return false;
        })
    }

    UNSAFE_componentWillReceiveProps() {
        this.state.routes.pop();
        this.state.routes.pop();
        this.state.routes.pop();

        this.state.routes.push(
            { key: 'chat', title: "Discover", icon: { uri: 'exp_' }, color: Colors.flatViolet, focusedIcon: { uri: 'exp_' }, unfocusedIcon: { uri: 'exp_' } },
            { key: 'food', title: "Search", icon: { uri: 'seach' }, color: Colors.midGray, focusedIcon: { uri: 'seach' }, unfocusedIcon: { uri: 'seach' } },
            { key: 'home', title: "Account", icon: { uri: 'profile' }, color: Colors.midGray, focusedIcon: { uri: 'profile' }, unfocusedIcon: { uri: 'profile' } }
        )
    }

    async componentWillMount() {
        console.log('DiscoverPage_componentWillMount')
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    async componentWillUnmount() {
        console.log('DiscoverPage_componentWillUnmount')
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = async () => {
        const { index, backPressCount } = this.state;
        console.log('index', index)
        console.log('backPressCount', backPressCount)

        if (this.props.navigation.isFocused()) {
            console.log('isFocused')
            if (index === 0) {
                if (backPressCount === 1) {
                    // Exit the app
                    BackHandler.exitApp();
                } else {
                    this.setState({ backPressCount: 1 });
                    ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
                    // Reset the backPressCount after 2 seconds
                    setTimeout(() => {
                        this.setState({ backPressCount: 0 });
                    }, 2000);
                }
            } else {
                // If on Search or Account tab, navigate back to Discover tab
                this.setState({ index: 0, indexName: "Discover" });
            }
            return true; // Prevent default back button behavior
        } else {
            // If not focused, go back to the previous screen
            this.props.navigation.goBack();
            return true; // Prevent default back button behavior
        }
    };

    _handleIndexChange = index => {
        this.setState({ index })

        if (index == 0)
            this.setState({ indexName: "Discover" });
        else if (index == 1)
            this.setState({ indexName: "Search" });
        else
            this.setState({ indexName: "Account" });

    };

    renderScene = ({ route, jumpTo }) => {
        // Using index because want to access tab changes
        const { index, id, location } = this.state; // Get the current tab index from state

        switch (route.key) {
            case 'chat':
                return <DiscoverDash jumpTo={jumpTo} propss={this.props} index={index} id={id} eventLocation={location} />;
            case 'food':
                return <SearchDash jumpTo={jumpTo} calledAgain={"YES"} propss={this.props} index={index} />;
            case 'home':
                return <AccountDash jumpTo={jumpTo} propss={this.props} />;
            default:
                return <DiscoverDash jumpTo={jumpTo} propss={this.props} index={index} id={id} location={location} />;
        }
    }

    render() {
        const { index, setIndex, routes, indexName } = this.state;
        return (
            <SafeAreaView style={[{
                justifyContent: 'space-between',
                alignItems: "center",
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                height: ('100%'),
                width: ('100%')
            }]} >
                <View style={{ height: ('100%'), width: '100%' }}>
                    <BottomNavigation
                        navigationState={{ index, routes }}
                        shifting={true}
                        labeled={true}
                        theme={{
                            fonts: configureFonts({ config: fontConfig, isV3: false }),
                        }}
                        onIndexChange={this._handleIndexChange}
                        renderScene={this.renderScene}
                        activeColor={Colors.flatViolet}
                        inactiveColor={Colors.midGray}
                        tabBarActiveTintColor={Colors.yellow}
                        style={{
                            backgroundColor: Colors.white,
                            fontFamily: fonts.fontPoppinsRegular,

                        }}
                        activeIndicatorStyle={{
                            fontFamily: fonts.fontPoppinsRegular
                        }}
                        barStyle={{
                            fontFamily: fonts.fontPoppinsRegular,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            paddingTop: 10,
                            position: 'absolute',
                            overflow: 'hidden',
                            height: 80,
                            borderTopLeftRadius: 15,
                            borderTopRightRadius: 15,
                            elevation: 4,
                            shadowColor: 'rgba(112, 144, 176, 0.30)',
                            shadowOffset: {
                                width: 0,
                                height: 3,
                            },
                            shadowOpacity: 0.17,
                            shadowRadius: 3.05,
                            elevation: 2,
                        }}
                    >
                    </BottomNavigation>
                </View>
            </SafeAreaView>
        )
    }
};

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
)(DiscoverPage);


