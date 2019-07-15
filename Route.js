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
  Alert
} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
import Fearther from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import IconBadge from 'react-native-icon-badge';
import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
  createSwitchNavigator,
  createDrawerNavigator,
} from 'react-navigation';

import HomePage from './src/components/HomePage';
import Splash from './src/components/Splash';
import LoginPage from './src/components/auth/LoginPage';
import RegisterPage from './src/components/auth/RegisterPage';
import ClassNews from './src/components/ClassNews';
import Settings from './src/components/SettingPage';
import NotificationPage from './src/components/NotificationComponent';
import ChildPage from './src/components/ChildComponent';
var ACCESS_TOKEN = 'key_access_token';

var access_token = '';
export default class Route extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      badgeNumber: 1
    }
  }
  componentWillMount(){

  }

  render(){
    return (
      <AppContainer />
    );
  }
}

const Feed = props=>(
  <View style={[styles.container]}>
    <Text>Feed</Text>
  </View>
);
const LoginStack = createStackNavigator({
    Login : {
      screen: LoginPage,
      navigationOptions: {
  			header: null
  		}
    },
    Register:{
      screen:RegisterPage,
      navigationOptions: {
  			tabBarVisible: false,
  			headerTransparent: true,
  			headerTintColor: '#000'
  		}
    }
});
const Home = createStackNavigator({
  HomePage: {
    screen: HomePage,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: 'Trang chủ',
        headerStyle: {
          backgroundColor: '#069d86'
        },
        headerTitleStyle: {
            textAlign: 'center',
            flexGrow:1,
            alignSelf:'center',
        },
        headerTintColor: '#fff'
      };
    }
  }
});
const Class = createStackNavigator({
  ClassPage: {
    screen: ClassNews,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: 'Quản lý lớp học',
        headerStyle: {
          backgroundColor: '#069d86'
        },
        headerTintColor: '#fff'
      };
    }
  }
});

const NotificationStack = createStackNavigator({
  Notification: {
    screen: NotificationPage,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: 'Thông báo',
        headerStyle: {
          backgroundColor: '#069d86'
        },
        headerTintColor: '#fff'
      };
    }
  }
});
const SettingsStack = createStackNavigator({
  Settings: {
    screen: Settings,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: 'Cá nhân',
        headerStyle: {
          backgroundColor: '#069d86'
        },
        headerTintColor: '#fff'
      };
    }
  }
});

const DashboardTabNavigator = createBottomTabNavigator(
  {
    Home,
    Class,
    NotificationStack,
    SettingsStack
  },{
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarLabel:({ focused, horizontal, tintColor }) =>{
        const { routeName } = navigation.state;
        var namePage = '';
        switch (routeName) {
          case 'Home':
            namePage = 'Trang chủ';
            break;
          case 'Class':
            namePage = 'Học';
            break;
          case 'NotificationStack':
            namePage = 'Thông báo';
            break;
          case 'SettingsStack':
            namePage = 'Cá nhân';
            break;
          default:
            namePage = 'Page'
        }

        return <Text style={{textAlign:'center',fontSize:10,paddingBottom:5,color: tintColor }}>{namePage}</Text>;
      },
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        //var badge =  null;
        const { routeName } = navigation.state;
        switch (routeName) {
          case 'Home':
            return (
              <Icon style={{ paddingLeft: 10 }}  color= {tintColor} name="home-outline" size={25} />
            );
            break;
          case 'Class':
            return (
                <Fearther style={{ paddingLeft: 10 }}  color= {tintColor} name="book" size={20} />
              );
            break;
          case 'NotificationStack':
            return (
              <FontAwesome style={{ paddingLeft: 10 }}  color= {tintColor} name="bell-o" size={20} />
              // <IconBadge
              //   MainElement={<FontAwesome style={{ paddingLeft: 10 }}  color= {tintColor} name="bell-o" size={20} />}
              //   BadgeElement={<Text style={{ color: 'white' }}>{badge}</Text>}
              //   Hidden={navigation.unreadMessagesCount === 0}
              //   IconBadgeStyle={
              //     {
              //       position:'absolute',
              //       top:-5,
              //       left:20,
              //       width:20,
              //       height:20,
              //       borderRadius:15,
              //       alignItems: 'center',
              //       justifyContent: 'center',
              //       backgroundColor: '#FF0000'
              //     }
              //   }
              // />

            );
            break;
          case 'SettingsStack':
            return (
              <FontAwesome style={{ paddingLeft: 10 }}  color= {tintColor} name="user-o" size={20} />
            );
            break;
          default:
          return (
            <Icon style={{ paddingLeft: 10 }} color= {tintColor} name="supervised_user_circle" size={20} />
          );
        }
      },
    }),
    tabBarOptions: {
      showLabel: true,
      activeTintColor: '#069d86',
      inactiveTintColor: '#5f6063',
    },
  }
);
const DashboardStackNavigator = createStackNavigator(
  {
    DashboardTabNavigator: {
      screen:DashboardTabNavigator,
      navigationOptions: ({ navigation }) => {
        return {
          header:null
        };
      }

    },
    ChildScreen: {
      screen: ChildPage
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      return {
        gesturesEnabled: false,
        //header: null
      };
    }
  }
);

// const AppDrawerNavigator = createDrawerNavigator({
//   Dashboard: {
//     screen: DashboardStackNavigator
//   }
// });
const AppSwitchNavigator = createSwitchNavigator({
  Splash: {screen: Splash},
  LoginPage: {screen: LoginStack},
  Dashboard: {screen: DashboardStackNavigator}
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
