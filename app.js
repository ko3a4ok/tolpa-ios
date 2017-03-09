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
}
