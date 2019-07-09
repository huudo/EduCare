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
const WEBVIEW_REF = 'webview';

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.webView = null;
    this.reloadWeb = 0;
  }
  onMessage(m){
    var message = JSON.parse(m.nativeEvent.data);
    var data = message.message;
    if(data.type == "openScreen"){
       var { navigate } = this.props.navigation;
       this.props.navigation.push('ChildScreen',{urlNext: data.newUrl,title:""});
     }
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      // The screen is focused
      if(this.reloadWeb > 0){
        this.refs[WEBVIEW_REF].reload();
      }
      this.reloadWeb++;
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }
  render() {
    return (
      <WebView
          useWebKit={false}
          userAgent="Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
          source={{uri: 'https://giasuvip.vn?hybrid=mobile'}}
          style={{flex: 1}}
          onMessage={this.onMessage.bind(this)}
          ref={WEBVIEW_REF}
          renderLoading={this.ActivityIndicatorLoadingView}
          startInLoadingState={true}
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
