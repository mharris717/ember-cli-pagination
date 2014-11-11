import Ember from 'ember';
import { test } from 'ember-qunit';
import PagedArray from 'ember-cli-pagination/local/paged-array';
import PagedRemoteArray from 'ember-cli-pagination/remote/paged-remote-array';
import equalArray from '../../../helpers/equal-array';
import toArray from '../../../helpers/to-array';
import InfinitePagedArray from 'ember-cli-pagination/infinite/paged-infinite-array';

module("InfinitePagedArray");

var makeAllPaged = function() {
  return PagedArray.create({
    perPage: 2,
    content: [1,2,3,4,5]
  });
};

asyncTest("smoke", function() {
  var s = InfinitePagedArray.create({all: makeAllPaged()});
  setTimeout(function() {
    equalArray(s,[1,2]);
    QUnit.start();
  },50);
});

asyncTest("smoke", function() {
  var s = InfinitePagedArray.create({all: makeAllPaged()});
  s.then(function() {
    equalArray(s,[1,2]);
    equal(s.get('length'),2);
    QUnit.start();
  });
});

test("add next page", function() {
  var s = InfinitePagedArray.create({all: makeAllPaged()});
  equalArray(s,[1,2]);
  s.loadNextPage();
  equalArray(s,[1,2,3,4]);
});

test("add next page - unpagedSource", function() {
  var s = InfinitePagedArray.createFromUnpaged({all: [1,2,3,4,5], perPage: 2});
  equalArray(s,[1,2]);
  s.loadNextPage();
  equalArray(s,[1,2,3,4]);
});

import Util from 'ember-cli-pagination/util';

var FakeStore = Ember.Object.extend({
  find: function(name,params) {
    Util.log("FakeStore#find params",params);
    var all = this.get('all');
    var paged = PagedArray.create({page: params.page, perPage: params.per_page, content: all});
    var res = toArray(paged);

    return new Promise(function(success,failure) {
      success(res);
    });
  }
});

var Promise = Ember.RSVP.Promise;

asyncTest("remote smoke", function() {
  var store = FakeStore.create({all: [1,2,3,4,5]});
  var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2});

  var s = InfinitePagedArray.create({all: paged});
  s.then(function() {
    equalArray(s,[1,2]);
    s.loadNextPage();

    s.then(function() {
      equalArray([1,2,3,4],s);
      QUnit.start();
    });
  });
});

asyncTest("remote smoke - call then on moveToNextPage", function() {
  var store = FakeStore.create({all: [1,2,3,4,5]});
  var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2});

  var s = InfinitePagedArray.create({all: paged});
  s.then(function() {
    equalArray(s,[1,2]);
    s.loadNextPage().then(function() {
      equalArray([1,2,3,4],s);
      QUnit.start();
    });
  });
});