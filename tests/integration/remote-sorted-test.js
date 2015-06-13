import startApp from '../helpers/start-app';
import pretenderServer from '../helpers/pretender-server';
import Todo from '../../models/todo';
import Ember from 'ember';
import { test, module } from 'qunit';

var App = null;
var server = null;

module('Acceptaxnce | Pagination Remote Sorted', {
  setup: function() {
    App = startApp();
    server = pretenderServer();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    server.shutdown();
  }
});

var todosTest = function(name, f, sortByField) {
  test(name, function(assert) {
    var url = "/todos/remote-sorted";
    if (sortByField) {
      url += "?sortByField="+sortByField;
    }
    visit(url).then(function() {
      f(assert);
    });
  });
};

todosTest("smoke", function(assert) {
  assert.equal(find(".pagination").length, 1);
  hasPages(assert,4);
  hasTodo(assert,0,"Clean Gutters 0");
  hasTodo(assert,1,"Make Dinner 0");
});

todosTest("smoke sorted", function(assert) {
  assert.equal(find(".pagination").length, 1);
  hasPages(assert,4);

  hasTodo(assert,0,"Clean Gutters 0");
  hasTodo(assert,1,"Clean Gutters 1");

  assert.equal(find("#sortByField input").val(),"name");
},"name");

todosTest("change to sorted", function(assert) {
  assert.equal(find(".pagination").length, 1);
  hasPages(assert,4);
  hasTodo(assert,0,"Clean Gutters 0");
  hasTodo(assert,1,"Make Dinner 0");

  Ember.run(function() {
    fillIn("#sortByField input","name");
  });
  andThen(function() {
    hasTodo(assert,1,"Clean Gutters 1");
  });
});