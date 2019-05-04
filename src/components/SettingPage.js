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
var ACCESS_TOKEN = 'key_access_token';
const BASE_URL = "https://giasuvip.vn/api"
export default class SettingPage extends Component {
  _onPressLogout(event){
    this._deleteTokenFCM();
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
        AsyncStorage.clear();
        var RCTNetworking = require('RCTNetworking');
        RCTNetworking.clearCookies(() => {});
        var pageUrl='LoginPage';
        var { navigate } = this.props.navigation;
        navigate(pageUrl);
      })
      .catch((error) => {
        console.warn(error);
      });
  }
  _deleteTokenFCM(){
    AsyncStorage.getItem('fcmToken').then((value) => {
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

        })
        .catch((error) => {
          console.warn(error);
        });
    });
  }
  render(){
    return (
      <View style={[styles.container]}>
        <TouchableOpacity activeOpacity={.5} onPress={() => this._onPressLogout(this)} keyboardShouldPersistTaps={true}>
          <View style={styles.button}>
            <Text style={styles.buttonText}> Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
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
