/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import FirstScreen from './components/login';
import MainScreen from './components/main';
import {
  updateHeader,
} from './components/network';
import {
  AppRegistry,
  AsyncStorage,
} from 'react-native';


AsyncStorage.getItem('profile', (err, profile)=>{
  if (!profile) {
    AppRegistry.registerComponent('Tolpa', () => FirstScreen);
  } else {
    var user = JSON.parse(profile);
    updateHeader(user.token);
    AppRegistry.registerComponent('Tolpa', () => MainScreen);
  }
});
