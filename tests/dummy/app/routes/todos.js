import Ember from 'ember';
import config from '../config/environment';
import Factory from 'ember-cli-pagination/factory';

export default Ember.Route.extend(Factory.routeMixin(config), {
  model: function(params) {
    return this.findPaged('todo',params);
  }
});