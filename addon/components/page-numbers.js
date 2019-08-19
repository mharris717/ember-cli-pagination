import Ember from 'ember';
import Util from 'ember-cli-pagination/util';
import PageItems from 'ember-cli-pagination/lib/page-items';
import Validate from 'ember-cli-pagination/validate';
import layout from '../templates/components/page-numbers';
import { get } from '@ember/object';
import { deprecate } from '@ember/debug';

export default Ember.Component.extend({
  layout,
  currentPage: Ember.computed.alias("content.page"),
  totalPages: Ember.computed.alias("content.totalPages"),

  hasPages: Ember.computed.gt('totalPages', 1),

  watchInvalidPage: Ember.observer("content", function() {
    const c = this.get('content');
    if (c && c.on) {
      c.on('invalidPage', (e) => {
        const invalidPageAction = this.get('invalidPageAction');
        // only run if a closure action has been passed
        // or this version of ember supports this.sendAction
        if (typeof invalidPageAction === 'function' || typeof this.sendAction == 'function') {
          this._runAction('invalidPageAction', e);
        }
      });
    }
  }),

  _runAction(key, ...args) {
    const action = get(this, key);
    if (typeof action === 'function') {
      action(...args);
    } else if (typeof this.sendAction === 'function') {
      deprecate('passing a string to `page-numbers` is deprecated due to Ember sendAction deprecation. Use a closure action instead: https://deprecations.emberjs.com/v3.x/#toc_ember-component-send-action');
      this.sendAction(key, ...args);
    } else {
      throw new Error('passing a string to `page-numbers` is deprecated due to Ember sendAction deprecation. Use a closure action instead: https://deprecations.emberjs.com/v3.x/#toc_ember-component-send-action');
    }
  },


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
    let result = PageItems.create({
      parent: this
    });

    Ember.defineProperty(result, 'currentPage', Ember.computed.alias("parent.currentPage"));
    Ember.defineProperty(result, 'totalPages', Ember.computed.alias("parent.totalPages"));
    Ember.defineProperty(result, 'truncatePages', Ember.computed.alias("parent.truncatePages"));
    Ember.defineProperty(result, 'numPagesToShow', Ember.computed.alias("parent.numPagesToShow"));
    Ember.defineProperty(result, 'showFL', Ember.computed.alias("parent.showFL"));

    return result;
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
      this._runAction('action', number);
    },
    incrementPage: function(num) {
      const currentPage = Number(this.get("currentPage")),
           totalPages = Number(this.get("totalPages"));

      if(currentPage === totalPages && num === 1) { return false; }
      if(currentPage <= 1 && num === -1) { return false; }
      this.incrementProperty('currentPage', num);

      const newPage = this.get('currentPage');
      this._runAction('action', newPage);
    }
  }
});
