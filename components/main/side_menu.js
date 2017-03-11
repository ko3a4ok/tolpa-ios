import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  TouchableOpacity,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {PRIMARY_COLOR} from '../global';

export default class ControlPanel extends Component {

  constructor(props): void {
    super(props);
    this._renderHeader = this._renderHeader.bind(this);
    this._renderRow = this._renderRow.bind(this);
    this.data = [
      {index: 0, icon: 'event', text: "Events"},
      {index: 5, icon: 'event-note', text: "News"},
      {index: 2, icon: 'event-available', text: 'Create Event'},
      {index: 1, icon: 'account-circle', text: "Profile"},
      {index: 4, icon: 'explore', text: 'Explore'},
      {index: 3, icon: 'settings', text: 'Settings'},
    ];
    this.state = {
      profile: props.app.state.profile,
      data: this.data,
      selected: 0,
    };
  }

  _renderHeader () {
    var user = this.props.app.state.profile;
    var imageSource = {};
    if (user.mini_profile_url) {
      imageSource.uri = user.mini_profile_url;
    }

    return (
      <View style={{flex: 1}}>
          <LinearGradient
            start={{x: 1, y: 0.0}}
            end={{x: 0, y: 0}}
            colors={[PRIMARY_COLOR, PRIMARY_COLOR + '99']}
            style={styles.linearGradient,{flexDirection: 'row', flex: 0, alignItems: 'center', height: 150}} >
            <Image
              style={styles.profileImage}
              defaultSource={require('../user/default_profile_image.png')}
              source={imageSource}
            />
            <View>
              <Text style={styles.profileName}>{this.state.profile.first_name + " " + this.state.profile.last_name} </Text>
              <Text style={styles.profileName}>{this.state.profile.location} </Text>
            </View>
          </LinearGradient>
      </View>
    );
  }

  _renderRow(data) {
    var selected = data.index == this.state.selected;
    const color = selected ? PRIMARY_COLOR: '#13564d';
    var bg = selected ? PRIMARY_COLOR + '11' : 'transparent';
    return (
      <TouchableOpacity
        disabled={selected}
        onPress={() => {
          this.setState({
                  data: this.state.data,
                  selected: data.index,
              });
          this.props.selectedMenuItem(data.index);
        }}>
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: bg}}>
        <Icon
          backgroundColor="transparent"
          name={data.icon}
          size={30}
          style={{margin: 10}}
          color={color} />
        <Text style={{fontSize: 20, color: color}}>{data.text}</Text>
      </View>
      </TouchableOpacity>);
  }

  _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          height:  1,
          left: 7,
          marginRight: 20,
          backgroundColor: PRIMARY_COLOR + '33',
        }}
      />
    );
  }

  render() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var dataSource = ds.cloneWithRows(this.data);
    return (
        <ListView
          enableEmptySections={true}
          dataSource={dataSource}
          renderRow={this._renderRow}
          renderHeader={this._renderHeader}
          renderSeparator={this._renderSeparator}
        />
    );
  }
}


const styles = StyleSheet.create({
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    margin: 10,
  },
  profileName: {
    left: 15,
    fontSize: 20,
    color: 'white',
    'backgroundColor': 'transparent',
  },
  linearGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
