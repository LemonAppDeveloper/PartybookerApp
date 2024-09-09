import React, { Component } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, Platform, ActivityIndicator } from 'react-native';
import CommonStyles from '../styles/CommonStyles';
import { Colors, fonts } from '../Components/theme';
import { connect } from 'react-redux';
import { actions as appActions } from "../AppState/actions/appActions";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import WebView from 'react-native-webview';

class WebviewCall extends Component {
    constructor() {
        super();
        this.state = {
            webID: '',
            namee: ''
        };
    }

    componentDidMount() {
        this.props.setLoader(false);

        if (this.props.route.hasOwnProperty('params') && this.props.route.params !== undefined
            && this.props.route.params.hasOwnProperty('webID')) {
            this.setState({ webID: this.props.route.params.webID })
        }
        if (this.props.route.hasOwnProperty('params') && this.props.route.params !== undefined
            && this.props.route.params.hasOwnProperty('namee')) {
            this.setState({ namee: this.props.route.params.namee })
        }
    }

    render() {
        return (
            <SafeAreaView style={[CommonStyles.container, {
                justifyContent: 'space-between',
                alignItems: "center",
                backgroundColor: 'black',
                height: '100%',
                paddingTop: Platform.OS == "ios" ? 20 : 0
            }]} >
                <View
                    style={{
                        width: wp('100%'), height: hp('100%'),
                        resizeMode: 'cover',
                        backgroundColor: Colors.white
                    }}>
                    <View style={{
                        height: '10%', flexDirection: 'row', alignItems: 'center',
                        padding: 20, justifyContent: 'flex-start'
                    }}>
                        <TouchableOpacity style={{
                            width: wp('20%'),
                        }}
                            onPress={() => this.props.navigation.goBack()}
                        >
                            <Image source={{ uri: 'back' }}
                                style={{
                                    width: 24, height: 24,
                                }} resizeMode='contain' />
                        </TouchableOpacity>
                        <Text style={{
                            width: '60%',
                            textAlign: 'center',
                            color: Colors.black,
                            fontFamily: fonts.fontPoppinsRegular,
                            fontSize: 20,
                            justifyContent: 'center',
                            textAlignVertical: 'center'
                        }}>{this.state.namee}</Text>
                    </View>
                    <WebView
                        ref={ref => this.webview = ref}
                        onLoad={() => { this.props.setLoader(true) }}
                        onLoadEnd={() => { this.props.setLoader(false) }}
                        onShouldStartLoadWithRequest={event => {
                            return true;
                        }}
                        scalesPageToFit={false}
                        style={{ height: '80%', width: '100%', resizeMode: 'cover', flex: 1 }}
                        source={{ uri: this.state.webID }}
                        originWhitelist={["https"]}
                        userAgent="Mozilla/5.0 (Linux; Android 4.4.4; One Build/KTU84L.H4) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/33.0.0.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/28.0.0.20.16;]"
                        decelerationRate='normal'
                        allowsInlineMediaPlayback={true}
                        mediaPlaybackRequiresUserAction={false}
                        sharedCookiesEnabled={true}
                        mixedContentMode='always'
                        startInLoadingState={true}
                        setDisplayZoomControls
                        containerStyle={{ height: '100%', width: '100%', flex: 1 }}
                        onError={(er) => console.log("fsdf", er)}
                        renderLoading={() => (
                            <ActivityIndicator
                                color='#29aae1'
                                size='large'
                                style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'flex-start' }}
                            />
                        )}
                    // onNavigationStateChange={this.redirect}
                    />
                </View>
            </SafeAreaView>
        )
    }
};


function mapDispatchToProps(dispatch) {
    return {
        updateAppState: data => dispatch(appActions.updateAppState(data)),
        setLoader: data => dispatch(appActions.setLoader(data)),
        setUserDetails: data => dispatch(appActions.setUserDetails(data)),
    };
}

export default connect(
    null, mapDispatchToProps
)(WebviewCall);
