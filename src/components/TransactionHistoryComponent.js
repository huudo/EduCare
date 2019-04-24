import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';

export default class TransactionHistoryComponent extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let tabBarLabel = 'History';
    let tabBarIcon = () => (
      <Image
        source={require('./../../images/history.png')}
        style={{ width: 26, height: 26}}
      />
    );
    return { tabBarLabel, tabBarIcon };
  }
  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#964f8e',
        alignItems: 'center',
        justifyContent: 'center'
        }}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 22, color: 'white' }}>This is Transaction History Screen</Text>
      </View>
    );
  }
}
