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
  followUser,
  getFollowList,
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

  _renderFollows() {
    var user = this.state.user;
    return (
    <View style={{flex: 1, flexDirection: 'row'}}>
      <TouchableOpacity
        onPress={ () => this.props.navigator.push({
          index: 4,
          title: 'Followers',
          getUsers: getFollowList.bind(null, user.user_id, false),
        })}
        style={[styles.follow_container, {marginLeft: 0}]}>
        <Text style={styles.follow}>{user.followers_count ? user.followers_count : 0} Followers</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={ () => this.props.navigator.push({
          index: 4,
          title: 'Following',
          getUsers: getFollowList.bind(null, user.user_id, true),
        })}
        style={[styles.follow_container, {marginRight: 0}]}>
        <Text style={styles.follow}>{user.followings_count ? user.followings_count : 0} Following</Text>
      </TouchableOpacity>
    </View>);
  }

  _followUser() {
    this.state.user.follow = !this.state.user.follow;
    this.setState(this.state);
    followUser(this.state.user.user_id, this.state.user.follow);
  }

  _renderFollowButton() {
    if (this.state.user.user_id == this.props.app.state.profile.user_id) {
      return (<TouchableOpacity
        onPress={() => {
          this.props.navigator.push({title: "Edit profile", data: this.state.user, index: 7});
        }}
        style={[{backgroundColor: PRIMARY_COLOR}, styles.make_follow]}>
        <Text style={styles.make_follow_text}>Edit Profile</Text>
      </TouchableOpacity>);
    }
    return (<TouchableOpacity
      onPress={() => this._followUser(!this.state.user.follow)}
      style={[{backgroundColor: !this.state.user.follow ? PRIMARY_COLOR: '#a00'}, styles.make_follow]}>
      <Text style={styles.make_follow_text}>{this.state.user.follow ? "Unfollow" : "Follow"}</Text>
    </TouchableOpacity>);
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
            {this._renderFollowButton()}
            <Text style={{fontSize: 20}}>{user.first_name} {user.last_name}</Text>
            <Text>{user.location}</Text>
            <Text>{this._getAge()} {this._getGender()} </Text>
            {this._renderEmail()}
          </View>
        </View>
        {this._renderFollows()}
        {this._renderTags()}
      </View>
    );
  }
}
export default class UserProfileView extends Component {

  profileHeader() {
    return (<ProfileView user={this.props.user} navigator={this.props.navigator} app={this.props.app}/>);
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
  follow: {
    overflow: 'hidden',
  },
  follow_container: {
    height: 30,
    margin: 10,
    borderRadius: 15,
    backgroundColor: PRIMARY_COLOR + '33',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  make_follow: {
    borderRadius: 10,
    height: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  make_follow_text: {
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
    color: 'white',
    backgroundColor: 'transparent',
  },

});
