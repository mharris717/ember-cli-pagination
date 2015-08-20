import Ember from 'ember';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

export default Ember.Controller.extend({
  queryParams: ["page"],
  page: 1,

  pagedContent: pagedArray('content', {infinite: "unpaged"}),

  actions: {
    loadNext: function() {
      this.get('pagedContent').loadNextPage();
    }
  }
});
