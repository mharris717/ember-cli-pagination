import Ember from 'ember';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default Ember.Route.extend(RouteMixin, {
  model: function(params) {
    var paged = this.findPaged('todo',params);
    //paged.lockToRange();
    return paged;
  }
});