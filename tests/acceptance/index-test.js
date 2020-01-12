import { findAll, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import pretenderServer from '../helpers/pretender-server';

let server = null;

module('Acceptance - Todo Index', function(hooks) {
  setupApplicationTest(hooks);
  
  hooks.beforeEach(function() {
    server = pretenderServer();
  });

  hooks.afterEach(function() {
    server.shutdown();
  });

  test('Should showo todos', function(assert) {
    assert.expect(1);
    visit("/todos/remote").then(function() {
      assert.equal(findAll(".todo").length, 10);
    });
  });
});
