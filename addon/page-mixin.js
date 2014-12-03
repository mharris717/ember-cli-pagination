import Ember from 'ember';

export default Ember.Mixin.create({
  getPage: function() {
    return parseInt(this.get('page') || 1);
  },

  getPerPage: function() {
    return parseInt(this.get('perPage'));
  }
});