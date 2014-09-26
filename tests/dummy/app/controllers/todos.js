import Ember from 'ember';
import Factory from 'ember-cli-pagination/factory';
import config from '../config/environment';
var c;

c = Ember.ArrayController.extend(Factory.controllerMixin(config), {
  actions: {
    save: function() {
      return this.forEach(function(t) {
        return t.save();
      });
    }
  }
});

export default c;
