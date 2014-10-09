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

Ember.Test.registerAsyncHelper('hasActivePage', function(app, num, context) {
  var i = 0;
  findWithAssert(".pagination li.page-number", context).each(function() {
    var li = $(this);
    var active = num - 1 === i;
    equal(li.hasClass('active'), active, "Has active page");
    i += 1;
  });
});

var hasButtons = function(ops) {
  for (var name in ops) {
    var present = ops[name];

    if(present) {
      equal(find(".pagination ." + name + ".enabled-arrow").length, 1);
    } else {
      equal(find(".pagination ." + name + ".disabled").length, 1);
    }
  }
};

var hasTodos = function(l) {
  equal(find("table tr.todo").length, l);
};

var hasPages = function(l) {
  equal(find(".pagination li.page-number").length, l, "Expected "+l+" Pages");
};

var clickPage = function(i) {
  if (i === "prev" || i === "next") {
    click(".pagination ." + i + " a");
  } else {
    click(".pagination li.page-number:eq(" + (i - 1) + ") a");
  }
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