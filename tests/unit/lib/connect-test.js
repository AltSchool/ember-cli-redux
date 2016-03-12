import Ember from 'ember';
import connect from 'ember-cli-redux/lib/connect';
import { module, test } from 'qunit';

module('Unit | Lib | Connect');

function createFakeReduxService(state = {}, dispatch = null) {
  return Ember.Object.extend({state, dispatch}).create();
}

test('it works', function(assert) {
  const subject = connect();
  assert.ok(subject);
});

test('statemap strings become one way aliases', function(assert) {
  const fakeReduxService = createFakeReduxService({ someReduxProp: 'ok' });
  const stateToComputed = { someProp: 'someReduxProp' };
  const component = connect(stateToComputed, {}, fakeReduxService)(Ember.Object).create();
  assert.equal(component.get('someProp'), 'ok');
});

test('statemaps accept custom functions', function(assert) {
  const fakeReduxService = createFakeReduxService({ someReduxProp: 'ok' });
  const stateToComputed = {
    someProp: () => Ember.computed.reads('reduxStore.state.someReduxProp')
  };
  const component = connect(stateToComputed, {}, fakeReduxService)(Ember.Object).create();
  assert.equal(component.get('someProp'), 'ok');
});

test('actionMap strings become dispatches without payloads', function(assert) {
  const fakeReduxService = createFakeReduxService({}, action => action);
  const dispatchToActions = {emberAction: 'REDUX_ACTION_TYPE'};
  const objectWithActions = Ember.Object.extend({actions: {}});
  const component = connect({}, dispatchToActions, fakeReduxService)(objectWithActions).create();
  assert.equal(component.actions.emberAction().type, 'REDUX_ACTION_TYPE');
});

test('actionMap functions operate as action creators', function(assert) {
  const fakeReduxService = createFakeReduxService({}, action => action);
  const dispatchToActions = {emberAction: () => {
    return {type: 'REDUX_ACTION_TYPE'};
  }};
  const objectWithActions = Ember.Object.extend({actions: {}});
  const component = connect({}, dispatchToActions, fakeReduxService)(objectWithActions).create();
  assert.equal(component.actions.emberAction().type, 'REDUX_ACTION_TYPE');
});
