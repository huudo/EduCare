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
  Platform
 } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Loader from "react-native-modal-loader";
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
      isLoading: false,
      userName: '',
      password: '',
      errors: []
    };
  }
  componentWillMount() {

  }
  showLoader = () => {
    this.setState({ isLoading: true });
  };
  hiddenLoader = () => {
    this.setState({ isLoading: false });
  };
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
    var device = "";
    if(Platform.OS === 'ios'){
      device = "IOS";
    }else{
      device = "Android";
    }
    await fetch(serviceUrl,{
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
      body: JSON.stringify({
          token: fcmToken,
          device: device
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
  _loginGiasuvip(data){

    let serviceUrl = VIP_URL + "/login";
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
        //console.warn(responseJSON);
        let isLogin = {
          'access_login' : true
        };
        AsyncStorage.setItem(IS_LOGIN, JSON.stringify(isLogin));
        this.hiddenLoader();
        var { navigate } = this.props.navigation;
        navigate('Dashboard');
      })
      .catch((error) => {
        this.hiddenLoader();
        console.warn(error);
      });
  }
  _onPressDashBoard(even){
    var { navigate } = this.props.navigation;
    navigate('Dashboard');
  }
  _onPressLogin(event){
    this.showLoader();
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
              var dataLogin = {
                'id_blacasa' : id_blacasa,
                'full_name': responseJSON.data.field_full_name_value,
                'userName' : responseJSON.data.name,
                'password' : password,
                'email': responseJSON.data.email,
                'phone': responseJSON.data.field_phone,
                'address': responseJSON.data.field_address_value
              };
              //console.warn(id_blacasa);
              access_token = responseJSON.token;
              let remomberToken = {
                'access_token' : access_token
              };
               if(access_token !=undefined){
                  try {
                      AsyncStorage.setItem(TOKEN_BLACASA, JSON.stringify(remomberToken));
                      //console.warn(responseJSON);
                      this._loginGiasuvip(dataLogin);
                    } catch (error) {
                      console.log('AsyncStorage error: ' + error.message);
                      this.hiddenLoader();
                    }
               }
               else{
                  this.hiddenLoader();
                  Alert.alert('Login failure');
               }
            }else{

              this.hiddenLoader();
              this.setState({
                  errors: responseJSON.errors
              });
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
      <Loader loading={this.state.isLoading} color="#ff66be" />
        <View style={styles.wrapper}>
          <View style={styles.about}>
            <Text style={styles.h1}>Sign In</Text>
            <Text style={styles.textColor}>Quản lý học tập và chia sẻ kiến thức</Text>
          </View>

          <View style={styles.groupInput} >

            <View style={styles.inputWrap}>
              <TextInput  style={this.state.errors['email_phone'] ? styles.inputError : styles.input} placeholder="Email or Phone" placeholderTextColor="#2b2b2b" onChangeText={(userName) => this.setState({userName})} underlineColorAndroid="transparent"/>
            </View>
            <View style={this.state.errors['email_phone'] ? styles.hasError : styles.noError}>
              <Text style={styles.errors}>{this.state.errors['email_phone'] ?this.state.errors['email_phone'] : ''}</Text>
            </View>
            <View style={styles.inputWrap}>
              <TextInput style={this.state.errors['name'] ? styles.inputError : styles.input} placeholder="Password" placeholderTextColor="#2b2b2b" secureTextEntry={true}  onChangeText={(password) => this.setState({password})} underlineColorAndroid="transparent"/>
            </View>
            <View style={this.state.errors['name'] ? styles.hasError : styles.noError}>
              <Text style={styles.errors}>{this.state.errors['name'] ?this.state.errors['name'] : ''}</Text>
            </View>
          </View>

          <TouchableOpacity activeOpacity={.5} onPress={this._onPressLogin.bind(this)} keyboardShouldPersistTaps={true} >
            <View style={styles.button}>
              <Text style={styles.buttonText}>Login via Blacasa</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={.5} onPress={() =>this.props.navigation.navigate('Register')} keyboardShouldPersistTaps={true}>
            <View style={styles.button}>
              <Text style={styles.buttonText}> Sign Up</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.textGroup} >
            <Text style={{paddingRight:20}}>Sử dụng tài khoản Blacasa để đăng nhập !</Text>
          </View>
        </View>

      </View>
      </ImageBackground>

    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column',
    justifyContent:'center'
  },
  textGroup: {
    flexDirection: 'row',
    justifyContent:'center',
    marginTop:20
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
    backgroundColor:"#069d86",
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
