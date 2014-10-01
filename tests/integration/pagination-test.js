import startApp from '../helpers/start-app';
import pretenderServer from '../helpers/pretender-server';
import Todo from '../../models/todo';
import Ember from 'ember';
var App, clickPage, hasButtons, hasPages, hasTodos, server, todosTest;

App = null;

server = null;

module('Integration - Pagination', {
  setup: function() {
    App = startApp();
    return server = pretenderServer();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    return server.shutdown();
  }
});

todosTest = function(name, f) {
  return test(name, function() {
    return visit("/todos").then(f);
  });
};

Ember.Test.registerAsyncHelper('hasActivePage', function(app, num, context) {
  var i;
  i = 0;
  return findWithAssert(".pagination li.page-number", context).each(function() {
    var active, li;
    li = $(this);
    active = num - 1 === i;
    equal(li.hasClass('active'), active);
    return i += 1;
  });
});

hasTodos = function(l) {
  return equal(find("table tr.todo").length, l);
};

hasPages = function(l) {
  return equal(find(".pagination li.page-number").length, l);
};

clickPage = function(i) {
  if(i === "prev" || i === "next") {
    return click(".pagination li." + i + " a");
  } else {
    return click(".pagination li:eq(" + i + ") a");
  }
};

todosTest("page links", function() {
  equal(find(".pagination").length, 1);
  return hasPages(2);
});

todosTest("first page is active at start", function() {
  return hasActivePage(1);
});

todosTest("clicking page 2", function() {
  clickPage(2);
  return andThen(function() {
    hasTodos(1);
    return hasActivePage(2);
  });
});


todosTest("click next", function() {
  clickPage("next");
  return andThen(function() {
    hasTodos(1);
    return hasActivePage(2);
  });
});

todosTest("click prev", function() {
  clickPage(2);
  andThen(function() {
    return clickPage("prev");
  });
  return andThen(function() {
    hasTodos(2);
    return hasActivePage(1);
  });
});
