import deserializeFromEmber from '../lib/deserialize-from-ember';

export default store => next => action => {
  console.group(action.type);
  console.info(
    `%c action`, 
    `color: #03A9F4; font-weight: bold`, 
    action
  );
  let result = next(action);
  console.log(
    `%c next state`, 
    `color: #4CAF50; font-weight: bold`, 
    deserializeFromEmber(store.getState())
  );
  console.groupEnd(action.type);
  return result;
};
