# Subscribe event in react style

Feel tired about `componentWillMount` and `componentWillUnmount` pair to subscribe and unsubscribe events?
This module will help.

Both helpful for react and react-native.

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

### SubscribeDOM

Use `SubscribeDOM` instead of Subscribe when subscribing a DOM Event.

```js
class MyCleanComponent extends React.Component {
    onBodyWheel = ev => {
        // Move indicates when document scrolls.
        const val = document.body.scrollTop / document.body.offsetHeight;
        this.refs.active.style.top = val * 20 + 'px';
    };
    return () {
        return (
            <div>
                {/* Other body components */}
                <SubscribeDOM target={document} eventName="scroll" listener={this.onBodyWheel}/>
                <div ref="active" className={classnames(styles.dot, styles.active)}></div>
            </div>
        )
    }
}
```

### Timer

Use `Timer` instead of `setInterval` and `clearInterval`. 

```js
import {Timer} from 'react-subscribe';

class CooldownButton extends React.Component {
    state = {
        cd: 60,
    };
    onTimer = () => {
        this.setState({cd: this.state.cd - 1});
    };
    return () {
        if (this.state.cd <= 0) {
            return (
                <div>
                    Cooldown is over and onTimer will not be called again!
                </div>
            );
        }
        return (
            <div>
                <Timer interval={1000} onTimer={this.onTimer} />
                There is still {this.state.cd} seconds to go.
            </div>
        );
    }
};
```

> Note: If you change interval value, the timer will be reset. 

> eg: You have a timer which interval is 60 seconds, and you click a button after 30 second which changes interval into 40 seconds,
> The next event will be fired 40 seconds later (totally 70 seconds after your component mounted) which may let user feel weired.

## module-loader

You can use [babel-plugin-import](https://npmjs.com/package/babel-plugin-import) to reduce code size.

```json
{
    "plugins": [
        ["import", "react-subscribe"]
    ]
}
```

This will remove components that you didn't use.