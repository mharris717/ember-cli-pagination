import Ember from 'ember';
import PagedArray from 'ember-cli-pagination/local/paged-array';
import config from '../config/environment';
import Factory from 'ember-cli-pagination/factory';

export default Ember.ArrayController.extend(Factory.controllerMixin(config), {
  pagedContent: function() {
    return PagedArray.create({content: this.get('content')});
  }.property(),

  actions: {
    save: function() {
      this.forEach(function(t) {
        t.save();
      });
    }
  }
});