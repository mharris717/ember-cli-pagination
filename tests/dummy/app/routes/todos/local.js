import { hash } from 'rsvp';
import Route from '@ember/routing/route';

export default Route.extend({
  model: function() {
    return hash({
      model: this.store.findAll('todo')
    });
  },

  setupController: function(controller, models) {
    controller.setProperties(models);
  }
});
