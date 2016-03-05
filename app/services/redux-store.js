import ReduxStore from 'ember-cli-redux/services/redux-store';
import reducer from '../reducers/index';
import redux from 'npm:redux';
import thunk from 'npm:redux-thunk';

export default ReduxStore.extend({
  reducer
});
