import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return Ember.RSVP.hash({
      model: this.store.findAll('todo', {page: "all"})
    });
  },

  setupController: function(controller, models) {
    controller.setProperties(models);
  }
});
