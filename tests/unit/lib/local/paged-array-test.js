import Ember from 'ember';
import { test } from 'ember-qunit';
import PagedArray from 'ember-cli-pagination/local/paged-array';
import toArray from '../../../helpers/to-array';

module("PagedArray");

var paramTest = function(name,ops,f) {
  test(name, function() {
    var subject = null;

    Ember.run(function() {
      subject = PagedArray.create(ops);
    });

    f(subject);
  });
};

paramTest("smoke", {page: 1, perPage: 2, content: [1,2,3,4,5]}, function(s) {
  equal(s.get('totalPages'),3);
  deepEqual(toArray(s),[1,2]);

  s.set('page',2);
  deepEqual(toArray(s),[3,4]);
});