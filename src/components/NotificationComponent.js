import React, { Component } from 'react';
import { Text,
  View,
  Image,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import { Card,Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
const BASE_URL = "https://giasuvip.vn/api"
export default class NotificationComponent extends Component {
  static navigationOptions =
    {
      title: 'Thông báo',
    };
  state = {
    loading: false,
    data: [],
    current_page: 1,
    hasMore: true
  }
  componentWillMount() {
    this.getListOfNotifications();
  };
  getListOfNotifications = () => {
    let serviceUrl =  BASE_URL + "/notifications";
    var { navigate } = this.props.navigation;
    fetch(serviceUrl,{
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((responseJSON) => {
          this.setState({
            data: responseJSON.data,
            loading: false,
            current_page: this.state.current_page + 1
          })
       })
      .catch((error) => {
        console.warn("error gets");
      });
  };
  openNotification(screen,url) {
    var { navigate } = this.props.navigation;
    navigate('ChildScreen',{urlNext:url});
    
  }
  renderList = () => {
  return ( this.state.data.map((u) => {
    return (
      <TouchableOpacity key={u.id} onPress={() => this.openNotification(u.screen,u.url)} keyboardShouldPersistTaps={true}>
           <Card featuredTitle={u.title}>
              <View style={{ padding: 5 }}>
                 <Text style={{ fontSize: 15,fontWeight:'bold',color:'#2089dc'}}>{u.title}</Text>
                 <Text>{u.content}</Text>
              </View>
          </Card>
       </TouchableOpacity>
     );
   })
  )};
  render() {
    return (
      <ScrollView>
        {this.renderList()}
      </ScrollView>
    );
  }
}
