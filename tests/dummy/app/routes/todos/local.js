import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var paged = this.store.query('todo');
    return paged;
  }
});
