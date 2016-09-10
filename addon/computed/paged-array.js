import Ember from 'ember';
import PagedArray from 'ember-cli-pagination/local/paged-array';
import PagedInfiniteArray from 'ember-cli-pagination/infinite/paged-infinite-array';

function makeLocal(contentProperty,ops) {
  return Ember.computed(function() {
    const pagedOps = {}; //{content: this.get(contentProperty)};
    pagedOps.parent = this;

    for (var key in ops) {
      var val = ops[key];

      if (key.match(/Binding$/)) {
        var keyWithoutBinding = key.substr(0, key.lastIndexOf("Binding"));
        pagedOps[keyWithoutBinding] = Ember.computed.alias(`parent.${val}`);
      } else {
        pagedOps[key] = val;
      }
    }

    const paged = PagedArray.extend({
      content: Ember.computed.alias(`parent.${contentProperty}`)
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
    let all = this.get(contentProperty);
    if (all) {
      all = Ember.A(all);
    }
    ops.all = all;
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
