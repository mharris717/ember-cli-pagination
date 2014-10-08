import startApp from '../helpers/start-app';
import pretenderServer from '../helpers/pretender-server';
import Todo from '../../models/todo';
import Ember from 'ember';

var App = null;
var server = null;

module('Integration - Pagination', {
  setup: function() {
    App = startApp();
    server = pretenderServer();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    server.shutdown();
  }
});

var todosTest = function(name, f) {
  test(name, function() {
    visit("/todos").then(f);
  });
};

Ember.Test.registerAsyncHelper('hasActivePage', function(app, num, context) {
  var i = 0;
  findWithAssert(".pagination li.page-number", context).each(function() {
    var li = $(this);
    var active = num - 1 === i;
    equal(li.hasClass('active'), active);
    i += 1;
  });
});

var hasButtons = function(ops) {
  for (var name in ops) {
    var present = ops[name];
    var length = present ? 1 : 0;
    equal(find(".pagination ." + name).length, length);
  }
};

var hasTodos = function(l) {
  equal(find("table tr.todo").length, l);
};

var hasPages = function(l) {
  equal(find(".pagination li.page-number").length, l);
};

var clickPage = function(i) {
  if (i === "prev" || i === "next") {
    click(".pagination ." + i + " a");
  } else {
    click(".pagination li:eq(" + (i - 1) + ") a");
  }
};

todosTest("page links", function() {
  equal(find(".pagination").length, 1);
  hasPages(2);
});

todosTest("first page is active at start", function() {
  hasActivePage(1);
});

todosTest("clicking page 2", function() {
  clickPage(2);
  andThen(function() {
    hasTodos(1);
    hasActivePage(2);
  });
});

todosTest("next button - proper buttons visible", function() {
  hasActivePage(1);
  hasButtons({
    prev: false,
    next: true
  });
});

todosTest("click next", function() {
  clickPage("next");
  andThen(function() {
    hasButtons({
      prev: true,
      next: false
    });
    hasTodos(1);
    hasActivePage(2);
  });
});

todosTest("click prev", function() {
  clickPage(2);
  andThen(function() {
    clickPage("prev");
  });
  andThen(function() {
    hasButtons({
      prev: false,
      next: true
    });
    hasTodos(2);
    hasActivePage(1);
  });
});
