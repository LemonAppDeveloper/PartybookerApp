import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, FlatList } from 'react-native';
import CommonStyles from '../styles/CommonStyles';
import { connect } from 'react-redux';
import { actions as appActions } from "../AppState/actions/appActions";
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Colors } from '../Components/theme';

class ViewSearchResultPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedCategoryId: '0',
            viewByList: []
        }
    }

    componentDidMount() {

    }

    renderItemTypeViewVERT = ({ item, index }) => {
        return (
            <View style={[styles.vie12, { padding: 10 }]}>
                <Image source={item.backIg} style={styles.img5} resizeMode='cover' />
                <View style={[styles.vie4, { marginTop: 10 }]}>
                    <Text style={[CommonStyles.txt1, { color: Colors.textColor }]}>{item.name}</Text>
                    <TouchableOpacity>
                        <Ionicons name={item.isLiked ? 'heart-sharp' : 'heart-outline'} size={24}
                            color={!item.isLiked ? Colors.textColor : Colors.danger} />
                    </TouchableOpacity>
                </View>

                <View style={[styles.vie13, { marginTop: 10 }]}>
                    <Ionicons name={'location-outline'} size={24} color={Colors.midGray} />
                    <Text style={[CommonStyles.txt2, { color: Colors.midGray }]}>{item.locality}</Text>
                </View>
                <View style={[styles.vie13, { marginTop: 10 }]}>
                    <Image source={{ uri: 'timer' }} style={{ height: 24, width: 24 }} />
                    <Text style={[CommonStyles.txt2, { fontWeight: '400', color: Colors.midGray }]}>{item.avail}</Text>
                </View>
                <View style={[styles.vie13, { justifyContent: 'flex-start', marginTop: 10 }]}>
                    <Ionicons name={'star'} size={24} color={Colors.warning} />
                    <View style={{ width: 10 }}></View>
                    <Ionicons name={'star'} size={24} color={Colors.warning} />
                    <View style={{ width: 10 }}></View>
                    <Ionicons name={'star'} size={24} color={Colors.warning} />
                    <View style={{ width: 10 }}></View>
                    <Ionicons name={'star'} size={24} color={Colors.warning} />
                    <View style={{ width: 10 }}></View>
                    <Ionicons name={'star-half'} size={24} color={Colors.warning} />
                </View>
                <Text style={[CommonStyles.txt1, { fontWeight: '300', marginTop: 10 }]}>{item.comment}</Text>
                <TouchableOpacity style={{
                    marginTop: 10, width: '100%', height: 60, borderRadius: 12,
                    borderColor: Colors.midGray, borderWidth: 1, justifyContent: 'center', alignItems: 'center'
                }}>
                    <Text style={[CommonStyles.txt1, { color: Colors.textColor }]}>View Details</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{
                justifyContent: 'space-between',
                alignItems: "center",
                backgroundColor: Colors.lightGray,
                height: '100%',
            }} >
                <View style={styles.vie1_d}>
                    <TouchableOpacity style={{ height: 46, width: 46, alignItems: 'center', justifyContent: 'center', }}
                        onPress={() => {
                            this.props.navigation.goBack()
                        }}>
                        <Ionicons name='arrow-back' size={30} color={Colors.textColor} />
                    </TouchableOpacity>
                    <Text style={[CommonStyles.txt3, { fontWeight: '400', fontSize: 20, textAlign: 'center' }]}>
                        Best Results</Text>
                    <TouchableOpacity style={{ height: 46, width: 46, alignItems: 'center', justifyContent: 'center', }}
                        onPress={() => { this.props.navigation.goBack() }}>
                    </TouchableOpacity>
                </View>
                <View style={{ width: '100%', height: '92%', padding: 20, justifyContent: 'flex-start' }}>
                    <View style={{
                        width: '100%',
                        marginTop: 10,
                    }}>
                        <FlatList
                            ref={(ref) => { this.list3 = ref; }}
                            onScrollToIndexFailed={(error) => {
                                this.list3.scrollToOffset({ offset: error.averageItemLength * error.index, animated: true });
                                setTimeout(() => {
                                    if (this.state.viewByList.length !== 0 && this.list3 !== null) {
                                        this.list3.scrollToIndex({ index: error.index, animated: true });
                                    }
                                }, 100);
                            }}
                            data={this.state.viewByList}
                            renderItem={this.renderItemTypeViewVERT.bind(this)}
                            keyExtractor={(item) => "_#" + item.id}
                            extraData={this.state}
                            snapToAlignment={'center'}
                            contentContainerStyle={
                                {
                                    elevation: 13,
                                }
                            }
                        />
                    </View>
                </View>
            </SafeAreaView >
        )
    }
};

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'
    },
    vie1: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 80,
        marginTop: 10
    },
    vie1_d: {
        width: '100%',
        height: '6%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10
    },
    img1: {
        height: 120,
        width: 140,
        marginLeft: 10
    },
    img2: {
        height: 32,
        width: 32
    },
    vie2: {
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    vie3: {
        padding: 20,
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#00fff0'
    },
    vie4: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    img4: {
        height: 400,
        width: '100%',
        justifyContent: 'center'
    },
    vie8: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15
    },
    vie9: {
        height: 35,
        width: 50,
        borderTopStartRadius: 4,
        borderBottomLeftRadius: 4,
        backgroundColor: Colors.borderGray,
        justifyContent: 'center',
        alignItems: 'center'
    },
    vie11: {
        height: 35,
        width: 50,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
        backgroundColor: Colors.borderGray,
        justifyContent: 'center',
        alignItems: 'center'
    },
    vie10: {
        height: 35,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    vie12: {
        shadowColor: 'rgba(112, 144, 176, 0.12)',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4,
        borderRadius: 12,
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFF',
        alignItems: 'center',
        marginBottom: 20,
        position: 'relative'
    },
    vie14: {
        shadowColor: 'rgba(112, 144, 176, 0.12)',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4,
        borderRadius: 12,
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFF',
        width: 300,
        alignItems: 'center',
        marginBottom: 20,
        marginRight: 20,
        position: 'relative'
    },
    vie13: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    img5: {
        borderRadius: 10,
        width: '100%',
        height: 120
    },
    img6: {
        borderTopStartRadius: 12,
        borderTopEndRadius: 12,
        width: '100%',
        height: 120
    },
});



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
)(ViewSearchResultPage);