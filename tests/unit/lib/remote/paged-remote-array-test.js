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

// module("PagedRemoteArray");

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
    var all = Ember.A(this.get('all'));
    var paged = PagedLocalArray.create({page: params.page, perPage: params.per_page, content: all});
    var res = toArray(paged);

    var totalPages = DivideIntoPages.create({all: all, perPage: params.per_page}).totalPages();
    var key = this.get('totalPagesField') || 'total_pages';
    res.meta = {};
    res.meta[key] = totalPages;

    return new Promise(function(success,failure) {
      success(Ember.A(res));
    });
  },

  query: function(name,params) {
    return this.find(name,params);
  }
});

var asyncTest = test;

asyncTest("page 1", function(assert) {
  assert.expect(1);
  var store = FakeStore.create({all: [1,2,3,4,5]});

  var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2});

  paged.then(function() {
    equalArray(assert,paged,[1,2]);
  });
});


asyncTest("page 2", function(assert) {
  assert.expect(1);
  var store = FakeStore.create({all: [1,2,3,4,5]});

  var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 2, perPage: 2});

  paged.then(function() {
    equalArray(assert,paged,[3,4]);
  });
});

asyncTest("change page", function(assert) {
  assert.expect(2);
  var store = FakeStore.create({all: [1,2,3,4,5]});

  var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2});

  paged.then(function() {
    equalArray(assert,paged,[1,2]);

    paged.runSet("page",2);

    paged.then(function() {
      equalArray(assert,paged,[3,4]);
    });

  });
});

var ErrorStore = Ember.Object.extend({
  find: function() {
    return new Promise(function(success,failure) {
      failure("Network Error");
    });
  },

  query: function(modelName,params) {
    return this.find(modelName,params);
  }
});

asyncTest("remote error", function(assert) {
  assert.expect(1);
  var store = ErrorStore.create({all: [1,2,3,4,5]});

  var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2});

  paged.then(function() {
    throw "should not be here";
  }, function() {
    equalArray(assert,paged,[]);
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

asyncTest("notifies observer", function(assert) {
  assert.expect(4);

  var store = FakeStore.create({all: [1,2,3,4,5]});
  var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2});

  var observer = MyArrayObserver.create();
  paged.addArrayObserver(observer);

  paged.then(function() {
    equalArray(assert,paged,[1,2]);
    // not sure if I want this to be 0
    assert.equal(observer.get('arrayDidChangeCount'),1);

    paged.set("page",2);
    paged.then(function() {
      equalArray(assert,paged,[3,4]);
      assert.equal(observer.get('arrayDidChangeCount'),2);
    });
  });
});

asyncTest("takes otherParams", function(assert) {
  assert.expect(3);

  var store = MockStore.create();

  var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2, otherParams: {name: "Adam"}});
  paged.then(function() {
    var findArgs = store.get('findArgs');
    assert.equal(findArgs.length,1);
    assert.equal(findArgs[0].params.page,1);
    assert.equal(findArgs[0].params.name,"Adam");
  });
});

test("paramsForBackend", function(assert) {
  var store = MockStore.create();
  var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2});
  var res = paged.get('paramsForBackend');
  assert.deepEqual(res,{page: 1, per_page: 2});
});



test("paramsForBackend with otherParams", function(assert) {
  var store = MockStore.create();
  var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2, otherParams: {name: "Adam"}});
  var res = paged.get('paramsForBackend');
  assert.deepEqual(res,{page: 1, per_page: 2, name: "Adam"});
});

test("paramsForBackend with param mapping", function(assert) {
  var store = MockStore.create();
  var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2});

  //paged.set('paramMapping', {page: "currentPage"});
  paged.addQueryParamMapping('page','currentPage');
  var res = paged.get('paramsForBackend');
  assert.deepEqual(res,{currentPage: 1, per_page: 2});
});

test("paramsForBackend with param mapping and function", function(assert) {
  var store = MockStore.create();
  var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2});
  paged.addQueryParamMapping('page','currentPage',function(ops) { return ops.perPage + ops.page; });
  var res = paged.get('paramsForBackend');
  assert.deepEqual(res, {currentPage: 3, per_page: 2});
});



asyncTest("basic meta", function(assert) {
  assert.expect(1);
  var store = FakeStore.create({all: [1,2,3,4,5]});
  var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2});

  paged.then(function() {
    var meta = paged.get('meta');
    assert.equal(meta.total_pages,3);
  });
});

asyncTest("meta with num_pages", function(assert) {
  assert.expect(1);

  var store = FakeStore.create({all: [1,2,3,4,5], totalPagesField: 'num_pages'});
  var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2});
  paged.set('paramMapping',{total_pages: 'num_pages'});

  paged.then(function() {
    var meta = paged.get('meta');
    assert.equal(meta.total_pages,3);
  });
});

asyncTest("meta with num_pages and function", function(assert) {
  assert.expect(1);
  var store = FakeStore.create({all: [1,2,3,4,5], totalPagesField: 'num_pages'});
  var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2});
  paged.addMetaResponseMapping('total_pages','num_pages',function(ops) { return ops.rawVal + ops.page + ops.perPage; });

  paged.then(function() {
    var meta = paged.get('meta');
    assert.equal(meta.total_pages,6);
  });
});
