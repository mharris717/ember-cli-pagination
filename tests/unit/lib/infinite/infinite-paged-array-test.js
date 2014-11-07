import Ember from 'ember';
import { test } from 'ember-qunit';
import PagedArray from 'ember-cli-pagination/local/paged-array';
import equalArray from '../../../helpers/equal-array';
import toArray from '../../../helpers/to-array';

module("InfinitePagedArray");

var allPaged = PagedArray.create({
  perPage: 2,
  content: [1,2,3,4,5]
});

var InfinitePagedArray = Ember.ArrayProxy.extend({
  page: 1,

  init: function() {
    this.set('content',[]);
    this.addRecordsForPage(1);
  },

  getRecordsForPage: function(page) {
    allPaged.set('page',page);
    return toArray(allPaged);
  },

  addRecordsForPage: function(page) {
    var arr = this.getRecordsForPage(page);
    this.get('arrangedContent').pushObjects(arr);
  },

  moveToNextPage: function() {
    this.incrementProperty('page');
    var page = this.get('page');
    this.addRecordsForPage(page);
  }
});

// var paramTest = function(name,ops,f) {
//   test(name, function() {
//     var subject = null;

//     Ember.run(function() {
//       subject = InfinitePagedArray.create(ops);
//     });

//     f(subject);
//   });
// };

// paramTest("smoke", {page: 1, perPage: 2, content: [1,2,3,4,5]}, function(s) {
//   equal(s.get('totalPages'),3);
//   equalArray(s,[1,2]);

//   s.set('page',2);
//   equalArray(s,[3,4]);
// });

test("smoke", function() {
  var s = InfinitePagedArray.create();
  equalArray(s,[1,2]);
});

test("add next page", function() {
  var s = InfinitePagedArray.create();
  s.moveToNextPage();
  equalArray(s,[1,2,3,4]);
});