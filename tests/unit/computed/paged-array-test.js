import Ember from 'ember';
import { test } from 'ember-qunit';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

module("Paged Array Property");

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

test("passing perPage to pagedArray", function() {
  var Something = Ember.Object.extend({
    pagedContent: pagedArray("content", {perPage: 2})
  });

  var object = Something.create({content: [1,2,3,4,5]});

  deepEqual(toArray(object.get('pagedContent')),[1,2]);
});

test("passing perPage to pagedArray", function() {
  var Something = Ember.Object.extend({
    pagedContent: pagedArray("content", {perPage: 2, page: 2})
  });

  var object = Something.create({content: [1,2,3,4,5]});

  deepEqual(toArray(object.get('pagedContent')),[3,4]);
});

test("passing perPage to pagedArray", function() {
  var Something = Ember.Object.extend({
    pagedContent: pagedArray("content", {perPage: 2, pageBinding: "page"})
  });

  var object = Something.create({
    content: [1,2,3,4,5],
    page: 2
  });

  deepEqual(toArray(object.get('pagedContent')),[3,4]);
});