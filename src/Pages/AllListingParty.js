import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, FlatList } from 'react-native';
import CommonStyles from '../styles/CommonStyles';
import { connect } from 'react-redux';
import { actions as appActions } from "../AppState/actions/appActions";
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Colors } from '../Components/theme';

class AllListingParty extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedCategoryId: '0',
            sortBytype: '1',
            categorieDetails: [{
                id: 0,
                imgg: { uri: 'back_se' },
                name: 'Imagine Dragons',
                datee: 'Weekends',
                timee: '9:00AM-6:00PM',
                isSelected: true,
                loca: '856 E 23rd St Loveland, Colorado..',
                typee: 'Weddings, Engagements & Showers',
            }, {
                id: 1,
                imgg: { uri: 'ex4' },
                name: 'Imagine Dragons',
                datee: 'Mon-Thur',
                timee: '9:00AM-6:00PM',
                isSelected: true,
                loca: '856 E 23rd St Loveland, Colorado..',
                typee: 'Weddings, Engagements & Showers',
            }, {
                id: 2,
                imgg: { uri: 'ex1' },
                name: 'Imagine Dragons',
                datee: 'Any day',
                timee: '9:00AM-6:00PM',
                isSelected: false,
                loca: '856 E 23rd St Loveland, Colorado..',
                typee: 'Weddings, Engagements & Showers',
            }, {
                id: 3,
                imgg: { uri: 'ex4' },
                name: 'Imagine Dragons',
                datee: 'Weekends',
                timee: '9:00AM-6:00PM',
                isSelected: false,
                loca: '856 E 23rd St Loveland, Colorado..',
                typee: 'Weddings, Engagements & Showers',
            }, {
                id: 4,
                imgg: { uri: 'ex3' },
                name: 'Imagine Dragons',
                datee: 'Weekends',
                timee: '9:00AM-6:00PM',
                isSelected: true,
                loca: '856 E 23rd St Loveland, Colorado..',
                typee: 'Weddings, Engagements & Showers',
            }, {
                id: 5,
                imgg: { uri: 'ex1' },
                name: 'Imagine Dragons',
                datee: 'Weekends',
                timee: '9:00AM-6:00PM',
                isSelected: true,
                loca: '856 E 23rd St Loveland, Colorado..',
                typee: 'Weddings, Engagements & Showers',
            },]
        }
    }

    renderItemType = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.vie7}
                onPress={() => {
                    this.setState({ selectedCategoryId: index })
                }}>
                <View style={[(this.state.selectedCategoryId == index) ?
                    styles.vie5 : styles.vie6, {}]}>
                    <Image source={item.imgg} style={styles.img3} resizeMode='contain' />
                </View>
                <Text style={[CommonStyles.txt2, {
                    textAlign: 'center',
                    color: this.state.selectedCategoryId == index ? Colors.orange3 : Colors.midGray
                }]}>
                    {item.text}</Text>
            </TouchableOpacity>
        )
    }

    renderItemTypeDetails = ({ item, index }) => {
        return (
            <View style={styles.vie4}>
                <TouchableOpacity onPress={() => {
                    let editableComparatorIndexes = [...this.state.categorieDetails];
                    editableComparatorIndexes[index].isSelected = !editableComparatorIndexes[index].isSelected;
                    this.setState({ categorieDetails: editableComparatorIndexes });
                }}>
                    <Ionicons name={item.isSelected ? 'checkmark-circle' : 'ellipse-outline'} size={34}
                        color={item.isSelected ? Colors.success : Colors.borderGray} />
                </TouchableOpacity>
                <Image source={item.imgg} style={styles.img1} resizeMode='contain' />
                <View style={{ marginLeft: 20, width: '68%' }}>
                    <Text style={[CommonStyles.txt1, { color: Colors.textColor }]}>{item.name}</Text>
                    <Text style={[CommonStyles.txt2, { color: Colors.midGray, fontWeight: '400' }]}
                        numberOfLines={1}>{item.loca}sdfsdfsdfsdfsdfsdf</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[CommonStyles.txt2, { color: Colors.midGray, fontWeight: '400' }]}>{item.datee}</Text>
                        <View style={{ marginLeft: 5, marginRight: 5, width: 1, height: 20, backgroundColor: Colors.midGray }}>
                        </View>
                        <Text style={[CommonStyles.txt2, { color: Colors.midGray, fontWeight: '400' }]}>{item.timee}</Text>
                    </View>
                    <Text style={[CommonStyles.txt2, { color: Colors.midGray, fontWeight: '400' }]} numberOfLines={1}>
                        {item.typee}</Text>
                </View>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{
                justifyContent: 'flex-start',
                alignItems: "center",
                backgroundColor: 'white',
                height: '100%',
            }}>
                <View style={styles.vie1}>
                    <TouchableOpacity style={{ height: 46, width: 46, alignItems: 'center', justifyContent: 'center', }}
                        onPress={() => {
                            this.props.navigation.goBack()
                        }}>
                        <Ionicons name='arrow-back' size={30} color={Colors.textColor} />
                    </TouchableOpacity>
                    <Text style={[CommonStyles.txt3, { fontWeight: '400', fontSize: 20, textAlign: 'center' }]}>All Party</Text>
                    <TouchableOpacity style={{ height: 46, width: 46, alignItems: 'center', justifyContent: 'center', }}
                        onPress={() => { this.props.navigation.goBack() }}>
                        <Image source={{ uri: 'delete' }} style={{ width: 30, height: 30 }} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
                <View style={{ width: '100%', height: '92%', padding: 20, justifyContent: 'flex-start' }}>
                    <View style={styles.vie11}>
                        <TouchableOpacity style={this.state.sortBytype == '1' ? styles.vie12 : styles.vie13} onPress={() => {
                            this.setState({ sortBytype: '1' });
                        }}>
                            <Text style={[CommonStyles.txt1, {
                                color: this.state.sortBytype == '1' ? Colors.white : Colors.midGray
                            }]}>All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={this.state.sortBytype == '2' ? styles.vie12 : styles.vie13} onPress={() => {
                            this.setState({ sortBytype: '2' });
                        }}>
                            <Text style={[CommonStyles.txt1, {
                                color: this.state.sortBytype == '2' ? Colors.white : Colors.midGray
                            }]}>Planned</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={this.state.sortBytype == '3' ? styles.vie12 : styles.vie13} onPress={() => {
                            this.setState({ sortBytype: '3' });
                        }}>
                            <Text style={[CommonStyles.txt1,
                            { color: this.state.sortBytype == '3' ? Colors.white : Colors.midGray }]}>Book again</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 20, width: '100%' }}></View>
                    <FlatList
                        ref={(ref) => { this.list3 = ref; }}
                        onScrollToIndexFailed={(error) => {
                            this.list3.scrollToOffset({ offset: error.averageItemLength * error.index, animated: true });
                            setTimeout(() => {
                                if (this.state.categorieDetails.length !== 0 && this.list3 !== null) {
                                    this.list3.scrollToIndex({ index: error.index, animated: true });
                                }
                            }, 100);
                        }}
                        data={this.state.categorieDetails}
                        renderItem={this.renderItemTypeDetails.bind(this)}
                        keyExtractor={(item) => "_#" + item.id}
                        extraData={this.state}
                        showsHorizontalScrollIndicator={false}
                        snapToAlignment={'center'}
                    />

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
        width: '100%',
        height: '6%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10
    },
    vie2: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%'
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
        borderColor: Colors.borderGray,
        backgroundColor: 'white',
    },
    vie4: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        padding: 12,
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
)(AllListingParty);