/**
 * Created by DengYun on 2017/6/21.
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class Fetch extends PureComponent {
  static propTypes = {
    url: PropTypes.string,
    options: PropTypes.shape({
      method: PropTypes.string,
    }),
    doFetch: PropTypes.func,
    type: PropTypes.oneOf(['text', 'json', 'blob']).isRequired,
  };

  static defaultProps = {
    type: 'json',
    options: {
      credentials: 'same-origin'
    },
  };

  static childPropTypes = {
    loading: PropTypes.bool,
    data: PropTypes.object,
    error: PropTypes.instanceOf(Error),
  };

  state = {
    loading: true,
    statusCode: null,
    data: null,
    error: null,
  };

  componentDidMount() {
    this.doFetch(this.props);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.url !== this.props.url || newProps.type !== this.props.type) {
      this.doFetch(newProps);
    }
  }

  componentWillUnmount() {
    this.fetching = null;
  }

  reload = () => {
    this.doFetch(this.props);
  };

  doFetch({url, options, type, doFetch}) {
    let promise;
    this.setState({
      loading: true,
    });
    promise = (doFetch ? doFetch(url, status => {
      this.setState({
        statusCode: resp.status,
      });
    }) : fetch(url, options).then(resp => {
      this.setState({
        statusCode: resp.status,
      });
      return resp[type]();
    }))
      .then(data => {
        this.setState({
          loading: false,
          data,
          error: null,
        });
      }, error => {
        if (promise === this.fetching) {
          this.setState({
            loading: false,
            data: null,
            error,
          });
        }
      });
    this.fetching = promise;
  }

  render() {
    const { children } = this.props;
    return React.cloneElement(children, {
      ...this.state,
      reload: this.reload,
    });
  }
}
