import React, { Component, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import CommonStyles from '../styles/CommonStyles';
import { connect } from 'react-redux';
import { actions as appActions } from "../AppState/actions/appActions";
import { Colors } from '../Components/theme';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Switch } from 'react-native-paper';
import { ProdCtrl } from '../Controller/ProductController';
import { ErrorCtrl } from '../Controller/ErrorController';
import AsyncStorage from '@react-native-async-storage/async-storage';

class NotificationListPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pushNotificationSwitch: false,
            emailSwitch: false
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('Push').then(value => {
            if (value == null || value == 0)
                this.setState({ pushNotificationSwitch: false })
            else this.setState({ pushNotificationSwitch: true })
        })
        AsyncStorage.getItem('Email').then(value => {
            if (value == null || value == 0)
                this.setState({ emailSwitch: false })
            else this.setState({ emailSwitch: true })
        })
    }

    async callChangesInNotification(type1, type2) {
        var that = this;
        this.props.setLoader(true);
        let data = { name: type2, value: type1 ? 1 : 0 }
        var result = await ProdCtrl.NotificationUpdate(data).catch(obj => {
            this.props.setLoader(false);
            ErrorCtrl.showError({
                msg: obj.data,
            });

            return false;
        });
        this.props.setLoader(false);

        if (result) {
        }
    }

    render() {
        return (
            <SafeAreaView style={{
                justifyContent: 'flex-start',
                alignItems: "center",
                backgroundColor: '#FDFDFD',
                height: '100%',
                paddingTop: Platform.OS == "ios" ? 20 : 0
            }} >
                <View style={styles.vie1}>
                    <TouchableOpacity style={{
                        height: 46, width: 46, alignItems: 'center',
                        justifyContent: 'center',
                    }}
                        onPress={() => {
                            this.props.navigation.goBack()
                        }}>
                        <Ionicons name='arrow-back' size={30} color={Colors.textColor} />
                    </TouchableOpacity>
                    <Text style={[CommonStyles.txt3, {
                        fontWeight: '400', fontSize: 18,
                        marginLeft: 20, width: '80%',
                    }]}>Notification Settings</Text>
                </View>
                <View style={{ width: '100%', padding: 20, marginTop: 15 }}>
                    <Text style={[CommonStyles.txt4, { fontSize: 16 }]}>Email</Text>

                    <TouchableOpacity style={styles.vie2}>
                        <Text style={[CommonStyles.txt4, { fontSize: 16 }]}>Push Notification</Text>
                        <Switch
                            value={this.state.pushNotificationSwitch}
                            color={this.state.pushNotificationSwitch ? Colors.success : Colors.darkGray}
                            onValueChange={(value) => {
                                AsyncStorage.setItem('Push', value == true ? '1' : '0')
                                this.setState({ pushNotificationSwitch: value })
                                this.callChangesInNotification(value, 'notification_push_status');
                            }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.vie2}>
                        <Text style={[CommonStyles.txt4, { fontSize: 16 }]}>Email</Text>
                        <Switch
                            value={this.state.emailSwitch}
                            color={this.state.emailSwitch ? Colors.success : Colors.darkGray}
                            onValueChange={(value) => {
                                AsyncStorage.setItem('Email', value == true ? '1' : '0')
                                this.setState({ emailSwitch: value })
                                this.callChangesInNotification(value, 'notification_email_status');
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10
    },
    vie2: {
        marginTop: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
        height: 60,
        paddingLeft: 10,
        paddingRight: 10,
        shadowColor: '#7090B01F',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4,
        borderRadius: 12,
        borderWidth: 0,
        backgroundColor: 'white',
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
)(NotificationListPage);