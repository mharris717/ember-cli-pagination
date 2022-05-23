import Controller from '@ember/controller';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

export default Controller.extend({
  pagedContent: pagedArray("model", {infinite: true}),

  actions: {
    loadNext: function() {
      this.pagedContent.loadNextPage();
    }
  }
});
