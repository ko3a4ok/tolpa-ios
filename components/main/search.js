import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Navigator,
} from 'react-native';

import FullEventsListView from './full_event_list.js';
import {
  searchEventsByText
} from '../network';


export default class SearchContentView extends Component {

  render() {
    return (
      <FullEventsListView
        navigator={this.props.navigator}
        getEvents={searchEventsByText.bind(null, this.props.searchText)}
      />
    );
  }
}

const styles = StyleSheet.create({
});
