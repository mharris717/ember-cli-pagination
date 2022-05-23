import { hash } from 'rsvp';
import Route from '@ember/routing/route';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default Route.extend(RouteMixin, {
  model: function(params) {
    return hash({
      model: this.findPaged('todo',params,{zeroBasedIndex: false})
    });
  },

  setupController: function(controller, models) {
    controller.setProperties(models);
  }
});
