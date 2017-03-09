import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Navigator,
} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast'

import {
  checkEmail,
  loginWithEmail,
  updateHeader,
} from '../network' ;



export default class LoginScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      registered: true,
      invalid: false,
      email: '',
      password: '',
    };
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.state.invalid = !re.test(email);
    this.setState(this.state);
  }

  async checkUserEmail(email) {
    if (this.state.invalid) {
      this.refs.toast.show('Invalid Email!');
      return;
    }
    var resp = await checkEmail(email);
    this.setState({registered: resp});
  }


  async signIn() {
    if (this.state.invalid) {
      this.refs.toast.show('Invalid Email!');
      return;
    }

    if (this.state.password.length < 6) {
      this.refs.toast.show('Password is too short!');
      return;
    }
    var resp = await loginWithEmail(this.state.email, this.state.password);
    if (typeof resp === 'string') {
      this.refs.toast.show(resp);
      return;
    }
    resp.profile.user_id = resp.profile._id;
    updateHeader(resp.token);
    AsyncStorage.setItem('profile', JSON.stringify(resp.profile));
    AsyncStorage.setItem('token', resp.token);
    this.props.app.setState({profile: resp.profile});
  }

  signInBlock() {
    if (this.state.registered) {
      return (<Button
        onPress={() => this.signIn()}
        title="Sign In"
        style={styles.input}/>);
    }
    return null;
  }

  signUpBlock() {
    if (!this.state.registered) {
      return (
        <View>
          <TextInput placeholder="Confirm Password" style={styles.input}/>
          <TextInput placeholder="Full Name" style={styles.input}/>
          <Button title="Sign Up" style={styles.input}/>
        </View>
      );
    }
    return null;
  }
  render() {
    return (
      <View style={{backgroundColor: 'white', flex:1, top: 50, padding: 20}}>
        <TextInput
          ref="email"
          value={this.state.email}
          autoCapitalize="none"
          placeholder="Email"
          style={[styles.input, {backgroundColor: this.state.invalid ? '#fff0f0' : 'transparent'}]}
          onChangeText={email => this.setState({email})}
          onEndEditing={(event) => this.checkUserEmail(event.nativeEvent.text)}
          onChange={(event) => this.validateEmail(event.nativeEvent.text)}
        />
        <TextInput
          value={this.state.password}
          ref="password"
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={password => this.setState({password})}
          style={styles.input}
        />
        {this.signInBlock()}
        {this.signUpBlock()}
        <Toast ref="toast"/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    padding: 5,
    borderRadius: 10,
  },
});
