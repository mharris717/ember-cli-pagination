import Ember from 'ember';

var Validate = Ember.Object.extend();

Validate.reopenClass({
  internalErrors: [],

  internalError: function(str,obj) {
    this.internalErrors.push(str);
    console.error(str);
    if (obj) {
      console.error(obj);
    }
  },

  getLastInternalError: function() {
    return this.internalErrors[this.internalErrors.length-1];
  }
});

export default Validate;