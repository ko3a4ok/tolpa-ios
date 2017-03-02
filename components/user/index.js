import React, {Component} from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  Image,
  Navigator,
  TouchableOpacity,
  ListView,
} from 'react-native';

import ScrollableTabView,{
  DefaultTabBar,
} from 'react-native-scrollable-tab-view';

import {
  getUserProfile,
  getEventsCreatedBy,
  getAttendedEvents,
} from '../network';

import {
  CATEGORIES,
} from '../main/categories_header.js';

import FullEventsListView from '../main/full_event_list.js';

const PRIMARY_COLOR = '#25a67d';

class ProfileView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
    }
  }

  async componentDidMount() {
    var data = await getUserProfile(this.props.user.user_id);
    this.setState({user: data});
  }

  _getAge() {
    var user = this.state.user;
    if (!user.birthday) return "";
    var ageDifMs = Date.now() - new Date(user.birthday).getTime();
    var ageDate = new Date(ageDifMs);
    var years = Math.abs(ageDate.getUTCFullYear() - 1970);
    return years + " years";
  }

  _getGender() {
    var user = this.state.user;
    if (user.gender === null || user.gender === undefined) return "";
    return user.gender ? '♂' : '♀';
  }

  _renderEmail() {
    var user = this.state.user;
    if (!user.email) return null;
    return (
      <Text>{user.email}</Text>
    );
  }

  _renderTags() {
    var user = this.state.user;
    if (!user.categories) return null;
    var res = [];
    user.categories.forEach(function(tagId){
      res.push(
        <Text
          style={styles.category}
          key={tagId}>{CATEGORIES[tagId]}
        </Text>);
    });
    return <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>{res}</View>;
  }

  render() {
    var user = this.state.user;
    var imageUrl = user.mini_profile_url;
    if (user.profile_url)
      imageUrl = user.profile_url;
    var imageSource = {};
    if (imageUrl) {
      imageSource.uri = imageUrl;
    }
    return (
      <View style={{padding: 15}}>
        <View style={{flexDirection: 'row'}}>
          <Image
            defaultSource={require('./default_profile_image.png')}
            source={imageSource} style={styles.profile_image} />
          <View style={{marginLeft: 15}}>
            <Text style={{fontSize: 20}}>{user.first_name} {user.last_name}</Text>
            <Text>{user.location}</Text>
            <Text>{this._getAge()} {this._getGender()} </Text>
            {this._renderEmail()}
          </View>
        </View>
        {this._renderTags()}
      </View>
    );
  }
}
export default class UserProfileView extends Component {

  profileHeader() {
    return (<ProfileView user={this.props.user}/>);
  }
  constructor(props) {
    super(props);
    this.profileHeader = this.profileHeader.bind(this);
  }

  render() {
    var createdByFn = getEventsCreatedBy.bind(null, this.props.user.user_id);
    var pastEventsFn = getAttendedEvents.bind(null, this.props.user.user_id, false);
    var futureEventsFn = getAttendedEvents.bind(null, this.props.user.user_id, true);

    return (
      <ScrollableTabView
        tabBarActiveTextColor={PRIMARY_COLOR}
        style={{marginTop: 70}}
        renderTabBar={() => <DefaultTabBar underlineStyle={{backgroundColor: PRIMARY_COLOR}} />}
        ref={(tabView) => { this.tabView = tabView; }}
      >
      <FullEventsListView tabLabel='Profile' getEvents={createdByFn} navigator={this.props.navigator} header={this.profileHeader}/>
      <FullEventsListView tabLabel='Past' getEvents={pastEventsFn} navigator={this.props.navigator}/>
      <FullEventsListView tabLabel='Future' getEvents={futureEventsFn} navigator={this.props.navigator}/>

    </ScrollableTabView>
    );
  }
}

const styles = StyleSheet.create({
  profile_image: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  category: {
    overflow: 'hidden',
    paddingLeft: 10,
    paddingRight: 10,
    margin: 2,
    borderColor: PRIMARY_COLOR,
    backgroundColor: PRIMARY_COLOR + '33',
    borderWidth: 1,
    borderRadius: 5,
    height: 20,
  },
});
