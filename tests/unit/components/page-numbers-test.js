import Ember from 'ember';
import { test, moduleForComponent } from 'ember-qunit';
import PagedArray from 'ember-cli-pagination/local/paged-array';

moduleForComponent("page-numbers", {unit: true});

var paramTest = function(name,ops,f) {
  test(name, function(assert) {
    var subject = this.subject();

    Ember.run(function() {
      Object.keys(ops).forEach(function (key) {
          var value = ops[key];
          subject.set(key,value);
      });
    });

    f.call(this,subject,assert,ops);
  });
};

test('hasPages', function(assert) {
  assert.expect(2);
  var s = this.subject();

  Ember.run(function() {
    s.set('content', {totalPages: 1});
  });
  assert.equal(s.get('hasPages'),false);

  Ember.run(function() {
    s.set('content', {totalPages: 2});
  });
  assert.equal(s.get('hasPages'),true);
});

test("canStepBackward", function(assert) {
  var s = this.subject();
  Ember.run(function() {
    s.set('content', {page: 1});
  });
  assert.equal(s.get('canStepBackward'),false);
});

paramTest("first page", {content: {page: 1, totalPages: 10}}, function(s,assert) {
  assert.equal(s.get('canStepBackward'),false);
  assert.equal(s.get('canStepForward'),true);
});

paramTest("last page page", {content: {page: 10, totalPages: 10}}, function(s,assert) {
  assert.equal(s.get('canStepBackward'),true);
  assert.equal(s.get('canStepForward'),false);
});

paramTest("middle page", {content: {page: 5, totalPages: 10}}, function(s,assert) {
  assert.equal(s.get('canStepBackward'),true);
  assert.equal(s.get('canStepForward'),true);
});

paramTest("only one page", {content: {page: 1, totalPages: 1}}, function(s,assert) {
  assert.equal(s.get('canStepBackward'),false);
  assert.equal(s.get('canStepForward'),false);
});


var makePagedArray = function(list) {
  list = Ember.A(list);
  return PagedArray.create({content: list, perPage: 2, page: 1});
};

paramTest("create with content", {content: makePagedArray([1,2,3,4,5])}, function(s,assert,ops) {
  assert.equal(s.get('totalPages'),3);
  assert.equal(ops.content.get('totalPages'),3);
});



paramTest("create with content - changing array.content changes component", {content: makePagedArray([1,2,3,4,5])}, function(s,assert,ops) {
  assert.equal(s.get('totalPages'),3);
  Ember.run(function() {
    ops.content.pushObjects([6,7]);
  });
  assert.equal(s.get('totalPages'),4);
});

paramTest("create with content - changing page changes content value", {content: makePagedArray([1,2,3,4,5])}, function(s,assert,ops) {
  assert.equal(s.get('totalPages'),3);
  Ember.run(function() {
    ops.content.set("page",2);
  });
  assert.equal(s.get('currentPage'),2);
});

paramTest("template smoke", {content: makePagedArray([1,2,3,4,5])}, function(s,assert) {
  assert.equal(this.$().find(".page-number").length,3);
  assert.equal(this.$().find(".prev.disabled").length,1);
  assert.equal(this.$().find(".next.enabled-arrow").length,1);
});

paramTest("arrows and pages in right order", {content: makePagedArray([1,2,3,4,5])}, function(s,assert) {
  var pageItems = this.$().find("ul.pagination li");
  assert.equal(pageItems.length,5);

  assert.equal(pageItems.eq(0).hasClass("prev"),true);
  assert.equal(pageItems.eq(1).text(),1);
  assert.equal(pageItems.eq(2).text(),2);
  assert.equal(pageItems.eq(3).text(),3);
  assert.equal(pageItems.eq(4).hasClass("next"),true);
});

paramTest("truncation", {content: {page: 2, totalPages: 10}, numPagesToShow: 5}, function(s,assert) {
  var pages = s.get('pageItems').map(function(obj) {
    return obj.page;
  });

  assert.deepEqual(pages,[1,2,3,4,5]);
});

paramTest("truncation with showFL = true", {content: {page: 2, totalPages: 10}, numPagesToShow: 5, showFL: true}, function(s,assert) {
  var pages = s.get('pageItems').map(function(obj) {
    return obj.page;
  });

  assert.deepEqual(pages,[1,2,3,4,5,6,10]);
});



paramTest("pageClicked sends default event", {content: makePagedArray([1,2,3,4,5])}, function(s,assert,ops) {
  var actionCounter = 0;
  var clickedPage = null;
  var containingObject = {
    doThing: function(n) {
      actionCounter++;
      clickedPage = n;
    }
  };

  s.set('targetObject',containingObject);
  s.set('action','doThing');

  assert.equal(s.get('totalPages'),3);
  Ember.run(function() {
    s.send('pageClicked',2);
  });
  assert.equal(s.get('currentPage'),2);
  assert.equal(actionCounter,1);
  assert.equal(clickedPage,2);
});

paramTest("incrementPage sends default event", {content: makePagedArray([1,2,3,4,5])}, function(s,assert,ops) {
  var actionCounter = 0;
  var clickedPage = null;
  var containingObject = {
    doThing: function(n) {
      actionCounter++;
      clickedPage = n;
    }
  };

  s.set('targetObject',containingObject);
  s.set('action','doThing');

  assert.equal(s.get('totalPages'),3);
  Ember.run(function() {
    s.send('incrementPage',1);
  });
  assert.equal(s.get('currentPage'),2);
  assert.equal(actionCounter,1);
  assert.equal(clickedPage,2);
});

paramTest("invalid incrementPage does not send default event", {content: makePagedArray([1,2,3,4,5])}, function(s,assert,ops) {
  var actionCounter = 0;
  var clickedPage = null;
  var containingObject = {
    doThing: function(n) {
      actionCounter++;
      clickedPage = n;
    }
  };

  s.set('targetObject',containingObject);
  s.set('action','doThing');

  assert.equal(s.get('totalPages'),3);
  Ember.run(function() {
    s.send('incrementPage',-1);
  });
  assert.equal(s.get('currentPage'),1);
  assert.equal(actionCounter,0);
});

paramTest("invalid page send invalidPage component action", {content: makePagedArray([1,2,3,4,5])}, function(s,assert,ops) {
  var actionCounter = 0;
  var pageEvent = null;
  var containingObject = {
    doThing: function(n) {
      actionCounter++;
      pageEvent = n;
    }
  };

  s.set('targetObject',containingObject);
  s.set('invalidPageAction','doThing');

  assert.equal(s.get('totalPages'),3);
  Ember.run(function() {
    s.get('content').set('page',99);
  });
  assert.equal(pageEvent.page,99);
  assert.equal(actionCounter,1);
});
/*
*/
