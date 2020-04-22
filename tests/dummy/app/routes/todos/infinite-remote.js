import Ember from 'ember';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default Ember.Route.extend(RouteMixin, {
  model: function(params) {
    return this.findPaged('todo',params,{zeroBasedIndex: false});
  },
});
