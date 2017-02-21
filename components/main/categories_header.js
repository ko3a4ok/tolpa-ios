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

const CATEGORIES=[
  "Free",
  "Party",
  "Spiritual",
  "Food and Drinks",
  "Play",
  "Art",
  "Business",
  "Movie",
  "Education and Development",
  "Family and kids",
  "Sport",
  "Hobby",
  "Other",
];

export default class CategoriesHeader extends Component {
  _renderRow(rowData) {
      return (<TouchableHighlight style={{height: 30}} underlayColor='#d5f6ed' onPress={() => {}}>
        <Text style={styles.headerItem}>{CATEGORIES[parseInt(rowData)].toUpperCase()}</Text>
      </TouchableHighlight>
    );
  }

  render() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var dataSource = ds.cloneWithRows(this.props.category_ids);
    return (
      <ListView
        horizontal={true}
        dataSource={dataSource}
        renderRow={this._renderRow}
      />
    );
  }
}

const styles = StyleSheet.create({
  headerItem: {
    padding: 10,
    fontWeight: 'bold',
    color: '#25a67d',
  },
});
