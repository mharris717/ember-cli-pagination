import Ember from 'ember';
import { test } from 'ember-qunit';
import TruncatePages from 'ember-cli-pagination/lib/truncate-pages';
import Validate from 'ember-cli-pagination/validate';

// module("TruncatePages");

var paramTest = function(name,ops,f) {
  test(name, function(assert) {
    var subject = null;

    Ember.run(function() {
      subject = TruncatePages.create(ops);
    });

    f(subject,assert);
  });
};

// paramTest("smoke", {perPage: 2, all: [1,2,3,4,5]}, function(s) {
//   equal(s.totalPages(),3);
//   deepEqual(s.objsForPage(2),[3,4]);
// });

paramTest("smoke", {currentPage: 2, totalPages: 4}, function(s,assert) {
  assert.deepEqual(s.get('pagesToShow'),[1,2,3,4]);
});

paramTest("truncate pages, no scroll", {currentPage: 2, totalPages: 10, numPagesToShow: 5}, function(s,assert) {
  assert.deepEqual(s.get('pagesToShow'),[1,2,3,4,5]);
});

paramTest("truncate pages, scroll", {currentPage: 4, totalPages: 10, numPagesToShow: 5}, function(s,assert) {
  assert.deepEqual(s.get('pagesToShow'),[2,3,4,5,6]);
});

paramTest("smoke", {currentPage: 4, totalPages: 5, numPagesToShow: 1}, function(s,assert) {
  assert.deepEqual(s.get('pagesToShow'),[4]);
});

paramTest("negative numbers", {currentPage: 3, totalPages: 10, numPagesToShow:-99}, function(s,assert) {
  assert.deepEqual(s.get('pagesToShow'),[3]);
});

paramTest("zero to show", {currentPage: 5, totalPages: 10, numPagesToShow:0}, function(s,assert) {
  assert.deepEqual(s.get('pagesToShow'),[5]);
});

paramTest("string to show", {currentPage: 3, totalPages: 10, numPagesToShow:"2"}, function(s,assert) {
  assert.deepEqual(s.get('pagesToShow'),[2,3]);
});

paramTest("truncate pages, no scroll, showFL", {currentPage: 2, totalPages: 10, numPagesToShow: 5, showFL: true}, function(s,assert) {
  assert.deepEqual(s.get('pagesToShow'),[1,2,3,4,5,6,10]);
});

paramTest("truncate pages, scroll, ShowFL", {currentPage: 4, totalPages: 10, numPagesToShow: 5, showFL: true}, function(s,assert) {
  assert.deepEqual(s.get('pagesToShow'),[1,2,3,4,5,6,10]);
});

paramTest("truncate pages, scroll, ShowFL", {currentPage: 8, totalPages: 10, numPagesToShow: 5, showFL: true}, function(s,assert) {
  assert.deepEqual(s.get('pagesToShow'),[1,5,6,7,8,9,10]);
});

paramTest("truncate pages, scroll, ShowFL", {currentPage: 6, totalPages: 10, numPagesToShow: 5, showFL: true}, function(s,assert) {
  assert.deepEqual(s.get('pagesToShow'),[1,4,5,6,7,8,10]);
});

paramTest("if total pages is missing", {currentPage: 6}, function(s,assert) {
  assert.deepEqual(s.get('pagesToShow'),[6]);
  assert.equal(Validate.getLastInternalError(),"no int for totalPages val is null");
});