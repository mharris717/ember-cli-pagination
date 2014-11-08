import Ember from 'ember';
import Util from 'ember-cli-pagination/util';
import PageItems from 'ember-cli-pagination/lib/page-items';

export default Ember.Component.extend({
  currentPageBinding: "content.page",
  totalPagesBinding: "content.totalPages",
  
  isVisible: function () {
    return this.get('totalPages') !== 0;
  }.property('totalPages'),

  truncatePages: true,
  numPagesToShowBefore: 5,
  numPagesToShowAfter: 5,

  pageItemsObj: function() {
    return PageItems.create({
      parent: this,
      currentPageBinding: "parent.currentPage",
      totalPagesBinding: "parent.totalPages",
      truncatePagesBinding: "parent.truncatePages",
      numPagesToShowBeforeBinding: "parent.numPagesToShowBefore",
      numPagesToShowAfterBinding: "parent.numPagesToShowAfter"
    });
  }.property(),

  pageItemsBinding: "pageItemsObj.pageItems",

  canStepForward: (function() {
    var page = Number(this.get("currentPage"));
    var totalPages = Number(this.get("totalPages"));
    return page < totalPages;
  }).property("currentPage", "totalPages"),

  canStepBackward: (function() {
    var page = Number(this.get("currentPage"));
    return page > 1;
  }).property("currentPage"),

  actions: {
    pageClicked: function(number) {
      Util.log("PageNumbers#pageClicked number " + number);
      this.set("currentPage", number);
      this.sendAction('action',number);
    },
    incrementPage: function(num) {
      var currentPage = Number(this.get("currentPage")),
          totalPages = Number(this.get("totalPages"));

      if(currentPage === totalPages && num === 1) { return false; }
      if(currentPage <= 1 && num === -1) { return false; }
      this.incrementProperty('currentPage', num);

      var newPage = this.get('currentPage');
      this.sendAction('action',newPage);
    }
  }
});
