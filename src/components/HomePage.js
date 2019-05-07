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
} from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
var ACCESS_TOKEN = 'key_access_token';

export default class HomePage extends Component {

  onMessage(m){
    url = m.nativeEvent.data;
    var { navigate } = this.props.navigation;
    navigate('EmptyPage',{urlNext: url});
  }
  static navigationOptions =
    {
      title: 'Trang chủ'

    };
  constructor(props) {
    super(props);

  }
  componentWillMount() {
  }

  render() {
    return (
      <WebView
          source={{uri: 'https://giasuvip.vn'}}
          scalesPageToFit={false}
          style={{flex: 1}}
          startInLoadingState={false}
          //onShouldStartLoadWithRequest = {this.navigationStateChangedHandler}
          //onNavigationStateChange={this.navigationStateChangedHandler}
          onMessage={m => this.onMessage(m)}
          ref={c => {
            this.WebView = c;
          }}
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
