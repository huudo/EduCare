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
import AsyncStorage from '@react-native-community/async-storage';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome';
var ACCESS_TOKEN = 'key_access_token';
const BASE_URL = "https://giasuvip.vn/api";
const WEBVIEW_REF = 'webview';
export default class SettingPage extends Component {
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
    }else{
      this.props.navigation.setParams({ title: data.title });
    }
  }
  static navigationOptions = ({ navigation }) => {
    //const { params = {} } = navigation.state
    return {
      headerTitle: 'Settings',
      headerRight: (
        <Icon style={{ paddingLeft: 10 }} color="#fff" onPress={navigation.getParam('handleLogout')} name="sign-out" size={25} />
      )
    };
  };
  componentWillMount () {
    this.props.navigation.setParams({ handleLogout: this._onPressLogout })
  }
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      // The screen is focused
      if(this.reloadWeb > 0 ){
        this.refs[WEBVIEW_REF].reload();
      }
      this.reloadWeb++;
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }
  _onPressLogout = ()=>{

    let serviceUrl =  BASE_URL + "/account/logout";
    var { navigate } = this.props.navigation;
    fetch(serviceUrl,{
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        this._deleteTokenFCM();
        AsyncStorage.clear();
        var RCTNetworking = require('RCTNetworking');
        RCTNetworking.clearCookies(() => {});
        var pageUrl='LoginPage';
        var { navigate } = this.props.navigation;
        navigate(pageUrl);
      })
      .catch((error) => {
        console.warn("error LOGOUT");
      });
  }
  _deleteTokenFCM(){
    AsyncStorage.getItem('fcmToken').then((value) => {
      //console.warn("TOKEN",value);
    let serviceUrl =  BASE_URL + "/deleteTokenNotification";
    fetch(serviceUrl,{
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: value
          }),
        credentials: "include"
      })
        .then((response) => response.json())
        .then((responseJSON) => {
          //console.warn(responseJSON);
        })
        .catch((error) => {
          console.warn("error");
        });
    });
  }

  render(){
    return (
      <WebView
          useWebKit={false}
          userAgent="Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
          source={{uri: 'https://giasuvip.vn/profile?hybrid=mobile'}}
          style={{flex: 1}}
          onMessage={m => this.onMessage(m)}
          ref={WEBVIEW_REF}
          renderLoading={this.ActivityIndicatorLoadingView}
          startInLoadingState={true}
      />
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
  },
  button:{
    backgroundColor:"#d73352",
    paddingVertical: 8,
    marginVertical:8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    color:'#FFFFFF',
    textAlign: 'center',
  },
});
