import Ember from 'ember';
import Util from 'ember-cli-pagination/util';

var ArrayProxyPromiseMixin = Ember.Mixin.create(Ember.PromiseProxyMixin, {
  then: function(f) {
    var promise = this.get('promise');
    var me = this;

    promise.then(function() {
      f(me);
    });
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

    var res = store.find(modelName, ops);
    var me = this;

    res.then(function(rows) {
      Util.log("PagedRemoteArray#fetchContent in res.then " + rows);
      return me.set("meta", rows.meta);
    });

    return res;
  },

  totalPagesBinding: "meta.total_pages",

  setPage: function(page) {
    this.set('page', page);
    this.set('promise', this.fetchContent());
  }
});