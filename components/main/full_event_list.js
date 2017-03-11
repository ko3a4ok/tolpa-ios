import React, {Component} from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Navigator,
  TouchableHighlight,
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

import {
  getEvents
} from '../network';

export function renderEvent(rowData, nav) {
  if (!rowData) return null;
  var d = new Date(rowData.start);
  var day = d.toDateString().split(" ").slice(1,3).join(' ');
  var time =  moment(d).format('ddd, HH:mm');
  return (<TouchableOpacity onPress={() => {nav.push({index: 2, title: rowData.name, data: rowData})}}
    style={{height: 270, margin: 10, alignSelf: 'stretch',}}>
    <Image style={{height: 200}}
      resizeMode="cover"
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
</TouchableOpacity>);
}

export default class FullEventsListView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      results: []
    }
    this.loadEvents = this.loadEvents.bind(this);
    this._renderRow = this._renderRow.bind(this);
    this.loading = -1;
  }

  _renderRow(rowData) {
      if (!rowData) {
        return (<ActivityIndicator style={{paddingTop: 20}}/>);
      }
      var nav = this.props.navigator;
      return (
        <Card>
          {renderEvent(rowData, nav)}
        </Card>
    );
  }


  async loadEvents() {
    var offset = this.state.results.length;
    if (offset > 0 && !this.state.results.slice(-1)[0])
      offset--;
    if (this.loading >= offset) return;
    this.loading = offset;
    this.setState({
      results: this.state.results.concat(null),
    });
    var res = await this.props.getEvents(offset);
    this.setState({
      results: this.state.results.slice(0, -1).concat(res),
    });
  }

  async componentDidMount() {
    await this.loadEvents();
  }

  render() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var dataSource = ds.cloneWithRows(this.state.results);
    return (
        <ListView
          enableEmptySections={true}
          dataSource={dataSource}
          renderRow={this._renderRow}
          renderHeader={this.props.header}
          onEndReached={() => {this.loadEvents()}}
        />
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
});
