import Ember from 'ember';

export default Ember.Mixin.create({
  findPaged: function(name) {
    return this.store.find(name);
  }
});