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
import {
  updateNotificationSettings,
  getNotificationSettings,
} from "../network/index";

export default class SettingsView extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.onNotificationChange = this.onNotificationChange.bind(this);
  }

  async componentDidMount() {
    res = await getNotificationSettings();
    if (res) this.setState(res);
  }

  onNotificationChange(notif, value) {
    let param = {};
    param[notif] = value;
    this.setState(param);
    updateNotificationSettings(param);
  }

  render() {
    return (
      <SettingsList borderColor='#d6d5d9' defaultItemSize={40}>
        <SettingsList.Header headerText='Notifications' />
        <SettingsList.Item
          icon={<Icon name="message" size={30} color={PRIMARY_COLOR} style={styles.icon}/>}
          hasSwitch={true}
          switchState={this.state.messages}
          switchOnValueChange={this.onNotificationChange.bind(this, 'messages')}
          hasNavArrow={false}
          title='Messages'
        />
        <SettingsList.Item
          icon={<Icon name="timelapse" size={30} color={PRIMARY_COLOR} style={styles.icon}/>}
          hasSwitch={true}
          switchState={this.state.upcoming_events}
          switchOnValueChange={this.onNotificationChange.bind(this, 'upcoming_events')}
          hasNavArrow={false}
          title='Upcoming Events'
        />
        <SettingsList.Item
          icon={<Icon name="place" size={30} color={PRIMARY_COLOR} style={styles.icon}/>}
          hasSwitch={true}
          switchState={this.state.near_events}
          switchOnValueChange={this.onNotificationChange.bind(this, 'near_events')}
          hasNavArrow={false}
          title='Near Events'
        />
        <SettingsList.Item
          icon={<Icon name="favorite" size={30} color={PRIMARY_COLOR} style={styles.icon}/>}
          hasSwitch={true}
          switchState={this.state.recommended_events}
          switchOnValueChange={this.onNotificationChange.bind(this, 'recommended_events')}
          hasNavArrow={false}
          title='Recommended Events'
        />

        <SettingsList.Header headerText='Exit'/>
        <SettingsList.Item
          hasNavArrow={false}
          title='Logout'
          borderHide={'Both'}
          icon={
            <Icon name="exit-to-app" size={30} color={PRIMARY_COLOR} style={styles.icon}/>
            }
          onPress={() => this.props.app.logout()}
        />
      </SettingsList>
    );
  }
}
const styles = StyleSheet.create({
  icon: {
    marginLeft:10,
    alignSelf: 'center',
  },
});
