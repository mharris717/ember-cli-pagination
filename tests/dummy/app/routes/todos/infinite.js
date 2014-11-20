import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var paged = this.store.find('todo', {page: "all"});
    return paged;
  }
});