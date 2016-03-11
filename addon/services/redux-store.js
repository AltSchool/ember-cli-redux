import Ember from 'ember';
import redux from 'npm:redux';
import thunk from 'npm:redux-thunk';
import deserializeFromEmber from '../lib/deserialize-from-ember';
import emberLoggerMiddleware from '../lib/ember-logger-middleware';

const { createStore, applyMiddleware } = redux;

const createStoreWithMiddleware = (middleware) => 
  applyMiddleware.apply(null, middleware)(createStore);

const emberLogger = emberLoggerMiddleware();

export default Ember.Service.extend({
  reducer: null, // Provided by the host app's app/reducers/index.js via app/services/redux-store
  state: Ember.computed.readOnly('_state'),

  middleware: [thunk, emberLogger],

  init() {
    this._store = createStoreWithMiddleware(this.get('middleware'))(this.get('reducer'));

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
