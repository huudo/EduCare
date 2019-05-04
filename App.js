import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import Route from './Route';


var access_token = '';
export default class App extends React.Component{
  async componentDidMount() {
    //this.checkPermission();
  }


  render(){
    return (
      <Route />
    );
  }
}
