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


export default class FullEventsListView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      results: []
    }
    this.loadEvents = this.loadEvents.bind(this);
    this.loading = false;
  }

  _renderRow(rowData) {
      if (!rowData) {
        return (<ActivityIndicator style={{paddingTop: 20}}/>);
      }
      var d = new Date(rowData.start);
      var day = d.toDateString().split(" ").slice(1,3).join(' ');
      var time =  moment(d).format('ddd, hh:MM');
      return (
        <Card>
          <CardContent>
            <View style={{height: 270, margin: -10}}>
              <Image style={{height: 200}}
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
    );
  }


  async loadEvents() {
    if (this.loading) return;
    this.loading = true;
    var offset = this.state.results.length;
    this.setState({
      results: this.state.results.concat(null),
    });
    var res = await getEvents(this.props.categoryId, offset);
    this.setState({
      results: this.state.results.slice(0, -1).concat(res),
    });
    this.loading = false;
  }

  async componentDidMount() {
    await this.loadEvents();
  }

  render() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var dataSource = ds.cloneWithRows(this.state.results);
    return (
        <ListView
          style={{top: 20}}
          enableEmptySections={true}
          dataSource={dataSource}
          renderRow={this._renderRow}
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
