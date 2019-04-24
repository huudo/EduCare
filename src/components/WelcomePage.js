import React, { Component } from 'react';
import { Text, View, Image,Button } from 'react-native';

export default class WelcomePage extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let tabBarLabel = 'WELCOME TO BLACASA';
    let tabBarIcon = () => (
      <Image
        source={require('./../../images/homeIcon.png')}
        style={{ width: 26, height: 26 }}
      />
    );
    return { tabBarLabel, tabBarIcon };
  }

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#0067a7',
        alignItems: 'center',
        justifyContent: 'center'
        }}
      >
        <Button title="Login" onPress = {()=>this.props.navigation.navigate('LoginPage')} />
        <Button title="Register" onPress = {()=>this.props.navigation.navigate('Dashboard')} />
      </View>
    );
  }
}
