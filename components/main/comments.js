import React, {Component} from 'react';
import {
  Alert,
  Animated,
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import I18n from 'react-native-i18n';

import {
  getComments,
  sendComment,
  deleteComment,
} from '../network';
import {timeSince} from '../global';


export default class CommentsView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      results: []
    }
    this.loadComments = this.loadComments.bind(this);
    this._sendComment = this._sendComment.bind(this);
    this._renderRow = this._renderRow.bind(this);
    this._renderHeader = this._renderHeader.bind(this);
    this._deleteComment = this._deleteComment.bind(this);
    this.loading = -1;
  }

  async _deleteComment(rowId) {
    res = this.state.results[rowId];
    const animKey = '_rowOpacity' + res.id;
    this.setState({
      [animKey]: new Animated.Value(1),
    });
    Animated.timing(this.state[animKey], {
      toValue  : 0,
      duration : 400,
      useNativeDriver: true,
    }).start();
    result = await deleteComment(res.event_id, res.id);
    if (!result) {
      this.setState({
        [animKey]: new Animated.Value(1),
      });
      return;
    }
    this.state.results.splice(rowId, 1);
    this.setState({results: this.state.results});
  }

  _renderRow(rowData,  sectionID, rowID, highlightRow) {
      if (!rowData) {
        return (<ActivityIndicator style={{paddingTop: 20}}/>);
      }
      var userName = rowData.user.name;
      var nav = this.props.navigator;
      var time = timeSince(new Date(rowData.created_at));
      var user = rowData.user;
      var imageUrl = user.mini_profile_url;
      var imageSource = {};
      if (imageUrl)
        imageSource.uri = imageUrl;
      var anim_style = {};
      if (this.state['_rowOpacity' + rowData.id])
        anim_style={opacity: this.state['_rowOpacity' + rowData.id]};
      return (
        <Animated.View style={[{padding: 5}, anim_style]}>
              <TouchableOpacity style={styles.container}
                  onLongPress={() => {
                    if (this.props.app.state.profile.user_id != rowData.user.user_id)
                      return;
                    Alert.alert(
                      I18n.t('Delete your comment?'),
                      rowData.text,
                      [
                        {text: I18n.t('Cancel'), onPress: () => {}, style: 'cancel'},
                        {text: I18n.t('OK'), onPress: () => this._deleteComment(rowID)},
                      ],
                    )
                  }}
                  onPress={() => {
                  nav.push({index: 3, data: user, title: userName})
                }}>
                <Image source={imageSource} style={styles.user_image} />
                <View flexDirection='column' style={{paddingLeft: 5}}>
                  <Text style={styles.title}>{userName}</Text>
                  <Text style={{paddingRight: 5, color: 'darkgrey', fontSize: 10}}>{time}</Text>
                </View>
              </TouchableOpacity>
              <Text style={{paddingLeft: 40}}>{rowData.text}</Text>
        </Animated.View>
    );
  }

  async loadComments() {
    var offset = this.state.results.length;
    if (offset > 0 && !this.state.results.slice(-1)[0])
      offset--;
    if (this.loading >= offset) return;
    this.loading = offset;
    this.setState({
      results: this.state.results.concat(null),
    });
    var res = await getComments(this.props.eventId, offset);
    this.setState({
      results: this.state.results.slice(0, -1).concat(res),
    });
  }

  async componentDidMount() {
    this.loadComments();
  }

  async _sendComment(text) {
    if (!text) return;
    res = await sendComment(this.props.eventId, text);
    if (!res) {
      this.setState({comment: text});
      return;
    }
    this.state.results.unshift(res);
    const animKey = '_rowOpacity' + res.id;
    this.setState({
      results: this.state.results,
      [animKey]: new Animated.Value(0),
    });
    Animated.timing(this.state[animKey], {
      toValue  : 1,
      duration : 2000,
      useNativeDriver: true,
    }).start();

  }

  _renderHeader() {
    return (
      <View style={{padding: 10}}>
      <TextInput
      onChangeText={(text) => this.setState({comment: text})}
      value={this.state.comment}
      onSubmitEditing={() => {
        var text = this.state.comment;
        this.setState({comment: undefined});
        this._sendComment(text);
      }}
      style={{paddingVertical: 0, paddingHorizontal: 5, height: 40}}
      clearButtonMode='always'
      autoCapitalize='sentences'
      autoFocus={true}
      returnKeyType='send'
      placeholder={I18n.t("Leave a Comment")}/>
      </View>);
  }

  _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          height:  1,
          marginLeft: 47,
          marginRight: 20,
          backgroundColor: '#aaa3',
        }}
      />
    );
  }


  render() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var dataSource = ds.cloneWithRows(this.state.results);
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <ListView
          enableEmptySections={true}
          dataSource={dataSource}
          renderHeader={this._renderHeader}
          renderRow={this._renderRow}
          renderSeparator={this._renderSeparator}
          onEndReached={() => {this.loadComments()}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  title: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  user_image: {
    width: 30,
    height: 30,
    borderRadius: 15,
  }
});
