import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Button,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  AsyncStorage,
  WebView
} from 'react-native';
var ACCESS_TOKEN = 'key_access_token';

export default class ClassNews extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let tabBarLabel = 'News';
    let tabBarIcon = () => (
      <Image
        source={require('./../../images/homeIcon.png')}
        style={{ width: 26, height: 26 }}
      />
    );
    return { tabBarLabel, tabBarIcon };
  }
  constructor(props) {
    super(props);

  }
  componentWillMount() {

    let serviceApi =  "https://giasuvip.vn/api/checkLogin";
    fetch(serviceApi,{
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((responseJSON) => {

          console.warn(serviceApi,responseJSON);
      })
      .catch((error) => {
        console.warn(error);
      });

  }

  render() {
    return (
      <WebView
          source={{uri: 'https://giasuvip.vn'}}
          scalesPageToFit={false}
          style={{flex: 1}}
        />
    );
  }
}
const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentContainer: {
    paddingVertical: 20
  }
});
