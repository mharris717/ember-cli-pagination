import startApp from '../helpers/start-app';
import pretenderServer from '../helpers/pretender-server';
import Ember from 'ember';

var App = null;
var server = null;

module('Integration - Todo Index', {
  setup: function() {
    App = startApp();
    server = pretenderServer();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    server.shutdown();
  }
});

test('Should showo todos', function() {
  visit("/todos").then(function() {
    equal(find(".todo").length, 2);
  });
});
