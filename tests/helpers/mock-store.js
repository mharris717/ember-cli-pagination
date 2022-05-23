import { Promise } from 'rsvp';
import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';

export default EmberObject.extend({
  findArgs: computed(() => { 
    return A([]);
  }),

  find: function(modelName,params) {
    return new Promise((success) => {
      this.findArgs.pushObject({modelName: modelName, params: params});
      success(A([]));
    });
  },

  query: function(modelName,params) {
    return this.find(modelName,params);
  }
});
