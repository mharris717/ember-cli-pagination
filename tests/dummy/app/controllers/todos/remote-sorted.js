import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ["page","perPage","sortByField"],
  page: 1,

  updatePaged: Ember.observer("sortByField", function() {
    var field = this.get('sortByField');
    var paged = this.get('model');
    if (paged && paged.setOtherParam) {
      paged.setOtherParam('sortByField',field);
    }
  })
});
