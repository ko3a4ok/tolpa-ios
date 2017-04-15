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

import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {
  Card,
} from 'react-native-card-view';

import moment from 'moment';

import {PRIMARY_COLOR} from '../global';

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
    {!rowData.multi ? null :
      <MaterialIcon
        style={{position: 'absolute', right:0, backgroundColor:"transparent"}}
        name="timelapse" size={40} color={PRIMARY_COLOR}  />
    }
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
    this.params = '';
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
    var res = await this.props.getEvents(offset, this.params);
    this.setState({
      results: this.state.results.slice(0, -1).concat(res),
    });
  }

  async invalidateSearch() {
    this.setState({sort: this.state.sort});
    if (!this.state.sort) {
      this.params = '';
    }
    else if (this.state.sort == 'location') {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.state.results = [];
          this.loading = -1;
          this.params = "&lat=" + position.coords.longitude + "&lon=" + position.coords.latitude;
          this.loadEvents();

        },
        (error) => alert(JSON.stringify(error)),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
      );
      return;
    } else {
      this.params = "&sort_by=" + this.state.sort;
    }
    this.state.results = [];
    this.loading = -1;
    await this.loadEvents();
  }

  async componentDidMount() {
    await this.loadEvents();
  }

  _renderSortButtons() {
    if (!this.props.sortable) return;
    var icons = {
      undefined: 'md-options',
      'start': 'md-time',
      '-start': 'md-time',
      'budget_min': 'md-cash',
      '-budget_min': 'md-cash',
      'location': 'md-navigate'
    }
    var mainIcon = icons[this.state.sort];
    var sort = this.state.sort;
    var that = this;
    return (
      <ActionButton
        degrees={180}
        icon={<Icon name={mainIcon} style={styles.actionButtonIcon}/>}
        buttonColor={PRIMARY_COLOR} >
        <ActionButton.Item buttonColor='#9b59b6' title="Sort by Cost" onPress={() => {
            if (sort == 'budget_min') that.state.sort = '-budget_min';
            else that.state.sort = 'budget_min';
            this.invalidateSearch();
          }}>
          <Icon name="md-cash" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor='#3498db' title="Sort by Time" onPress={() => {
            if (sort == 'start') that.state.sort = '-start';
            else that.state.sort = 'start';
            this.invalidateSearch();
          }}>
          <Icon name="md-time" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor='#1abc9c' title="Sort by Distance" onPress={() => {
            that.state.sort = 'location';
            this.invalidateSearch();
          }}>
          <Icon name="md-navigate" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
    );
  }

  render() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var dataSource = ds.cloneWithRows(this.state.results);
    return (
      <View style={{flex:1, marginBottom: this.props.sortable ? 70 : 0}}>
        <ListView
          enableEmptySections={true}
          dataSource={dataSource}
          renderRow={this._renderRow}
          renderHeader={this.props.header}
          onEndReached={() => {this.loadEvents()}}
        />
      {this._renderSortButtons()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
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
