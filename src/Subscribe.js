/**
 * Created by tdzl2003 on 12/17/16.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Subscribe extends Component {
  static propTypes = {
    children: PropTypes.element,
    target: PropTypes.object,
    eventName: PropTypes.string,
    listener: PropTypes.func,
  };
  subscription = null;

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
    this.subscription = target.addListener(eventName, this.onEvent);
  }
  unsubscribe() {
    this.subscription.remove();
    this.subscription = null;
  }
  render() {
    return this.props.children || null;
  }
}
