import Ember from 'ember';
import Util from 'ember-cli-pagination/util';

export default Ember.Component.extend({
  content: null,

  pageToUse: function(k,v) {
    var content = this.get('content');
    if (content) {
      if (arguments.length == 2) {
        content.set("page",v);
      }
      else {
        return content.get('page');
      }
    }
    else {
      if (arguments.length == 2) {
        this.set("currentPage", v);
      }
      else {
        return this.get('currentPage');
      }
      
    }
  }.property("content.currentPage","currentPage"),

  totalPagesToUse: function() {
    var content = this.get('content');
    if (content) {
      return content.get('totalPages');
    }
    else {
      return this.get('totalPages');
    }
  }.property("content.totalPages","totalPages")
});
