import startApp from '../helpers/start-app';
import pretenderServer from '../helpers/pretender-server';
import Ember from 'ember';
import { test, module } from 'qunit';

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

test('Should showo todos', function(assert) {
  assert.expect(1);
  visit("/todos/remote").then(function() {
    assert.equal(find(".todo").length, 10);
  });
});
