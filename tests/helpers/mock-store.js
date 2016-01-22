import Ember from 'ember';

export default Ember.Object.extend({
  findArgs: Ember.computed(() => { 
    return Ember.A([]);
  }),

  find: function(modelName,params) {
    return new Ember.RSVP.Promise((success,failure) => {
      this.get("findArgs").pushObject({modelName: modelName, params: params});
      success(Ember.A([]));
    });
  },

  query: function(modelName,params) {
    return this.find(modelName,params);
  }
});
