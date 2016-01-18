import Ember from 'ember';
import redux from 'npm:redux';
import thunk from 'npm:redux-thunk';
import deserializeFromEmber from '../lib/deserialize-from-ember';
import emberLoggerMiddleware from '../lib/ember-logger-middleware';

const { createStore, applyMiddleware } = redux;
import reducer from '../reducers/index';

const { inject: { service } } = Ember;

const createStoreWithMiddleware = applyMiddleware(
  thunk,
  emberLoggerMiddleware
)(createStore);

export default Ember.Service.extend({
  store: service(),
  
  init() {
    this._store = createStoreWithMiddleware(reducer(this.get('store')));

    this._store.subscribe(() => {
      this.set('state', this._store.getState());
      this.notifyPropertyChange('state');
    });

    this.set('state', this._store.getState());
  },

  stateString: Ember.computed('state', function() {
    return JSON.stringify(deserializeFromEmber(this.get('state')));
  }),

  dispatch(action) {
    this._store.dispatch(action);
  }
});
