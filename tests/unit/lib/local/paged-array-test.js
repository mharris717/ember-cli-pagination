import Ember from 'ember';
import { test } from 'ember-qunit';
import PagedArray from 'ember-cli-pagination/local/paged-array';
import equalArray from '../../../helpers/equal-array';

//module("PagedArray abc");

var paramTest = function(name,ops,f) {
  if (ops.content) {
    ops.content = Ember.A(ops.content);
  }
  test(name, function(assert) {
    var subject = null;

    Ember.run(function() {
      subject = PagedArray.create(ops);
    });

    f(subject,assert);
  });
};

paramTest("smoke", {page: 1, perPage: 2, content: [1,2,3,4,5]}, function(s,assert) {
  assert.equal(s.get('totalPages'),3);
  equalArray(assert,s,[1,2]);

  s.set('page',2);
  equalArray(assert,s,[3,4]);
});

paramTest("page out of range should give empty array", {page: 20, perPage: 2, content: [1,2,3,4,5]}, function(s,assert) {
  equalArray(assert,s,[]);
});

paramTest("working then method", {page: 1, perPage: 2, content: [1,2,3,4,5]}, function(s,assert) {
  equalArray(assert,s,[1,2]);

  s.set('page',2);
  s.then(function(res) {
    equalArray(assert,s,[3,4]);
    equalArray(assert,res,[3,4]);
  });
});

paramTest("page oob event test", {page: 1, perPage: 2, content: [1,2,3,4,5]}, function(s,assert) {
  var events = [];
  s.on('invalidPage', function(page) {
    events.push(page);
  });

  Ember.run(function() {
    s.set('page',20);
  });

  assert.equal(events.length,1);
  assert.equal(events[0].page,20);

  Ember.run(function() {
    s.set('page',2);
  });
  assert.equal(events.length,1);
});

import LockToRange from 'ember-cli-pagination/watch/lock-to-range';
paramTest("LockToRange", {page: 1, perPage: 2, content: [1,2,3,4,5]}, function(s,assert) {
  LockToRange.watch(s);
  Ember.run(function() {
    s.set('page',20);
  });

  equalArray(assert,s,[5]);

  Ember.run(function() {
    s.set('page',-10);
  });

  equalArray(assert,s,[1,2]);
});
