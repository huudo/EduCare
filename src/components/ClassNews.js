import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Button,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView
} from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
var ACCESS_TOKEN = 'key_access_token';

export default class ClassNews extends Component {
  constructor(props) {
    super(props);
    this.webView = null;
  }
  onMessage(m){
    var message = JSON.parse(m.nativeEvent.data);
    var data = message.message;

    if(data.type == "openScreen"){
      var { navigate } = this.props.navigation;
      this.props.navigation.push('ChildScreen',{urlNext: data.newUrl,title:""});
    }else{
      this.props.navigation.setParams({ title: data.title });
    }
  }
  static navigationOptions =
  {
    title: 'Class',
  };
  componentWillMount() {
  }
  render() {
    return (
      <WebView
          useWebKit={false}
          userAgent="Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
          source={{uri: 'https://giasuvip.vn/education-box?hybrid=mobile'}}
          style={{flex: 1}}
          startInLoadingState={false}
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
