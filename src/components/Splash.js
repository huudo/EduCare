import React, { Component } from 'react';
import { Text, View, Image,Button,StyleSheet,ScrollView,ImageBackground,AsyncStorage } from 'react-native';
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
     if(userData.access_login){
      pageUrl='Dashboard';
     }else{
      pageUrl='LoginPage';
     }
   });
   var { navigate } = this.props.navigation;
     setTimeout(() => {
       navigate (pageUrl, null);
     }, 1000);
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
