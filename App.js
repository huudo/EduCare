import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import Route from './Route';
import firebase from 'react-native-firebase';
import type  { Notification ,NotificationOpen  } from 'react-native-firebase';

var access_token = '';
export default class App extends React.Component{
  componentWillMount() {
      this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
          // Process your notification as required
          // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
          console.warn("RECIVE");
      });
      this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
          // Process your notification as required
          console.warn("RECIVE 11");
      });
      this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
          // Get the action triggered by the notification being opened
          const action = notificationOpen.action;
          // Get information about the notification that was opened
          const notification: Notification = notificationOpen.notification;
      });
      firebase.notifications().getInitialNotification()
      .then((notificationOpen: NotificationOpen) => {
        if (notificationOpen) {
          // App was opened by a notification
          // Get the action triggered by the notification being opened

          const action = notificationOpen.action;
          // Get information about the notification that was opened
          const notification: Notification = notificationOpen.notification._data.message;
          const screen =  JSON.parse(notification);
          let pushScreen = {
            'screen' : screen.screen
          };
          AsyncStorage.getItem('push_screen').then((key) => {
            let appS = JSON.parse(key);
            if(appS){
              AsyncStorage.removeItem('push_screen');
            }
          });
          AsyncStorage.setItem('push_screen', JSON.stringify(pushScreen));
          console.warn("RUN",screen.screen);
        }
      });
  }
  render(){
    return (
      <Route />
    );
  }
}
