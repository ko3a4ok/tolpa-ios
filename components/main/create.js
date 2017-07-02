import React, {Component} from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  Switch,
  TouchableOpacity,
  View,
  Image,
  Platform
} from 'react-native';
import I18n from 'react-native-i18n';

import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker';
import DatePicker from 'react-native-datepicker'
import MultiSlider from './multi-slider';
import Toast, {DURATION} from 'react-native-easy-toast';

import moment from 'moment';

import {
  localDay,
} from "../../localization";


import {
  createEvent,
  uploadEventImage,
} from '../network';

import {
  PRIMARY_COLOR,
  KYIV
} from '../global';

import {
  CATEGORIES,
} from './categories_header.js';
import {nextDate, intToTimeFormat} from "../global/index";

const DATE_FORMAT = "YYYY-MMM-DD HH:mm";
export default class CreateEventView extends Component {
    constructor(props) {
      super(props);
      this._loadImage = this._loadImage.bind(this);
      this._createEvent = this._createEvent.bind(this);
      this._updateAddress = this._updateAddress.bind(this);
      this._renderTags = this._renderTags.bind(this);
      this._renderTime = this._renderTime.bind(this);
      this.state = {
        height: 0,
        imageSource: {},
        tags: new Set(),
        week: {},
      }
      if (props.data) {
        var event = props.data;
        Object.assign(this.state, event);
        this.state.title = event.name;
        this.state.desc = event.description;
        this.state.tags = new Set(event.tags);
        if (event.start)
          this.state.start = moment(new Date(event.start)).format(DATE_FORMAT);
        if (event.end)
          this.state.end = moment(new Date(event.end)).format(DATE_FORMAT);
        if (event.image_url)
          this.state.imageSource.uri = event.image_url;
        if (event.place)
          this.state.location = {
            latitude: event.place[1],
            longitude: event.place[0],
            latitudeDelta: 0.0822,
            longitudeDelta: 0.0421,
          }
      }
    }

    async _loadImage() {
      var options = {
        maxWidth: 400,
        maxHeight: 300,
        mediaType: 'photo',
        quality: 0.7,
        noData: true,
        allowsEditing: true,
        storageOptions: {
          skipBackup: true,
          path: 'images'
        }
      };
      let that = this;
      ImagePicker.showImagePicker(options, (response) => {
        if (response.didCancel) {
          return;
        }
        if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          that.setState({imageSource: { uri: response.uri }});
        }
      });
    }

    _renderImagePicker() {
      if (Object.keys(this.state.imageSource).length) return null;
      return (
        <Icon
          name="camera"
          size={100}
          color="#fffd"
        />
      );
    }

    _renderTags() {
      var res = [];
      var that = this;
      var tags = this.state.tags;
      CATEGORIES.map(function(tag, tagId){
        var selected = tags.has(tagId);
        res.push(
          <TouchableOpacity
            onPress={() => {
              if (selected) {
                tags.delete(tagId);
              } else {
                tags.add(tagId);
              }
              that.setState({tags: tags});
            }}
            key={`press-${tagId}`}
            style={styles.tag_container}>
          <Text
            style={[styles.category, selected ? styles.selected_category : styles.nonselected_category]}
            key={tagId}>{I18n.t(tag)}
          </Text>
        </TouchableOpacity>
        );
      });
      return <View style={styles.tags}>{res}</View>;
    }

    _renderTime(end) {
      var that = this;
      return (
        <DatePicker
          date={end? this.state.end : this.state.start}
          mode="datetime"
          format={DATE_FORMAT}
          showIcon={false}
          placeholder={I18n.t(end? 'End' : 'Start')}
          confirmBtnText={I18n.t("Confirm")}
          cancelBtnText={I18n.t("Cancel")}
          style={{height: 50}}
          customStyles={{
            dateInput: styles.input,
          }}
          onDateChange={(date) => {
            if (end)
              that.setState({end: date})
            else
              that.setState({start: date})
          }}
        />
      );
    }

    _renderOnlyTime(day, end) {
      const that = this;
      let d = this.state.week[day];
      if (d)
        d = d[end ? 'end' : 'start'];
      d = intToTimeFormat(d);
      var startDate, endDate;
      if (end)
        startDate = this.state.week[day] ? this.state.week[day].start : undefined;
      else
        endDate = this.state.week[day] ? this.state.week[day].end : undefined;
      return (
        <DatePicker
          ref={""+day+end}
          date={d}
          is24Hour={true}
          minDate={intToTimeFormat(startDate)}
          maxDate={intToTimeFormat(endDate)}
          showIcon={false}
          mode="time"
          placeholder={I18n.t(end? 'End' : 'Start')}
          confirmBtnText={I18n.t(end ? "End" : "Start") + " " + I18n.t("Confirm")}
          cancelBtnText={I18n.t("Cancel")}
          style={{width: 70}}
          customStyles={{
            dateInput: [styles.input, styles.only_date],
          }}
          onDateChange={(t) => {
            let tt = t.split(':');
            t = parseInt(tt[0])*60 + parseInt(tt[1]);
            if (!that.state.week[day])
              that.state.week[day] = {};
            that.state.week[day][end ? 'end' : 'start'] = t;
            that.setState({days: that.state.week});
            if (!end && !that.state.week[day].end) {
             const next = that.refs[""+day+true];
             setTimeout(()=>{
              next.onPressDate();
             }, 500);
            }
          }}
        />
      );

    }

    _renderPrice() {
      var priceText = I18n.t('None');
      if (this.state.budget_min !== undefined) {
        if (this.state.budget_max == 0)
          priceText = I18n.t('Free');
        else if (this.state.budget_max == this.state.budget_min)
          priceText = '₴' + this.state.budget_max;
        else if (this.state.budget_max == 1001)
          priceText = '₴' + this.state.budget_min + "+";
        else
          priceText = '₴' + this.state.budget_min + "-" + this.state.budget_max;
      }
      return (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{marginTop: 10, flex: 1}}>{I18n.t("Price")}: {priceText}</Text>
          <MultiSlider
            onValuesChange={(arr)=>{
              this.setState({
                budget_min: arr[0],
                budget_max: arr[1],
              });
            }}
            min={0}
            max={1001}
            values={this.props.data ? [this.props.data.budget_min, this.props.data.budget_max] : [0,500]}/>
        </View>
      );
    }

    async _updateAddress(event) {
      var cc = event.nativeEvent.coordinate;
      this.setState({location: Object.assign(cc,
                    {latitudeDelta: 0.0822,
                    longitudeDelta: 0.0421})});
      if (this.state.addressed) return;
      var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+cc.latitude + "," + cc.longitude;
      try {
        let response = await fetch(url);
        let responseJson = await response.json();
        if (responseJson.results.length > 0)
          this.setState({address: responseJson.results[0].formatted_address});
      } catch(error) {
        console.error(error);
      }
    }
    _renderLocation() {
      return (
      <View style={{flex: 1, marginTop: 10, height: 300}}>
        <MapView
          onPress={this._updateAddress}
            liteMode={false}
            style={{height: 250}}
            initialRegion={this.state.location ? this.state.location : {
              latitude: KYIV.latitude,
              longitude: KYIV.longitude,
              latitudeDelta: 0.0822,
              longitudeDelta: 0.0421,
            }}>
            {!this.state.location ? null :
            <MapView.Marker
              draggable
              coordinate={{
                latitude: this.state.location.latitude,
                longitude: this.state.location.longitude,
              }}
              onDragEnd={this._updateAddress}
            />
            }
        </MapView>
        <TextInput
          style={[styles.input, styles.input_text]}
          placeholder={I18n.t("Address")}
          defaultValue={this.state.address}
          onChangeText={text => this.setState({address: text, addressed: true})}
        />
      </View>
      );
    }

    _createButton() {
      if (this.state.creating) {
        return (<ActivityIndicator style={{paddingTop: 20}}/>);
      }
      return (
        <TouchableOpacity onPress={this._createEvent} style={styles.create_btn}>
          <Text style={[styles.category, {
              color: "white",
              fontWeight: "bold",
            }]}>{I18n.t(this.props.data ? "Update" : "Create" + " Event")}</Text>
        </TouchableOpacity>
      );
    }

    async _createEvent() {
      err = this._validateInput();
      if (err) {
        this.refs.toast.show(err);
        return;
      }
      this.setState({creating: true});
      var event = {
        name: this.state.title,
        description: this.state.desc,
        tags: [...this.state.tags],
        budget_min: this.state.budget_min,
        budget_max: this.state.budget_max,
        address: this.state.address,
        multi: this.state.multi,
        week: this.state.week,
      }
      if (this.state.start)
        event.start = moment(this.state.start, DATE_FORMAT).toDate().toISOString();
      if (this.state.end)
        event.end = moment(this.state.end, DATE_FORMAT).toDate().toISOString();

      if (this.state.location)
        event.place = [this.state.location.longitude, this.state.location.latitude];

      if (this.props.data)
        res = await createEvent(event, this.props.data.id);
      else
        res = await createEvent(event);
      if (!res || !res.id) {
        this.refs.toast.show('Oops!');
        this.setState({creating: false});
        return;
      }
      if ((this.state.imageSource && !this.props.data) ||
          this.state.imageSource.uri != this.props.data.image_url) {
        image = await uploadEventImage(res.id, this.state.imageSource.uri);
        Object.assign(res, image);
      }
      if (!this.props.data)
        this.props.navigator.replace({index: 2, title: res.name, data: res});
      else
        this.props.navigator.replacePreviousAndPop({index: 2, title: res.name, data: res});
    }
    render() {
      return (
        <View style={{flex: 1}}>
        <ScrollView style={{flex: 1, padding: 5}}>
          <View style={styles.image}>
            <Image
              source={this.state.imageSource}
              style={{flex: 1}}
            />
            <TouchableOpacity
              onPress={this._loadImage}
              style={styles.imageContainer}>
              {this._renderImagePicker()}
            </TouchableOpacity>
          </View>
          <TextInput
            defaultValue={this.state.title}
            style={[styles.input, styles.input_text, {fontWeight: 'bold'}]}
            placeholder={I18n.t("Title")}
            autoCapitalize="sentences"
            onChangeText={text => this.setState({title: text})}
            multiline={false}
            />
          <TextInput
            defaultValue={this.state.desc}
            placeholder={I18n.t("Description")}
            multiline={true}
            onChangeText={text => this.setState({desc: text})}
            onContentSizeChange={(event) => {
              this.setState({height: event.nativeEvent.contentSize.height});
            }}
            style={[styles.input, styles.input_text, {paddingBottom: 5, height: this.state.height}]}
            />
          {this._renderTags()}
          {this._renderDate()}
          {this._renderPrice()}
          {this._renderLocation()}
          {this._createButton()}
          <View style={{height: 100}} />
        </ScrollView>
        <Toast ref="toast" />
        </View>
      );
    }

  _renderSingleEvent() {
      return (
        <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-around'}}>
          {this._renderTime(false)}
          {this._renderTime(true)}
        </View>
      );
  }
  _renderMultiEvent() {
    const res = [];
    const that = this;
    moment.weekdays().map((day, idx)=>{
      const dayState = that.state.week[idx];
      const missing = dayState && ((dayState.end != null) ^ (!!dayState.start != null));
      const filled = dayState && (dayState.end && dayState.start);
      res.push(
        <View
          key={day}
          style={[
            {padding: 5, flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'space-around'},
            {backgroundColor: missing ? '#f002': 'transparent'}]
          }>
          <Text style={[
            styles.category,
            filled ? styles.selected_category : styles.nonselected_category,
            {width: 100, height: 30, padding: 5}]}>{localDay(idx)}</Text>
          {this._renderOnlyTime(idx, false)}
          {this._renderOnlyTime(idx, true)}
          <Icon
            onPress={()=>{
              delete that.state.week[idx];
              that.setState({days: that.state.week});
            }}
            name="clear"
            size={30}
            color={dayState ? PRIMARY_COLOR : 'transparent'}
          />
        </View>
      );
    });
    m = nextDate(this.state.week);
    return (<View>
      <Text style={{marginLeft: 5}}>{m ? I18n.t("Next event: ") + m.calendar() : ""}</Text>
      {res}
      </View>);
  }

  _renderDate() {
    return (<View>
      <View style={{marginLeft: 5, flexDirection: 'row', alignItems: 'center'}}>
        <Text>{I18n.t("Multi Event: ")}</Text>
        <Switch
          onTintColor={PRIMARY_COLOR}
          tintColor={PRIMARY_COLOR}
          value={this.state.multi}
          onValueChange={(val) => this.setState({multi: val})}
          backgroundActive={PRIMARY_COLOR}
        />
      </View>
      {!this.state.multi ? this._renderSingleEvent() : this._renderMultiEvent()}
    </View>);

  }

  _validateDate() {
      if (!this.state.multi) {
        if (!this.state.start) throw new Error("Start Date");
        if (!this.state.end) throw new Error("End Date");
      } else {
        if (Object.keys(this.state.week).length == 0) throw new Error("Days");
        for (let day in this.state.week) {
          if (day == 'offset') continue;
          const o = this.state.week[day];
          if (o.start == null) throw new Error("Start Date");
          if (o.end == null) throw new Error("End Date");
        }
      }
  }
  _validateInput() {
    try {
      this._validateTitle();
      this._validateDate();
    } catch (err) {
      return I18n.t("Please set ") + I18n.t(err.message);
    }
  }

  _validateTitle() {
    if (!this.state.title) throw new Error("Title");
    if (!this.state.desc) throw new Error("Description");

  }
}

const styles = StyleSheet.create({
  image: {
    left: 0,
    right: 0,
    height: 250,
    backgroundColor: '#ddd',
  },
  input: {
    paddingHorizontal: 5,
    borderRadius: 5,
    borderColor: '#0003',
    borderWidth: 0.5,
    minHeight: 40,
    marginTop: 10,
    paddingVertical: 0,
    right: 0,
  },
  input_text: {
    fontSize: 18,
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  category: {
    overflow: 'hidden',
    paddingHorizontal: 10,
    margin: 2,
    borderColor: PRIMARY_COLOR,
    borderWidth: 0,
    borderRadius: 5,
    textAlign: 'center',
    alignSelf: 'center',
  },
  nonselected_category : {
    backgroundColor: PRIMARY_COLOR + '33',
  },
  selected_category : {
    backgroundColor: PRIMARY_COLOR + 'dd',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 0,
    marginTop: 10,
  },
  tag_container: {
    margin: 3,
    height: 27,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  only_date: {
    minHeight: 30,
    maxHeight: 30,
    marginTop: 0,
  },
  create_btn: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "darkred",
    height: 35,
    borderRadius: 12,
  },

});
