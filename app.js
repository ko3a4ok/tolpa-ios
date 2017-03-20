import FirstScreen from './components/login';
import MainScreen from './components/main';
import {
  updateHeader,
  logout,
} from './components/network';
import {
  AsyncStorage,
  Alert,
} from 'react-native';

const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
} = FBSDK;


import React, { Component } from 'react';
export default class Tolpa extends Component {

  constructor(props) {
    super(props);
    this.state = {
      profile: undefined,
    };
    AsyncStorage.multiGet(['profile', 'token'], (err, stores) => {
      if (!stores[0][1]) {
        this.setState({profile: null});
        return;
      }
      updateHeader(stores[1][1]);
      var user = JSON.parse(stores[0][1]);
      user.user_id = user._id;
      this.setState({profile: user});
    });
  }

  render() {
    if (this.state.profile === undefined) return null;
    if (this.state.profile) {
      return (<MainScreen app={this}/> );
    }
    return (<FirstScreen app={this}/>);
  }

  logout() {
    logout();
    LoginManager.logOut();
    AsyncStorage.clear((err)=> {
      this.setState({profile: null});
    });
  }

  postLogin(resp) {
    if (typeof resp === 'string') {
      this.refs.toast.show(resp);
      Alert.alert("Oops", resp);
      return;
    }
    resp.profile.user_id = resp.profile._id;
    updateHeader(resp.token);
    AsyncStorage.setItem('profile', JSON.stringify(resp.profile));
    AsyncStorage.setItem('token', resp.token);
    this.setState({profile: resp.profile});
  }
}
