/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import FirstScreen from './components/login';
import MainScreen from './components/main';
import {
  AppRegistry,
  AsyncStorage,
} from 'react-native';


AsyncStorage.getItem('profile', (err, profile)=>{
  if (!profile) {
    AppRegistry.registerComponent('Tolpa', () => FirstScreen);
  } else {
    AppRegistry.registerComponent('Tolpa', () => MainScreen);
  }
});
