import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ["page","perPage"],
  page: 1,

  pageBinding: Ember.Binding("content.page")
});
