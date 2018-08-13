# Subscribe event in react style

Feel tired about `componentDidMount` and `componentWillUnmount` pair to subscribe and unsubscribe events?
This module will help.

Feel tired about `componentDidMount` and `componentWillReceiveProps` and write a `fetchData` method and deal with reentry issue and 'warning: setState after componentDidUnmount''?
This module will help.

Helpful for both react and react-native.

## Installation

Just npm it:

```bash
npm install react-subscribe --save
```

## API

### Subscribe

Use together with [fbemitter](https://npmjs.com/package/fbemitter) like event emitters.
Emitter should have a `addListener` method, which return a subscription object.
Call `remove` method of subscription object will do unsubscribe.

Now you can subscribe event like this:

```js
import {Subscribe} from 'react-subscribe';
import someEmitter from '../someModule';

class MyCleanComponent extends React.Component {
  state = {
    listening = true,

    target = someEmitter,
    eventName = 'eventName',
  }
  onEvent = ev => {
  };
  render() {
    return (
      <div>
        {/* This will render nothing: */}
        <Subscribe target={someEmitter} eventName="eventName" listener={this.onEvent} />

        {/* You can subscribe many event here. */}
        <Subscribe target={someEmitter} eventName="otherEvent" listener={this.onEvent} />

        {/* You can subscribe with a condition. */}
        {/* It will subscribe/unsubscribe when condition changes and this component re-renders. */}
        {this.state.listening && <Subscribe target={someEmitter} eventName="eventName" listener={this.onEvent} />}

        {/* You can use expression for target & eventName and change it after re-render.*/}
        {/* This will safely unsubscribe old target/eventName and resubscribe the new one(s).*/}
        <Subscribe target={this.state.target} eventName={this.state.eventName} listener={this.onEvent} />
      </div>
    );
  }
}
```

Subscribe will automatic begin when after component mount and automatic unsubscribe before component unmount.

In the case when your component renders a component that should not have any children or have special meaning with children (like TabBar from react-native),
you should use Subscribe in this form:

```js
class MyCleanComponent extends React.Component {
  onEvent = ev => {
  };
  render() {
    // This component will render only a <input />
    return (
      <Subscribe target={someEmitter}, eventName="eventName" listener={this.onEvent}>
          <input />
      </Subscribe>
    );
  }
}
```

If you use react 16+, you also can use React.Fragment instead:

```js
class MyCleanComponent extends React.Component {
  onEvent = ev => {
  };
  render() {
    // This component will render only a <input />
    return (
      <React.Fragment>
        <input />
        <Subscribe target={someEmitter}, eventName="eventName" listener={this.onEvent} />
      </React.Fragment>
    );
  }
}
```

### SubscribeDOM

Use `SubscribeDOM` instead of Subscribe when subscribing a DOM Event.

```js
class MyCleanComponent extends React.Component {
  onBodyWheel = ev => {
    // Move indicates when document scrolls.
    const val = document.body.scrollTop / document.body.offsetHeight;
    this.refs.active.style.top = val * 20 + 'px';
  };
  return() {
    return (
      <div>
        {/* Other body components */}
        <SubscribeDOM
          target={document}
          eventName="scroll"
          listener={this.onBodyWheel}
        />
        <div ref="active" className={classnames(styles.dot, styles.active)} />
      </div>
    );
  }
}
```

### Timer

Use `Timer` instead of `setInterval` and `clearInterval`.

```js
import { Timer } from 'react-subscribe';

class CooldownButton extends React.Component {
  state = {
    cd: 60,
  };
  onTimer = () => {
    this.setState({ cd: this.state.cd - 1 });
  };
  return() {
    if (this.state.cd <= 0) {
      return <div>Cooldown is over and onTimer will not be called again!</div>;
    }
    return (
      <div>
        <Timer interval={1000} onTimer={this.onTimer} />
        There is still {this.state.cd} seconds to go.
      </div>
    );
  }
}
```

> Note: If you change interval value, the timer will be reset.

> eg: You have a timer which interval is 60 seconds, and you click a button after 30 second which changes interval into 40 seconds,
> The next event will be fired 40 seconds later (totally 70 seconds after your component mounted) which may let user feel weired.

### Fetch

Use `Fetch` instead of `fetch` or promise. Fetch will auto reload when `url` or `type` changes.

```js
function SomeComponent({ data, loading, error, reload, statusCode }) {
  if (loading) {
    return <div>loading...</div>;
  }
  if (error) {
    return (
      <div>
        Error: {error.message}{' '}
        <a href="#" onClick={reload}>
          Reload
        </a>
      </div>
    );
  }
  return (
    <div>
      <p>Status Code: {statusCode}</p>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
}

const FETCH_OPTION = {
  method: 'POST',
  headers: {
    'X-AccessToken': 'some_token',
  },
  credentials: 'include', // Default credentials is 'same-origin' in `Fetch`
};

export default function SomePage(props) {
  const { id } = props;
  return (
    <div>
      <Fetch url={`/some/api/${id}`} type="json" option={FETCH_OPTION}>
        <SomeComponent />
      </Fetch>
    </div>
  );
}
```

Use 'doFetch' props to provide a custom async function.

```js
async function customRequest(url) {
  return 'Hello, world!';
}

export default function SomePage(props) {
  return (
    <div>
      <Fetch doFetch={customRequest} url="foo">
        <SomeComponent />
      </Fetch>
    </div>
  );
}
```

Maybe you want use [Axios](https://npmjs.com/package/axios) instead of fetch, I suggest you to use axios status/error management:

```js
function SomeComponent({ data, loading, error, reload }) {
  if (loading) {
    return <div>loading...</div>;
  }
  if (error) {
    return (
      <div>
        <p>Error: {error.message} </p>
        <p>StatusCode: {error.response.status}</p>
        <p>{JSON.stringify(error.response.data)}</p>
        <a href="#" onClick={reload}>
          Reload
        </a>
      </div>
    );
  }
  return (
    <div>
      <p>Status Code: {data.status}</p>
      <p>{JSON.stringify(data.data)}</p>
    </div>
  );
}

export default class SomePage extends React.Component {
  render() {
    <div>
      <Fetch doFetch={Axios.get} url="foo">
        <SomeComponent />
      </Fetch>
    </div>;
  }
}
```
