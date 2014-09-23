import Ember from 'ember';
import PageRouteMixin from 'ember-cli-pagination/route-mixin';
var c;

c = Ember.Route.extend(PageRouteMixin, {
  model: function(params) {
    return this.findPaged('todo', params);
  }
});

export default c;
