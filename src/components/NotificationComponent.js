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
  RefreshControl
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
    hasMore: true,
    refreshing: false
  }
  componentWillMount() {
    this.getListOfNotifications();
  };
  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getListOfNotifications();
    this.setState({refreshing: false});

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
  //Update status notification to read
  changeStatusNotification(id){
    let serviceUrl = BASE_URL + "/notifications/setStatus";
    fetch(serviceUrl,{
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
      body: JSON.stringify({
        id: id
      }),
      credentials: "include"
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        //console.warn(responseJSON);

      })
      .catch((error) => {
        console.warn(error);
      });
  }
  openNotification(screen,url,number,id) {
    var { navigate } = this.props.navigation;
    var dataOld = this.state.data;
    dataOld[number].status = "read";
    this.setState({
      data:dataOld
    });
    // API change status notification to read
    this.changeStatusNotification(id);
    // Open notification on new screen
    url = url+'?hybrid=mobile';
    navigate('ChildScreen',{urlNext:url});
  }
  renderList = () => {
  return ( this.state.data.map((u,i) => {
    return (
      <TouchableOpacity  key={u.id} onPress={() => this.openNotification(u.screen,u.url,i,u.id)} keyboardShouldPersistTaps={true}>
           <View style={(u.status == 'read')?styles.read:styles.card}>
              <View style={{ padding: 5 }}>
                 <Text style={styles.cardTitle}>{u.title}</Text>
                 <Text>{u.body }</Text>
              </View>
          </View>
       </TouchableOpacity>
     );
   })
  )};
  render() {
    return (
      <View style={{paddingTop:10, backgroundColor:"#FAFAFA"}}>
      <ScrollView refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      >
          {this.renderList()}
      </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  card :{
    backgroundColor: '#fff',
    padding: 10,
    marginBottom:5,
    marginLeft:0,
    marginRight:0,
    //borderWidth: 1,
    // /borderRadius: 10,
    borderColor: '#ddd',
    borderBottomWidth: 0
  },
  read: {
    backgroundColor: '#edf2fa',
    padding: 10,
    marginBottom:5,
    marginLeft:0,
    marginRight:0,
    //borderWidth: 1,
    // /borderRadius: 10,
    borderColor: '#ddd',
    borderBottomWidth: 0
  },
  cardTitle:{
    fontSize: 15,
    fontWeight:'bold',
    color:'#03afad'
  }
});
