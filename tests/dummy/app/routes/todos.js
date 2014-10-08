import Ember from 'ember';
import Factory from 'ember-cli-pagination/factory';
import config from '../config/environment';

export default Ember.Route.extend(Factory.routeMixin(config), {
  model: function(params) {
    return this.findPaged('todo', params);
  }
});