import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
} from 'react-native';

import MapView from 'react-native-maps';

import {
  findEventsNear
} from '../network';


export default class ExploreMapView extends Component {
  constructor(props) {
    super(props);
    this.onRegionChange = this.onRegionChange.bind(this);
    this.state = {
      region: {
        latitude: 50.45,
        longitude: 30.5234,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      markers : [

      ]
    }
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        position.coords.latitudeDelta = 0.0922;
        position.coords.longitudeDelta = 0.0421;
        this.setState({
          region: position.coords,
        });
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  async onRegionChange(region) {
    var res = await findEventsNear(region.latitude, region.longitude);

    this.setState({
      markers: res,
      region: region,
    });
  }


  render() {
    return (
      <MapView
        style={{flex: 1}}
        region={this.state.region}
        showsUserLocation={true}
        onRegionChangeComplete={this.onRegionChange}
      >
      {this.state.markers.map(event => (
        <MapView.Marker
          key={event.id}
          coordinate={{
            latitude: event.place[1],
            longitude: event.place[0],
          }}
          title={event.name}
          description={event.description}
        >
        <MapView.Callout tooltip style={styles.callout}>
            <View style={[styles.calloutContainer]}>
                <TouchableHighlight onPress={() => {
                    this.props.navigator.push({index: 2, data: event});
                  }} underlayColor='transparent'>
                    <View style={styles.bubble}>
                        <View style={styles.amount}>
                            <Text style={styles.calloutHeaderText} numberOfLines={1} ellipsizeMode={'tail'}>{event.name}</Text>
                            <Text style={styles.calloutDescriptionText}>{event.description}</Text>
                        </View>
                    </View>
                </TouchableHighlight>
                <View style={styles.arrowBorder} />
                <View style={styles.arrow} />
            </View>
        </MapView.Callout>

        </MapView.Marker>
      ))}
      </MapView>
    );
  }
}


const styles = StyleSheet.create({
  callout: {
      width: 140,
      height: 100,
  },
  calloutContainer: {
      flexDirection: 'column',
      alignSelf: 'flex-start',
  },
  calloutHeaderText: {
      fontSize: 18,
  },
  calloutDescriptionText: {

  },
  amount: {
        flex: 1,
  },
  arrow: {
      backgroundColor: 'transparent',
      borderWidth: 16,
      borderColor: 'transparent',
      borderTopColor: 'white',
      alignSelf: 'center',
      marginTop: -32,
  },
  arrowBorder: {
      backgroundColor: 'transparent',
      borderWidth: 16,
      borderColor: 'transparent',
      borderTopColor: 'white',
      alignSelf: 'center',
      marginTop: -0.5,
  },
  bubble: {
      width: 300,
      flexDirection: 'row',
      alignSelf: 'center',
      backgroundColor: 'white',
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderRadius: 6,
      borderColor: 'white',
      borderWidth: 0.5,
      marginTop: 32,
  },
});
