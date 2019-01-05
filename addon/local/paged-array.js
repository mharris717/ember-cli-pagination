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

  arrangedContent: Ember.computed("content.[]", "page", "perPage", function() {
    return this.divideObj().objsForPage(this.get('page'));
  }),

  totalPages: Ember.computed("content.[]", "perPage", function() {
    return this.divideObj().totalPages();
  }),

  setPage: function(page) {
    Util.log("setPage " + page);
    return this.set('page', page);
  },

  watchPage: Ember.observer('page','totalPages', function() {
    var page = this.get('page');
    var totalPages = this.get('totalPages');

    this.trigger('pageChanged',page);

    if (page < 1 || page > totalPages) {
      this.trigger('invalidPage',{page: page, totalPages: totalPages, array: this});
    }
  }),

  then: function(success,failure) {
    var content = Ember.A(this.get('content'));
    var me = this;
    var promise;

    if (content.then) {
      promise = content.then(function() {
        return success(me);
      },failure);
    }
    else {
      promise = new Ember.RSVP.Promise(function(resolve) {
        resolve(success(me));
      });
    }

    return promise;
  },

  lockToRange: function() {
    LockToRange.watch(this);
  }
});
