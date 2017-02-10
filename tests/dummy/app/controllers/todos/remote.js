import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ["page","perPage"],
  page: 1
});
