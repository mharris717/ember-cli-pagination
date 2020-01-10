import { findAll, visit } from '@ember/test-helpers';
import { test } from 'qunit';
import pretenderServer from '../helpers/pretender-server';
import moduleForAcceptance from '../helpers/module-for-acceptance';

let server = null;

moduleForAcceptance('Acceptance - Todo Index', function(hooks) {
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
