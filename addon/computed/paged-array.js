import Ember from 'ember';
import PagedArray from 'ember-cli-pagination/local/paged-array';
import PagedInfiniteArray from 'ember-cli-pagination/infinite/paged-infinite-array';

export default function(contentProperty,ops) {
  ops = ops || {};

  if (ops.infinite) {
    return Ember.computed(function() {
      return PagedInfiniteArray.create({all: this.get(contentProperty)});
    });
  }
  else {
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
}