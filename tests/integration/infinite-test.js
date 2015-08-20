import startApp from '../helpers/start-app';
import pretenderServer from '../helpers/pretender-server';
import Todo from '../../models/todo';
import Ember from 'ember';
import { test, module } from 'qunit';

var App = null;
var server = null;

var todosTestLocal = function(name, f) {
  test(name, function(assert) {
    visit("/todos/infinite").then(function() {
      f(assert);
    });
  });
};

var todosTestRemote = function(name, f) {
  test(name, function(assert) {
    visit("/todos/infinite-remote").then(function() {
      f(assert);
    });
  });
};

var runTests = function(todosTest) {
  todosTest("smoke", function(assert) {
    hasTodos(assert,10);
  });

  todosTest("next page", function(assert) {
    assert.expect(2);
    hasTodos(assert,10);

    click(".infinite .next a");
    andThen(function() {
      assert.equal(find('.infinite .todo').length,20);
    });
  });
};

module('Integration - Infinite Pagination Local', {
  setup: function() {
    App = startApp();
    server = pretenderServer();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    server.shutdown();
  }
});

runTests(todosTestLocal);

module('Integration - Infinite Pagination Remote', {
  setup: function() {
    App = startApp();
    server = pretenderServer();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    server.shutdown();
  }
});
runTests(todosTestRemote);

