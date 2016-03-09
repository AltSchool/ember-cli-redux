import Ember from 'ember';
import reduxStore from '../services/redux-store';

const {
  computed,
  defineProperty,
  inject: { service }
} = Ember;

export default function connect(mapStateToComputed, mapDispatchToActions, storeService) {
  return function wrapWithConnect(WrappedComponent) {
    return WrappedComponent.extend({
      reduxStore: storeService || service('reduxStore'),

      init() {
        this._super(...arguments);
        this.actions = this.actions || {};
        const propMap = Ember.typeOf(mapStateToComputed) === 'function' ? 
          mapStateToComputed(reduxStore) :
          mapStateToComputed;
        Object.keys(propMap).forEach((key) => {
          const value = propMap[key];
          const property = Ember.typeOf(value) === 'function' ? 
            value() :
            computed.reads(`reduxStore.state.${value}`);
          defineProperty(this, key, property);
        });
        const store = this.get('reduxStore');
        const actionMap = Ember.typeOf(mapDispatchToActions) === 'function' ?
          mapDispatchToActions(store && store.dispatch.bind(store), this) : 
          mapDispatchToActions;

        Object.keys(actionMap).forEach((key) => {
          const value = actionMap[key];
          const action = Ember.typeOf(value) === 'function' ?
            value :
            () => {
              const store = this.get('reduxStore');
              return store && this.get('reduxStore').dispatch({type: value});
            };
          this.actions[key] = action;
        });
      }
    });
  };
}
