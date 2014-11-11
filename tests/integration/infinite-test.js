import startApp from '../helpers/start-app';
import pretenderServer from '../helpers/pretender-server';
import Todo from '../../models/todo';
import Ember from 'ember';

var App = null;
var server = null;

module('Integration - Infinite Pagination', {
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
    visit("/todos/infinite").then(f);
  });
};

todosTest("smoke", function() {
  equal(find(".pagination").length, 1);
  hasPages(4);

  equal(find('.infinite').length,1);
  equal(find('.infinite .todo').length,10);
});

todosTest("next page", function() {
  equal(find('.infinite').length,1);
  equal(find('.infinite .todo').length,10);

  click(".infinite .next a");
  andThen(function() {
    QUnit.stop();
    setTimeout(function() {
      equal(find('.infinite .todo').length,20);
      QUnit.start();
    },50);
  });
});
