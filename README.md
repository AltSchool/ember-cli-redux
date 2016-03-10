__ALPHA: API changes likely to come__

This add-on isn't ready to be used in production. It's a RFC proof-of-concept intended to further the conversation of how state is managed in Ember apps.

PRs and constructive questions and comments via [GitHub issues](https://github.com/AltSchool/ember-cli-redux/issues/new) are highly encouraged.

[Example TodoMVC App](http://matthewconstantine.github.io/ember-cli-redux-todos/) ([code](https://github.com/matthewconstantine/ember-cli-redux-todos))

# Ember-cli-redux

State management in ambitious Ember apps is difficult. This add-on provides a way to manage the state of your application in a predictable, testable way.

[Redux](http://redux.js.org/) is an evolution of [Facebook's Flux pattern](https://facebook.github.io/flux/docs/overview.html#content). It was developed for React applications but it plays well with other view libraries. It works surprisingly well with Ember. 

This project provides a Redux Store service and a Mixin for some syntactic sugar. By default, we include the popular `redux-thunk` middleware and a simple Ember-aware logger.

## Installation

* `ember install ember-cli-redux`

## Usage

In any ember object, use the reduxStore service to dispatch actions and read state. 

### Data Flow Example

First, the reducer defines an `initialState`, the starting state of your app. Then it does the work of modifying the state and returns the new state when actions are dispatched. The rest of your app updates automatically from this central state using computed properties.

```javascript
// app/reducers/index.js
import redux from 'npm:redux';

const initialState = Ember.Object.create({
  count: 0
})

export default function(emberStore = null, state = initialState, action = null) {
  switch (action.type) {
    case 'INCREMENT_COUNT':
      state.setProperties({count: state.count + 1});
      return state;

    default:
      return state;
  }
};
```

Next, The route's `incrementCount` action dispatches a Redux Action to the reducer via the reduxStore.


```javascript
// app/routes/application.js
import Ember from 'ember';
import EmberRedux from 'ember-cli-redux/mixins/ember-redux';

export default Ember.Route.extend(EmberRedux, {
  reduxStore: Ember.inject.service(),

  actions: {
    incrementCount() {
      this.dispatch({ type: 'INCREMENT_COUNT' })
    }
  }
});
```

Then, the controller provides a `state` computed property to the template.

```javascript
// app/controllers/application.js
import Ember from 'ember';

export default Ember.Controller.extend({
  reduxStore: Ember.inject.service(),
  state: Ember.computed.alias('reduxStore.state')
});
```

Finally, the template renders the state and fires an Ember action on click. The Ember action dispatches an `INCREMENT_COUNT` action, the reducer receives the action, updates the state and Ember rerenders the template.

```handlebars
{{!-- app/templates/application.hbs --}}
<h1>Current count: {{state.count}}</h1>
<button {{action "incrementCount"}}>Increment</button>
```
 

## Core concepts

Redux introduces a few new concepts. Don't worry, the learning curve is a breeze compared to Ember.

### State

Instead of storing your state across your app in controllers, routes and components, store it in a single nested data structure.

Now, you have a single place to look for problems related to state. No longer do you have to hunt through your application to figure out which place your state went awry.

The only way to change that state is by dispatching a Redux Action to a Reducer. More on that next.

### Redux Actions

Redux Actions describe the fact that something happened. They are simple atomic objects that contain a `type` and an optional payload. Here are some examples:

```javascript
{
  type: FETCH_TODOS
}
{
  type: EDIT_TODO,
  todo: todo,
  title: 'Fly to mars'
}
{
  type: TOGGLE_COMPLETED,
  todo: todo
}
```

You'll notice that actions are just plain javascript objects. They contain just enough information for the Reducer to change the state.

You often will dispatch Redux actions from your Ember actions:

```javascript
actions: {
  editTodo(todo) {
    this.dispatch({
      type: EDIT_TODO,
      todo
    })
  }
}
``` 

Asynchronous actions are similarly easy to deal with. Here, we dispatch an action from a route's model hook:

```javascript
model() => {
  this.dispatch({type: 'REQUEST_TODOS'});
  return this.store.findAll('todo').then((todos) => {
    this.dispatch({
      type: 'RECEIVE_TODOS',
      todos
    });
}
```

Actions describe what happened and `dispatch` to passes them onto Reducers.

[More on Actions.](http://redux.js.org/docs/basics/Actions.html)


### Reducer

The Reducer's job is to specify how an application's state changes in response to an action.

> For now, just remember that the reducer must be pure. Given the same arguments, it should calculate the next state and return it. No surprises. No side effects. No API calls. No mutations. Just a calculation.

Global state could easily become unmanageable so Ember CLI Redux keeps it read-only. The only thing that may change the state is a Reducer. A reducer looks something like this:

```javascript
  function todo(state = initialState, action = null) {
    switch (action.type) {
      case 'UPDATE_TODO':
        action.todo.set('title', action.title); // side effect
        action.todo.save(); // side effect
        state.setProperties({editingTodo: null});
        return state;
```

So, about those side effects: Because of Ember's computed properties, we unfortunately create side-effects. However the intent is clear. The reducer takes an action and modifies the state. If we can't have truly immutable state objects in Ember, we can at least limit the mutations to a single testable place.

Redux provides a helpful `combineReducers` function which simply chains reducers together. It expects a State shape like:

```javascript
  import redux from 'npm:redux';
  const { combineReducers } = redux;

  import auth from './session';
  import todoLists from './todo-lists';
  import todo from './todo';

  export default combineReducers({
    // Add additional reducers here in order of data dependency.
    session,
    todoLists,
    todo
  });

```

It expects a state where the top level keys match the reducer names. Upon dispatch, the reducers run in order responding to the actions. Because the state tree is guaranteed to be in a stable state after each dispatch, this strict order makes it easier to handle asynchronous apps since each child reducer is guaranteed the results from previous ones. 

```
   const initialState= {
     session,
     todoLists,
     todo
   }
```

[More on Reducers.](http://redux.js.org/docs/basics/Reducers.html)

### Middleware

By dispatching actions to a Reducer, we have a chance of action on those actions. That's where middleware comes in. It provides a single extensible interface for adding cross-cutting capabilites to your app. It's perfect for logging, crash reporting, managing asynchronous actions. Here's a [long list of middlewares](https://github.com/xgrommx/awesome-redux#react---a-javascript-library-for-building-user-interfaces). By default Ember CLI Redux provides the popular [redux-thunk](https://github.com/gaearon/redux-thunk) middleware and a simple Ember aware logger.

#### Customizing Middleware

To customize or add your own middleware, extend the reduxStore like this:

```javascript
// app/services/redux-store.js
import ReduxStore from 'ember-cli-redux/services/redux-store';
import reducer from '../reducers/index';
import emberLoggerMiddleware from 'ember-cli-redux/lib/ember-logger-middleware';

const logger = emberLoggerMiddleware({
  enabled: true
});

export default ReduxStore.extend({
  reducer,

  middleware: [logger],
});
```

Adding your own middleware is straightforward:
```javascript
const customLogger = (/* store */) => next => action => {
  console.log(`Hey! The action is ${action.type}`, action);
  return next(action);
};
```

[More on Middleware.](http://redux.js.org/docs/advanced/Middleware.html)

That's it for the core concepts. State, Actions, Reducers and Middleware. 

## The problems Redux alleviates in Ember Apps

### Routes are heavy

Routes in Ember apps routes tend to hold a lot of logic. They're responsible for fetching data, setting up controllers, managing url parameters and performing common-ancestor duties. 

They're responsible for pausing transitions while data loads. They're the only place you can choose which data is required for render and which can be loaded afterwards.

Because of that, they are tightly coupled to your view. If you need a sidebar to load before your app body, you need to nest a route. Got that wrong? You'll need to re-architect your route structure and likely a handful of files that go along with it.

Redux can help. It moves the heavy lifting to new Reducer layer. Multiple routes can dispatch redux actions to the Reducer. That puts your routes on a diet making them easier to deal with. 

If your app has routes that perform similar actions, Redux is a natural fit. Say you have an `/items` route and a `/admin/items` route. Rather than relying on mixins or inheritance, just create two routes that dispatch the same actions. The admin action can dispatch additional actions.

### Ember State is Everywhere

Say you wanted to save the state of your Ember app, as it is at any given moment. How would you do it? 

Keep in mind, we want to restore **everything** as it was, which data was loaded, which items were selected, which views were toggled, what the user had started to type, etc. How would you do it? You would find state stored in different controllers, components and routes - any place you used `this.set()` or `controller.set()`. Gathering up this state would prove enormously difficult. Implementing app-wide feature like Undo and Redo would prove daunting. As would sending error reports with the exact state a user sees and a ledger of actions leading to it.

Redux helps by centralizing the state and all the ways it can be transformed. After each dispatch your app is guaranteed to be in a stable serializable state. You can log all the transformations and replay them elsewhere. Undo and Redo becomes fun to implement. 

### Debugging Ember Apps is hard

A typical lage-scale Ember app has state distributed across the app. Add to that asynchronous events that modify that state. Throw in a handful of mixins, injected dependencies, long computed property chains and data passed through deep layers of routes and components. Soon it becomes difficult to know the facts about what happened in your app, when it happened, and what changed as a result.

By increasing the rigor around actions and state we reduce the number of places you need to look for problems.

Debugging an Ember app with Redux becomes much easier:

1. Did your route, controller or component dispatch a Redux Action? If not, why not?
2. Did your reducer modify the state properly? If not, why not? And by the way, here's a log of the exact state before and after the action fired.

# Anticipated Questions

### Is this ready to be used in production?

No. Expect some breaking API changes as we work through more use cases.

### Is this enormous?

Redux is a tiny (About 2kB) and provides a pattern that Ember apps could really benefit from. The API is similarly tiny.  If you've struggled to learn the depth of EmberData you'll find this to be a breeze in comparison.

### Does this replace Ember Data?

This plays well with Ember Data. It provides a top-level state tree. You're free to add any kind of data to that tree. This alpha version includes a logger which will deserialize your ember models for easier debugging. 

### How is this different than the EmberData Store?

The EmberData store only holds Ember Models. The rest of your application's state has to be captured elsewhere. This includes lists of models that are loaded from the Ember Store. Without centralized state you're on your own to find appropriate places across your app to store that state. 

With Redux, you keep your state in one place and let EmberData do what it does best, fetch and cache Ember models. 

### I've heard Globals are evil, how is this different?

The Redux store can't be changed at-will by your app. It's only modified by Reducers which in turn can only take Redux Actions (simple objects like `{type: CREATE_ITEM, title: 'Foo'}`). This means the state can only change in predictable, easy-to-test ways. Furthermore, logging reveals exactly what changed and when.

### Does this require major all-or-nothing changes to my Ember app?

Remarkably, no. You can ease a complex Ember app into using Redux. However, the more of your app you transition the more you benefit. If you plan to use a time-traveling-debugger, or error reports that include the full application state, you'll need to transition more of your application state to Redux.

### How are Redux Actions and Ember Actions different?

Ember Actions modify the application state directly. Redux Actions are a simple data format with a `type` and optional payload. You use `store.dispatch` to send the action to the Reducer. The Reducer does the work of changing the application state. Your UI then observes the state and gets the changes in real-time. 

You use them by simply dispatch a payload to a Reducer which updates the Redux State. In most cases you can replace your Ember actions with calls to `this.dispatch`.

### Do I need this?

If your app has little or no state, then probably not. If your application state is well-represented and easy to debug, then maybe not. If your routes cleanly match your UI, with no need for mixins then move on. In other words, if your app matches the happy-path laid out for you by Ember then you might find less benefit to using this.

You might need this if:
 
* You use `controller.set` in more than a couple places in your app.
* If your routing and view layer seem too tightly-coupled. 
* Changes to the UI's layout require excessive churn in your codebase.
* You have long computed-property chains that reach up the routing hierarchy.
* Error reports from your production environments are hard to reproduce. Especially when race conditions are involved.
* You find it difficult to specify what promises should and shouldn't pause your route transitions.

### What might this lead to?

Centralized state is key for features like [time traveling debugging](https://github.com/gaearon/redux-devtools) and [hot module replacement](https://webpack.github.io/docs/hot-module-replacement.html), two technologies that can dramatically improve the development experience. If we can build a reasonable pattern for managing and serializing state in Ember, we'll have a foundation for some pretty useful tech.

## Running Tests

* `ember test`
* `ember test --server`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).


