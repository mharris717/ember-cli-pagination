import Ember from 'ember';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default Ember.Route.extend(RouteMixin, {
  queryParams: {
    page: {},
    perPage: {}
  },
  page: 1,

  pageBinding: Ember.Binding.oneWay("content.page"),

  model: function(params) {
    var paged = this.findPaged('todo', params);

    return paged;
  }
});
