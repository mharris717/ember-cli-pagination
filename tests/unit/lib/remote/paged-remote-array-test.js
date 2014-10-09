import Ember from 'ember';
import { test } from 'ember-qunit';
import PagedRemoteArray from 'ember-cli-pagination/remote/paged-remote-array';
import PagedLocalArray from 'ember-cli-pagination/local/paged-array';
import Util from 'ember-cli-pagination/util';

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

var toArray = function(a) {
  var res = [];
  if (a.forEach) {
    a.forEach(function(obj) {
      res.push(obj);
    });
  }
  else {
    res = a;
  }
  return res;
};

var equalArray = function(a,b) {
  a = toArray(a);
  b = toArray(b);

  deepEqual(a,b);
};

var FakeStore = Ember.Object.extend({
  find: function(name,params) {
    Util.log("FakeStore#find params",params);
    var all = this.get('all');
    var paged = PagedLocalArray.create({page: params.page, perPage: params.per_page, content: all});
    var res = toArray(paged);

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

// asyncTest("change page", function() {
//   var store = FakeStore.create({all: [1,2,3,4,5]});

//   var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2});

//   paged.then(function() {
//     equalArray(paged,[1,2]);
    
//     paged.set("page",2);

//     setTimeout(function() {
//       paged.then(function() {
//         equalArray(paged,[3,4]);
//         QUnit.start();
//       });
//     },10);
    
//   });
// });