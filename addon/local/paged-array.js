import Ember from 'ember';
import Util from 'ember-cli-pagination/util';
import DivideIntoPages from 'ember-cli-pagination/divide-into-pages';
import LockToRange from 'ember-cli-pagination/watch/lock-to-range';

export default Ember.ArrayProxy.extend(Ember.Evented, {
  page: 1,
  perPage: 10,

  divideObj: function() {
    return DivideIntoPages.create({
      perPage: this.get('perPage'),
      all: this.get('content')
    });
  },

  arrangedContent: function() {
    return this.divideObj().objsForPage(this.get('page'));
  }.property("content.@each", "page", "perPage"),

  totalPages: function() {
    return this.divideObj().totalPages();
  }.property("content.@each", "perPage"),
  
  setPage: function(page) {
    Util.log("setPage " + page);
    return this.set('page', page);
  },

  watchPage: function() {
    var page = this.get('page');
    var totalPages = this.get('totalPages');

    this.trigger('pageChanged',page);

    if (page < 1 || page > totalPages) {
      this.trigger('invalidPage',{page: page, totalPages: totalPages, array: this});
    }
  }.observes('page','totalPages'),

  then: function(success,failure) {
    var content = this.get('content');
    var me = this;

    if (content.then) {
      content.then(function() {
        success(me);
      },failure);
    }
    else {
      success(this);
    }
  },

  lockToRange: function() {
    LockToRange.watch(this);
  }
});