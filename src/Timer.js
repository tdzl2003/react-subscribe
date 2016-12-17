/**
 * Created by tdzl2003 on 12/17/16.
 */

import React, {Component} from 'react';

export default class Timer extends Component {
  componentWillMount() {
    const {interval} = this.props;
    this.timer = setInterval(this.onEvent, interval);
  }
  componentWillReceiveProps(newProps) {
    if (newProps.interval !== this.props.interval) {
      clearInterval(this.timer);
      this.timer = setInterval(this.onEvent, newProps.interval);
    }
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  onEvent = ev => {
    const { onTimer } = this.props;
    onTimer(ev);
  };
  render(){
    return this.props.children || null;
  }
}
