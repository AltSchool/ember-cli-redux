import Ember from 'ember';

export default Ember.Mixin.create({
  reduxStore: Ember.inject.service(),

  dispatch(action) {
    return this.get('reduxStore').dispatch(action);
  },

  dispatchAction(actionName, ...args) {
    return this.dispatch(this.action(actionName).apply(this, args));
  },

  getState(path) {
    return path ? 
      this.get(`reduxStore.state.${path}`) : 
      this.get('reduxStore.state');
  },

  action(actionName) {
    if (!this.reduxActions[actionName]) {throw new Error(`No redux action found for ${actionName}`);}
    return this.reduxActions[actionName].bind(this);
  },
});
