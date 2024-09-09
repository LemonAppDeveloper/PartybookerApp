import React, { Component, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Platform, TouchableOpacity, FlatList, Alert } from 'react-native';
import CommonStyles from '../styles/CommonStyles';
import { connect } from 'react-redux';
import { actions as appActions } from "../AppState/actions/appActions";
import { Colors, fonts } from '../Components/theme';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ProdCtrl } from '../Controller/ProductController';
import { ErrorCtrl } from '../Controller/ErrorController';

class NotificationAPIPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            notificationListAPI: [],
            isReaded: false,
            readNotificationID: '',
            valueOfUnread: '0'
        }
    }

    componentDidMount() {
        this.getAllNotificationAPI();
    }

    async getAllNotificationAPI() {
        var that = this;
        this.props.setLoader(true);
        let data = {};
        var result = await ProdCtrl.NotificationListNotify(data).catch(obj => {
            this.props.setLoader(false);
            var code = obj.success;
            return false;
        });
        this.props.setLoader(false);

        this.setState({ notificationListAPI: [] })

        let valueOfUnread = '0'
        if (result) {
            this.setState({ notificationListAPI: result.data })
            for (let i = 0; i < result.data.length; i++) {
                if (result.data[i].is_read == 0) {
                    valueOfUnread++;
                }
            }
            this.setState({ valueOfUnread: valueOfUnread })
        }
    }

    async NotificationRead(item, ID) {
        let data = { id: ID };
        var result = await ProdCtrl.NotificationRead(data).catch(obj => {
            this.props.setLoader(false);
            var code = obj.success;

            ErrorCtrl.showError({
                msg: obj.message,
            });
            return false;
        });

        if (result) { }
    }

    renderItemType = ({ item, index }) => {
        return (
            <TouchableOpacity style={{
                width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                paddingTop: 20, paddingBottom: this.state.notificationListAPI.length - 1 == index ? 20 : 0,
            }} onPress={() => {
                Alert.alert(
                    "Notification",
                    item.notification,
                    [
                        { text: 'OK', onPress: () => { this.getAllNotificationAPI() } }
                    ],
                    { cancelable: false }
                );
                this.NotificationRead(item, item.id)
            }}>
                <View style={styles.container1}>
                    <Image
                        source={require('../assets/bell_ic.png')}
                        style={styles.image}
                    />
                    <View style={styles.textContainer}>
                        <Text style={[CommonStyles.txt1, {
                            flexWrap: 'wrap', fontWeight: item.is_read == '0' ? '500' : '300',
                            fontFamily: item.is_read == '0' ? fonts.fontPoppinsMedium : fonts.fontPoppinsLight
                        }]} numberOfLines={2}>
                            {item.notification}</Text>
                        <Text style={[CommonStyles.txt2, {
                            fontWeight: item.is_read == '0' ? '600' : '400',
                            color: Colors.darkGray
                        }]}>
                            {item.created_at}</Text>
                    </View>
                    <View style={{
                        width: '20%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center',
                    }}>
                        {item.is_read == "0" && <View style={{
                            width: 10, height: 10, borderRadius: 10,
                            backgroundColor: Colors.orange3,
                        }}></View>}
                        <Ionicons name='chevron-forward-outline' size={24} color={Colors.textColor} />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }


    render() {
        return (
            <SafeAreaView style={{
                justifyContent: 'flex-start',
                alignItems: "center",
                backgroundColor: '#FDFDFD',
                height: '100%',
                paddingTop: Platform.OS == "ios" ? 15 : 0
            }} >
                <View style={styles.vie1}>
                    <TouchableOpacity style={{
                        height: 46, width: 46, alignItems: 'center',
                        justifyContent: 'center',
                    }}
                        onPress={() => {
                            this.props.navigation.goBack()
                            if (this.props.route.hasOwnProperty('params') &&
                                this.props.route.params !== undefined &&
                                (this.props.route.params.hasOwnProperty('updateText'))) {
                                console.log("UPDATE TEXT : ", "now what??");
                                this.props.route.params.updateText('Notification');
                            }
                        }}>
                        <Ionicons name='arrow-back' size={30} color={Colors.textColor} />
                    </TouchableOpacity>
                    <Text style={[CommonStyles.txt3, {
                        fontWeight: '400', fontSize: 20, marginLeft: 20, width: '70%', alignSelf: 'center',
                        textAlign: 'center'
                    }]}>Notifications</Text>
                </View>
                {this.state.notificationListAPI !== null && this.state.notificationListAPI.length > 0 ?
                    <View style={{ width: '100%', padding: 20, marginTop: 15 }}>
                        <Text style={[CommonStyles.txt1, { fontFamily: fonts.fontPoppinsMedium, marginBottom: 20 }]}>
                            {this.state.valueOfUnread} Unread</Text>
                        <FlatList
                            ref={(ref) => { this.list3 = ref; }}
                            onScrollToIndexFailed={(error) => {
                                this.list3.scrollToOffset({ offset: error.averageItemLength * error.index, animated: true });
                                setTimeout(() => {
                                    if (this.state.notificationListAPI.length !== 0 && this.list3 !== null) {
                                        this.list3.scrollToIndex({ index: error.index, animated: true });
                                    }
                                }, 100);
                            }}
                            data={this.state.notificationListAPI}
                            renderItem={this.renderItemType.bind(this)}
                            keyExtractor={(item) => "_#" + item.id}
                            extraData={this.state}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            snapToAlignment={'center'}
                        />
                    </View>
                    :
                    <View style={[CommonStyles.txt3, {
                        verticalAlign: 'middle',
                        height: '90%', width: '100%', justifyContent: 'center',
                        alignSelf: 'center', alignItems: 'center', textAlign: 'center'
                    }]}>
                        <Text style={[CommonStyles.txt3, { fontSize: 14 }]}>Nothing to show.</Text>
                    </View>
                }
            </SafeAreaView>
        )
    }
};


const styles = StyleSheet.create({
    container1: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
    },
    image: {
        width: 28,
        height: 28,
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
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
)(NotificationAPIPage);