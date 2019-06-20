import React, { Component } from 'react';
import { Text, View, Image,Button,StyleSheet,ScrollView,ImageBackground,Alert } from 'react-native';
import { WebView } from 'react-native-webview';

export default class ChildPage extends Component {
  constructor(props) {
    super(props);
    this.webView = null;
  }
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;
    return {
     title: params ? params.title : 'A Nested Details Screen'
    }
  };
  onMessage(m){
    var message = JSON.parse(m.nativeEvent.data);
    var data = message.message;

    if(data.type == "openScreen"){
      var { navigate } = this.props.navigation;
      this.props.navigation.push('ChildScreen',{urlNext: data.newUrl,title:""});
    }else{
      this.props.navigation.setParams({ title: data.title });
    }
  }
  render(){
    const { navigation } = this.props;
    const urlNext = navigation.getParam('urlNext', 'https://google.com');
    const titleHead = navigation.getParam('titleHead',' ');
    return (
      <WebView
          useWebKit={false}
          userAgent="Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
          source={{uri: urlNext }}
          style={{flex: 1}}
          startInLoadingState={false}
          onMessage={this.onMessage.bind(this)}
          ref={c => {
            this.WebView = c;
          }}
        />
    );
  }
  componentWillMount() {
  }
}
const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentContainer: {
    paddingVertical: 20
  }
});
