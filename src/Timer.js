import React, { Component } from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';
import TimerMixin from 'react-timer-mixin';

export default class Timer extends Component {
  static propTypes = {
    interval: PropTypes.number, // msec
    remaining: PropTypes.number.isRequired, // msec
    afterTick: PropTypes.func, // callback after each ticks
    afterComplete: PropTypes.func, // callback after remaining <= 0
    style: stylePropType, // container style object
    children: PropTypes.node, // children react element node
  }

  static defaultProps = {
    interval: 1000,
    afterTick: null,
    afterComplete: null,
    style: {},
    children: null,
  }

  static childContextTypes = {
    remaining: PropTypes.number,
  }

  state = {
    remaining: this.props.remaining,
    timerId: TimerMixin.setInterval(this.handleTick.bind(this), this.props.interval),
    prevTime: (new Date()).getTime(),
  }

  getChildContext() {
    return { remaining: this.state.remaining };
  }

  componentWillUnmount() {
    TimerMixin.clearTimeout(this.state.timerId);
  }

  handleTick() {
    const currentTime = (new Date()).getTime();
    const elapsed = currentTime - this.state.prevTime;
    const nextRemaining = this.state.remaining - elapsed;
    if (nextRemaining <= 0) {
      TimerMixin.clearTimeout(this.state.timerId);
      if (this.props.afterComplete !== null) {
        this.props.afterComplete();
      }
      this.setState({
        remaining: 0, timerId: null, prevTime: null,
      });
    } else {
      this.setState({
        ...this.state, remaining: nextRemaining, prevTime: currentTime,
      });
      if (this.props.afterTick !== null) {
        this.props.afterTick(nextRemaining);
      }
    }
  }

  render() {
    const { style, children } = this.props;
    return <div style={style}>{children}</div>;
  }
}
