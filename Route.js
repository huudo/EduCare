import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Button,
  TouchableOpacity,
  TouchableHighlight,
  AsyncStorage,
  WebView
} from 'react-native';

import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
  createSwitchNavigator,
  createDrawerNavigator,
} from 'react-navigation';
import Login from './src/components/HomeComponent';
import Dashboard from './src/components/PromotionComponent';
import TransactionHistoryComponent from './src/components/TransactionHistoryComponent';
import MyWalletComponent from './src/components/MyWalletComponent';
import WelcomePage from './src/components/WelcomePage';
import Splash from './src/components/Splash';
import LoginPage from './src/components/auth/LoginPage';
import ClassNews from './src/components/ClassNews';
import Settings from './src/components/SettingPage';
var ACCESS_TOKEN = 'key_access_token';

var access_token = '';
export default class Route extends React.Component{
  render(){
    return (
      <AppContainer />
    );
  }
}
class Profile extends Component{
  render(){
    return (
      <WebView
          source={{uri: 'https://gia-su.com'}}
          scalesPageToFit={false}
          style={{flex: 1}}
        />
    );
  }
}
const DashboardTabNavigator = createBottomTabNavigator(
  {
    ClassNews,
    Profile,
    Settings
  },{
    navigationOptions:({navigation}) =>{
      const {routeName} = navigation.state.routes[navigation.state.index];
      return {
        headerTitle: routeName
      }
    }
  }
);
const DashboardStackNavigator = createStackNavigator(
  {
    DashboardTabNavigator: DashboardTabNavigator
  },{
    defaultNavigationOptions: ({navigation}) => {
      return {
        headerLeft: <Text onPress={() => navigation.openDrawer()}>Menu</Text>
      }
    }
  }
);

const AppDrawerNavigator = createDrawerNavigator({
  Dashboard: {
    screen: DashboardStackNavigator
  }
});
const AppSwitchNavigator = createSwitchNavigator({
  Splash: {screen: Splash},
  LoginPage: {screen: LoginPage},
  Dashboard: {screen: AppDrawerNavigator}
});

const AppContainer =  createAppContainer(AppSwitchNavigator);

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
