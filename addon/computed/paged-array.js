import Ember from 'ember';
import PagedArray from 'ember-cli-pagination/local/paged-array';

export default function(contentProperty) {
  return Ember.computed(contentProperty,function() {
    return PagedArray.create({content: this.get(contentProperty)});
  });
}