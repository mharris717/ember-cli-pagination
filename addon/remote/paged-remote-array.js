import Ember from 'ember';
import Util from 'ember-cli-pagination/util';
import LockToRange from 'ember-cli-pagination/watch/lock-to-range';

var ArrayProxyPromiseMixin = Ember.Mixin.create(Ember.PromiseProxyMixin, {
  then: function(success,failure) {
    var promise = this.get('promise');
    var me = this;

    promise.then(function() {
      success(me);
    }, failure);
  }
});

export default Ember.ArrayProxy.extend(Ember.Evented, ArrayProxyPromiseMixin, {
  page: 1,
  paramMapping: {},

  init: function() {
    this.set('promise', this.fetchContent());
  },

  paramsForBackend: function() {
    var page = parseInt(this.get('page') || 1);
    var perPage = parseInt(this.get('perPage'));
    //var store = this.get('store');
    //var modelName = this.get('modelName');
    var self = this;

    var ops = {};

    var me = this;
    function setOp(key,val,defaultKey) {
      if (val) {
        key = me.get('paramMapping')[key] || defaultKey || key;
        if (Array.isArray(key)) {
          var fn = key[1];
          key = key[0];
          ops[key] = fn.call(self, page, perPage);
        } else {
          ops[key] = val;
        }
      }
    }
    
    setOp("page",page);
    setOp("perPage",perPage,"per_page");

    // take the otherParams hash and add the values at the same level as page/perPage
    var otherOps = this.get('otherParams') || {};
    for (var key in otherOps) {
      Util.log("otherOps key " + key);
      var val = otherOps[key];
      ops[key] = val;
    }

    return ops;
  }.property('page','perPage','paramMapping'),

  fetchContent: function() {
    var store = this.get('store');
    var modelName = this.get('modelName');
    var page = parseInt(this.get('page') || 1);
    var perPage = parseInt(this.get('perPage'));

    var ops = this.get('paramsForBackend');
    var res = store.find(modelName, ops);
    this.incrementProperty("numRemoteCalls");
    var me = this;

    res.then(function(rows) {
      Util.log("PagedRemoteArray#fetchContent in res.then " + rows);
      var newMeta = {};
      var totalPagesField = me.get('paramMapping').total_pages;
      var fn;
      
      if (totalPagesField && Array.isArray(totalPagesField)) {
        fn = totalPagesField[1];
        totalPagesField = totalPagesField[0];
      }
      
      if (rows.meta) {
        for (var k in rows.meta) { 
          newMeta[k] = rows.meta[k]; 
          if (totalPagesField && totalPagesField === k) {
            if (fn) {
              newMeta['total_pages'] = fn.call(this, rows.meta[k], page, perPage);
            } else {
              newMeta['total_pages'] = rows.meta[k];
            }
          }
        }      
      }
      return me.set("meta", newMeta);
    }, function(error) {
      Util.log("PagedRemoteArray#fetchContent error " + error);
    });

    return res;
  },  

  totalPagesBinding: "meta.total_pages",

  pageChanged: function() {
    this.set("promise", this.fetchContent());
  }.observes("page", "perPage"),

  lockToRange: function() {
    LockToRange.watch(this);
  },

  watchPage: function() {
    var page = this.get('page');
    var totalPages = this.get('totalPages');
    if (parseInt(totalPages) <= 0) {
      return;
    }

    this.trigger('pageChanged',page);

    if (page < 1 || page > totalPages) {
      this.trigger('invalidPage',{page: page, totalPages: totalPages, array: this});
    }
  }.observes('page','totalPages')
});