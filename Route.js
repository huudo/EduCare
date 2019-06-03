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
import { Icon } from 'react-native-elements';
import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
  createSwitchNavigator,
  createDrawerNavigator,
} from 'react-navigation';
import Dashboard from './src/components/PromotionComponent';
import HomePage from './src/components/HomePage';
import MyWalletComponent from './src/components/MyWalletComponent';
import WelcomePage from './src/components/WelcomePage';
import Splash from './src/components/Splash';
import LoginPage from './src/components/auth/LoginPage';
import RegisterPage from './src/components/auth/RegisterPage';
import ClassNews from './src/components/ClassNews';
import Settings from './src/components/SettingPage';
import NotificationPage from './src/components/NotificationComponent';
var ACCESS_TOKEN = 'key_access_token';

var access_token = '';
export default class Route extends React.Component{
  componentWillMount(){

  }

  render(){
    return (
      <AppContainer />
    );
  }
}

class ProfilePage extends Component{
  render(){
    return (
      <View style={[styles.container]}>
        <Button title="Go to Feed" onPress= {()=>this.props.navigation.navigate('ChildScreen')} />
      </View>
    );
  }
}
const Feed = props=>(
  <View style={[styles.container]}>
    <Text>Feed</Text>
  </View>
);
const DetailPage = props => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Detail</Text>
  </View>
);
class ChildScreen extends Component{

  static navigationOptions = ({ navigation }) => {
   const { params } = navigation.state;

   return {
     title: params.title ? params.title : 'A Nested Details Screen',
   }
 };
  render(){
    const { navigation } = this.props;
    const urlNext = navigation.getParam('urlNext', 'https://google.com');
    const titleHead = navigation.getParam('titleHead',' ');
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
        header:null
      };
    }
  }
});
const Class = createStackNavigator({
  ClassPage: {
    screen: ClassNews,
    navigationOptions: ({ navigation }) => {
      return {
        header:null,
        headerTitle: 'Class'
      };
    }
  }
});
const Profile = createStackNavigator({
    ProfilePage: {
      screen: ProfilePage,
      navigationOptions: ({ navigation }) => {
        return {
          headerTitle: 'Profile',
          header:null
        };
      }
    }
  }
);
const NotificationStack = createStackNavigator({
  Notification: {
    screen: NotificationPage,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: 'Thông báo',
  			tabBarVisible: false,
  			headerTransparent: true,
  			headerTintColor: '#03afad'
      };
    }
  }
});
const SettingsStack = createStackNavigator({
  Settings: {
    screen: Settings
  }
});

const DashboardTabNavigator = createBottomTabNavigator(
  {
    Home,
    Class,
    Profile,
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
          case 'Profile':
            namePage = 'Khám phá';
            break;
          case 'NotificationStack':
            namePage = 'Thông báo';
            break;
          case 'SettingsStack':
            namePage = 'Cài đặt';
            break;
          default:
            namePage = 'Page'
        }

        return <Text style={{textAlign:'center',fontSize:10,paddingBottom:5,color: tintColor }}>{namePage}</Text>;
      },
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        switch (routeName) {
          case 'Home':
            return (
              <Icon style={{ paddingLeft: 10 }}  color= {tintColor} name="home" size={20} />
            );
            break;
          case 'Class':
            return (
                <Icon style={{ paddingLeft: 10 }}  color= {tintColor} name="book" size={20} />
              );
            break;
          case 'Profile':
            return (
              <Icon style={{ paddingLeft: 10 }}  color= {tintColor} name="star" size={20} />
            );
            break;
          case 'NotificationStack':
            return (
              <Icon style={{ paddingLeft: 10 }}  color= {tintColor} name="notifications" size={20} />
            );
            break;
          case 'SettingsStack':
            return (
              <Icon style={{ paddingLeft: 10 }}  color= {tintColor} name="settings" size={20} />
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
      activeTintColor: '#03afad',
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
      screen: ChildScreen
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

const AppDrawerNavigator = createDrawerNavigator({
  Dashboard: {
    screen: DashboardStackNavigator
  }
});
const AppSwitchNavigator = createSwitchNavigator({
  Splash: {screen: Splash},
  LoginPage: {screen: LoginStack},
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
