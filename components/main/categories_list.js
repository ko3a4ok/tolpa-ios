import React, {Component} from 'react';
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
  ListView,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import I18n from 'react-native-i18n';

import {
  CATEGORIES,
} from './categories_header';
import {PRIMARY_COLOR} from "../global";

export const ICONS = [
  "emoticon-happy",
  "cake",
  "bullseye",
  "food",
  "cards-playing-outline",
  "brush",
  "briefcase",
  "movie",
  "book-open-page-variant",
  "home-variant",
  "football",
  "beach",
  "apps",
];

export default class CategoriesList extends Component {

  constructor(props) {
    super(props);
    this._renderRow = this._renderRow.bind(this);
  }

  _renderRow(idx) {
    nav = this.props.navigator;
    return (
      <TouchableHighlight
        activeOpacity={0.9}
        underlayColor="#ddd"
        onPress={() => nav.push({index: 1, title: I18n.t(CATEGORIES[idx]), tagId: idx})}>
        <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flex: 1}}>
          <Icon style={styles.icon} name={ICONS[idx]} color={PRIMARY_COLOR} size={40} />
          <Text style={styles.text}>{I18n.t(CATEGORIES[idx])}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          height:  1,
          left: 7,
          backgroundColor: PRIMARY_COLOR + '33',
        }}
      />
    );
  }



  render() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var dataSource = ds.cloneWithRows(Array.apply(null, {length: CATEGORIES.length}).map(Number.call, Number));
    return (
        <ListView
          enableEmptySections={true}
          dataSource={dataSource}
          renderRow={this._renderRow}
          renderSeparator={this._renderSeparator}
        />
    );
  }
}

const styles = StyleSheet.create({
  text: {
    flex: 1,
    fontSize: 20,
    marginLeft: 10,
  },
  icon: {
    marginLeft: 10,
  },
});
