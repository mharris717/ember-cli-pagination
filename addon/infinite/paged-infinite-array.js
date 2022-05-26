import { A } from '@ember/array';
import { reads } from '@ember/object/computed';
import ArrayProxy from '@ember/array/proxy';
import PagedArray from 'ember-cli-pagination/local/paged-array';
// import PagedRemoteArray from 'ember-cli-pagination/remote/paged-remote-array';

var toArray = function (a) {
  var res = [];
  if (a.forEach) {
    a.forEach(function (obj) {
      res.push(obj);
    });
  } else {
    res = a;
  }
  return res;
};

var pushPromiseObjects = function (base, promise) {
  if (!base) {
    throw 'pushPromiseObjects no base';
  }
  if (!promise) {
    throw 'pushPromiseObjects no promise';
  }

  if (!promise.then) {
    throw 'pushPromiseObjects no promise.then';
  }

  if (!base.pushObjects) {
    throw 'pushPromiseObjects no base.pushObjects';
  }

  promise.then(function (r) {
    base.pushObjects(toArray(r));
  });
  return promise;
};

var InfiniteBase = ArrayProxy.extend({
  page: 1,

  arrangedContent: reads('content'),

  init: function () {
    this.set('content', A([]));

    this._super(...arguments);

    this.addRecordsForPage(1);
  },

  loadNextPage: function () {
    this.incrementProperty('page');
    const page = this.page;
    return this.addRecordsForPage(page);
  },

  addRecordsForPage: function (page) {
    const arr = this.getRecordsForPage(page);
    return pushPromiseObjects(this.content, arr);
  },

  getRecordsForPage: function (/* page */) {
    throw 'Not Implemented';
  },
});

var c = InfiniteBase.extend({
  getRecordsForPage: function (page) {
    const c = this.all;
    c.set('page', page);
    return c;
  },

  then: function (f, f2) {
    return this.all.then(f, f2);
  },
});

c.reopenClass({
  createFromUnpaged: function (ops) {
    var unpaged = A(ops.all);
    var perPage = ops.perPage || 10;
    var paged = PagedArray.create({ perPage: perPage, content: unpaged });
    return this.create({ all: paged });
  },
});

export default c;
