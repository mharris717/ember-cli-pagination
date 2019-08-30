import Ember from 'ember';


export default Ember.Mixin.create({
  queryParams: ["page", "perPage"],

  page: Ember.computed.alias("model.page"),

  totalPages: Ember.computed.alias("model.totalPages"),

  pagedContent: Ember.computed.alias("model")
});
