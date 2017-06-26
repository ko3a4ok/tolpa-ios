import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Navigator,
} from 'react-native';

import ScrollableTabView,{
  DefaultTabBar,
} from 'react-native-scrollable-tab-view';
import I18n from 'react-native-i18n';

import FullEventsListView from './full_event_list.js';
import UsersListView from '../user/user_list.js';
import {
  searchUsersByText,
  searchEventsByText
} from '../network';

import {PRIMARY_COLOR} from '../global';

export default class SearchContentView extends Component {

  render() {
    return (
      <ScrollableTabView
        tabBarActiveTextColor={PRIMARY_COLOR}
        renderTabBar={() => <DefaultTabBar underlineStyle={{backgroundColor: PRIMARY_COLOR}} />}
        ref={(tabView) => { this.tabView = tabView; }}
      >
      <FullEventsListView
        style={{flex: 1}}
        tabLabel={I18n.t('Events')}
        sortable={true}
        navigator={this.props.navigator}
        getEvents={searchEventsByText.bind(null, this.props.searchText)}
      />
      <UsersListView
        style={{flex: 1}}
        tabLabel={I18n.t('Users')}
        navigator={this.props.navigator}
        getUsers={searchUsersByText.bind(null, this.props.searchText)}
      />
  </ScrollableTabView>);
  }
}

const styles = StyleSheet.create({
});
