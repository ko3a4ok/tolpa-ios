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

import {
  getPopularCategories
} from '../network';


export const CATEGORIES=[
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

  constructor(props) {
    super(props);
    this._renderRow = this._renderRow.bind(this);
    this.state = {
      tags: [],
    }
    AsyncStorage.getItem('tags', (err, tags) => {
      if (!tags) return;
      this.setState({tags: JSON.parse(tags)});
    });
  }

  async componentDidMount() {
    var tags = await getPopularCategories();
    this.setState({tags: tags});
    AsyncStorage.setItem('tags', JSON.stringify(tags));
  }


  _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          width:  1,
          height: 20,
          top: 7,
          backgroundColor: '#25a67d',
        }}
      />
    );
  }

  _renderRow(tagId) {
      var categoryName = CATEGORIES[parseInt(tagId)];
      return (<TouchableHighlight style={{height: 40}} underlayColor='#d5f6ed' onPress={() => {
        this.props.navigator.push({index: 1, title: categoryName, tagId: tagId});
      }}>
        <Text style={styles.headerItem}>{categoryName.toUpperCase()}</Text>
      </TouchableHighlight>
    );
  }

  render() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var dataSource = ds.cloneWithRows(this.state.tags);
    return (
      <ListView
        horizontal={true}
        enableEmptySections={true}
        dataSource={dataSource}
        renderRow={this._renderRow}
        renderSeparator={this._renderSeparator}
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
