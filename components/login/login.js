import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Navigator,
} from 'react-native';
import Toast from 'react-native-easy-toast'

import {
  checkEmail,
  loginWithEmail,
  signUp,
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
    this.setState({invalid: !re.test(email)});
  }

  async checkUserEmail(email) {
    if (this.state.invalid) {
      this.refs.toast.show('Invalid Email!');
      return;
    }
    this.setState({loading: true});
    var resp = await checkEmail(email);
    this.setState({loading: false, registered: resp});
  }

  signInBlock() {
    if (this.state.registered) {
      return (<Button
        disabled={this.state.invalid || !this.state.email}
        onPress={() => this.signIn()}
        title="Sign In"
        style={styles.input}/>);
    }
    return null;
  }

  async _onSignIn() {
    return await loginWithEmail(this.state.email, this.state.password);
  }

  async _onSignUp() {
    if (this.state.password != this.state.conf_password) {
      this.refs.toast.show('Passwords are not matched!');
      return;
    }
    if (!this.state.full_name) {
      this.refs.toast.show("Name can't be empty!");
      return;
    }

    var first_name = this.state.full_name;
    var last_name = '';
    var sp = this.state.full_name.indexOf(' ');
    if (sp != -1) {
      first_name = this.state.full_name.substring(0, sp);
      last_name = this.state.full_name.substring(1 + sp);
    }

    return await signUp(this.state.email, this.state.password, first_name, last_name);

  }
  async _onSign(signIn) {
    if (this.state.invalid) {
      this.refs.toast.show('Invalid Email!');
      return;
    }

    if (this.state.password.length < 6) {
      this.refs.toast.show('Password is too short!');
      return;
    }
    this.setState({loading: true});
    if (signIn)
      resp = await this._onSignIn();
    else
      resp = await this._onSignUp();
    if (resp)
      this.props.app.postLogin(resp);
    this.setState({loading: false});
  }
  signUpBlock() {
    if (!this.state.registered) {
      return (
         <View>
          <TextInput
            secureTextEntry={true}
            onChangeText={conf_password => this.setState({conf_password})}
            placeholder="Confirm Password" style={styles.input}/>
          <TextInput
            autoCapitalize="words"
            onChangeText={full_name => this.setState({full_name})}
            placeholder="Full Name" style={styles.input}/>
        </View>
      );
    }
    return null;
  }

  renderButton() {
    if (this.state.loading)
      return (
        <ActivityIndicator
          size="large"
          color="gold"
          style={{paddingTop: 10}}/>
      );
    var signIn = this.state.registered;
    return (
      <View>
        <Button
          disabled={this.state.invalid || !this.state.email}
          onPress={()=>this._onSign(signIn)}
          title={"Sign " + (signIn ? "In" : "Up")} style={styles.input}/>
      </View>
    );

  }
  render() {
    return (
      <View style={{ flex:1, top: 50, padding: 20}}>
        <TextInput
          ref="email"
          keyboardType="email-address"
          value={this.state.email}
          autoCapitalize="none"
          placeholder="Email"
          returnKeyType="next"
          style={[styles.input, {backgroundColor: this.state.invalid ? '#fff0f0' : 'transparent'}]}
          onChangeText={email => this.setState({email})}
          onEndEditing={(event) => this.checkUserEmail(event.nativeEvent.text)}
          onChange={(event) => this.validateEmail(event.nativeEvent.text)}
        />
        <TextInput
          value={this.state.password}
          ref="password"
          returnKeyType="next"
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={password => this.setState({password})}
          style={styles.input}
        />
        {this.signUpBlock()}
        {this.renderButton()}
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
