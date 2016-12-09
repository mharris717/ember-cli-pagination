import Ember from 'ember';
import Util from 'ember-cli-pagination/util';
import PageItems from 'ember-cli-pagination/lib/page-items';
import Validate from 'ember-cli-pagination/validate';

export default Ember.Component.extend({
  currentPage: Ember.computed.alias("content.page"),
  totalPages: Ember.computed.alias("content.totalPages"),

  hasPages: Ember.computed.gt('totalPages', 1),

  watchInvalidPage: Ember.observer("content", function() {
    const c = this.get('content');
    if (c && c.on) {
      c.on('invalidPage', (e) => {
        this.sendAction('invalidPageAction',e);
      });
    }
  }),

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

  pageItemsObj: Ember.computed(function() {
    return PageItems.create({
      parent: this,
      currentPage: Ember.computed.alias("parent.currentPage"),
      totalPages: Ember.computed.alias("parent.totalPages"),
      truncatePages: Ember.computed.alias("parent.truncatePages"),
      numPagesToShow: Ember.computed.alias("parent.numPagesToShow"),
      showFL: Ember.computed.alias("parent.showFL")
    });
  }),

  pageItems: Ember.computed("pageItemsObj.pageItems","pageItemsObj", function() {
    this.validate();
    return this.get("pageItemsObj.pageItems");
  }),

  canStepForward: Ember.computed("currentPage", "totalPages", function() {
    const page = Number(this.get("currentPage"));
    const totalPages = Number(this.get("totalPages"));
    return page < totalPages;
  }),

  canStepBackward: Ember.computed("currentPage", function() {
    const page = Number(this.get("currentPage"));
    return page > 1;
  }),

  actions: {
    pageClicked: function(number) {
      Util.log("PageNumbers#pageClicked number " + number);
      this.set("currentPage", number);
      this.sendAction('action',number);
    },
    incrementPage: function(num) {
      const currentPage = Number(this.get("currentPage")),
           totalPages = Number(this.get("totalPages"));

      if(currentPage === totalPages && num === 1) { return false; }
      if(currentPage <= 1 && num === -1) { return false; }
      this.incrementProperty('currentPage', num);

      const newPage = this.get('currentPage');
      this.sendAction('action',newPage);
    }
  }
});
