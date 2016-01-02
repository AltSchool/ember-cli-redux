import { moduleFor, test } from 'ember-qunit';

moduleFor('service:redux-store', 'Unit | Service | redux store', {});

// Replace this with your real tests.
test('it exists', function(assert) {
  var service = this.subject();
  assert.ok(service);
});

test('it accepts dispatched actions', function(assert) {
  var service = this.subject();
  service.dispatch({type: 'INCREMENT_COUNT'});
  assert.equal(service.get('state.count'), 1);
});

test('it accepts thunks', function(assert) {
  var service = this.subject();
  service.dispatch((_dispatch) => {
    _dispatch({type: 'INCREMENT_COUNT'});
  });
  assert.equal(service.get('state.count'), 1);  
});

test('it produces a deserialized state string', function(assert) {
  var service = this.subject();
  assert.equal(service.get('stateString'), "{\"count\":0}");
});
