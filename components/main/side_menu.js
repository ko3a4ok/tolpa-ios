import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

export default class ControlPanel extends Component {

  constructor(): void {
    super();
    this.state = {
      profile: {
        first_name: '',
        last_name: '',
        categories: [],
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
      <View style={{flex: 1}}>
          <LinearGradient
            start={{x: 1, y: 0.0}}
            end={{x: 0, y: 0}}
            colors={['#25a67d', '#25a67d99']}
            style={styles.linearGradient,{flexDirection: 'row', flex: 0, alignItems: 'center', height: 150}} >
            <Image
              style={styles.profileImage}
              source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
            />
            <View>
              <Text style={styles.profileName}>{this.state.profile.first_name + " " + this.state.profile.last_name} </Text>
              <Text style={styles.profileName}>{this.state.profile.location} </Text>
            </View>
          </LinearGradient>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    left: 10,
  },
  profileName: {
    left: 15,
    fontSize: 20,
    color: 'white',
    'backgroundColor': 'transparent',
  },
  linearGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
