import Ember from 'ember';
import Factory from 'ember-cli-pagination/factory';
import config from '../config/environment';
var c;

c = Ember.Route.extend(Factory.routeMixin(config), {
  model: function(params) {
    params.perPage = params.perPage || 2;
    return this.findPaged('todo', params);
  }
});

export default c;
