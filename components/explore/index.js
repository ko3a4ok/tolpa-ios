import React, {Component} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import ExploreMapView from './map.js';

export default class ExploreView extends Component {

  render() {
    return (
      <View style={{flex: 1}}>
        <ExploreMapView navigator={this.props.navigator} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
});
