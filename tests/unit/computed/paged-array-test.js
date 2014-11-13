import Ember from 'ember';
import { test } from 'ember-qunit';
import pagedArray from 'ember-cli-pagination/computed/paged-array';
import toArray from '../../helpers/to-array';

module("Paged Array Property");

test("passing perPage to pagedArray", function() {
  var Something = Ember.Object.extend({
    pagedContent: pagedArray("content", {perPage: 2})
  });

  var object = Something.create({content: [1,2,3,4,5]});

  deepEqual(toArray(object.get('pagedContent')),[1,2]);
});

test("passing perPage and page to pagedArray", function() {
  var Something = Ember.Object.extend({
    pagedContent: pagedArray("content", {perPage: 2, page: 2})
  });

  var object = Something.create({content: [1,2,3,4,5]});

  deepEqual(toArray(object.get('pagedContent')),[3,4]);
});

test("passing pageBinding to pagedArray", function() {
  var Something = Ember.Object.extend({
    pagedContent: pagedArray("content", {perPage: 2, pageBinding: "page"})
  });

  var object = Something.create({
    content: [1,2,3,4,5],
    page: 2
  });

  deepEqual(toArray(object.get('pagedContent')),[3,4]);
});

test("passing perPageBinding to pagedArray", function() {
  var Something = Ember.Object.extend({
    pagedContent: pagedArray("content", {page: 1, perPageBinding: "perPage"})
  });

  var object = Something.create({
    content: [1,2,3,4,5],
    perPage: 3
  });

  deepEqual(toArray(object.get('pagedContent')),[1,2,3]);
});

test("pagedArray value changes when parent content property changes", function() {
  var Something = Ember.Object.extend({
    pagedContent: pagedArray("content", {page: 1, perPage: 2})
  });

  var object = Something.create({
    content: [1,2,3,4,5]
  });

  deepEqual(toArray(object.get('pagedContent')),[1,2]);

  Ember.run(function() {
    object.set("content",[6,7,8,9,10]);
  });

  deepEqual(toArray(object.get('pagedContent')),[6,7]);
});

test("pagedArray value changes when parent content property is modified", function() {
  var Something = Ember.Object.extend({
    pagedContent: pagedArray("content", {page: 2, perPage: 4})
  });

  var object = Something.create({
    content: Ember.A([1,2,3,4,5])
  });

  deepEqual(toArray(object.get('pagedContent')),[5]);

  object.get("content").pushObject(6);
  deepEqual(toArray(object.get('pagedContent')),[5,6]);
});

test("pagedArray is locked to range by default", function() {
  var Something = Ember.Object.extend({
    pagedContent: pagedArray("content", {perPage: 2})
  });

  var object = Something.create({
    content: Ember.A([1,2,3,4,5])
  });

  deepEqual(toArray(object.get('pagedContent')),[1,2]);

  Ember.run(function() {
    object.get('pagedContent').set('page',99);
  });

  deepEqual(object.get('pagedContent.page'),3);

  // object.get("content").pushObject(6);
  // deepEqual(toArray(object.get('pagedContent')),[5,6]);
});

test("infinite smoke", function() {
  var Something = Ember.Object.extend({
    pagedContent: pagedArray("content", {perPage: 2}),
    infiniteContent: pagedArray("pagedContent", {infinite: true})
  });

  var object = Something.create({content: [1,2,3,4,5]});

  deepEqual(toArray(object.get('infiniteContent')),[1,2]);

  object.get('infiniteContent').loadNextPage();

  deepEqual(toArray(object.get('infiniteContent')),[1,2,3,4]);
});

test("infinite smoke", function() {
  var Something = Ember.Object.extend({
    infiniteContent: pagedArray("content", {infinite: {source: "unpaged"}, perPage: 2})
  });

  var object = Something.create({content: [1,2,3,4,5]});

  deepEqual(toArray(object.get('infiniteContent')),[1,2]);

  object.get('infiniteContent').loadNextPage();

  deepEqual(toArray(object.get('infiniteContent')),[1,2,3,4]);
});

test("filtered", function() {
  var Something = Ember.Object.extend({
    page: 1,
    filteredContent: function() {
      var min = this.get('min');
      var res = this.get('content');
      if (min) {
        res = res.filter(function(num) {
          return num >= min;
        });
      }
      return res;
    }.property("content.@each","min"),

    pagedContent: pagedArray("filteredContent", {perPage: 2, pageBinding: "page"})
  });

  var object = Something.create({
    content: Ember.A([1,2,3,4,5,6,7,8,9,10]),

  });

  deepEqual(toArray(object.get('pagedContent')),[1,2]);
  Ember.run(function() {
    object.set('min',8);
  });
  
  deepEqual(toArray(object.get('pagedContent')),[8,9]);
  Ember.run(function() {
    object.set('min',null);
  });
  deepEqual(toArray(object.get('pagedContent')),[1,2]);
  Ember.run(function() {
    object.set('pagedContent.page',5);
  });
  deepEqual(toArray(object.get('pagedContent')),[9,10]);

  Ember.run(function() {
    object.set('min',11);
  });
  deepEqual(toArray(object.get('pagedContent')),[]);

  // Ember.run(function() {
  //   object.get('pagedContent').set('page',99);
  // });

  // deepEqual(object.get('pagedContent.page'),3);

  // object.get("content").pushObject(6);
  // deepEqual(toArray(object.get('pagedContent')),[5,6]);
});