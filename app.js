import FirstScreen from './components/login';
import MainScreen from './components/main';
import {
  updateHeader,
} from './components/network';
import {
  AsyncStorage,
} from 'react-native';

import React, { Component } from 'react';
export default class Tolpa extends Component {

  constructor(props) {
    super(props);
    this.state = {
      profile: undefined,
    };
    AsyncStorage.getItem('profile', (err, profile) => {
      console.log(profile);
      if (profile) {
        var user = JSON.parse(profile);
        updateHeader(user.token);
      }
      this.setState({profile: profile});
    });
  }

  render() {
    if (this.state.profile === undefined) return null;
    if (this.state.profile) {
      return (<MainScreen /> );
    }
    return (<FirstScreen />);
  }
}
