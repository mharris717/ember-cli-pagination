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

    f.call(this,subject,ops);
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

paramTest("create with content", {content: makePagedArray([1,2,3,4,5])}, function(s,ops) {
  equal(s.get('totalPages'),3);
  equal(ops.content.get('totalPages'),3);
});

paramTest("create with content - changing array.content changes component", {content: makePagedArray([1,2,3,4,5])}, function(s,ops) {
  equal(s.get('totalPages'),3);
  Ember.run(function() {
    ops.content.pushObjects([6,7]);
  });
  equal(s.get('totalPages'),4);
});

paramTest("create with content - changing page changes content value", {content: makePagedArray([1,2,3,4,5])}, function(s,ops) {
  equal(s.get('totalPages'),3);
  Ember.run(function() {
    ops.content.set("page",2);
  });
  equal(s.get('currentPage'),2);
});

paramTest("template smoke", {content: makePagedArray([1,2,3,4,5])}, function(s) {
  equal(this.$().find(".page-number").length,3);
  equal(this.$().find(".prev.disabled").length,1);
  equal(this.$().find(".next.enabled-arrow").length,1);
});

paramTest("template smoke 2", {content: makePagedArray([1,2,3,4,5])}, function(s) {
  this.append();
  
  hasPages(3);
  hasActivePage(1);

  clickPage(2);
  andThen(function() {
    hasActivePage(2);
  });
});

paramTest("truncation", {currentPage: 2, totalPages: 10}, function(s) {
  var pages = s.get('pageItems').map(function(obj) {
    return obj.page;
  });

  deepEqual(pages,[1,2,3,4,5,6,7,10]);
});

paramTest("truncation ops", {currentPage: 2, totalPages: 10, numPagesToShowAfter: 1}, function(s) {
  var pages = s.get('pageItems').map(function(obj) {
    return obj.page;
  });

  deepEqual(pages,[1,2,3,10]);
});