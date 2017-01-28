import Ember from 'ember';


export default Ember.Mixin.create({
  queryParams: ["perPage"],

  page: Ember.computed.alias("content.page"),

  totalPages: Ember.computed.alias("content.totalPages"),

  pagedContent: Ember.computed.alias("content")
});
