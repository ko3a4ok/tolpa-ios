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
  TouchableOpacity,
  ListView,
} from 'react-native';

import {
  Card,
  CardImage,
  CardTitle,
  CardContent,
  CardAction
} from 'react-native-card-view';

import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';


import {
  getEvents
} from '../network';

import {
  CATEGORIES,
} from './categories_header';

export default class EventsListView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      results: []
    }
    this._renderFooter = this._renderFooter.bind(this);
    this._renderRow = this._renderRow.bind(this);
  }

  _renderRow(rowData) {
      var d = new Date(rowData.start);
      var day = d.toDateString().split(" ").slice(1,3).join(' ');
      var time =  moment(d).format('ddd, HH:mm');
      var nav = this.props.navigator;
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => nav.push({index: 2, title: rowData.name, data: rowData})}>
        <Card>
          <CardContent>
            <View style={{width: 200, height: 270, margin: -10}}>
              <Image style={{height: 200, width: 200}}
                source={{uri: rowData.mini_image_url}}/>
              <View style={styles.date}>
              <Text style={{color: 'white'}}>{day}</Text>
              </View>
              <Text numberOfLines={2} style={{height: 50, fontSize: 16}}>{rowData.name}</Text>
              <View style={{flex: 1, flexDirection:'row', justifyContent: 'space-between'}}>
                <Text>{time}</Text>
                <Text>{!rowData.budget_min ? "free" : "₴" + rowData.budget_min + "+"}</Text>
                <Text>👥{rowData.attenders_count}</Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </TouchableOpacity>
    );
  }


  _renderFooter(tagId, categoryName) {
    return (<TouchableOpacity
        onPress={() => {
          this.props.navigator.push({index: 1, title: categoryName, tagId: tagId});
        }}
        style={styles.next}>
        <Icon name="more-horiz" size={30} color="white"/>
      </TouchableOpacity>);
  }

  async componentDidMount() {
    var res = await getEvents(this.props.categoryId);
    this.setState({
      results: res,
    });
  }

  render() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var dataSource = ds.cloneWithRows(this.state.results);
    var tagId = this.props.categoryId;
    var categoryName = tagId === "popular" ? "Popular" : CATEGORIES[tagId];
    return (
      <View style={{height: 340, paddingTop: 20}}>
        <Text style={styles.title}>{categoryName}</Text>
        <ListView
          enableEmptySections={true}
          horizontal={true}
          dataSource={dataSource}
          renderRow={this._renderRow}
          renderFooter={() => this._renderFooter(tagId, categoryName)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  date: {
    flex: 1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    position: 'absolute',
    backgroundColor: '#25a67d77',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  next: {
    top: 50,
    margin: 50,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#25a67d77',
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  title: {
    padding: 5,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'grey',
  },
});
