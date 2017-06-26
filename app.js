import FirstScreen from './components/login';
import MainScreen from './components/main';
import {
  updateHeader,
  logout,
} from './components/network';
import {
  AsyncStorage,
  Alert,
} from 'react-native';

const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
} = FBSDK;


import React, { Component } from 'react';
import FCM, {
  FCMEvent,
  RemoteNotificationResult,
  WillPresentNotificationResult,
  NotificationType
} from 'react-native-fcm';

import './localization';

export default class Tolpa extends Component {

  constructor(props) {
    super(props);
    this.state = {
      profile: undefined,
    };
    AsyncStorage.multiGet(['profile', 'token'], (err, stores) => {
      if (!stores[0][1]) {
        this.setState({profile: null});
        return;
      }
      updateHeader(stores[1][1]);
      var user = JSON.parse(stores[0][1]);
      user.user_id = user._id;
      this.setState({profile: user});
      this.fcmToken = null;
    });
  }

  setFcmToken(token) {
    this.fcmToken = token;
  }
  componentDidMount() {
    FCM.requestPermissions(); // for iOS
    let that = this;
    FCM.getFCMToken().then(token => {
      that.setFcmToken(token);
    });
    this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
      // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
      if(notif.local_notification){
        //this is a local notification
      }
      if(notif.opened_from_tray){
        //app is open/resumed because user clicked banner
      }

      if(Platform.OS ==='ios'){
        //optional
        //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
        //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
        //notif._notificationType is available for iOS platfrom
        switch(notif._notificationType){
          case NotificationType.Remote:
            notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
            break;
          case NotificationType.NotificationResponse:
            notif.finish();
            break;
          case NotificationType.WillPresent:
            notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
            break;
        }
      }
    });
    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
      that.setFcmToken(token);
    });
  }

  componentWillUnmount() {
    // stop listening for events
    this.notificationListener.remove();
    this.refreshTokenListener.remove();
  }

  render() {
    if (this.state.profile === undefined) return null;
    if (this.state.profile) {
      return (<MainScreen app={this}/> );
    }
    return (<FirstScreen app={this}/>);
  }

  logout() {
    logout();
    LoginManager.logOut();
    AsyncStorage.clear((err)=> {
      this.setState({profile: null});
    });
  }

  postLogin(resp) {
    if (typeof resp === 'string') {
      Alert.alert("Oops", resp);
      return;
    }
    resp.profile.user_id = resp.profile._id;
    updateHeader(resp.token);
    AsyncStorage.setItem('profile', JSON.stringify(resp.profile));
    AsyncStorage.setItem('token', resp.token);
    this.setState({profile: resp.profile});
  }
}
