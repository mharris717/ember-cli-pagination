import Ember from 'ember';
import Util from 'ember-cli-pagination/util';
import PageItems from 'ember-cli-pagination/lib/page-items';
import Validate from 'ember-cli-pagination/validate';

export default Ember.Component.extend({
  currentPageBinding: "content.page",
  totalPagesBinding: "content.totalPages",

  hasPages: Ember.computed.gt('totalPages', 1),

  watchInvalidPage: function() {
    var me = this;
    var c = this.get('content');
    if (c && c.on) {
      c.on('invalidPage', function(e) {
        me.sendAction('invalidPageAction',e);
      });
    }
  }.observes("content"),

  truncatePages: true,
  numPagesToShow: 10,

  validate: function() {
    if (Util.isBlank(this.get('currentPage'))) {
      Validate.internalError("no currentPage for page-numbers");
    }
    if (Util.isBlank(this.get('totalPages'))) {
      Validate.internalError('no totalPages for page-numbers');
    }
  },

  pageItemsObj: function() {
    return PageItems.create({
      parent: this,
      currentPageBinding: "parent.currentPage",
      totalPagesBinding: "parent.totalPages",
      truncatePagesBinding: "parent.truncatePages",
      numPagesToShowBinding: "parent.numPagesToShow",
      showFLBinding: "parent.showFL"
    });
  }.property(),

  //pageItemsBinding: "pageItemsObj.pageItems",

  pageItems: function() {
    this.validate();
    return this.get("pageItemsObj.pageItems");
  }.property("pageItemsObj.pageItems","pageItemsObj"),

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
