import Ember from 'ember';
import { test, moduleForComponent } from 'ember-qunit';
import PagedArray from 'ember-cli-pagination/local/paged-array';

moduleForComponent("page-numbers");

var paramTest = function(name,ops,f) {
  test(name, function() {
    var subject = this.subject();

    Ember.run(function() {
      Object.keys(ops).forEach(function (key) { 
          var value = ops[key];
          subject.set(key,value);
      });
    });

    f.call(this,subject);
  });
};

test("canStepBackwards", function() {
  var s = this.subject();
  Ember.run(function() {
    s.set("currentPage",1);
  });
  equal(s.get('canStepBackwards',false));
});

paramTest("first page", {currentPage: 1, totalPages: 10}, function(s) {
  equal(s.get('canStepBackward'),false);
  equal(s.get('canStepForward'),true);
});

paramTest("last page page", {currentPage: 10, totalPages: 10}, function(s) {
  equal(s.get('canStepBackward'),true);
  equal(s.get('canStepForward'),false);
});

paramTest("middle page", {currentPage: 5, totalPages: 10}, function(s) {
  equal(s.get('canStepBackward'),true);
  equal(s.get('canStepForward'),true);
});

paramTest("only one page", {currentPage: 1, totalPages: 1}, function(s) {
  equal(s.get('canStepBackward'),false);
  equal(s.get('canStepForward'),false);
});

var makePagedArray = function(list) {
  return PagedArray.create({content: list, perPage: 2, page: 1});
};

paramTest("create with content", {content: makePagedArray([1,2,3,4,5])}, function(s) {
  equal(s.get('totalPages'),3);
});

paramTest("template smoke", {content: makePagedArray([1,2,3,4,5])}, function(s) {
  equal(this.$().find(".page-number").length,3);
});