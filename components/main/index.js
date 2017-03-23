import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  TextInput,
  Platform,
  View,
  Image,
  Button,
  Navigator,
  ListView,
  TouchableHighlight,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import Drawer from 'react-native-drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';


import CategoriesHeader from './categories_header.js';
import EventsListView from './events_list_view.js';
import ControlPanel from './side_menu.js';
import FullEventsListView from './full_event_list.js';
import DetailEventView from './detail_event_view.js';
import SearchContentView from './search.js';

import UserProfileView from '../user';
import EditUserProfileView from '../user/edit.js';
import UsersListView from '../user/user_list.js';
import NewsView from './news.js';
import CommentsView from './comments.js';
import CreateEventView from './create.js';

import ExploreView from '../explore';
import SettingsView from '../settings';

import {
  getEvents,
} from '../network';
import {
  PRIMARY_COLOR,
  DARK_COLOR,
} from '../global';

class MainFragment extends Component {
  constructor(props): void {
    super(props);
    this._renderRow = this._renderRow.bind(this);
    this.state = {
      profile: props.app.state.profile,
      search: false,
    };

  }

  _renderRow(rowData) {
      return (<EventsListView categoryId={rowData} navigator={this.props.navigator}/>);
  }

  render() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var dataSource = ds.cloneWithRows(['popular'].concat(this.state.profile.categories));
    return (
        <ListView
          enableEmptySections={true}
          dataSource={dataSource}
          renderRow={this._renderRow}
          renderHeader={()=>{return (<CategoriesHeader navigator={this.props.navigator}/>)}}
        />
    );
  }
}

class NavigationBar extends Navigator.NavigationBar {
  render() {
    var routes = this.props.navState.routeStack;
    if (routes.length) {
      var route = routes[routes.length - 1];
      if (route.index == 2) {
        return null;
      }
    }
    return super.render();
  }
}

class MainView extends Component {

  constructor(props): void {
    super(props);
    this.state = {
      search: false,
    };
  }
  _renderSearch() {
    if (!this.state.search) return null;
    return (<TextInput
      keyboardType="web-search"
      returnKeyType="search"
      autoFocus={true}
      style={styles.search}
      ref='searchBar'
      placeholder='Search'
      onSubmitEditing={(e)=>{
        var text = e.nativeEvent.text;
        this.setState({search: false});
        this.refs.navigator.push({index: 5, text: text.toLowerCase(), title: 'Search ' + text});
      }}
      onEndEditing={(event) => this.setState({search: false})}
        />);
  }
  render () {
    var TOP = 44 + (Platform.OS == 'android' ? 10: 26);
    return (
      <View style={{flex: 1}}>
      <StatusBar
       backgroundColor={DARK_COLOR}
     />
      <Navigator
        ref="navigator"
        initialRoute={{ title: 'tolpa', index: 0 }}
        renderScene={(route, navigator) => {
          if (route.index == 0) {
            return <View style={{top: TOP, flex: 1}}>
              <MainFragment navigator={navigator} app={this.props.app} />
            </View>
          } else if (route.index == 1) {
            return <View style={{top: TOP, flex: 1}}>
              <FullEventsListView getEvents={getEvents.bind(null, route.tagId)} navigator={navigator}/>
            </View>
          } else if (route.index == 2) {
            return <DetailEventView data={route.data} navigator={navigator} app={this.props.app}/>
          } else if (route.index == 3) {
            return <UserProfileView user={route.data} navigator={navigator} app={this.props.app} />
          } else if (route.index == 4) {
            return <View style={{top: TOP}}>
              <UsersListView getUsers={route.getUsers} navigator={navigator} invitedEvent={route.invitedEvent}/>
            </View>
          } else if (route.index == 5) {
           return <View style={{top: TOP, flex: 1}}>
             <SearchContentView searchText={route.text} navigator={navigator}/>
           </View>
         } else if (route.index == 6) {
           return <View style={{top: 56, flex: 1}}>
             <ExploreView navigator={navigator}/>
           </View>
         } else if (route.index == 7) {
           return <View style={{top: TOP, flex: 1}}>
             <EditUserProfileView user={route.data} navigator={navigator} app={this.props.app} />
           </View>
         } else if (route.index == 8) {
           return <View style={{top: TOP, flex: 1}}>
             <NewsView navigator={navigator} app={this.props.app} />
           </View>
         } else if (route.index == 9) {
         return <View style={{top: TOP, flex: 1}}>
           <CommentsView navigator={navigator} eventId={route.event_id} />
         </View>
       } else if (route.index == 10) {
         return <View style={{top: TOP, flex: 1}}>
           <CreateEventView navigator={navigator} data={route.data}/>
         </View>
       } else if (route.index == 11) {
         return (<View style={{top: TOP, flex: 1}}>
           <SettingsView app={this.props.app}/>
         </View>);
       }
        }}
        navigationBar={
         <NavigationBar
           style={{backgroundColor: PRIMARY_COLOR}}
           routeMapper={{
             LeftButton: (route, navigator, index, navState) =>
             {
                if (navState.routeStack.length > 1)
                  return (<View style={styles.in_center}><Icon.Button
                    color='white'
                    backgroundColor='transparent'
                    underlayColor='transparent'
                    size={30}
                    name='keyboard-arrow-left'
                    onPress={()=> {navigator.pop()}}
                  /></View>);

                return (<View style={styles.in_center}><Icon
                  color='white'
                  backgroundColor="transparent"
                  name="menu"
                  size={30}
                  onPress={this.props.drawerOpen}
                /></View>);

             },
             RightButton: (route, navigator, index, navState) =>
               {
                 if (route.index == 4 && route.inviteUsersRoute) {
                   return (<View style={styles.in_center}><Icon.Button
                     onPress={()=>navigator.push(route.inviteUsersRoute)}
                     backgroundColor="transparent"
                     name="group-add"
                     size={30}
                     color="white" /></View>);
                 }
                 if (route.index > 0) return null;
                 return (<View style={styles.in_center}><Icon.Button
                   onPress={()=>{
                     this.setState({search: true});}
                   }
                   backgroundColor="transparent"
                   name="search"
                   size={30}
                   color="white" /></View>);
                  },
             Title: (route, navigator, index, navState) =>
               {
                  return (<View style={styles.in_center}>
                      <Text numberOfLines={1} style={styles.title}>{route.title}</Text>
                    </View>);
               },
           }}
         />
      }
        />
      {this._renderSearch()}
      </View>
    );
  }
}

export default class MainScreen extends Component {
  constructor(props) {
    super(props);
    this._selectedMenuItem = this._selectedMenuItem.bind(this);
  }
  _selectedMenuItem(index) {
    this._drawer.close();
    if (index == 0) {
      this._mainView.refs.navigator.resetTo({index: 0, title: 'Tolpa'});
    } else if (index == 1) {
      var user = this.props.app.state.profile;
      this._mainView.refs.navigator.resetTo({index: 3, title: user.first_name + ' ' + user.last_name, data: user});
    } else if (index == 2) {
      this._mainView.refs.navigator.push({index: 10, title: 'Create Event'});
    } else if (index == 3) {
      this._mainView.refs.navigator.push({index: 11, title: 'Settings'});
    } else if (index == 4) {
      this._mainView.refs.navigator.resetTo({index: 6, title: 'Explore'});
    } else if (index == 5) {
      this._mainView.refs.navigator.resetTo({index: 8, title: 'News'});
    }
  }
  render () {
    return (
      <Drawer
        type="overlay"
        ref={(ref) => this._drawer = ref}
        content={<ControlPanel selectedMenuItem={this._selectedMenuItem} app={this.props.app}/>}
        openDrawerOffset={50}
        closedDrawerOffset={-3}
        styles={drawerStyles}
        tweenHandler={(ratio) => ({
          main: { opacity:(2-ratio)/2 }
        })}
        negotiatePan={true}
        panOpenMask={5}
        captureGestures={true}
        tapToClose={true}
        initializeOpen={false}
        panCloseMask={0.2}
      >
          <MainView
            app={this.props.app}
            ref={(ref) => this._mainView = ref}
            drawerOpen={() => {this._drawer.open();}}/>
      </Drawer>
    );
  }
}

const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 3},
}

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontSize: 18,
  },
  search: {
    position: 'absolute',
    top: Platform.OS == 'android' ? 0: 26,
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: 'white',
    paddingLeft: 20,
  },
  in_center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});
