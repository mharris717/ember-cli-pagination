import Ember from 'ember';
import Util from 'ember-cli-pagination/util';

export default Ember.ArrayProxy.extend({
  page: 1,

  fetchContent: function() {
    Util.log("PagedRemoteArray#fetchContent");

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

  content: (function() {
    return this.fetchContent();
  }).property("page"),

  totalPagesBinding: "meta.total_pages",

  setPage: function(page) {
    this.set('page', page);
  }
});