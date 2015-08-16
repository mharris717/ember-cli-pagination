import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ["page","perPage","sortByField"],
  page: 1,

  pageBinding: Ember.computed.oneWay("ccontent.page"),

  // arrangedContent: function() {
  //   var field = this.get('sortByField');
  //   return Ember.ArrayProxy.extend(Ember.SortableMixin).create({
  //     sortProperties: [field],
  //     sortAscending: true,
  //     content: this.get('content')
  //   });
  // }.property('content'),

  updatePaged: function() {
    var field = this.get('sortByField');
    var paged = this.get('content');
    if (paged.setOtherParam) {
      paged.setOtherParam('sortByField',field);
    }
  }.observes('sortByField')
});
