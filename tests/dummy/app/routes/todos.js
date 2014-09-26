import Ember from 'ember';
import Factory from 'ember-cli-pagination/factory';
import config from '../config/environment';
var c;

c = Ember.Route.extend(Factory.routeMixin(config), {
  model: function(params) {
    console.debug("TodosRoute#model");
    return this.findPaged('todo', params);
  }
});

export default c;
