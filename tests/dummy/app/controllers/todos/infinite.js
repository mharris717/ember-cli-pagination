import Ember from 'ember';
import PagedInfiniteArray from 'ember-cli-pagination/infinite/paged-infinite-array';

export default Ember.ArrayController.extend({
  needs: ["todos"],
  pagedContent: function() {
    var base = this.get('controllers.todos.pagedContent');
    return PagedInfiniteArray.create({all: base});
  }.property(),

  actions: {
    loadNext: function() {
      this.get('pagedContent').moveToNextPage();
    }
  }
});