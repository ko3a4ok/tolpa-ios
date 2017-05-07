import React, { Component } from 'react';
import MegaBackground from './megabackground.js';
import LoginScreen from './login.js';
import {
  ActivityIndicator,
  AsyncStorage,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Navigator,
  TouchableHighlight,
} from 'react-native';
import {PRIMARY_COLOR} from "../global/index";

const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
  AccessToken
} = FBSDK;

import {
  loginWithFb
} from '../network' ;
import Icon from 'react-native-vector-icons/FontAwesome';

const navigationBar = (
      <Navigator.NavigationBar routeMapper={{
        RightButton(route, navigator) {
          return (
            <NavButton
              text="Login"
              onPress={ () => {} }
            />
          );
        }
      }} />
    )


export default class FirstScreen extends Component {

  render() {
    return (
      <View style={styles.container}>
    <MegaBackground style={styles.linearGradient} />
    <Navigator
        style={styles.linearGradient}
        initialRoute={{ title: 'My Initial Scene', index: 0 }}
        renderScene={(route, navigator) => {
          if (route.index == 0) {
            return <Intro navigator={navigator} app={this.props.app}/>
          } else {
            return <LoginScreen navigator={navigator} app={this.props.app}/>
          }
        }}
        navigationBar={
         <Navigator.NavigationBar
           routeMapper={{
             LeftButton: (route, navigator, index, navState) =>
             {
              if (route.index === 0) {
               return null;
              } else {
               return (
                 <View style={styles.in_center}>
                 <Icon onPress={() => navigator.pop()}
                  name="angle-left"
                  size={25}
                  style={{backgroundColor: 'transparent', padding: 5}}
                   />
                  </View>
               );
              }
             },
             RightButton: (route, navigator, index, navState) =>
               { return null; },
             Title: (route, navigator, index, navState) =>
               {
                 if (route.index == 0) return null;
                 return (
                <View style={styles.in_center}>
                <Text>Sign In/Up</Text>
                </View>); },
           }}
         />
      }
        /></View>
    );
  }
}

class Intro extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.fbLogin = this.fbLogin.bind(this);
    this.facebookButton = this.facebookButton.bind(this);
    this.loginWithFacebook = this.loginWithFacebook.bind(this);
  }

  async fbLogin(token) {
    this.setState({fbLoading: true});
    var resp = await loginWithFb(token);
    this.props.app.postLogin(resp);
    this.setState({fbLoading: undefined});
  }

  loginWithFacebook() {
    var that = this;
    LoginManager.logInWithReadPermissions([]).then(
      function(result) {
        if (result.isCancelled) {
          alert("login is cancelled.");
        } else {
          AccessToken.getCurrentAccessToken().then(
            (data) => {
              var fbToken = data.accessToken.toString();
              that.fbLogin(fbToken);
            }
          )
        }
      }
    );
  }

  facebookButton() {
    if (this.state.fbLoading) {
      return (<ActivityIndicator style={{flex: 1}}/>);
    }
    return (<Icon.Button
      style={{alignItems: 'center', justifyContent: 'center'}}
       name="facebook" backgroundColor="#3b5998" onPress={this.loginWithFacebook}>
    Login with Facebook
  </Icon.Button>);
  }

  render() {
    return (<View style={styles.container}>
      <Text style={{color:'white', 'fontSize':100, top:100, fontFamily: 'Zapfino' }}>tolpa</Text>
      <View style={styles.bottomButtons}>
        {this.facebookButton()}
        <Icon.Button
          style={{alignItems: 'center', justifyContent: 'center', backgroundColor: PRIMARY_COLOR}}
          name="envelope"
          onPress={()=>{
            this.props.navigator.push({index: 1, title: 'Login'});
          }}
        >Enter with email</Icon.Button>
      </View>
    </View>);
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    backgroundColor: 'transparent',
  },
  linearGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomButtons: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 10,
    justifyContent: 'space-between',
    height: 100,
  },
  in_center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
