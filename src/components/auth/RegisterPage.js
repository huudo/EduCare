import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  Alert,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  ImageBackground,
 } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
const BASE_URL = "https://gia-su.com/api";
const VIP_URL = "https://giasuvip.vn/api";
const PUSH_ENDPOINT = "https://giasuvip.vn/api/setTokenNotification";
const background = require('./../../images/backgound.jpg') ;
const lockIcon = require('./../../images/ic_lock.png');
const userIcon = require('./../../images/ic_user.png');
const logoDefault = require('./../../images/logo_blacasa.png');


var TOKEN_BLACASA = 'key_blacasa_token';
var IS_LOGIN = 'is_login';
export default class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      email: '',
      phone: '',
      password: '',
      errors: []
    };
  }
  componentWillMount() {

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
    this._registerToken(fcmToken);
    //console.warn('RUN',fcmToken);
  }
    //2
  async requestPermission() {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        this.getToken();
    } catch (error) {
        // User has rejected permissions
        console.warn('DIS RUN rejected');
    }
  }
  async _registerToken(fcmToken){
    let serviceUrl = VIP_URL + "/setTokenNotification";
    await fetch(serviceUrl,{
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
      body: JSON.stringify({
          token: fcmToken
        }),
      credentials: "include"
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        //console.warn(responseJSON);
      })
      .catch((error) => {
        console.warn(error);
      });
  }
  _loginGiasuvip(uid){
    let serviceUrl = VIP_URL + "/login";
    let id_blacasa = uid;

    fetch(serviceUrl,{
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
      body: JSON.stringify({
          id_blacasa: id_blacasa
        }),
      credentials: "include"
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        this.checkPermission();
        let isLogin = {
          'access_login' : true
        };
        AsyncStorage.setItem(IS_LOGIN, JSON.stringify(isLogin));

        var { navigate } = this.props.navigation;
        navigate('Dashboard');
      })
      .catch((error) => {
        console.warn(error);
      });
  }
  _registerGiasuVip(data){
    let serviceUrl = VIP_URL + "/register";
    // let id_blacasa = uid;
    // let username = data['username'];
    // let password = data['password'];

    fetch(serviceUrl,{
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
      body: JSON.stringify(data),
      credentials: "include"
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        this.checkPermission();
        let isLogin = {
          'access_login' : true
        };
        AsyncStorage.setItem(IS_LOGIN, JSON.stringify(isLogin));
        console.warn(responseJSON);
        var { navigate } = this.props.navigation;
        navigate('Dashboard');
      })
      .catch((error) => {
        console.warn(error);
      });
  }
  _onPressDashBoard(even){
    var { navigate } = this.props.navigation;
    navigate('Dashboard');
  }
  _onPressLogin(event){
    let serviceUrl =  BASE_URL + "/account/login";
    let userName = this.state.userName;
    let password = this.state.password;
    var access_token = '';
    //let postData = "grant_type=password&username=" + userName + "&password=" + password;
      fetch(serviceUrl,{
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'device':'IOS',
        'version':'2.0'
      },
        body: JSON.stringify({
            email_phone: userName,
            pass: password,
          }),
      credentials: "same-origin"
      })
        .then((response) => response.json())
        .then((responseJSON) => {
            if(responseJSON.status && responseJSON.status == 'success'){
              var { navigate } = this.props.navigation;
              var id_blacasa = responseJSON.data.uid;
              //console.warn(id_blacasa);
              access_token = responseJSON.token;
              let remomberToken = {
                'access_token' : access_token
              };
               if(access_token !=undefined){
                  try {
                      AsyncStorage.setItem(TOKEN_BLACASA, JSON.stringify(remomberToken));
                      this._loginGiasuvip(id_blacasa);

                    } catch (error) {
                      console.log('AsyncStorage error: ' + error.message);
                    }
               }
               else{
                  Alert.alert('Login failure');
               }
            }else{
              Alert.alert('Login failure');
            }
        })
        .catch((error) => {
          console.warn(error);
        });
  }
  _onRegister(event){
    let serviceUrl =  BASE_URL + "/account/register";
    let full_name = this.state.userName;
    let email = this.state.email;
    let phone_number = this.state.phone;
    let pass = this.state.password;
    let type_acc = 0;
    let rules = true;

    var access_token = '';
    //let postData = "grant_type=password&username=" + userName + "&password=" + password;
      fetch(serviceUrl,{
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'device':'IOS',
        'version':'2.0'
      },
        body: JSON.stringify({
            full_name: full_name,
            email: email,
            phone_number: phone_number,
            pass: pass,
            type_acc : type_acc,
            rules: rules
          }),
      credentials: "same-origin"
      })
        .then((response) => response.json())
        .then((responseJSON) => {
            if(responseJSON.status && responseJSON.status == 'success'){
              var { navigate } = this.props.navigation;
              var id_blacasa = responseJSON.data.uid;
              // //console.warn(id_blacasa);
              var dataRegister = {
                'id_blacasa' : responseJSON.data.uid,
                'full_name': full_name,
                'userName' : responseJSON.data.name,
                'password' : pass,
                'email': email,
                'phone': phone_number
              }
              //console.warn(data);
              access_token = responseJSON.token;
              let remomberToken = {
                'access_token' : access_token
              };
               if(access_token !=undefined){
                  try {
                      AsyncStorage.setItem(TOKEN_BLACASA, JSON.stringify(remomberToken));
                      this._registerGiasuVip(dataRegister);

                    } catch (error) {
                      console.log('AsyncStorage error: ' + error.message);
                    }
               }
               else{
                  Alert.alert('Login failure');
               }
            }else{
              this.setState({
                  errors: responseJSON.errors
              });
              console.warn(this.state.errors['email']);
            }
        })
        .catch((error) => {
          console.warn(error);
        });
  }
  render() {
    return (

      <ImageBackground source={background} style={[styles.container, styles.background]}>

      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.about}>
            <Text style={styles.h1}>Register</Text>
            <Text style={styles.textColor}>Quản lý học tập và chia sẻ kiến thức</Text>
          </View>
          <KeyboardAwareScrollView
              automaticallyAdjustContentInsets={false}
               keyboardShouldPersistTaps='always'
               scrollEventThrottle={10}
               extraHeight={250}
               resetScrollToCoords={{x: 0, y: 0}}
          >
          <View style={styles.groupInput} >

            <View style={styles.inputWrap}>
              <TextInput  style={styles.input} placeholder="Họ tên" placeholderTextColor="#2b2b2b" onChangeText={(userName) => this.setState({userName})} underlineColorAndroid="transparent"/>
            </View>
            <View style={styles.inputWrap}>
              <TextInput  style={this.state.errors['email'] ? styles.inputError : styles.input} placeholder="Email không bắt buộc" placeholderTextColor="#2b2b2b" onChangeText={(email) => this.setState({email})} underlineColorAndroid="transparent"/>
            </View>
            <View style={this.state.errors['email'] ? styles.hasError : styles.noError}>
              <Text style={styles.errors}>{this.state.errors['email'] ?this.state.errors['email'] : ''}</Text>
            </View>
            <View style={styles.inputWrap}>
              <TextInput  style={styles.input} placeholder="Số điện thoại" placeholderTextColor="#2b2b2b" onChangeText={(phone) => this.setState({phone})} underlineColorAndroid="transparent"/>
            </View>
            <View style={styles.inputWrap}>
              <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#2b2b2b" secureTextEntry={true}  onChangeText={(password) => this.setState({password})} underlineColorAndroid="transparent"/>
            </View>
          </View>

          <TouchableOpacity activeOpacity={.5} onPress={this._onRegister.bind(this)} keyboardShouldPersistTaps={true} >
            <View style={styles.button}>
              <Text style={styles.buttonText}>Register</Text>
            </View>
          </TouchableOpacity>
          </KeyboardAwareScrollView>
        </View>

      </View>
      </ImageBackground>

    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center'
  },
  background:{
    width: null,
    height:null,
  },
  wrapper:{
      paddingHorizontal:30,
  },
  about:{
    color:'#fff',
    marginBottom:50,
    alignItems:"center"
  },
  h1:{
    fontSize: 30,
    color:"#000",
    fontWeight:"bold"
  },
  textColor:{
    color: "#000"
  },
  groupInput:{
    marginBottom:20
  },
  inputWrap:{
      flex: 1,
      flexDirection:"row",
      marginVertical: 5,
      height:36,
      backgroundColor:"transparent",
  },
  hasError:{
    flex: 1
  },
  inputError: {
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: 'rgba(0,0,0,0)',
    borderBottomWidth: 1,
    borderColor: 'red',
    color: "red"
  },
  noError :{
    display: 'none'
  },
  errors:{
    color: "red",
    fontSize: 11,
    paddingLeft:5
  },
  input:{
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: 'rgba(0,0,0,0)',
    borderBottomWidth: 1,
    borderColor: '#444444',
    color: "#2b2b2b"
  },
  iconWrap:{
  paddingHorizontal:7,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor:"#d73352"
  },
  icon:{
  width:20,
  height:20,
  },
  button:{
    backgroundColor:"#d73352",
    paddingVertical: 8,
    marginVertical:8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius:25,
  },
  buttonText: {
      fontSize: 16,
      color:'#FFFFFF',
      textAlign: 'center',
  },
  forgotPasswordText:{
    color:'#FFFFFF',
       backgroundColor:"transparent",
         textAlign: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
