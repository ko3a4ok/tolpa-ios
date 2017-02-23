import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Navigator,
  ListView,
  TouchableHighlight,
} from 'react-native';

import Drawer from 'react-native-drawer';
import CategoriesHeader from './categories_header.js';
import EventsListView from './events_list_view.js';
import ControlPanel from './side_menu.js';
import FullEventsListView from './full_event_list.js';

class MainFragment extends Component {
  constructor(): void {
    super();
    this._renderRow = this._renderRow.bind(this);
    this.state = {
      profile: {
        categories: [1, 2,],
      },
    };
    AsyncStorage.getItem('profile', (err, profile) => {
      if (!profile) return;
      var user = JSON.parse(profile);
      this.setState({profile: user.profile});
    });
  }

  _renderRow(rowData) {
      return (<EventsListView categoryId={rowData} navigator={this.props.navigator}/>);
  }

  render() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var dataSource = ds.cloneWithRows(['popular'].concat(this.state.profile.categories));
    return (
      <View style={{ paddingTop: 40}}>
        <CategoriesHeader category_ids={this.state.profile.categories} />
        <ListView
          enableEmptySections={true}
          dataSource={dataSource}
          renderRow={this._renderRow}
        />
      </View>
    );
  }
}
class MainView extends Component {

  render () {
    return (
      <Navigator
        style={{paddingTop: 30}}
        initialRoute={{ title: 'tolpa', index: 0 }}
        renderScene={(route, navigator) => {
          if (route.index == 0) {
            return <MainFragment navigator={navigator}/>
          } else if (route.index == 1) {
            return <FullEventsListView categoryId={route.tagId} />
          }
        }}
        navigationBar={
         <Navigator.NavigationBar
           style={{backgroundColor: '#25a67d'}}
           navigationStyles={Navigator.NavigationBar.StylesIOS}
           routeMapper={{
             LeftButton: (route, navigator, index, navState) =>
             {
                return (<Button
                  color='white'
                  title="≡"
                  onPress={this.props.drawerOpen}
                />);

             },
             RightButton: (route, navigator, index, navState) =>
               { return null; },
             Title: (route, navigator, index, navState) =>
               {
                  return <Text style={{color: 'white', fontSize: 20}}>{route.title}</Text>;
                },
           }}
         />
      }
        />
    );
  }
}

export default class MainScreen extends Component {
  render () {
    return (
      <Drawer
        type="overlay"
        ref={(ref) => this._drawer = ref}
        content={<ControlPanel />}
        openDrawerOffset={100}
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
          <MainView drawerOpen={() => {this._drawer.open();}}/>
      </Drawer>
    );
  }
}

const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 3},
}
