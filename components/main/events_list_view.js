import React, {Component} from 'react';
import {
  AsyncStorage,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Navigator,
  TouchableOpacity,
  ListView,
  TouchableHighlight,
} from 'react-native';


import Icon from 'react-native-vector-icons/MaterialIcons';
import I18n from 'react-native-i18n';


import {
  getEvents
} from '../network';

import {
  CATEGORIES,
} from './categories_header';
import {PRIMARY_COLOR} from "../global/index";
import moment from 'moment';

const KEY_TAG = "property_tag_";
export default class EventsListView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      results: []
    };
    AsyncStorage.getItem(KEY_TAG + props.categoryId, (err, tags)=>{
      if (!tags) return;
      this.setState({results: JSON.parse(tags)});
    });
    this._renderFooter = this._renderFooter.bind(this);
    this._renderRow = this._renderRow.bind(this);
  }

  _renderRow(rowData) {
      var d = new Date(rowData.start);
      var day = I18n.t("_Months")[d.getMonth()].substring(0,3) + " " + d.getDate();
      var time = I18n.t("_Weekdays")[d.getDay()] + moment(d).format(', HH:mm');
      var nav = this.props.navigator;
      return (
        <TouchableHighlight
          underlayColor="white"
          onPress={() => nav.push({index: 2, title: rowData.name, data: rowData})}>
        <View style={[styles.container, styles.card]}>
          <View style={[styles.cardContent]}>
            <View style={{width: 200, height: 270, margin: -10}}>
              <Image style={{height: 200, width: 200}}
                source={{uri: rowData.mini_image_url}}/>
              <View style={styles.date}>
              <Text style={{color: 'white', textAlign: 'center'}}>{day}</Text>
              </View>
              {!rowData.multi ? null :
                <Icon
                  style={{position: 'absolute', right:0, backgroundColor:"transparent"}}
                  name="timelapse" size={30} color={PRIMARY_COLOR}  />
              }
              <Text numberOfLines={2} style={{height: 50, fontSize: 16}}>{rowData.name}</Text>
              <View style={{flex: 1, flexDirection:'row', justifyContent: 'space-between'}}>
                <Text>{time}</Text>
                <Text>{!rowData.budget_min ? I18n.t('Free') : "₴" + rowData.budget_min + "+"}</Text>
                <Text>👥{rowData.attenders_count}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }


  _renderFooter(tagId, categoryName) {
    return (<TouchableOpacity
        onPress={() => {
          this.props.navigator.push({index: 1, title: categoryName, tagId: tagId});
        }}
        style={styles.next}>
        <Icon name="more-horiz" size={30} color="white"/>
      </TouchableOpacity>);
  }

  async componentDidMount() {
    var res = getEvents(this.props.categoryId).then((res)=>{
      if (!res) return;
      this.setState({
        results: res,
      });
      AsyncStorage.setItem(KEY_TAG + this.props.categoryId, JSON.stringify(res));
    });
  }

  render() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var dataSource = ds.cloneWithRows(this.state.results);
    var tagId = this.props.categoryId;
    var categoryName = I18n.t(tagId === "popular" ? "Popular" : CATEGORIES[tagId]);
    return (
      <View style={{height: 340, paddingTop: 20}}>
        <Text style={styles.title}>{categoryName}</Text>
        <ListView
          enableEmptySections={true}
          horizontal={true}
          dataSource={dataSource}
          renderRow={this._renderRow}
          renderFooter={() => this._renderFooter(tagId, categoryName)}
        />
      </View>
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
    backgroundColor: PRIMARY_COLOR + '77',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  next: {
    top: 50,
    margin: 50,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: PRIMARY_COLOR + '77',
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  title: {
    padding: 5,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'grey',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    margin: 5
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 2,
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 0.3,
    }
  },

  cardContent: {
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },

});
