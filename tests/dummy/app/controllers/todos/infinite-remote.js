import Ember from 'ember';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

export default Ember.Controller.extend({
  pagedContent: pagedArray("content", {infinite: true}),

  actions: {
    loadNext: function() {
      this.get('pagedContent').loadNextPage();
    }
  }
});
