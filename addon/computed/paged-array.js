import Ember from 'ember';
import PagedArray from 'ember-cli-pagination/local/paged-array';
import PagedInfiniteArray from 'ember-cli-pagination/infinite/paged-infinite-array';

function makeLocal(contentProperty,ops) {
  return Ember.computed("",function() {
    var pagedOps = {}; //{content: this.get(contentProperty)};
    pagedOps.parent = this;

    var getVal = function(key,val) {
      if (key.match(/Binding$/)) {
        return "parent."+val;
        //return Ember.Binding.oneWay("parent."+val);
      }
      else {
        return val;
      }
    };

    for (var key in ops) {
      pagedOps[key] = getVal(key,ops[key]);
    }

    var paged = PagedArray.extend({
      contentBinding: "parent."+contentProperty
    }).create(pagedOps);
    // paged.lockToRange();
    return paged;
  });
}

function makeInfiniteWithPagedSource(contentProperty /*, ops */) {
  return Ember.computed(function() {
    return PagedInfiniteArray.create({all: this.get(contentProperty)});
  });
}

function makeInfiniteWithUnpagedSource(contentProperty,ops) {
  return Ember.computed(function() {
    ops.all = this.get(contentProperty);
    return PagedInfiniteArray.createFromUnpaged(ops);
  });
}

export default function(contentProperty,ops) {
  ops = ops || {};

  if (ops.infinite === true) {
    return makeInfiniteWithPagedSource(contentProperty,ops);
  }
  else if (ops.infinite) {
    return makeInfiniteWithUnpagedSource(contentProperty,ops);
  }
  else {
    return makeLocal(contentProperty,ops);
  }
}
