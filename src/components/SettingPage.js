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
import { Icon } from 'react-native-elements';
var ACCESS_TOKEN = 'key_access_token';
const BASE_URL = "https://giasuvip.vn/api"
export default class SettingPage extends Component {
  onMessage(m){
    //console.warn("RUN 2");
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
        <Icon style={{ paddingLeft: 10 }} onPress={navigation.getParam('handleLogout')} name="refresh" size={30} />
      )
    };
  };
  componentWillMount () {
    this.props.navigation.setParams({ handleLogout: this._onPressLogout })
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
