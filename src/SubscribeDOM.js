/**
 * Created by tdzl2003 on 12/17/16.
 */

import React, { PropTypes } from 'react';

export default class SubscribeDOM extends React.Component {
  static propTypes = {
    children: PropTypes.element,
    target: PropTypes.object,
    eventName: PropTypes.string,
    listener: PropTypes.func,
  };
  componentWillMount() {
    this.subscribe(this.props);
  }
  componentWillReceiveProps(newProps) {
    if (newProps.target !== this.props.target || newProps.eventName !== this.props.eventName) {
      this.unsubscribe();
      this.subscribe(newProps);
    }
  }
  shouldComponentUpdate(newProps) {
    return newProps.children !== this.props.children;
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  onEvent = ev => {
    const { listener } = this.props;
    listener(ev);
  };
  subscribe(props) {
    props.target.addEventListener(props.eventName, this.onEvent);
    this.subscription = ()=> {
      props.target.removeEventListener(props.eventName, this.onEvent);
    }
  }
  unsubscribe() {
    this.subscription();
    this.subscription = null;
  }
  render() {
    return this.props.children || null;
  }
}