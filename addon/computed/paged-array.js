import Ember from 'ember';
import PagedArray from 'ember-cli-pagination/local/paged-array';

export default function(contentProperty,ops) {
  ops = ops || {};

  return Ember.computed(contentProperty,function() {
    var pagedOps = {content: this.get(contentProperty)};
    pagedOps.parent = this;

    if (ops.perPage) {
      pagedOps.perPage = ops.perPage;
    }

    if (ops.page) {
      pagedOps.page = ops.page;
    }

    if (ops.pageBinding) {
      pagedOps.pageBinding = "parent."+ops.pageBinding;
    }

    return PagedArray.create(pagedOps);
  });
}