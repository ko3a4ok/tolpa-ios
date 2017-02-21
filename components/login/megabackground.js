import LinearGradient from 'react-native-linear-gradient';
import React, { Component } from 'react';

import {
  View,
  Animated,
  StyleSheet,
} from 'react-native';


const PERIOD = 2000;
class BGLinearLayout extends Component {

  constructor(): void {
    super();
    this.state = {
      animatedStartValue: new Animated.Value(0)
    };
  }

  cycleAnimation(d) {
    Animated.sequence([
      Animated.timing(this.state.animatedStartValue, {
        delay: d,
        fromValue:0,
        toValue: 1,
        duration: PERIOD,
      }),
      Animated.timing(this.state.animatedStartValue, {
        toValue: 0,
        duration: PERIOD,
      })
    ]).start(() => this.cycleAnimation(PERIOD*2));
  }

  componentDidMount() {
      this.cycleAnimation(this.props.delay*PERIOD);
  }

  render() {
    return (
      <Animated.View style={[styles.linearGradient, {opacity: this.state.animatedStartValue}]}>
        <LinearGradient
          start={this.props.start}
          start={this.props.end}
          colors={this.props.colors}
          style={styles.linearGradient} />
      </Animated.View>
  );
  }

}

export default class MegaBackground extends Component {
  render() {
    return (
      <View style={this.props.style}>
        <LinearGradient delay={0} colors={['#614385', '#516395']} style={styles.linearGradient} />
        <BGLinearLayout delay={1} colors={['#5f2c82', '#49a09d']} start={{x: 0.0, y: 0.0}} end={{x: -1, y: 0}}/>
        <BGLinearLayout delay={2} colors={['#4776E6', '#8E54E9']} start={{x: 0.0, y: 0.0}} end={{x: 0, y: 1}}/>
        <BGLinearLayout delay={3} colors={['#7141e2', '#d46cb3']} start={{x: 0.0, y: 0.0}} end={{x: 1, y: 0}}/>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  linearGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
