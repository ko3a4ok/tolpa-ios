import React, {Component} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Image,
  Navigator,
  TouchableOpacity,
  ListView,
} from 'react-native';

import {
  getEvents
} from '../network';


export default class UsersListView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      results: []
    }
    this.loadUsers = this.loadUsers.bind(this);
    this._renderRow = this._renderRow.bind(this);
    this.loading = -1;
  }

  _renderRow(user) {
      if (!user) {
        return (<ActivityIndicator style={{paddingTop: 20}}/>);
      }
      var nav = this.props.navigator;
      var imageUrl = user.mini_profile_url;
      var userName = user.first_name + " " + user.last_name;
      var imageSource = {};
      if (imageUrl)
        imageSource.uri = imageUrl;
      return (
        <TouchableOpacity
            style={{padding: 10}}
            onPress={() => {nav.push({index: 3, data: user, title: userName})}} >
          <View style={{flexDirection: 'row'}}>
            <Image
              source={imageSource}
              defaultSource={require('./default_profile_image.png')}
              style={styles.profile_image} />
            <View style={{alignItems: 'center', justifyContent: 'center', }}>
              <Text style={styles.profile_name}>{userName}</Text>
            </View>
          </View>
        </TouchableOpacity>
    );
  }


  async loadUsers() {
    var offset = this.state.results.length;
    if (offset > 0 && !this.state.results.slice(-1)[0])
      offset--;
    if (this.loading >= offset) return;
    this.loading = offset;
    this.setState({
      results: this.state.results.concat(null),
    });
    var res = await this.props.getUsers(offset);
    this.setState({
      results: this.state.results.slice(0, -1).concat(res),
    });
  }

  async componentDidMount() {
    await this.loadUsers();
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
          onEndReached={() => {this.loadUsers()}}
        />
    );
  }
}

const styles = StyleSheet.create({
  profile_image: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  profile_name: {
    marginLeft: 10,
    fontSize: 18,
  }
});
