import Ember from 'ember';
import { test } from 'ember-qunit';
import BasePagedRemoteArray from 'ember-cli-pagination/remote/paged-remote-array';
import PagedLocalArray from 'ember-cli-pagination/local/paged-array';
import Util from 'ember-cli-pagination/util';
import toArray from '../../../helpers/to-array';
import equalArray from '../../../helpers/equal-array';
import MockStore from '../../../helpers/mock-store';
import DivideIntoPages from 'ember-cli-pagination/divide-into-pages';

var RunSet = Ember.Mixin.create({
  runSet: function(k,v) {
    var me = this;
    Ember.run(function() {
      me.set(k,v);
    });
  }
});

var PagedRemoteArray = BasePagedRemoteArray.extend(RunSet);

module("PagedRemoteArray");

var Promise = Ember.RSVP.Promise;

var paramTest = function(name,ops,f) {
  test(name, function() {
    var subject = null;

    Ember.run(function() {
      subject = PagedRemoteArray.create(ops);
    });

    f(subject);
  });
};

var FakeStore = Ember.Object.extend({
  find: function(name,params) {
    Util.log("FakeStore#find params",params);
    var all = this.get('all');
    var paged = PagedLocalArray.create({page: params.page, perPage: params.per_page, content: all});
    var res = toArray(paged);

    var totalPages = DivideIntoPages.create({all: all, perPage: params.per_page}).totalPages();
    var key = this.get('totalPagesField') || 'total_pages';
    res.meta = {};
    res.meta[key] = totalPages;

    return new Promise(function(success,failure) {
      success(res);
    });
  }
});

asyncTest("page 1", function() {
  var store = FakeStore.create({all: [1,2,3,4,5]});

  var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2});

  paged.then(function() {
    equalArray(paged,[1,2]);
    QUnit.start();
  });
});

asyncTest("page 2", function() {
  var store = FakeStore.create({all: [1,2,3,4,5]});

  var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 2, perPage: 2});

  paged.then(function() {
    equalArray(paged,[3,4]);
    QUnit.start();
  });
});

asyncTest("change page", function() {
  var store = FakeStore.create({all: [1,2,3,4,5]});

  var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2});

  paged.then(function() {
    QUnit.start();
    equalArray(paged,[1,2]);
    
    paged.runSet("page",2);

    paged.then(function() {
      equalArray(paged,[3,4]);
    });

  });
});

asyncTest("double start", function() {
  var makePromise = function(res) {
    return new Promise(function(success) {
      setTimeout(function() {
        success(res);
      },5);
    });
  };

  var promise = makePromise(3);
  promise.then(function(res) {
    QUnit.start();
    equal(res,3);

    var promise2 = makePromise(5);
    QUnit.stop();
    promise2.then(function(res2) {
      QUnit.start();
      equal(res2,5);
    });
  });
});

var ErrorStore = Ember.Object.extend({
  find: function() {
    return new Promise(function(success,failure) {
      failure("Network Error");
    });
  }
});

asyncTest("remote error", function() {
  var store = ErrorStore.create({all: [1,2,3,4,5]});

  var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2});

  paged.then(function() {
    throw "should not be here";
  }, function() {
    equalArray(paged,[]);
    QUnit.start();
  });
});

var MyArrayObserver = Ember.Object.extend({
  arrayWillChangeCount: 0,
  arrayDidChangeCount: 0,

  arrayWillChange: function(observedObj, start, removeCount, addCount) {
    this.incrementProperty("arrayWillChangeCount");
  },

  arrayDidChange: function(observedObj, start, removeCount, addCount) {
    this.incrementProperty("arrayDidChangeCount");
  }
});

asyncTest("notifies observer", function() {
  var store = FakeStore.create({all: [1,2,3,4,5]});
  var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2});

  var observer = MyArrayObserver.create();
  paged.addArrayObserver(observer);

  paged.then(function() {
    QUnit.start();

    equalArray(paged,[1,2]);
    // not sure if I want this to be 0
    equal(observer.get('arrayDidChangeCount'),1);

    QUnit.stop();

    paged.set("page",2);
    paged.then(function() {
      QUnit.start();
      equalArray(paged,[3,4]);
      equal(observer.get('arrayDidChangeCount'),2);
    });
  });
});

asyncTest("takes otherParams", function() {
  var store = MockStore.create();

  var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2, otherParams: {name: "Adam"}});
  paged.then(function() {
    QUnit.start();

    var findArgs = store.get('findArgs');
    equal(findArgs.length,1);
    equal(findArgs[0].params.page,1);
    equal(findArgs[0].params.name,"Adam");
  });
});

test("paramsForBackend", function() {
  var store = MockStore.create();
  var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2});
  var res = paged.get('paramsForBackend');
  deepEqual(res,{page: 1, per_page: 2});
});

test("paramsForBackend with otherParams", function() {
  var store = MockStore.create();
  var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2, otherParams: {name: "Adam"}});
  var res = paged.get('paramsForBackend');
  deepEqual(res,{page: 1, per_page: 2, name: "Adam"});
});

test("paramsForBackend with param mapping", function() {
  var store = MockStore.create();
  var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2});
  
  //paged.set('paramMapping', {page: "currentPage"});
  paged.addQueryParamMapping('page','currentPage');
  var res = paged.get('paramsForBackend');
  deepEqual(res,{currentPage: 1, per_page: 2});
});

test("paramsForBackend with param mapping and function", function() {
  var store = MockStore.create();
  var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2});
  paged.addQueryParamMapping('page','currentPage',function(ops) { return ops.perPage + ops.page; });
  var res = paged.get('paramsForBackend');
  deepEqual(res, {currentPage: 3, per_page: 2});
});



asyncTest("basic meta", function() {
  var store = FakeStore.create({all: [1,2,3,4,5]});
  var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2});

  paged.then(function() {
    var meta = paged.get('meta');
    equal(meta.total_pages,3);
    QUnit.start();
  });
});

asyncTest("meta with num_pages", function() {
  var store = FakeStore.create({all: [1,2,3,4,5], totalPagesField: 'num_pages'});
  var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2});
  paged.set('paramMapping',{total_pages: 'num_pages'});

  paged.then(function() {
    var meta = paged.get('meta');
    equal(meta.total_pages,3);
    QUnit.start();
  });
});

asyncTest("meta with num_pages and function", function() {
  var store = FakeStore.create({all: [1,2,3,4,5], totalPagesField: 'num_pages'});
  var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2});
  paged.addMetaResponseMapping('total_pages','num_pages',function(ops) { return ops.rawVal + ops.page + ops.perPage; });

  paged.then(function() {
    var meta = paged.get('meta');
    equal(meta.total_pages,6);
    QUnit.start();
  });
});