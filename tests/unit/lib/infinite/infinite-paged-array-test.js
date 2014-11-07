import Ember from 'ember';
import { test } from 'ember-qunit';
import PagedArray from 'ember-cli-pagination/local/paged-array';
import PagedRemoteArray from 'ember-cli-pagination/remote/paged-remote-array';
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
    var me = this;
    arr.then(function(r) {
      r.forEach(function(x) {
        me.get('content').pushObject(x);
      });
      //me.get('content').pushObjects(r);
    });
  },

  getRecordsForPage: function(page) {
    throw "Not Implemented";
  }
});

var InfinitePagedArray = InfiniteBase.extend({
  getRecordsForPage: function(page) {
    var c = this.get('all');
    c.set('page',page);

    return new Ember.RSVP.Promise(function(success) {
      c.then(function(c2) {
        success(c2);
      });
    });
    //return toArray(c);
    
  },

  then: function(f) {
    var all = this.get('all');
    if (all.then) {
      all.then(f);
    }
    else {
      f();
    }
  }
});

asyncTest("smoke", function() {
  var s = InfinitePagedArray.create({all: makeAllPaged()});
  setTimeout(function() {
    equalArray(s.get('content'),[1,2]);
    QUnit.start();
  },50);
});

// test("add next page", function() {
//   var s = InfinitePagedArray.create({all: makeAllPaged()});
//   equalArray(s,[1,2]);
//   s.moveToNextPage();
//   equalArray(s,[1,2,3,4]);
// });

// asyncTest("page 1", function() {
//   var store = FakeStore.create({all: [1,2,3,4,5]});

//   var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2});

//   paged.then(function() {
//     equalArray(paged,[1,2]);
//     QUnit.start();
//   });
// });

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

// asyncTest("remote smoke", function() {
//   var store = FakeStore.create({all: [1,2,3,4,5]});
//   var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2});

//   var s = InfinitePagedArray.create({all: paged});
//   s.then(function() {
//     equalArray(s,[1,2]);
//     QUnit.start();
//   });
  
// });