/**
 * Created by tdzl2003 on 12/17/16.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class SubscribeDOM extends React.Component {
  static propTypes = {
    children: PropTypes.element,
    target: PropTypes.object,
    eventName: PropTypes.string,
    listener: PropTypes.func,
  };
  componentDidMount() {
    this.subscribe();
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.target !== this.props.target ||
      prevProps.eventName !== this.props.eventName
    ) {
      this.unsubscribe();
      this.subscribe();
    }
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  onEvent = ev => {
    const { listener } = this.props;
    listener(ev);
  };
  subscribe() {
    const { target, eventName } = this.props;
    target.addEventListener(eventName, this.onEvent);
    this.subscription = () => {
      target.removeEventListener(eventName, this.onEvent);
    };
  }
  unsubscribe() {
    this.subscription();
    this.subscription = null;
  }
  render() {
    return this.props.children || null;
  }
}
