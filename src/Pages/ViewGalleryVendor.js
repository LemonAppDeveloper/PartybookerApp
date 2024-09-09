import React, { Component } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, Platform, Dimensions, ActivityIndicator, Modal,
} from 'react-native';
import { Colors, fonts } from '../Components/theme';
import { connect } from 'react-redux';
import { actions as appActions } from "../AppState/actions/appActions";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ErrorCtrl } from '../Controller/ErrorController';
import StaggeredList from '@mindinventory/react-native-stagger-view';
import Video from 'react-native-video';

class ViewGalleryVendor extends Component {
    constructor() {
        super();
        this.state = {
            vendorInfo: [],
            vendorGallary: [],
            sortBytype: '1',
            isVideoModalVisible: false,
            selectedVideoUrl: '',
            isBuffering: false,
        };
        this.videoRef = React.createRef();
    }

    toggleVideoModal = (url) => {
        this.setState({
            isVideoModalVisible: !this.state.isVideoModalVisible,
            selectedVideoUrl: url || '',
        });
    }

    onBuffer = (buffer) => {
        console.log('Video is buffering', buffer);
        this.setState({ isBuffering: buffer.isBuffering });
    }

    onError = (error) => {
        console.error('Video error:', error);
        const errorMessage = error.error?.localizedDescription || 'An error occurred while loading the video.';
        ErrorCtrl.showError({
            msg: errorMessage,
        });
    }

    componentDidMount() {
        if (this.props.route.hasOwnProperty('params') && this.props.route.params !== undefined
            && this.props.route.params.hasOwnProperty('InfoD')) {
            this.setState({ vendorInfo: this.props.route.params.InfoD })
        }
        if (this.props.route.hasOwnProperty('params') && this.props.route.params !== undefined
            && this.props.route.params.hasOwnProperty('Gallery')) {
            this.setState({ vendorGallary: this.props.route.params.Gallery })
        }
    }

    renderChildren = (item, index) => {
        const isVideo = item.image_url.endsWith('.mp4') || item.image_url.endsWith('.mov'); // Check if it's a video
        return (
            <View style={this.getChildrenStyle()} key={item.id}>
                <View style={styles.avatarImage}>
                    <TouchableOpacity onPress={() => isVideo && this.toggleVideoModal(item.image_url)}>
                        <Image
                            onError={() => { }}
                            style={{ height: '100%', width: '100%', borderRadius: 12 }}
                            source={{
                                uri: item.image_url,
                            }}
                            resizeMode={'cover'}
                        />
                        {isVideo && (
                            <View style={styles.playIconContainer}>
                                <Ionicons name="play-circle" size={50} color="white" />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    getChildrenStyle = () => {
        return {
            width: Platform.OS == 'android' ? (Dimensions.get('screen').width - 50) / 2 :
                (Dimensions.get('screen').width - 50) / 2,
            height: Number(Math.random() * 20 + 12) * 10,
            backgroundColor: 'gray',
            margin: 4,
            borderRadius: 18,
        };
    };

    render() {
        return (
            <SafeAreaView style={{
                justifyContent: 'flex-start',
                alignItems: "center",
                height: '100%',
                width: '100%',
                padding: 10,
                backgroundColor: 'white'
            }}>

                <View style={styles.vie1}>
                    <TouchableOpacity style={{ height: 50, width: 50, alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => {
                            this.props.navigation.goBack()
                        }}>
                        <Ionicons name='arrow-back-outline' size={30} color={Colors.textColor} />
                    </TouchableOpacity>
                    <Text style={[styles.txt1, { marginLeft: 10 }]}>{this.state.vendorInfo.name}</Text>
                </View>

                {this.state.sortBytype !== '3' ?
                    <Text style={[styles.txt1, {
                        marginTop: 10, paddingBottom: 10, alignSelf: 'flex-start',
                        fontSize: 14, marginLeft: 20, marginBottom: 10
                    }]}>Photos ({this.state.vendorGallary.length})</Text>
                    : null}
                {this.state.sortBytype !== '3' ?
                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', height: '86%' }}>
                        <StaggeredList
                            data={this.state.vendorGallary}
                            animationType={'FADE_IN_FAST'}
                            contentContainerStyle={{
                                width: Platform.OS == 'android' ? '100%' : '96%',
                                justifyContent: Platform.OS == "android" ? 'space-evenly' : 'center',
                                alignContent: 'center',
                                alignItems: 'center', alignSelf: 'center'
                            }}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => this.renderChildren(item, index)}
                            LoadingView={
                                <View style={styles.activityIndicatorWrapper}>
                                    <ActivityIndicator color={'black'} size={'large'} />
                                </View>
                            }
                        />
                    </View> :
                    <Text style={[styles.txt1, { fontSize: 14, marginTop: 50 }]}>No videos uploaded</Text>
                }

                <Modal
                    visible={this.state.isVideoModalVisible}
                    transparent={true}
                    onRequestClose={() => this.toggleVideoModal()}>
                    <View style={styles.modalContainer}>
                        <Video
                            source={{ uri: this.state.selectedVideoUrl }}
                            style={styles.defaultSizeVideo}
                            controls={true}
                            ref={this.videoRef}
                            onError={this.onError}
                            onBuffer={this.onBuffer}
                        />
                        {this.state.isBuffering && (
                            <View style={styles.loaderContainer}>
                                <ActivityIndicator size="large" color="white" />
                                {/* <Text style={styles.bufferingText}>Loading...</Text> */}
                            </View>
                        )}
                        <TouchableOpacity style={styles.closeButton} onPress={() => this.toggleVideoModal()}>
                            <Ionicons name="close-circle" size={30} color="white" />
                        </TouchableOpacity>
                    </View>
                </Modal>
            </SafeAreaView >
        )
    }
};

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'
    },
    vie1: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%'
    },
    txt1: {
        fontSize: 20,
        fontFamily: fonts.fontPoppinsRegular,
        fontWeight: '400',
        color: Colors.textColor
    },
    vie11: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        backgroundColor: Colors.borderGray,
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
    vie10: {
        width: '32.5%',
        height: '100%',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.borderGray
    },
    playIconContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    defaultSizeVideo: {
        width: '100%', // Adjust width as needed
        height: 200, // Adjust height as needed
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    backgroundVideo: {
        width: 300,
        height: 300,
    },
    loaderContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
        justifyContent: 'center',
        alignItems: 'center',
    },
});


function mapDispatchToProps(dispatch) {
    return {
        updateAppState: data => dispatch(appActions.updateAppState(data)),
        setLoader: data => dispatch(appActions.setLoader(data)),
        setUserDetails: data => dispatch(appActions.setUserDetails(data)),
    };
}

export default connect(
    null, mapDispatchToProps
)(ViewGalleryVendor);