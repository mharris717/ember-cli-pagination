import Ember from 'ember';

export default Ember.ArrayController.extend({
  queryParams: ["page","perPage","sortByField"],

  page: Ember.computed.oneWay("content.page"),

  updatePaged: function() {
    var field = this.get('sortByField');
    var paged = this.get('content');
    if (paged.setOtherParam) {
      paged.setOtherParam('sortByField',field);
    }
  }.observes('sortByField')
});