import Ember from 'ember';

export default Ember.Object.extend({
  findArgs: function() {
    return [];
  }.property(),

  find: function(modelName,params) {
    var me = this;
    return new Ember.RSVP.Promise(function(success,failure) {
      me.get("findArgs").pushObject({modelName: modelName, params: params});
      success([]);
    });
  },

  query: function(modelName,params) {
    return this.find(modelName,params);
  }
});
