import Ember from 'ember';
import EmberReduxMixin from '../../../mixins/ember-redux';
import { module, test } from 'qunit';

module('Unit | Mixin | ember redux');

test('it works', function(assert) {
  var EmberReduxObject = Ember.Object.extend(EmberReduxMixin);
  var subject = EmberReduxObject.create();
  assert.ok(subject);
});

test('it dispatches actions', function(assert) {
  assert.expect(1);
  var EmberReduxObject = Ember.Object.extend(EmberReduxMixin, {
    reduxStore: {
      dispatch() {
        assert.ok(true);
      }      
    }
  });
  var subject = EmberReduxObject.create();
  subject.dispatch();
});

test('it dispatches reduxActions', function(assert) {
  assert.expect(1);
  var EmberReduxObject = Ember.Object.extend(EmberReduxMixin, {
    reduxStore: {
      dispatch(action) {
        assert.equal(action.type, 'SOME_ACTION');
      }      
    },
    reduxActions: {
      actionTest() {
        return {type: 'SOME_ACTION'};
      }
    }
  });
  var subject = EmberReduxObject.create();
  subject.dispatchAction('actionTest');
});
