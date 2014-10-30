import Ember from 'ember';
import { test } from 'ember-qunit';
import TruncatePages from 'ember-cli-pagination/lib/truncate-pages';

module("TruncatePages");

var paramTest = function(name,ops,f) {
  test(name, function() {
    var subject = null;

    Ember.run(function() {
      subject = TruncatePages.create(ops);
    });

    f(subject);
  });
};

// paramTest("smoke", {perPage: 2, all: [1,2,3,4,5]}, function(s) {
//   equal(s.totalPages(),3);
//   deepEqual(s.objsForPage(2),[3,4]);
// });

paramTest("smoke", {currentPage: 2, totalPages: 4}, function(s) {
  deepEqual(s.get('pagesToShow'),[1,2,3,4]);
});

paramTest("truncate after pages, always shows last page", {currentPage: 2, totalPages: 10, numPagesToShowAfter: 1}, function(s) {
  deepEqual(s.get('pagesToShow'),[1,2,3,10]);
});

paramTest("smoke", {currentPage: 4, totalPages: 5, numPagesToShowBefore: 1}, function(s) {
  deepEqual(s.get('pagesToShow'),[1,3,4,5]);
});

paramTest("negative numbers", {currentPage: 3, totalPages: 10, numPagesToShowBefore:-99, numPagesToShowAfter: 2}, function(s) {
  deepEqual(s.get('pagesToShow'),[1,3,4,5,10]);
});

paramTest("zero before", {currentPage: 3, totalPages: 10, numPagesToShowBefore:0, numPagesToShowAfter: 2}, function(s) {
  deepEqual(s.get('pagesToShow'),[1,3,4,5,10]);
});

paramTest("string before", {currentPage: 3, totalPages: 10, numPagesToShowBefore:0, numPagesToShowAfter: "2"}, function(s) {
  deepEqual(s.get('pagesToShow'),[1,3,4,5,10]);
});