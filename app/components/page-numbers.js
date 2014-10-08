import Ember from 'ember';

var PassThrough = Ember.Object.extend({
  currentPageBinding: "content.currentPage",
  totalPagesBinding: "content.totalPages"
});

var ContentWrap = Ember.Object.extend({
  currentPageBinding: "content.page",
  totalPagesBinding: "content.totalPages"
});

export default Ember.Component.extend({
  wrap: function() {
    var content = this.get('content');
    if (content) return ContentWrap.create({content: content});
    else return PassThrough.create({content: this});
  }.property("content")
});
