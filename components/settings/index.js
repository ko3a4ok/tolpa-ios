import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import SettingsList from 'react-native-settings-list';

import {PRIMARY_COLOR} from '../global';

export default class SettingsView extends Component {

  render() {
    return (
      <SettingsList borderColor='#d6d5d9' defaultItemSize={40}>
        <SettingsList.Item
          hasNavArrow={false}
          title='Logout'
          borderHide={'Both'}
          icon={
            <Icon name="exit-to-app" size={40} color={PRIMARY_COLOR} alignSelf='center'/>
            }
          onPress={() => this.props.app.logout()}
        />
      </SettingsList>
    );
  }
}
