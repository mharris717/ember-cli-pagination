import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return Ember.RSVP.hash({
      content: this.store.findAll('todo')
    });
  },

  setupController: function(controller, models) {
    controller.setProperties(models);
  }
});
