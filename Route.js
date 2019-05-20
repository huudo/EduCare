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
import Login from './src/components/HomeComponent';
import Dashboard from './src/components/PromotionComponent';
import HomePage from './src/components/HomePage';
import MyWalletComponent from './src/components/MyWalletComponent';
import WelcomePage from './src/components/WelcomePage';
import Splash from './src/components/Splash';
import LoginPage from './src/components/auth/LoginPage';
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
class EmptyPage extends Component{
  render(){
    const { navigation } = this.props;
    const urlNext = navigation.getParam('urlNext', 'https://google.com');
    navigationOptions =
    {
      title: 'Home',
      headerTitle:'CHILD SCREEN'
    };
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
const Home = createStackNavigator({
  HomePage: {
    screen: HomePage,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: 'Trang chủ',
        headerLeft: (
          <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="menu" size={30} />
        )
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
        headerTitle: 'Class',
        headerLeft: (
          <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="menu" size={30} />
        )
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
          headerLeft: (
            <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="menu" size={30} />
          )
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
        headerTitle: 'Thông báo'
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
      tabBarLabel:() =>{
        const { routeName } = navigation.state;
        var namePage = '';
        switch (routeName) {
          case 'Home':
            namePage = 'Trang chủ';
            break;
          case 'Class':
            namePage = 'Học';
            break;
          default:
            namePage = 'Page'
        }

        return <Text style={{textAlign:'center',fontSize:10,paddingBottom:5}}>{namePage}</Text>;
      },
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        if (routeName === 'Home') {
          return (
            <Icon style={{ paddingLeft: 10 }}  color= {tintColor} name="home" size={20} />
          );
        } else {
          return (
            <Icon style={{ paddingLeft: 10 }} color= {tintColor} name="notifications" size={20} />
          );
        }
      },
    }),
    tabBarOptions: {
      showLabel: true,
      activeTintColor: '#FF6F00',
      inactiveTintColor: '#263238',
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
