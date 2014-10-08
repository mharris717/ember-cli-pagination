import Ember from 'ember';
import PagedArray from 'ember-cli-pagination/local/paged-array';
import config from '../config/environment';
import Factory from 'ember-cli-pagination/factory';

var pagedArray = function(contentProperty) {
  return Ember.computed(function() {
    return PagedArray.create({content: this.get(contentProperty)});
  });
};

export default Ember.ArrayController.extend(Factory.controllerMixin(config), {
  pagedContent: pagedArray("content"),

  actions: {
    save: function() {
      this.forEach(function(t) {
        t.save();
      });
    }
  }
});