import Controller from '@ember/controller';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

export default Controller.extend({
  queryParams: ['page'],
  page: 1,

  pagedContent: pagedArray('model', { infinite: 'unpaged' }),

  actions: {
    loadNext: function () {
      this.pagedContent.loadNextPage();
    },
  },
});
