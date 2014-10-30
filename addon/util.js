import Ember from 'ember';

var Util = Ember.Object.extend();

Util.reopenClass({
  log: function() {},

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
  }
});

export default Util;
