import Ember from 'ember';

export default Ember.Mixin.create({
  findPaged: function(name) {
    return this.store.query(name);
  }
});
