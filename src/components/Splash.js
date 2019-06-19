import React, { Component } from 'react';
import { Text, View, Image,Button,StyleSheet,ScrollView,ImageBackground,Alert } from 'react-native';
import firebase from 'react-native-firebase';
// import BadgeNumberAndroid from 'react-native-shortcut-badger';
import type  { Notification ,NotificationOpen  } from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
const background =  require('./../../images/1_Loading.jpg') ;
export default class Splash extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
   var pageUrl='LoginPage';
   // Kiểm tra xem đã login chưa
   AsyncStorage.getItem('is_login').then((value) => {
     let userData = JSON.parse(value);
     if(userData){
        AsyncStorage.getItem('push_screen').then((key) => {
          let appScreen = JSON.parse(key);
          if(appScreen){
            pageUrl=appScreen.screen;
            console.warn("PUSH SCREEN",pageUrl);
          }else{
            pageUrl='Dashboard';
          }
        });
     }else{
      pageUrl='LoginPage';
     }
   });
   var { navigate } = this.props.navigation;
     setTimeout(() => {
       navigate (pageUrl, null);
     }, 1000);
 }
 
 
 componentDidMount() {

	 //this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
		 // Process your notification as required
		 // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
		 // Process your notification as required
		 //const { title, body } = notification.notification;
		 //this.showAlert(title, body);
		 //this.props.navigation.navigate('ChildScreen',{urlNext:'https://google.com',title:'Notification'});
		 //});
	 //this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
		 // Process your notification as required
		 //const { title, body } = notification.notification;
		 //this.showAlert(title, body);
		 //this.props.navigation.navigate('ChildScreen',{urlNext:'https://google.com',title:'Notification'});
		 //});
 }
 componentWillUnmount() {
 //this.notificationDisplayedListener();
 //this.notificationListener();
 }
 showAlert(title, body) {
   Alert.alert(
     title, body,
     [
         { text: 'OK', onPress: () => this.props.navigation.navigate('ChildScreen') },
     ],
     { cancelable: false },
   );
 }
	static navigationOptions = {
   title: 'WelcomePage',
    header: null,
 };
 render() {
   return (
     <ImageBackground source={background} style={[styles.container, styles.background]}>

     </ImageBackground>
   );
 }
 
}
const styles = StyleSheet.create({
  background:{
    flex:1
  },
  calendar: {
    borderTopWidth: 1,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: 350
  },
  text: {
    textAlign: 'center',
    borderColor: '#bbb',
    padding: 10,
    backgroundColor: '#eee'
  },
  container: {
    flex: 1,
    backgroundColor: 'gray'
  }
});
