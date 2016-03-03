import Ember from 'ember';
import redux from 'npm:redux';
import thunk from 'npm:redux-thunk';
import deserializeFromEmber from '../lib/deserialize-from-ember';
import emberLoggerMiddleware from '../lib/ember-logger-middleware';

const { createStore, applyMiddleware } = redux;
import reducer from '../reducers/index';

const createStoreWithMiddleware = applyMiddleware(
  thunk,
  emberLoggerMiddleware
)(createStore);

export default Ember.Service.extend({
  state: Ember.computed.readOnly('_state'),

  init() {
    this._store = createStoreWithMiddleware(reducer);

    this._store.subscribe(() => {
      this.set('_state', this._store.getState());
      this.notifyPropertyChange('_state');
    });

    this.set('_state', this._store.getState());
  },

  stateString: Ember.computed('state', function() {
    return JSON.stringify(deserializeFromEmber(this.get('state')));
  }),

  dispatch(action) {
    this._store.dispatch(action);
  }
});
