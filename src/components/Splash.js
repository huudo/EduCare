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
 async componentDidMount() {
   this.createNotificationListeners(); //add this line
 }
 componentWillUnmount() {
  //  this.notificationListener();
   this.notificationOpenedListener();
 }
 async createNotificationListeners() {
   /*
   * Triggered when a particular notification has been received in foreground
   * */
   this.notificationListener = firebase.notifications().onNotification((notification) => {
       const { title,body,screen,url } = notification;
       console.warn(notification);
       //this.showAlert(url, body);
        //this.props.navigation.navigate('ChildScreen',{urlNext:url,title:title});
   });

   /*
   * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
   * */
   this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
     const { title,body,screen, url } = notificationOpen;
    //console.warn(notification.notification);
     //this.showAlert(title, body);
     this.props.navigation.navigate('ChildScreen',{urlNext:String(url),title:title});
   });

   /*
   * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
   * */
   const notificationOpen = await firebase.notifications().getInitialNotification();
   if (notificationOpen) {
      const { title,body,screen, url } = notificationOpen;
    //console.warn(notification.notification);
     this.showAlert(title, body);
      //this.props.navigation.navigate('ChildScreen',{urlNext:String(url),title:title});
   }
   /*
   * Triggered for data only payload in foreground
   * */
   this.messageListener = firebase.messaging().onMessage((message) => {
     //process data message
     console.log(JSON.stringify(message));
   });
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
