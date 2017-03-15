import React, {Component} from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker';
import DatePicker from 'react-native-datepicker'
import MultiSlider from 'react-native-multi-slider';
import Toast, {DURATION} from 'react-native-easy-toast';

import moment from 'moment';

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
      [...CATEGORIES.keys()].forEach(function(tagId){
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
            key={tagId}>{CATEGORIES[tagId]}
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
          placeholder={end? 'End' : 'Start'}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          style={{marginTop: 10}}
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

    _renderPrice() {
      var priceText = 'None';
      if (this.state.budget_min !== undefined) {
        if (this.state.budget_max == 1)
          priceText = 'Free';
        else if (this.state.budget_max == this.state.budget_min+1)
          priceText = '₴' + this.state.budget_max;
        else if (this.state.budget_max == 1001)
          priceText = '₴' + this.state.budget_min + "+";
        else
          priceText = '₴' + this.state.budget_min + "-" + this.state.budget_max;
      }
      return (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{marginTop: 10, flex: 1}}>Price: {priceText}</Text>
          <MultiSlider
            onValuesChange={(arr)=>{
              this.setState({
                budget_min: arr[0],
                budget_max: arr[1],
              });
            }}
            selectedStyle={{
              backgroundColor: PRIMARY_COLOR,
              height: 3,
            }}
            unselectedStyle={{
              backgroundColor: 'grey',
              height: 1,

            }}
            touchDimensions={{
              height: 40,
              width: 40,
              borderRadius: 20,
              slipDisplacement: 40
            }}
            min={0}
            max={1001}
            values={[0,1000]}/>
        </View>
      );
    }

    async _updateAddress(event) {
      var cc = event.nativeEvent.coordinate;
      this.setState({location: cc});
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
            liteMode={true}
            style={{height: 250}}
            initialRegion={{
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
          placeholder="Address"
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
        <TouchableOpacity onPress={this._createEvent} style={{
          marginTop: 10,
          backgroundColor: "darkred",
          height: 35,
          borderRadius: 12,
          }}>
          <Text style={[styles.category, {
              color: "white",
              fontWeight: "bold",
            }]}>Create Event</Text>
        </TouchableOpacity>
      );
    }

    async _createEvent() {
      this.setState({creating: true});
      var event = {
        name: this.state.title,
        description: this.state.desc,
        tags: [...this.state.tags],
        budget_min: this.state.budget_min,
        budget_max: this.state.budget_max,
        address: this.state.address,
      }
      if (this.state.start)
        event.start = moment(this.state.start, DATE_FORMAT).toDate().toISOString();
      if (this.state.end)
        event.end = moment(this.state.end, DATE_FORMAT).toDate().toISOString();

      if (this.state.location)
        event.place = [this.state.location.longitude, this.state.location.latitude];

      res = await createEvent(event);
      if (!res.id) {
        this.refs.toast.show('Oops!');
        this.setState({creating: false});
        return;
      }
      this.refs.toast.show('Ya!');

      if (this.state.imageSource) {
        image = await uploadEventImage(res.id, this.state.imageSource.uri);
        Object.assign(res, image);
      }
      this.props.navigator.replace({index: 2, title: res.name, data: res});
    }
    render() {
      return (
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
          <Toast ref="toast" />
          <TextInput
            style={[styles.input, styles.input_text, {fontWeight: 'bold'}]}
            placeholder="Title"
            autoCapitalize="sentences"
            onChangeText={text => this.setState({title: text})}
            multiline={false}
            />
          <TextInput
            placeholder="Description"
            multiline={true}
            onChangeText={text => this.setState({desc: text})}
            onContentSizeChange={(event) => {
              this.setState({height: event.nativeEvent.contentSize.height});
            }}
            style={[styles.input, styles.input_text, {height: this.state.height}]}
            />
          {this._renderTags()}
          <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-around'}}>
            {this._renderTime(false)}
            {this._renderTime(true)}
          </View>
          {this._renderPrice()}
          {this._renderLocation()}
          {this._createButton()}
          <View style={{height: 100}} />
        </ScrollView>
      );
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
    paddingVertical: 5,
    margin: 2,
    borderColor: PRIMARY_COLOR,
    borderWidth: 0,
    borderRadius: 5,
    height: 25,
    textAlign: 'center',

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
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },


});
