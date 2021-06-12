module.exports = {
  getSubset(allowedKeys, obj){
    let result = {};
    Object.keys(obj).forEach((key) => {
      if(allowedKeys.includes(key)){
        result[key] = obj[key];
      }
    });
    return result;
  },

  getDefinedSubset(allowedKeys, obj){
    let result = {};
    Object.keys(obj).forEach((key) => {
      if(allowedKeys.includes(key) && obj[key] != undefined){
        result[key] = obj[key];
      }
    });
    return result;
  }
}