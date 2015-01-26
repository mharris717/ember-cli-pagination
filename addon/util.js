import Ember from 'ember';

var Util = Ember.Object.extend();

Util.reopenClass({
  log: function() {},

  isBlank: function(obj) {
    if (obj === 0) {
      return false;
    }
    return !obj || (obj === "");
  },

  keysOtherThan: function(params,excludeKeys) {
    var res = [];
    for (var key in params) {
      if (!excludeKeys.contains(key)) {
        res.push(key);
      }
    }
    return res;
  },

  paramsOtherThan: function(params,excludeKeys) {
    var res = {};
    var keys = this.keysOtherThan(params,excludeKeys);
    for(var i=0;i<keys.length;i++) {
      var key = keys[i];
      var val = params[key];
      res[key] = val;
    }
    return res;
  },

  mergeHashes: function(a,b) {
    var res = {};
    var val;
    var key;

    for (key in a) {
      val = a[key];
      res[key] = val;
    }

    for (key in b) {
      val = b[key];
      res[key] = val;
    }

    return res;
  },

  isFunction: function(obj) {
    return (typeof obj === 'function');
  },

  getHashKeyForValue: function(hash,targetVal) {
    for (var k in hash) {
      var val = hash[k];
      if (val === targetVal) {
        return k;
      }
      else if (Util.isFunction(targetVal) && targetVal(val)) {
        return k;
      }
    }
    return undefined;
  }
});

export default Util;
