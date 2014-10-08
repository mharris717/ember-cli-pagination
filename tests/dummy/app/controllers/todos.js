import Ember from 'ember';
import PagedArray from 'ember-cli-pagination/local/paged-array';

export default Ember.ArrayController.extend({
  queryParams: ["page"],
  page: "1",

  totalPagesBinding: "pagedContent.totalPages",

  pagedContent: function() {
    var all = this.get('content');
    var page = this.get('page') || 1;
    var paged = PagedArray.create({content: all, page: page});
    return paged;
  }.property("content.@each", "page"),

  actions: {
    save: function() {
      this.forEach(function(t) {
        t.save();
      });
    }
  }
});