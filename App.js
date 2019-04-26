import React, { Component } from 'react';
import {AsyncStorage} from 'react-native';
import Route from './Route';
import firebase from 'react-native-firebase';

var access_token = '';
export default class App extends React.Component{
  async componentDidMount() {
    this.checkPermission();
  }

    //1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getToken();
    } else {
        this.requestPermission();
    }
  }
  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            await AsyncStorage.setItem('fcmToken', fcmToken);
        }
    }
  }

    //2
  async requestPermission() {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        this.getToken();
    } catch (error) {
        // User has rejected permissions
        console.log('DIS rejected');
    }
  }
  render(){
    return (
      <Route />
    );
  }
}
