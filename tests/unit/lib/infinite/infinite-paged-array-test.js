import { Promise } from 'rsvp';
import EmberObject from '@ember/object';
import { A } from '@ember/array';
import { test } from 'qunit';
import PagedArray from 'ember-cli-pagination/local/paged-array';
import PagedRemoteArray from 'ember-cli-pagination/remote/paged-remote-array';
import equalArray from '../../../helpers/equal-array';
import toArray from '../../../helpers/to-array';
import InfinitePagedArray from 'ember-cli-pagination/infinite/paged-infinite-array';

var makeAllPaged = function () {
  return PagedArray.create({
    perPage: 2,
    content: A([1, 2, 3, 4, 5]),
  });
};

test('smoke', function (assert) {
  assert.expect(1);
  var s = InfinitePagedArray.create({ all: makeAllPaged() });
  equalArray(assert, s, [1, 2]);
});

test('smoke', function (assert) {
  assert.expect(2);
  var s = InfinitePagedArray.create({ all: makeAllPaged() });
  s.then(function () {
    equalArray(assert, s, [1, 2]);
    assert.strictEqual(s.get('length'), 2);
  });
});

test('add next page', function (assert) {
  assert.expect(2);
  var s = InfinitePagedArray.create({ all: makeAllPaged() });
  equalArray(assert, s, [1, 2]);
  s.loadNextPage();
  equalArray(assert, s, [1, 2, 3, 4]);
});

test('add next page - unpagedSource', function (assert) {
  assert.expect(2);
  var s = InfinitePagedArray.createFromUnpaged({
    all: [1, 2, 3, 4, 5],
    perPage: 2,
  });
  equalArray(assert, s, [1, 2]);
  s.loadNextPage();
  equalArray(assert, s, [1, 2, 3, 4]);
});

import Util from 'ember-cli-pagination/util';

var FakeStore = EmberObject.extend({
  find: function (name, params) {
    Util.log('FakeStore#find params', params);
    var all = A(this.all);
    var paged = PagedArray.create({
      page: params.page,
      perPage: params.per_page,
      content: all,
    });
    var res = toArray(paged);

    return new Promise(function (success) {
      success(A(res));
    });
  },

  query: function (name, params) {
    return this.find(name, params);
  },
});

test('remote smoke', function (assert) {
  assert.expect(2);
  var store = FakeStore.create({ all: [1, 2, 3, 4, 5] });
  var paged = PagedRemoteArray.create({
    store: store,
    modelName: 'number',
    page: 1,
    perPage: 2,
  });

  var s = InfinitePagedArray.create({ all: paged });
  s.then(function () {
    equalArray(assert, s, [1, 2]);
    s.loadNextPage();

    s.then(function () {
      equalArray(assert, [1, 2, 3, 4], s);
    });
  });
});

test('remote smoke - call then on moveToNextPage', function (assert) {
  assert.expect(2);
  var store = FakeStore.create({ all: [1, 2, 3, 4, 5] });
  var paged = PagedRemoteArray.create({
    store: store,
    modelName: 'number',
    page: 1,
    perPage: 2,
  });

  var s = InfinitePagedArray.create({ all: paged });
  s.then(function () {
    equalArray(assert, s, [1, 2]);
    s.loadNextPage().then(function () {
      equalArray(assert, [1, 2, 3, 4], s);
    });
  });
});
