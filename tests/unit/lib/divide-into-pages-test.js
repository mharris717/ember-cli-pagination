import Ember from 'ember';
import { test } from 'ember-qunit';
import DivideIntoPages from 'ember-cli-pagination/divide-into-pages';

module("DivideIntoPages");

var paramTest = function(name,ops,f) {
  test(name, function() {
    var subject = null;

    Ember.run(function() {
      subject = DivideIntoPages.create(ops);
    });

    f(subject);
  });
};

paramTest("smoke", {perPage: 2, all: [1,2,3,4,5]}, function(s) {
  equal(s.totalPages(),3);
  deepEqual(s.objsForPage(2),[3,4]);
});

paramTest("page out of range returns empty array", {perPage: 2, all: [1,2,3,4,5]}, function(s) {
  deepEqual(s.objsForPage(25),[]);
});