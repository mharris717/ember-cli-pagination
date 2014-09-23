import startApp from '../helpers/start-app';
import pretenderServer from '../helpers/pretender-server';
import Todo from '../../models/todo';
import Ember from 'ember';
var App, server, todosTest;

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

todosTest("page links", function() {
  equal(find(".pagination").length, 1);
  return equal(find(".pagination li.page-number").length, 2);
});

todosTest("first page is active at start", function() {
  return hasActivePage(1);
});

todosTest("clicking page 2", function() {
  click(".pagination li:eq(1) a");
  return andThen(function() {
    equal(find("table tr.todo").length, 1);
    return hasActivePage(2);
  });
});

todosTest("next button - proper buttons visible", function() {
  hasActivePage(1);
  equal(find(".pagination .prev").length, 0);
  return equal(find(".pagination .next").length, 1);
});

todosTest("click next", function() {
  click(".pagination .next a");
  return andThen(function() {
    equal(find(".pagination .prev").length, 1);
    equal(find(".pagination .next").length, 0);
    equal(find("table tr.todo").length, 1);
    return hasActivePage(2);
  });
});
