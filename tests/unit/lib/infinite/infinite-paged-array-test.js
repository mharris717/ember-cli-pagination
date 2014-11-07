import Ember from 'ember';
import { test } from 'ember-qunit';
import PagedArray from 'ember-cli-pagination/local/paged-array';
import equalArray from '../../../helpers/equal-array';
import toArray from '../../../helpers/to-array';

module("InfinitePagedArray");

var makeAllPaged = function() {
  return PagedArray.create({
    perPage: 2,
    content: [1,2,3,4,5]
  });
};

var InfiniteBase = Ember.Object.extend({
  page: 1,

  init: function() {
    this.set('content',[]);
    this.addRecordsForPage(1);
  },

  moveToNextPage: function() {
    this.incrementProperty('page');
    var page = this.get('page');
    this.addRecordsForPage(page);
  },

  forEach: function(f) {
    this.get('content').forEach(f);
  },

  addRecordsForPage: function(page) {
    var arr = this.getRecordsForPage(page);
    this.get('content').pushObjects(arr);
  },

  getRecordsForPage: function(page) {
    throw "Not Implemented";
  }
});

var InfinitePagedArray = InfiniteBase.extend({
  getRecordsForPage: function(page) {
    var c = this.get('all');
    c.set('page',page);
    return toArray(c);
  }
});

test("smoke", function() {
  var s = InfinitePagedArray.create({all: makeAllPaged()});
  equalArray(s,[1,2]);
});

test("add next page", function() {
  var s = InfinitePagedArray.create({all: makeAllPaged()});
  equalArray(s,[1,2]);
  s.moveToNextPage();
  equalArray(s,[1,2,3,4]);
});