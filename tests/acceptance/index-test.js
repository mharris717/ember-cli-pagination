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

  test('Should showo todos', async function(assert) {
    await visit("/todos/remote");
    
    assert.equal(findAll(".todo").length, 10)
  });
});
