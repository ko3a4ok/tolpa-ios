import React, { Component } from 'react';
import {
  AsyncStorage,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Navigator,
  TouchableHighlight,
} from 'react-native';

import Drawer from 'react-native-drawer'


class ControlPanel extends Component {

  constructor(): void {
    super();
    this.state = {
      profile: {
        first_name: '',
        last_name: '',
      },
    };
    AsyncStorage.getItem('profile', (err, profile) => {
      if (!profile) return;
      var user = JSON.parse(profile);
      this.setState({profile: user.profile});
    });
  }

  render () {
    return (
      <View style={{backgroundColor: '#00ffaa', flex: 1, paddingTop: 70, alignItems: 'center',}}>
        <Image
          style={styles.profileImage}
          source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
        />
      <Text style={{fontSize: 20, paddingTop: 10}}>{this.state.profile.first_name + " " + this.state.profile.last_name} </Text>
      </View>
    );
  }
}


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

class MainView extends Component {
  render () {
    return (
      <Navigator
        initialRoute={{ title: 'My Initial Scene', index: 0 }}
        renderScene={(route, navigator) => {
          if (route.index == 0) {
            return <View style={{flex: 1}}/>
          }
        }}
        navigationBar={
         <Navigator.NavigationBar
           routeMapper={{
             LeftButton: (route, navigator, index, navState) =>
             {
               return null;
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

export default class MainScreen extends Component {
  render () {
    return (
      <Drawer
        type="overlay"
        content={<ControlPanel />}
        openDrawerOffset={100}
        closedDrawerOffset={-3}
        styles={drawerStyles}
        tweenHandler={(ratio) => ({
          main: { opacity:(2-ratio)/2 }
        })}
        negotiatePan={true}
        panOpenMask={5}
        captureGestures={true}
        tapToClose={true}
        initializeOpen={false}
        panCloseMask={0.2}
      >
          <MainView />
      </Drawer>
    );
  }
}

const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 3},
}

const styles = StyleSheet.create({
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
