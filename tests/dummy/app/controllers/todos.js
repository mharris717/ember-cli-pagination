import Ember from 'ember';
import PageControllerMixin from 'ember-cli-pagination/controller-mixin';
var c;

c = Ember.ArrayController.extend(PageControllerMixin, {
  actions: {
    save: function() {
      return this.forEach(function(t) {
        return t.save();
      });
    }
  }
});

export default c;
