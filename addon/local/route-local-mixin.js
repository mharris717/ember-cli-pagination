import Ember from 'ember';

export default Ember.Mixin.create({
  findPaged: function(name) {
    return this.get('store').find(name);
  }
});
