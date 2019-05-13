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
export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {

      userName: '',
      password: '',
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
  _onPressLoginGoogle = async () => {
      try {
        const result = await Expo.Google.logInAsync({
          iosClientId: '192467398839-isins5vgffrdstgcg5lhtpq3kb4edap7.apps.googleusercontent.com',
          scopes: ["profile", "email"]
        })
        if (result.type === "success") {
          const tokenGoogle = result.idToken
          let serviceUrl =  BASE_URL + "/account/login_google";
          fetch(serviceUrl,{
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'device':'IOS',
            'version':'2.0',

          },
            body: JSON.stringify({
                token_google: tokenGoogle
              }),

          })
            .then((response) => response.json())
            .then((responseJSON) => {
                //console.warn(responseJSON);
                var id_blacasa = responseJSON.data.uid;

                var { navigate } = this.props.navigation;
                access_token = responseJSON.token;
                let remomberToken = {
                  'access_token' : access_token
                };
                 if(access_token !=undefined){
                    try {
                        AsyncStorage.setItem(TOKEN_BLACASA, JSON.stringify(remomberToken));
                        _loginGiasuvip(id_blacasa);
                      } catch (error) {
                        console.log('AsyncStorage error: ' + error.message);
                      }
                 }
                 else{
                    Alert.alert('Login failure');
                 }
            })
            .catch((error) => {
              console.warn(error);
            });
        } else {
          console.warn("cancelled")
        }
  } catch (e) {
        console.warn("error", e)
      }
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
            <Text style={styles.h1}>Sign In</Text>
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
              <TextInput  style={styles.input} placeholder="Email or Phone" placeholderTextColor="#2b2b2b" onChangeText={(userName) => this.setState({userName})} underlineColorAndroid="transparent"/>
            </View>
            <View style={styles.inputWrap}>
              <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#2b2b2b" secureTextEntry={true}  onChangeText={(password) => this.setState({password})} underlineColorAndroid="transparent"/>
            </View>
          </View>

          <TouchableOpacity activeOpacity={.5} onPress={this._onPressLogin.bind(this)} keyboardShouldPersistTaps={true} >
            <View style={styles.button}>
              <Text style={styles.buttonText}> Login</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={.5} onPress={() => this._loginGiasuvip(139)} keyboardShouldPersistTaps={true} >
            <View style={styles.button}>
              <Text style={styles.buttonText}> Login via Google</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={.5} onPress={() => navigate('RegisterPage')}>
            <View >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={.5} onPress={this._onPressDashBoard.bind(this)} keyboardShouldPersistTaps={true}>
            <View style={styles.button}>
              <Text style={styles.buttonText}> Sign Up</Text>
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
      flexDirection:"row",
      marginVertical: 5,
      height:36,
      backgroundColor:"transparent",
  },
  input:{
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: 'rgba(0,0,0,0)',
    borderBottomWidth: 1,
    borderColor: '#444444',
    color: "#fff"
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
