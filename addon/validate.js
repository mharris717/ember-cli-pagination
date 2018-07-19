import Ember from 'ember';

var Validate = Ember.Object.extend();

Validate.reopenClass({
  internalErrors: [],

  internalError: function(str,obj) {
    this.internalErrors.push(str);
    console.warn(str);
    if (obj) {
      console.warn(obj);
    }
  },

  getLastInternalError: function() {
    return this.internalErrors[this.internalErrors.length-1];
  }
});

export default Validate;
