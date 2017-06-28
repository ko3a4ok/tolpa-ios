import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SettingsList from 'react-native-settings-list';
import Picker from 'react-native-picker';


import {PRIMARY_COLOR} from '../global';
import {
  updateNotificationSettings,
  getNotificationSettings,
  updatePrivacySettings,
  getPrivacySettings,
} from "../network/index";

const PRIVACY = [
  I18n.t('Only Me'),
  I18n.t('My Followings'),
  I18n.t('Anyone'),
];
export default class SettingsView extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.onNotificationChange = this.onNotificationChange.bind(this);
    this.onPrivacyChange = this.onPrivacyChange.bind(this);
  }

  async componentDidMount() {
    var res = await getNotificationSettings();
    if (res) this.setState(res);
    res = await getPrivacySettings();
    if (res) this.setState(res);
  }

  async componentWillUnmount() {
    Picker.hide();
  }

  onNotificationChange(notif, value) {
    let param = {};
    param[notif] = value;
    this.setState(param);
    updateNotificationSettings(param);
  }


  onPrivacyChange(privacy) {
      Picker.init({
        pickerData: PRIVACY,
        selectedValue: [PRIVACY[this.state[privacy]]],
        pickerTitleText: "",
        onPickerConfirm: (data) => {
          let param = {};
          param[privacy] = PRIVACY.indexOf(data[0]);
          this.setState(param);
          updatePrivacySettings(param);
        },
      });
      Picker.show();
  }
  render() {
    return (
      <SettingsList borderColor='#d6d5d9' defaultItemSize={40}>
        <SettingsList.Header headerText={I18n.t('Notifications')} />
        <SettingsList.Item
          icon={<Icon name="message" size={30} color={PRIMARY_COLOR} style={styles.icon}/>}
          hasSwitch={true}
          switchState={this.state.messages}
          switchOnValueChange={this.onNotificationChange.bind(this, 'messages')}
          hasNavArrow={false}
          title={I18n.t('Messages')}
        />
        <SettingsList.Item
          icon={<Icon name="timelapse" size={30} color={PRIMARY_COLOR} style={styles.icon}/>}
          hasSwitch={true}
          switchState={this.state.upcoming_events}
          switchOnValueChange={this.onNotificationChange.bind(this, 'upcoming_events')}
          hasNavArrow={false}
          title={I18n.t('Upcoming Events')}
        />
        <SettingsList.Item
          icon={<Icon name="place" size={30} color={PRIMARY_COLOR} style={styles.icon}/>}
          hasSwitch={true}
          switchState={this.state.near_events}
          switchOnValueChange={this.onNotificationChange.bind(this, 'near_events')}
          hasNavArrow={false}
          title={I18n.t('Near Events')}
        />
        <SettingsList.Item
          icon={<Icon name="favorite" size={30} color={PRIMARY_COLOR} style={styles.icon}/>}
          hasSwitch={true}
          switchState={this.state.recommended_events}
          switchOnValueChange={this.onNotificationChange.bind(this, 'recommended_events')}
          hasNavArrow={false}
          title={I18n.t('Recommended Events')}
        />

        <SettingsList.Header headerText='Privacy'/>
        <SettingsList.Item
          icon={<Icon name="email" size={30} color={PRIMARY_COLOR} style={styles.icon}/>}
          titleInfo={PRIVACY[this.state.email]}
          onPress={this.onPrivacyChange.bind(this, 'email')}
          hasNavArrow={true}
          title='Email'
        />

        <SettingsList.Item
          icon={<Icon name="phone" size={30} color={PRIMARY_COLOR} style={styles.icon}/>}
          titleInfo={PRIVACY[this.state.phone]}
          onPress={this.onPrivacyChange.bind(this, 'phone')}
          hasNavArrow={true}
          title={I18n.t('Phone')}
        />

        <SettingsList.Item
          icon={<Icon name="tag-faces" size={30} color={PRIMARY_COLOR} style={styles.icon}/>}
          titleInfo={PRIVACY[this.state.private_info]}
          onPress={this.onPrivacyChange.bind(this, 'private_info')}
          hasNavArrow={true}
          title={I18n.t('Private Info')}
        />

        <SettingsList.Item
          icon={<Icon name="art-track" size={30} color={PRIMARY_COLOR} style={styles.icon}/>}
          titleInfo={PRIVACY[this.state.categories]}
          onPress={this.onPrivacyChange.bind(this, 'categories')}
          hasNavArrow={true}
          title={I18n.t('Categories')}
        />

        <SettingsList.Item
          icon={<Icon name="face" size={30} color={PRIMARY_COLOR} style={styles.icon}/>}
          titleInfo={PRIVACY[this.state.follow]}
          onPress={this.onPrivacyChange.bind(this, 'follow')}
          hasNavArrow={true}
          title={I18n.t('Following and Followers')}
        />

        <SettingsList.Item
          icon={<Icon name="event" size={30} color={PRIMARY_COLOR} style={styles.icon}/>}
          titleInfo={PRIVACY[this.state.events]}
          onPress={this.onPrivacyChange.bind(this, 'events')}
          hasNavArrow={true}
          title={I18n.t('Events')}
        />

        <SettingsList.Header headerText={I18n.t('Exit')}/>
        <SettingsList.Item
          hasNavArrow={false}
          title={I18n.t('Logout')}
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
