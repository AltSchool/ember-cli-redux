const emberModelType = function(model) {
  var constructor = model.constructor.toString();
  var match = constructor.match(/model:(.+):/);
  if (!match || !match[1]) {throw `No model constructor found for ${constructor}`;}
  return match[1];
};

const deserializeFromEmber = function(o, depth = 10) {
  if(o && o.toJSON) {
    const type = emberModelType(o);
    return o.store && o.store.normalize ? 
      o.store.normalize(type, o.toJSON({includeId:true})) : 
      o.toJSON();
  } else if (Array.isArray(o)) {
    return o.reduce((acc, item) => {
      acc.push(deserializeFromEmber(item, depth - 1));
      return acc;
    }, []);
  } else if(o && o.then) {
    return o.toString();
  } else if (o instanceof Object) {  
    return Object.keys(o).reduce((acc, key) => {
      var value = o.get ? o.get(key) : o[key];
      acc[key] = depth > 0 ? deserializeFromEmber(value, depth - 1) : value;
      return acc;
    }, {});
  } else {
    return o;
  }
};

export default deserializeFromEmber;
