const deserializeFromEmber = function(o, depth = 10) {
  if(o && o.toJSON) {
    var constructor = o.get && o.get('constructor').toString();
    return constructor ? 
      {'_constructor': constructor, json: o.toJSON({includeId:true})} : 
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
