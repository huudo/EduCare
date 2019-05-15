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
  constructor(props) {
    super(props);
    this.webView = null;
  }
  onMessage(m){
    //console.warn("RUN 2");
    url = m.nativeEvent.data;
    var { navigate } = this.props.navigation;
    navigate('ChildScreen',{urlNext: url});
  }
  static navigationOptions =
    {
      title: 'Trang chủ'

    };

  componentWillMount() {
  }

  render() {
    return (
      <WebView
          source={{uri: 'https://giasuvip.vn?hybrid=mobile'}}
          scalesPageToFit={false}
          style={{flex: 1}}
          startInLoadingState={false}
          //onShouldStartLoadWithRequest = {this.navigationStateChangedHandler}
          //onNavigationStateChange={this.navigationStateChangedHandler}
          onMessage={this.onMessage.bind(this)}
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
