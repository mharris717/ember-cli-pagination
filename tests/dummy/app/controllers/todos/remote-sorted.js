import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ["page","perPage","sortByField"],
  page: 1,

  pageBinding: Ember.computed.oneWay("content.page"),

  updatePaged: Ember.observer("sortByField", function() {
    var field = this.get('sortByField');
    var paged = this.get('content');
    if (paged && paged.setOtherParam) {
      paged.setOtherParam('sortByField',field);
    }
  })
});
