import Ember from 'ember';
import { moduleForModel, test } from 'ember-qunit';
import DivideIntoPages from 'ember-cli-pagination/divide-into-pages';

var paramTest = function(name,ops,f) {
  test(name, function(assert) {
    var subject = null;

    Ember.run(function() {
      subject = DivideIntoPages.create(ops);
    });

    f(subject,assert);
  });
};

paramTest("smoke", {perPage: 2, all: [1,2,3,4,5]}, function(s,assert) {
  assert.equal(s.totalPages(),3);
  assert.deepEqual(s.objsForPage(2),[3,4]);
});

paramTest("page out of range returns empty array", {perPage: 2, all: [1,2,3,4,5]}, function(s,assert) {
  assert.deepEqual(s.objsForPage(25),[]);
});