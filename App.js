import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import Route from './Route';
import firebase from 'react-native-firebase';
// import BadgeNumberAndroid from 'react-native-shortcut-badger';
import type  { Notification ,NotificationOpen  } from 'react-native-firebase';

var access_token = '';
export default class App extends React.Component{
  async componentDidMount() {
    const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const action = notificationOpen.action;
            const notification: Notification = notificationOpen.notification;
            var seen = [];
            alert(JSON.stringify(notification.data, function(key, val) {
                if (val != null && typeof val == "object") {
                    if (seen.indexOf(val) >= 0) {
                        return;
                    }
                    seen.push(val);
                }
                return val;
            }));
        }
        const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
                .setDescription('My apps test channel');
        // Create the channel
        firebase.notifications().android.createChannel(channel);
        this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
            notification
                .android.setChannelId('test-channel')
                .android.setSmallIcon('ic_launcher');
                firebase.notifications().setBadge(5);
            firebase.notifications().displayNotification(notification);
        });
        this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
            // Process your notification as required
            notification
                .android.setChannelId('test-channel')
                .android.setSmallIcon('ic_launcher');
                firebase.notifications().setBadge(5);
            firebase.notifications().displayNotification(notification);

        });
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            // Get information about the notification that was opened
            const notification: Notification = notificationOpen.notification;
            var seen = [];
            alert(JSON.stringify(notification.data, function(key, val) {
                if (val != null && typeof val == "object") {
                    if (seen.indexOf(val) >= 0) {
                        return;
                    }
                    seen.push(val);
                }
                return val;
            }));
            firebase.notifications().removeDeliveredNotification(notification.notificationId);

        });
  }
  componentWillUnmount() {
      this.notificationDisplayedListener();
      this.notificationListener();
      this.notificationOpenedListener();
      //BadgeNumberAndroid.setNumber(5);
  }
  render(){
    return (
      <Route />
    );
  }
}
