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

} from 'react-native';
import { WebView } from 'react-native-webview';
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
      <View style={[styles.container]}>
        <Button title="Go to Feed" onPress= {()=>this.props.navigation.navigate('Feed')} />
      </View>
    );
  }
}
const Feed = props=>(
  <View style={[styles.container]}>
    <Text>Feed</Text>
  </View>
);
const ProfileFeed = createStackNavigator({
  Profile: {screen:Profile},
  Feed: {screen:Feed}
});
class EmptyPage extends Component{
  render(){
    const { navigation } = this.props;
    const urlNext = navigation.getParam('urlNext', 'https://google.com');

    return (
      <WebView
          source={{uri: urlNext }}
          scalesPageToFit={false}
          style={{flex: 1}}
          startInLoadingState={false}
        />
    );
  }
}
// const ClassNavigator = createStackNavigator({
//
//   ClassNews: {screen:ClassNews},
//   EmptyPage: {screen:EmptyPage},
//
// });
const DashboardTabNavigator = createBottomTabNavigator(
  {
    ClassNews,
    ProfileFeed,
    Settings
  },{
    navigationOptions:({navigation}) =>{
      const {routeName} = navigation.state.routes[navigation.state.index];
      return {
        header:null,
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
  Dashboard: {screen: AppDrawerNavigator},
  EmptyPage: {screen: EmptyPage}
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
