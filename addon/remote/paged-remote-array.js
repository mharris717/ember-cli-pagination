import Ember from 'ember';
import Util from 'ember-cli-pagination/util';

var ArrayProxyPromiseMixin = Ember.Mixin.create(Ember.PromiseProxyMixin, {
  then: function(success,failure) {
    var promise = this.get('promise');
    var me = this;

    promise.then(function() {
      success(me);
    }, failure);
  }
});

export default Ember.ArrayProxy.extend(ArrayProxyPromiseMixin, {
  page: 1,

  init: function() {
    this.set('promise', this.fetchContent());
  },

  fetchContent: function() {
    var page = parseInt(this.get('page') || 1);
    var perPage = parseInt(this.get('perPage'));
    var store = this.get('store');
    var modelName = this.get('modelName');

    var ops = {page: page};
    if (perPage) {
      ops.per_page = perPage;
    }

    var otherOps = this.get('otherParams') || {};
    for (var key in otherOps) {
      Util.log("otherOps key " + key);
      var val = otherOps[key];
      ops[key] = val;
    }

    var res = store.find(modelName, ops);
    var me = this;

    res.then(function(rows) {
      Util.log("PagedRemoteArray#fetchContent in res.then " + rows);
      var newMeta = {};
      for (var i in rows.meta) { newMeta[i] = rows.meta[i]; }      
      return me.set("meta", newMeta);
    }, function(error) {
      Util.log("PagedRemoteArray#fetchContent error " + error);
    });

    return res;
  },  

  totalPagesBinding: "meta.total_pages",

  pageChanged: function() {
    this.set("promise", this.fetchContent());
  }.observes("page", "perPage")
});