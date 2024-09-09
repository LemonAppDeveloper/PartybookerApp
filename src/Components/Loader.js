import React from "react";
import { View } from 'react-native';
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';
import { useSelector } from 'react-redux';
import LottieView from 'lottie-react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import CommonStyles from "../styles/CommonStyles";

const Loader = (props) => {
    const appState = useSelector(state => state.app);
    //console.log('Loader visibility:', appState.showloader);
    return (
        appState.showloader ?
            <OrientationLoadingOverlay
                visible={appState.showloader}
                color="#fff"
                indicatorSize="large">
                <View style={[CommonStyles.container, {
                    justifyContent: 'center',
                    alignItems: "center",
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    height: hp('100%'),
                    width: wp('100%')
                }]} >
                    <LottieView
                        source={require('../assets/animation/animLogo.json')}
                        style={{
                            width: wp(20),
                            alignSelf: 'center'
                        }}
                        autoPlay
                        loop
                    />
                </View>
            </OrientationLoadingOverlay> : null
    );
};

export default Loader;