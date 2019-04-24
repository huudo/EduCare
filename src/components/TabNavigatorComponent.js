import React, { Component } from 'react';
import { Text, View, Image ,StyleSheet} from 'react-native';

import { createStackNavigator, createAppContainer  } from 'react-navigation';
//import HomeComponent from './HomeComponent';
// import PromotionComponent from './PromotionComponent';
// import TransactionHistoryComponent from './TransactionHistoryComponent';
// import MyWalletComponent from './MyWalletComponent';

class App extends React.Component{
  render(){
    return (
      <View style={styles.container}>
        <Text>This is main</Text>
      </View>
    );
  }
}
const AppStackNavigator = createStackNavigator({
  Home:App
});
export default createAppContainer(AppStackNavigator);

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
