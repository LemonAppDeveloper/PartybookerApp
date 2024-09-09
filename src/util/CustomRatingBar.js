import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../Components/theme';


const CustomRatingBar = (props) => {
  const [defaultRating, setDefaultRating] = useState(0);
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

  const onStarClick = (item, bool) => {
    if (bool) {
      item = item - 1 + 0.5;
    }
    setDefaultRating(item);
    props.ratingNumber(item)
  };

  return (
    <View style={styles.ratingBarStyle}>
      {maxRating.map((item, key) => {
        return (
          <View style={{ marginRight: 10 }}>
            <Icon
              size={28}
              name={item <= defaultRating ? 'star' :
                item >= defaultRating && item < defaultRating + 1 ? 'star-half-sharp' : 'star-outline'}
              color={item <= defaultRating ? Colors.warning :
                item >= defaultRating && item < defaultRating + 1 ? Colors.midGray : Colors.midGray}
            />
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                position: 'absolute',
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  width: 20,
                  height: 40,
                }}
                onPress={() => {
                  onStarClick(item, true)
                }}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  width: 20,
                  height: 40,
                }}
                onPress={() => { onStarClick(item, false) }}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default CustomRatingBar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    justifyContent: 'center',
    textAlign: 'center',
  },
  titleText: {
    padding: 8,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textStyle: {
    textAlign: 'center',
    fontSize: 23,
    color: '#000',
    marginTop: 15,
  },
  textStyleSmall: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
    marginTop: 15,
  },
  buttonStyle: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 30,
    padding: 15,
    backgroundColor: '#080566',
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  ratingBarStyle: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginTop: 10,

  },
  imageStyle: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
  },
});