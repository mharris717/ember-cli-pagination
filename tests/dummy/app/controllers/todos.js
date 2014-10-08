import Ember from 'ember';
import PagedArray from 'ember-cli-pagination/local/paged-array';

export default Ember.ArrayController.extend({
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