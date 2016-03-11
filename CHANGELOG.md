# Ember CLI Redux Changelog

#### v0.2.0
* [Breaking Change] We no longer provide the EmberStore to your reducers. This was originally intended as a way to support actions from code unaware of Ember Data. However, it proved to complicate testing quite a bit. If you need access to the store, pass it in using an action. When updating your reducer, simply remove the first `emberStore` parameter.

```javascript
// Before
export default function todo(emberStore, state = initialState, action = null) {
  switch (action.type) {
  /* ... */
  }
}

// After
export default function todo(state = initialState, action = null) {
  switch (action.type) {
  /* ... */
  }
}
```

* [Improvement] ember-cli-redux modules are now namespaced.
```javascript
// Before
import EmberRedux from '../mixins/ember-redux';

// After
import EmberRedux from 'ember-cli-redux/mixins/ember-redux'
```

* [Improvement] The ReduxStore Mixin's `state` property is now a Read Only computed property. This helps ensure that the only changing the state tree is the reducer. 
* [Improvement] The ReduxStore is now configurable. You can add specify your own middleware.
* [Improvement] Along with the configurable stores, the Ember logger now takes an `enabled` option to make it easy to disable on production.
* [Fix] Add-on now sets `isDevelopingAddon` to true only when it is npm-linked.

## v0.1.0

* The redux-store service now passes the Ember Data store into the root reducer. This makes it so actions can be dispatched from anywhere without an instance of the Ember store.
