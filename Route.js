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
import { Icon } from 'react-native-elements'
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
        <Button title="Go to Feed" onPress= {()=>this.props.navigation.navigate('Detail')} />
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
const Class = createStackNavigator({
  ClassPage: {
    screen: ClassNews,
    navigationOptions: ({ navigation }) => {
      return {
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
    },
    Detail: {
      screen: DetailPage
    }
  },
  {
    defaultNavigationOptions: {
      gesturesEnabled: false
    }
  }
);
const SettingsStack = createStackNavigator({
  Settings: {
    screen: Settings,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: 'Settings',
        headerLeft: (
          <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="menu" size={30} />
        )
      };
    }
  }
});
const DashboardTabNavigator = createBottomTabNavigator(
  {
    Class,
    Profile,
    SettingsStack
  },{
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        if (routeName === 'Class') {
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
      activeTintColor: '#FF6F00',
      inactiveTintColor: '#263238',
    },
  }
);
const DashboardStackNavigator = createStackNavigator(
  {
    DashboardTabNavigator: DashboardTabNavigator
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      return {
        header: null
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
