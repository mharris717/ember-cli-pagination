import Ember from 'ember';
import PagedArray from 'ember-cli-pagination/local/paged-array';
import PagedInfiniteArray from 'ember-cli-pagination/infinite/paged-infinite-array';

function makeLocal(contentProperty,ops) {
  return Ember.computed("",function() {
    const pagedOps = {
      parent: this,
      content: Ember.computed.alias('parent.' + contentProperty)
    };

    // update the old binding method to the new alias method
    // converts {pageBinding: 'page'} to {page: Ember.computed.alias('parent.page')}
    for (var key in ops) {
      if ( ops.hasOwnProperty(key) ) {
        const alias = key.replace(/Binding$/, '')
        const value = ops[key]
        if ( alias !== key ) {
          pagedOps[alias] = Ember.computed.alias('parent.' + value);
          Ember.deprecate('Using Binding is deprecated, use Ember.computed.alias or Ember.computed.oneWay instead', false, {
            id: 'addon.ember-cli-pagination.paged-array',
            until: '3.0.0',
            url: 'http://emberjs.com/deprecations/v2.x#toc_ember-binding' // @TODO change this to our changelog entry
          });
          // ^ deprecation warning based off of https://github.com/emberjs/ember.js/pull/13920/files
        }
        else {
          pagedOps[key] = value;
        }
      }
    }

    const paged = PagedArray.create(pagedOps);

    // paged.lockToRange();
    return paged;
  });
}

function makeInfiniteWithPagedSource(contentProperty /*, ops */) {
  return Ember.computed(contentProperty, function() {
    return PagedInfiniteArray.create({all: this.get(contentProperty)});
  });
}

function makeInfiniteWithUnpagedSource(contentProperty,ops) {
  return Ember.computed(contentProperty, function() {
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
