import React, { Component } from 'react';
import { View, ImageBackground, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { actions as appActions } from "../AppState/actions/appActions";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LP from '../assets/svg/lp.svg';


class SplashScreen extends Component {
    constructor() {
        super();
        this.state = {
            latlongAdded: false,
        }
    }

    componentDidMount() {
        var that = this;

        AsyncStorage.getItem('Logout').then(value => {
            if (value == null || value == 'yes')
                that.props.setUserDetails(undefined);
        })

        setTimeout(function () {
            that.gotoNextPage();
        }, 2000);
    }

    gotoNextPage() {
        var that = this;
        let data = { status: 'intro' }
        let data2 = { status: 'auth' }
        let datasend = '0';

        console.log(this.props.userDetails == undefined)
        console.log(this.props.userDetails !== undefined)

        if (this.props.userDetails !== undefined && Object.keys(this.props.userDetails).length !== 0) {
            this.props.updateAppState('AppStack');
        } else {
            AsyncStorage.getItem('LatLongAdded').then(value => {
                console.log("VALue fo ID : ", value);
                console.log("VALue fo ID 2: ", (value == 'yes'));
                if (value == 'yes')
                    this.props.updateAppState(data2)
                else this.props.updateAppState(data);
            })
        }
    }

    render() {
        return (
            <View style={{ width: ('100%'), height: ('100%') }}>
                <StatusBar hidden={true} />
                <ImageBackground source={require('../assets/svg/photshop.png')}
                    style={{ flex: 1 }}
                    resizeMode='cover'>
                    <View style={{
                        width: '100%', alignItems: 'center', justifyContent: 'center',
                        alignSelf: 'center', top: 0,
                        bottom: 0, position: 'absolute',
                    }}>
                        <LP />
                    </View>
                </ImageBackground>
            </View>
        )
    }
};


function mapDispatchToProps(dispatch) {
    return {
        updateAppState: (data) => dispatch(appActions.updateAppState(data)),
        setUserDetails: (data) => dispatch(appActions.setUserDetails(data))
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
)(SplashScreen);
