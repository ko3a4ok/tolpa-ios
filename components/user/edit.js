import React, {Component} from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Navigator,
  TouchableOpacity,
  ListView,
} from 'react-native';

import DatePicker from 'react-native-datepicker'
import ModalPicker from 'react-native-modal-picker'

import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-easy-toast';
import {PRIMARY_COLOR} from "../global/index";

var ImagePicker = require('react-native-image-picker');

import {
  updateProfile,
  uploadUserProfileImage,
} from '../network' ;


import {
  CATEGORIES,
} from '../main/categories_header.js';


export default class EditUserProfileView extends Component {
  constructor(props) {
    super(props);
    this._loadImage = this._loadImage.bind(this);
    this.state = {
      user: props.user,
      birthday: props.user.birthday,
      gender: props.user.gender,
    }
    if (props.user.birthday)
      this.state.user.birthday = props.user.birthday;
    if (props.user.gender)
      this.state.user.gender = props.user.gender;
  }

  _renderTags() {
    var user = this.state.user;
    var res = [];
    var that = this;
    CATEGORIES.map(function(tag, tagId){
      var selected = user.categories.includes(tagId);
      res.push(
        <TouchableOpacity
          onPress={() => {
            if (selected) {
              var i = user.categories.indexOf(tagId);
              user.categories.splice(i, 1);
            } else {
              user.categories.push(tagId);
            }
            that.setState({user: user});
          }}
          key={`press-${tagId}`}
          style={styles.tag_container}>
        <Text
          style={[styles.category, selected ? styles.selected_category : styles.nonselected_category]}
          key={tagId}>{tag}
        </Text>
      </TouchableOpacity>
      );
    });
    return <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>{res}</View>;
  }

  async _saveProfile() {
    var newProfile = Object.assign({}, this.state);
    delete newProfile['user'];
    newProfile.categories = this.state.user.categories;
    var name = newProfile.name;
    if (name) {
      var sp = name.indexOf(' ');
      if (sp != -1) {
        newProfile.first_name = name.substring(0, sp);
        newProfile.last_name = name.substring(1 + sp);
      } else {
        newProfile.first_name = name;
      }
      delete newProfile['name'];
    }
    if (newProfile.birthday) {
      newProfile.birthday = new Date(newProfile.birthday).toISOString();
    }
    if (this.state.avatarSource)
      await uploadUserProfileImage(this.state.avatarSource.uri);
    var res = await updateProfile(this.props.user.user_id, JSON.stringify(newProfile));
    if (res) {
      res.user_id = this.props.user.user_id;
      res._id = this.props.user.user_id;
      this.props.app.setState({'profile': res});
      AsyncStorage.setItem('profile', JSON.stringify(res));
      this.refs.toast.show('Saved!');
    } else {
      this.refs.toast.show('Oops!');
    }

  }

  async _loadImage() {
    var options = {
      maxWidth: 400,
      maxHeight: 400,
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
      console.log('Response = ', response);
      if (response.didCancel) {
        return;
      }
      if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        that.setState({avatarSource: { uri: response.uri }});
      }
    });
  }

  _renderPhotoChooser() {
    if (this.state.avatarSource) return null;
    return (<Icon
      opacity={0}
      backgroundColor="transparent"
      name="camera"
      size={40}
      color="#fff7"
    />);
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
    if (this.state.avatarSource)
      imageSource = this.state.avatarSource;

    return (
      <View style={{padding: 15, flex: 1}}>
        <View style={{flexDirection: 'row', marginBottom: 15}}>
          <View style={{alignItems: 'center', justifyContent: 'center',width: 100}}>
            <Image
              defaultSource={require('./default_profile_image.png')}
              source={imageSource} style={styles.profile_image} />
            <TouchableOpacity
              style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center',}}
              onPress={this._loadImage}>
              {this._renderPhotoChooser()}
            </TouchableOpacity>
          </View>
          <View style={{marginLeft: 5, flex: 1}} >
            <TextInput
              onChangeText={(text) => this.setState({name: text})}
              placeholder="Full Name"
              autoCapitalize="words"
              style={[styles.input, {fontSize: 20, height: 35}]}
              defaultValue={user.first_name + " " + user.last_name} />
            <TextInput
              onChangeText={(text) => this.setState({location: text})}
              placeholder="Location"
              autoCapitalize="words"
              style={styles.input}
              defaultValue={user.location}/>
            <TextInput
              onChangeText={(text) => this.setState({email: text})}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Email"
              style={styles.input}
              defaultValue={user.email}/>
            <TextInput
              onChangeText={(text) => this.setState({phone: text})}
              autoCapitalize="none"
              keyboardType="numeric"
              placeholder="Phone"
              style={styles.input}
              defaultValue={user.phone}/>
          </View>
        </View>
        <View style={{flexDirection: 'row',  height: 40, right: 0, justifyContent: 'space-around'}}>
          <ModalPicker
              data={[
                {label: '♀', key: false},
                {label: '♂', key: true},
              ]}
              onChange={(option)=>{ this.setState({gender:option.key})}}>

              <TextInput
                  style={{
                    width: 50,
                    height: 25,
                    fontSize: 14,
                    padding: 0,
                    color: 'black',
                  }}
                  underlineColorAndroid='transparent'
                  editable={false}
                  placeholder="Gender"
                  value={(this.state.gender === undefined || this.state.gender === null) ? "" : (this.state.gender ? '♂' : '♀')} />
          </ModalPicker>
          <DatePicker
            date={this.state.birthday}
            mode="date"
            showIcon={false}
            placeholder="Birthday"
            format="YYYY-MM-DD"
            minDate="1900-01-01"
            maxDate="2016-01-01"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            underlineColorAndroid='transparent'
            customStyles={{
              dateInput: {
                  borderWidth: 0,
                  borderColor: '#aaa',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start'
                },
            }}
            onDateChange={(date) => {this.setState({birthday: date})}}
          />
        </View>
        {this._renderTags()}
        <TouchableOpacity
          onPress={this._saveProfile.bind(this)}>
          <Text style={[styles.category, {
              marginTop: 15,
              backgroundColor: "darkred",
              color: "white",
              borderRadius: 12,
              fontWeight: "bold",
            }]}>Save Profile</Text>
        </TouchableOpacity>
        <Toast ref="toast"/>
      </View>
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
    paddingHorizontal: 10,
    paddingVertical: 3,
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
  picker: {
    height: 40,
    width: 100,
  },
  input : {
    flex: 0,
    paddingVertical: 0,
    height: 30,
    fontSize: 15,
  },
  tag_container: {
    margin: 3,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },


});
