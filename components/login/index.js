import React, { Component } from 'react';
import MegaBackground from './megabackground.js';
import LoginScreen from './login.js';
import MainScreen from '../main';
import {
  AsyncStorage,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Navigator,
  TouchableHighlight,
} from 'react-native';

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken
} = FBSDK;


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
  static navBarRouteMapper = {
  }
  render() {
    AsyncStorage.getItem('profile', (err, profile) => {
      if (!profile) return;
      var user = JSON.parse(profile);
      console.warn('Hello, '+ user.profile.first_name + " " + user.profile.last_name);
    });
    return (
      <Navigator
        initialRoute={{ title: 'My Initial Scene', index: 0 }}
        renderScene={(route, navigator) => {
          if (route.index == 0) {
            return <Intro navigator={navigator}/>
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
                 <TouchableHighlight onPress={() => navigator.pop()}>
                   <Text>Back</Text>
                 </TouchableHighlight>
               );
              }
             },
             RightButton: (route, navigator, index, navState) =>
               { return null; },
             Title: (route, navigator, index, navState) =>
               { return null; },
           }}
         />
      }
        />
    );
  }
}


function Intro (props) {
  return (<View style={styles.container}>
    <MegaBackground style={styles.linearGradient} />
    <Text style={{color:'white', 'fontSize':100, top:100, fontFamily: 'Zapfino' }}>tolpa</Text>
    <View style={{flex: 1, alignItems: 'flex-end', flexDirection: 'row'}}>
      <View style={{padding: 10, flex: 1, flexDirection: 'column', alignItems: 'center',}}>
        <FbButton />
        <Button
          title="Enter with email"
          onPress={()=>{
            props.navigator.push({index: 1, title: 'Login'});
          }}
        />
      </View>
    </View>
  </View>);
}

function FbButton(props) {
  return <LoginButton
    publishPermissions={["publish_actions"]}
    onLoginFinished={
      (error, result) => {
        if (error) {
          alert("login has error: " + result.error);
        } else if (result.isCancelled) {
          alert("login is cancelled.");
        } else {
          AccessToken.getCurrentAccessToken().then(
            (data) => {
              alert(data.accessToken.toString())
            }
          )
        }
      }
    }
    onLogoutFinished={() => alert("logout.")}/>
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
});
