import Ember from 'ember';
import PagedArray from 'ember-cli-pagination/local/paged-array';

export default function(contentProperty,ops) {
  ops = ops || {};

  return Ember.computed(contentProperty+".@each",function() {
    var pagedOps = {content: this.get(contentProperty)};
    pagedOps.parent = this;

    var getVal = function(key,val) {
      if (key.match(/Binding$/)) {
        return "parent."+val;
      }
      else {
        return val;
      }
    };

    for (var key in ops) {
      pagedOps[key] = getVal(key,ops[key]);
    }

    return PagedArray.create(pagedOps);
  });
}