import Ember from 'ember';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default Ember.Route.extend(RouteMixin, {
  model: function(params) {
    return Ember.RSVP.hash({
      model: this.findPaged('todo',params,{zeroBasedIndex: false})
    });
  },

  setupController: function(controller, models) {
    controller.setProperties(models);
  }
});
