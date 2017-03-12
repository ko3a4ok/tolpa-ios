import React, {Component} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ListView,
} from 'react-native';

import {
  Card,
} from 'react-native-card-view';

import moment from 'moment';
import {renderEvent} from './full_event_list.js';
import {timeSince} from '../global';
import {
  getNews,
} from '../network';


export default class NewsView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      results: []
    }
    this.loadNews = this.loadNews.bind(this);
    this._renderRow = this._renderRow.bind(this);
    this.loading = -1;
  }

  _getTitle(userName, rowData) {
    if (rowData.type == 'INVITE') return userName + " invited you";
    if (rowData.type == 'JOINED') return userName + " joined to";
    if (rowData.type == 'CREATE_EVENT') return userName + " organized";
    if (rowData.type == 'FOLLOW') return userName + " started following you";
  }

  _renderRow(rowData) {
      if (!rowData) {
        return (<ActivityIndicator style={{paddingTop: 20}}/>);
      }
      var userName = rowData.user.first_name + ' ' + rowData.user.last_name;
      var nav = this.props.navigator;
      var time = timeSince(new Date(rowData.time));
      var user = rowData.user;
      var imageUrl = user.mini_profile_url;
      var imageSource = {};
      if (imageUrl)
        imageSource.uri = imageUrl;

      return (
        <Card styles={{card: {'alignItems': 'stretch'}}}>
            <View style={{flex: 1, 'alignItems': 'flex-end'}}>
              <Text style={{paddingRight: 5}}>{time}</Text>
            </View>
              <TouchableOpacity style={styles.container} onPress={() => {
                  nav.push({index: 3, data: user, title: userName})
                }}>
              <Image source={imageSource} style={styles.user_image} />
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.title}>{this._getTitle(userName, rowData)}</Text>
              </View>
              </TouchableOpacity>
              {renderEvent(rowData.event, nav)}
        </Card>
    );
  }

  async loadNews() {
    var offset = this.state.results.length;
    if (offset > 0 && !this.state.results.slice(-1)[0])
      offset--;
    if (this.loading >= offset) return;
    this.loading = offset;
    this.setState({
      results: this.state.results.concat(null),
    });
    var res = await getNews(offset);
    this.setState({
      results: this.state.results.slice(0, -1).concat(res),
    });
  }

  async componentDidMount() {
    await this.loadNews();
  }

  render() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var dataSource = ds.cloneWithRows(this.state.results);
    return (
        <ListView
          enableEmptySections={true}
          dataSource={dataSource}
          renderRow={this._renderRow}
          onEndReached={() => {this.loadNews()}}
        />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  title: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  user_image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  }
});
