import React, { Component } from 'react';
import { Text, View, Image,Button,StyleSheet,ScrollView,ImageBackground,Platform,Alert,Linking} from 'react-native';
import firebase from 'react-native-firebase';
// import BadgeNumberAndroid from 'react-native-shortcut-badger';
import type  { Notification ,NotificationOpen  } from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
const VIP_URL = "https://giasuvip.vn/api";
const background =  require('./../../images/1_Loading.jpg') ;
const version = "1.0.32";
export default class Splash extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
  // Kiểm tra version
  let serviceUrl = VIP_URL + "/checkVersion";
  var device = "";
  var link = "";
  if(Platform.OS === 'ios'){
    device = "IOS";
    link = "itms://itunes.apple.com/us/app/blacasa-gia-sư/id1426179500?ls=1";
  }else{
    device = "Android";
    link = "market://details?id=giasu.blacasa.vn";
  }
  fetch(serviceUrl,{
  method: "POST",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
    body: JSON.stringify({
        version: version,
        device: device
      }),
    credentials: "include"
  })
  .then((response) => response.json())
  .then((responseJSON) => {
    //console.warn(responseJSON.status);
    let status = responseJSON.status;
    if(status == "success"){
      this.loadingScreen();
    }else{
      this.showAlert("Cập nhật phần mềm","Đã có phiên bản mới, cập nhật ngay !",link);
    }
  })
  .catch((error) => {
    console.warn(error);
  });

 }
 async componentDidMount() {
   this.createNotificationListeners(); //add this line
 }
 componentWillUnmount() {
  	//this.notificationListener();
   //this.notificationOpenedListener();
 }
 loadingScreen(){
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
 async createNotificationListeners() {
   /*
   * Triggered when a particular notification has been received in foreground
   * */
   // Nhận thông báo khi app đang chạy
   this.notificationListener = firebase.notifications().onNotification((notification) => {
     // const data =znotificationOpen.notification.data;
//      const message = JSON.parse(data.message);
     console.warn("message.badge");
       //this.showAlert(url, body);
        //this.props.navigation.navigate('ChildScreen',{urlNext:url,title:title});
   });

   /*
   * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
   * */
   this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
			const data = notificationOpen.notification.data;
			if(Platform.OS === 'ios'){
				const message = JSON.parse(data["gcm.notification.data"]);
				this.props.navigation.navigate(message.screen,{urlNext:message.url+'?hybrid=mobile',title:message.title});
			}else{
		    const message = JSON.parse(data.message);
		    this.props.navigation.navigate(message.screen,{urlNext:message.url+'?hybrid=mobile',title:message.title});
			}
   });

   /*
   * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
   * */
   // Nhận thông báo khi app đang không mở
   const notificationOpen = await firebase.notifications().getInitialNotification();
   if (notificationOpen) {
			const data = notificationOpen.notification.data;
			if(Platform.OS === 'ios'){
				const message = JSON.parse(data["gcm.notification.data"]);
				this.props.navigation.navigate(message.screen,{urlNext:message.url+'?hybrid=mobile',title:message.title});
			}else{
		    const message = JSON.parse(data.message);
		    this.props.navigation.navigate(message.screen,{urlNext:message.url+'?hybrid=mobile',title:message.title});
			}
   }
   /*
   * Triggered for data only payload in foreground
   * */
   this.messageListener = firebase.messaging().onMessage((message) => {
     //process data message
     console.warn(JSON.stringify(message));
   });
 }
 showAlert(title, body,link) {
   Alert.alert(
     title, body,
     [
         { text: 'Cập nhật', onPress: () => Linking.openURL(link) },
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
