import React, {Component} from 'react';

import {
  Animated,
  StyleSheet,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  getAttendersList,
  getFollowList,
  getEvent,
  joinEvent,
} from '../network';

import moment from 'moment';
import {PRIMARY_COLOR} from "../global";
import {intToTimeFormat} from "../global/index";


export default class DetailEventView extends Component {


    constructor(props) {
      super(props);
      this.loadEvent = this.loadEvent.bind(this);
      this.state = {
        data: props.data,
        scrollY: new Animated.Value(0),
      };
    }

    async loadEvent() {
      var data = await getEvent(this.props.data.id);
      this.setState({data: data});
    }

    async componentDidMount() {
      await this.loadEvent();
    }

    _renderMoney(data) {
      if (!data.budget_min && !data.budget_max) {
        return (<Text>free</Text>);
      }
      var value = "";
      if (data.budget_min)
        value += "From ₴" + data.budget_min;
      if (data.budget_max)
        value += " to ₴" + data.budget_max;
      return (<Text>{value}</Text>);
    }

    _renderMap(data) {
      if (!data.place || data.place.length == 0) return null;
      return (<MapView
          liteMode={true}
          style={{height: 300}}
          initialRegion={{
            latitude: data.place[1],
            longitude: data.place[0],
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421,
          }}
          >
          <MapView.Marker
            coordinate={{
              latitude: data.place[1],
              longitude: data.place[0],
            }}
          />
      </MapView>);
    }

    _joinEvent(join) {
      this.state.data.joined = join;
      this.state.data.attenders_count += join ? 1 : -1;
      this.setState(this.state);
      joinEvent(this.state.data.id, join);
    }

    _renderOrganizer(user) {
        if (!user) return null;
        var userName = user.first_name + " " + user.last_name;
        return (
          <TouchableOpacity
            onPress={() => this.props.navigator.push({index: 3, data: user, title: userName})}
            style={styles.profile_container}>
            <Text>Organized by: </Text>
            <Text style={styles.profile_name}>{userName}</Text>
            <Image source={{ uri: user.mini_profile_url }} style={styles.profile_icon}/>
          </TouchableOpacity>
        );
    }

    _edit(data, navigator) {
      navigator.push({title: data.name, index: 10, data: data});
    }

    _renderMultiEvent(data) {
      if (!data.multi || !data.week) return null;
      var msg = "Periodic Event: ";
      let week = data.week;
      for (let i = 0; i < 7; i++)
        if (week[i]) {
          msg += '\nEvery ' + moment.weekdays()[i] + ' ' + intToTimeFormat(week[i].start) + '-' + intToTimeFormat(week[i].end);
        }
      return (<Text style={{fontStyle: 'italic'}}>{msg}</Text>);
    }

    _renderContent(data) {
      var d = new Date(data.start);
      var day = moment(d).format('DD MMM');
      var time =  moment(d).format('ddd, hh:mm');
      var event = this.state.data;
      var can_edit = event.created_by && event.created_by.user_id == this.props.app.state.profile.user_id;
      return (
        <View style={{padding: 10}}>
          <TouchableOpacity
            onPress={() => can_edit ? this._edit(this.state.data, this.props.navigator) : this._joinEvent(!this.state.data.joined)}
            style={[{backgroundColor: !this.state.data.joined ? PRIMARY_COLOR: '#a00'}, styles.join]}>
            <Text style={styles.joinText}>{
                can_edit ? "Edit" :
                this.state.data.joined ? "Leave" : "Join"}</Text>
          </TouchableOpacity>
          {this._renderOrganizer(data.created_by)}

          <View style={{flex: 1, flexDirection:'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 16}}>{day}</Text>
            <TouchableOpacity onPress={() => this.props.navigator.push({
                inviteUsersRoute: {
                  invitedEvent: event.id,
                  index: 4,
                  getUsers: getFollowList.bind(null, this.props.app.state.profile.user_id, false),
                  title: 'Invite friends',
                },
                index: 4,
                getUsers: getAttendersList.bind(null, data.id),
                title: data.name})}>
              <Text>{data.attenders_count} 👥</Text>
            </TouchableOpacity>
          </View>
          <Text>{time}</Text>
          {this._renderMultiEvent(data)}
          {this._renderMoney(data)}

          <Text style={{marginTop: 10}}>{data.address}</Text>
          {this._renderMap(data)}
          <Text style={{marginTop: 10}}>{data.description}</Text>
        </View>
      );
    }

    _renderChatButton(eventId, navigator) {
      return (<Icon.Button
        onPress={() => {
          navigator.push({title: 'Comments', index: 9, event_id: eventId})
        }}
        name="chat"
        backgroundColor='transparent'
        selectedIconColor='transparent'
        borderRadius={0}
        size={30}
        color="white" />);
    }

    render() {
      const imageOpacity = this.state.scrollY.interpolate({
        inputRange: [0, HEADER_HEIGHT - NAVBAR_HEIGHT],
        outputRange: [1, 0],
      });
      const imageTranslate = this.state.scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [0, 100],
      });
      const imageScale = this.state.scrollY.interpolate({
        inputRange: [-100, 0, 100],
        outputRange: [2.5, 1, 1],
        extrapolate: 'clamp',
      });
      const headerTranslate = this.state.scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [-1, -200],
      });
      const navBarBackgroundOpacity = this.state.scrollY.interpolate({
        inputRange: [0, HEADER_HEIGHT - NAVBAR_HEIGHT - 1, HEADER_HEIGHT - NAVBAR_HEIGHT],
        outputRange: [0, 0, 1],
      });
      const titleOpacity = this.state.scrollY.interpolate({
        inputRange: [0, 220, 250],
        outputRange: [0, 0, 1],
      });
      const titleTranslate = this.state.scrollY.interpolate({
        inputRange:  [-1,  0, 220, 250, 251],
        outputRange: [20, 20,  20,   0,   0],
        extrapolate: 'clamp',
      });
      var imageUrl = this.state.data.image_url;
      if (!imageUrl) imageUrl = this.props.data.mini_image_url;
      return (
        <View style={{flex: 1}}>
          <View style={{height: Platform.OS === 'android' ? 24 : 26, position: 'absolute', top: 0, left: 0, right:0, backgroundColor: PRIMARY_COLOR}} />
          <View style={[styles.fill, { overflow: 'hidden' }]}>
            <Animated.ScrollView
              scrollEventThrottle={16}
              style={styles.fill}
              contentContainerStyle={styles.content}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
                { useNativeDriver: true }
              )}
            >
              <Text style={styles.name}>{this.state.data.name}</Text>
              {this._renderContent(this.state.data)}
            </Animated.ScrollView>

            <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslate }] }]} pointerEvents="none">
              <Animated.Image
                style={[styles.image, { opacity: imageOpacity, transform: [{ translateY: imageTranslate }, { scale: imageScale } ] }]}
                resizeMode="cover"
                source={{ uri: imageUrl }}
              />
            </Animated.View>

            <View style={styles.navbar}>
              <Animated.View style={[styles.navbarBackground, { opacity: navBarBackgroundOpacity }]} />

              <View style={[StyleSheet.absoluteFill, {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}]}>
                <TouchableOpacity onPress={() => { this.props.navigator.pop() }} hitSlop={{top: 15, left: 15, bottom: 15, right: 15}}>
                  <Image
                    style={styles.backButton}
                    source={{ uri: 'https://www.android.com/static/img/map/back-arrow.png' }}
                  />
                </TouchableOpacity>

                <Animated.View pointerEvents="none" style={[styles.titleContainer, {opacity: titleOpacity, transform: [{ translateY: titleTranslate }] }]}>
                  <Text style={styles.title}>{this.state.data.name}</Text>
                </Animated.View>
                {this._renderChatButton(this.state.data.id, this.props.navigator)}
              </View>
            </View>
          </View>

          <StatusBar barStyle="light-content" />
        </View>
      );
    }
  }

  const HEADER_HEIGHT = 200;
  const NAVBAR_HEIGHT = 46;

  const styles = StyleSheet.create({
    row: {
      padding: 10,
      margin: 10,
      backgroundColor: '#eee',
    },
    fill: {
      flex: 1,
      backgroundColor: '#fff',
      marginTop: Platform.OS === 'android' ? 0 : 26,
    },
    image: {
      height: HEADER_HEIGHT,
    },
    header: {
      overflow: 'hidden',
      position: 'absolute',
      top: -HEADER_HEIGHT - HEADER_HEIGHT,
      left: 0,
      right: 0,
      backgroundColor: PRIMARY_COLOR,
      height: HEADER_HEIGHT + HEADER_HEIGHT + HEADER_HEIGHT,
      paddingTop: HEADER_HEIGHT + HEADER_HEIGHT,
    },
    navbar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: NAVBAR_HEIGHT,
      flexDirection: 'row',
      alignItems: 'center',
    },
    navbarBackground: {
      backgroundColor: PRIMARY_COLOR,
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
    },
    content: {
      backgroundColor: '#fff',
      paddingTop: HEADER_HEIGHT,
    },
    name: {
      backgroundColor: 'transparent',
      marginTop: 60,
      marginBottom: 16,
      marginLeft: 10,
      fontSize: 16,
      fontWeight: 'bold',
    },
    backButton: {
      width: 20,
      height: 20,
      marginLeft: 16,
      tintColor: 'white',
    },
    rightButton: {
      width: 20,
      marginRight: 16,
    },
    titleContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      backgroundColor: 'transparent',
      textAlign: 'center',
      color: 'white',
      fontSize: 18,
    },
    join: {
      borderRadius: 10,
      marginBottom: 16,
      height: 30,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    joinText: {
      fontWeight: 'bold',
      textAlign: 'center',
      alignSelf: 'center',
      color: 'white',
      backgroundColor: 'transparent',
    },
    profile_icon: {
      marginLeft: 5,
      height: 20,
      width: 20,
      borderRadius: 10,
    },
    profile_container: {
      flex: 1,
      justifyContent: 'flex-end',
      flexDirection: 'row',
    },
    profile_name: {
      fontWeight: 'bold',
    }
  });
