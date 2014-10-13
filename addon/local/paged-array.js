import Ember from 'ember';
import Util from 'ember-cli-pagination/util';
import DivideIntoPages from 'ember-cli-pagination/divide-into-pages';

export default Ember.ArrayProxy.extend({
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
  }
});