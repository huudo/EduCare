import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import Route from './Route';
import {
  Alert
} from 'react-native';


var access_token = '';
export default class App extends React.Component{
  render(){
    return (
      <Route />
    );
  }
}
