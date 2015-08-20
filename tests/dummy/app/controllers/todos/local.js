import Ember from 'ember';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

export default Ember.Controller.extend({
  queryParams: ["page","perPage"],
  page: 1,

  pagedContent: pagedArray("content", {pageBinding: "page"})
});
