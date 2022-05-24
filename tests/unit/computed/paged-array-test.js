import { alias } from '@ember/object/computed';
import { run } from '@ember/runloop';
import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';
import { test } from 'qunit';
import pagedArray from 'ember-cli-pagination/computed/paged-array';
import toArray from '../../helpers/to-array';

// COMMENTEDOUTTEST
//module("paged-array");

test('passing perPage to pagedArray', function (assert) {
  var Something = EmberObject.extend({
    pagedContent: pagedArray('content', { perPage: 2 }),
  });

  var object = Something.create({ content: A([1, 2, 3, 4, 5]) });
  var res = null;
  run(function () {
    res = toArray(object.get('pagedContent'));
  });

  assert.deepEqual(res, [1, 2]);
});

test('passing perPage and page to pagedArray', function (assert) {
  var Something = EmberObject.extend({
    pagedContent: pagedArray('content', { perPage: 2, page: 2 }),
  });

  var object = Something.create({ content: A([1, 2, 3, 4, 5]) });

  assert.deepEqual(toArray(object.get('pagedContent')), [3, 4]);
});

test('passing page to pagedArray', function (assert) {
  var Something = EmberObject.extend({
    pagedContent: pagedArray('content', { perPage: 2, page: 2 }),
  });

  var object = Something.create({
    content: A([1, 2, 3, 4, 5]),
    page: 2,
  });

  assert.deepEqual(toArray(object.get('pagedContent')), [3, 4]);
});

test('doing binding the old binding way', function (assert) {
  var Something = EmberObject.extend({
    pagedContent: pagedArray('content', { pageBinding: 'page', perPage: 2 }),
  });

  var object = Something.create({
    content: A([1, 2, 3, 4, 5]),
    page: 2,
  });

  run(function () {
    object.set('page', 2);
  });

  assert.deepEqual(toArray(object.get('pagedContent')), [3, 4]);
});

test('doing binding the new alias way', function (assert) {
  var Something = EmberObject.extend({
    pagedContent: pagedArray('content', { perPage: 2 }),
    page: alias('pagedContent.page'),
  });

  var object = Something.create({
    content: A([1, 2, 3, 4, 5]),
    page: 2,
  });

  run(function () {
    object.set('page', 2);
  });

  assert.deepEqual(toArray(object.get('pagedContent')), [3, 4]);
});

test('passing perPage to pagedArray', function (assert) {
  var Something = EmberObject.extend({
    pagedContent: pagedArray('content', { page: 1, perPage: 3 }),
  });

  var object = Something.create({
    content: A([1, 2, 3, 4, 5]),
  });

  assert.deepEqual(toArray(object.get('pagedContent')), [1, 2, 3]);
});

test('pagedArray value changes when parent content property changes', function (assert) {
  var Something = EmberObject.extend({
    pagedContent: pagedArray('content', { page: 1, perPage: 2 }),
  });

  var object = Something.create({
    content: A([1, 2, 3, 4, 5]),
  });

  assert.deepEqual(toArray(object.get('pagedContent')), [1, 2]);

  run(function () {
    object.set('content', A([6, 7, 8, 9, 10]));
  });

  assert.deepEqual(toArray(object.get('pagedContent')), [6, 7]);
});

test('pagedArray value changes when parent content property is modified', function (assert) {
  var Something = EmberObject.extend({
    pagedContent: pagedArray('content', { page: 2, perPage: 4 }),
  });

  var object = Something.create({
    content: A([1, 2, 3, 4, 5]),
  });

  assert.deepEqual(toArray(object.get('pagedContent')), [5]);

  object.get('content').pushObject(6);
  assert.deepEqual(toArray(object.get('pagedContent')), [5, 6]);
});

test('infinite smoke', function (assert) {
  var Something = EmberObject.extend({
    pagedContent: pagedArray('content', { perPage: 2 }),
    infiniteContent: pagedArray('pagedContent', { infinite: true }),
  });

  var object = Something.create({ content: A([1, 2, 3, 4, 5]) });

  assert.deepEqual(toArray(object.get('infiniteContent')), [1, 2]);

  object.get('infiniteContent').loadNextPage();

  assert.deepEqual(toArray(object.get('infiniteContent')), [1, 2, 3, 4]);
});

test('infinite smoke', function (assert) {
  var Something = EmberObject.extend({
    infiniteContent: pagedArray('content', {
      infinite: { source: 'unpaged' },
      perPage: 2,
    }),
  });

  var object = Something.create({ content: A([1, 2, 3, 4, 5]) });

  assert.deepEqual(toArray(object.get('infiniteContent')), [1, 2]);

  object.get('infiniteContent').loadNextPage();

  assert.deepEqual(toArray(object.get('infiniteContent')), [1, 2, 3, 4]);
});

test('filtered', function (assert) {
  var Something = EmberObject.extend({
    page: 1,
    filteredContent: computed('content.[]', 'min', function () {
      var min = this.min;
      var res = this.content;
      if (min) {
        res = res.filter(function (num) {
          return num >= min;
        });
      }
      return A(res);
    }),

    pagedContent: pagedArray('filteredContent', {
      'content.page': 2,
      perPage: 2,
    }),
    // ^ @TODO why `content.page` over `page`
  });

  var object = Something.create({
    content: A([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  });

  assert.deepEqual(toArray(object.get('pagedContent')), [1, 2]);
  run(function () {
    object.set('min', 8);
  });

  assert.deepEqual(toArray(object.get('pagedContent')), [8, 9]);
  run(function () {
    object.set('min', null);
  });
  assert.deepEqual(toArray(object.get('pagedContent')), [1, 2]);
  run(function () {
    object.set('pagedContent.page', 5);
  });
  assert.deepEqual(toArray(object.get('pagedContent')), [9, 10]);

  // Ember.run(function() {
  //   object.get('pagedContent').set('page',99);
  // });

  // deepEqual(object.get('pagedContent.page'),3);

  // object.get("content").pushObject(6);
  // deepEqual(toArray(object.get('pagedContent')),[5,6]);
});
