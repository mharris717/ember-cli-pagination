import Ember from 'ember';
import { test } from 'ember-qunit';
import PageItems from 'ember-cli-pagination/lib/page-items';
import Validate from 'ember-cli-pagination/validate';

module("PageItems");

var paramTest = function(name,ops,f) {
  test(name, function() {
    var subject = null;

    Ember.run(function() {
      subject = PageItems.create(ops);
    });

    f(subject);
  });
};

paramTest("smoke", {currentPage: 2, totalPages: 4}, function(s) {
  equal(s.get('pageItems').length,4);
  deepEqual(s.get('pageItems')[0],{page: 1, current: false, dots: false});
  deepEqual(s.get('pageItems')[1],{page: 2, current: true, dots: false});
});

paramTest("truncated", {currentPage: 15, totalPages: 50, truncatePages: true, numPagesToShow: 10}, function(s) {
  equal(s.get('pageItems').length,10);
  deepEqual(s.get('pageItems')[0],{page: 10, current: false, dots: false});
});

paramTest("dots", {currentPage: 15, totalPages: 50, truncatePages: true, numPagesToShow: 10, showFL: true}, function(s) {
  equal(s.get('pageItems').length,12);
  deepEqual(s.get('pageItems')[0],{page: 1, current: false, dots: false});
  deepEqual(s.get('pageItems')[1],{page: 10, current: false, dots: true});
});
