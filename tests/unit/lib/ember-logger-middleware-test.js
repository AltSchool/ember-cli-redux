import emberLoggerMiddleware from 'ember-cli-redux/lib/ember-logger-middleware';
import { module, test } from 'qunit';

module('Unit | Lib | Ember Logger Middleware');

test('it works', function(assert) {
  const subject = emberLoggerMiddleware();
  assert.ok(subject);
});

test('it logs something', function(assert) {
  assert.expect(1);
  const store = {getState() {return {};}};
  const next = () => {return {};};
  const action = {type: "TEST"};
  window.console.log = () => {
    assert.ok(true);
  };
  emberLoggerMiddleware()(store)(next)(action);
});

test('it logs the action', function(assert) {
  assert.expect(1);
  const store = {getState() {return {someState: true};}};
  const next = () => {return {};};
  const action = {type: "TEST"};
  window.console.info = (label, style, _action) => {
    assert.equal(_action, action);
  };
  emberLoggerMiddleware()(store)(next)(action);
});

test('it applies the action to the state', function(assert) {
  const store = {getState() {return {value: 0};}};
  const next = (action) => {return {value: action.value};};
  const action = {type: "TEST", value: 1};
  let result = emberLoggerMiddleware()(store)(next)(action);
  assert.equal(result.value, 1);
});

test('it logs the state', function(assert) {
  assert.expect(1);
  const newState = {someState: 1};
  const store = {getState() {return newState;}};
  const next = () => {return {};};
  const action = {type: "TEST"};
  window.console.log = (label, style, state) => {
    assert.equal(state.someState, 1);
  };
  emberLoggerMiddleware()(store)(next)(action);
});

