import Ember from 'ember';
import Factory from 'ember-cli-pagination/factory';
import config from '../config/environment';

export default Ember.ArrayController.extend(Factory.controllerMixin(config), {
  actions: {
    save: function() {
      this.forEach(function(t) {
        t.save();
      });
    }
  }
});