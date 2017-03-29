import React, {Component} from 'react';

import {
  Animated,
  StyleSheet,
  View,
  Platform,
  PanResponder,
} from 'react-native';
import {PRIMARY_COLOR} from "../global";


export default class MultiSlider extends Component {

  updateValues() {
    if (this.props.onValuesChange) {
      const k = (this.props.max-this.props.min)/this.width;
      this.props.onValuesChange([Math.trunc(this.start.x*k), Math.trunc(this.end.x*k)]);
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      pan1     : new Animated.ValueXY(),
      pan2     : new Animated.ValueXY(),
    };
    this.start = {x: 0, y: 0};
    this.end = {x: 0, y: 0};
    this.state.pan1.addListener((value) => this.start = value);
    this.state.pan2.addListener((value) => this.end = value);
    this.pan1Responder = PanResponder.create({

      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (e, gesture) => {
        if (this.start.x >= 0 && this.start.x <= this.end.x) {
          this.updateValues();
          Animated.event([null, {dx: this.state.pan1.x}])(e, gesture);
        }
        return true;
      },
      onPanResponderRelease: (e, gesture) => {
        this.start.x = Math.max(0, Math.min(this.start.x, this.end.x));
        this.state.pan1.setOffset(this.start);
        this.state.pan1.setValue({x: 0, y: 0});
      },
      onPanResponderTerminate: (evt, gestureState) => {
        this.start.x = Math.max(0, Math.min(this.start.x, this.end.x))
        this.state.pan1.setOffset(this.start);
        this.state.pan1.setValue({x: 0, y: 0});
      }
    });
    this.pan2Responder = PanResponder.create({
      onStartShouldSetPanResponder : () => true,
      onPanResponderMove: (e, gesture) => {
        if (this.end.x <= this.width && this.start.x <= this.end.x) {
          this.updateValues();
          Animated.event([null, {dx: this.state.pan2.x}])(e, gesture);
        }
      },
      onPanResponderRelease        : (e, gesture) => {
        this.end.x = Math.min(this.width, Math.max(this.start.x, this.end.x));
        this.state.pan2.setOffset(this.end);
        this.state.pan2.setValue({x: 0, y: 0});
      },
      onPanResponderTerminate: (evt, gestureState) => {
        this.end.x = Math.min(this.width, Math.max(this.start.x, this.end.x));
        this.state.pan2.setOffset(this.end);
        this.state.pan2.setValue({x: 0, y: 0});
      }
    });
  }

  render() {
    return (
      <View
        onLayout={(event) => {
          const {x, y, width, height} = event.nativeEvent.layout;
          if (this.width) return;
          this.width = width-30;
          const k = this.width/(this.props.max-this.props.min);
          this.start.x = this.props.values[0]*k;
          this.end.x = this.props.values[1]*k;
          this.state.pan1.setOffset(this.start);
          this.state.pan1.setValue({x: 0, y: 0});
          this.state.pan2.setOffset(this.end);
          this.state.pan2.setValue({x: 0, y: 0});
        }}
        style={styles.container}>
        <View style={{flex: 1, height: 1, backgroundColor: '#777'}}/>
        <View style={[
          {position: 'absolute', top: 10},
          {left: this.start.x+15},
          {width: this.end.x-this.start.x},
          {flex: 1, height: 10, backgroundColor: PRIMARY_COLOR}]} />

      <Animated.View
        {...this.pan1Responder.panHandlers}
        style={[this.state.pan1.getLayout(), styles.dragger]}/>
      <Animated.View
        {...this.pan2Responder.panHandlers}
        style={[this.state.pan2.getLayout(), styles.dragger]}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dragger: {
    position: 'absolute',
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: .5,
    backgroundColor: '#ddd',
    borderColor: '#777',
  },
  container: {
    flex: 1,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignSelf: 'stretch',
    height: 30,
    alignItems: 'center',
  },
});