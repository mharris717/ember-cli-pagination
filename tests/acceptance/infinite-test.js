import { click, findAll, visit } from '@ember/test-helpers';
import { hasTodos } from '../helpers/assertions';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import pretenderServer from '../helpers/pretender-server';

let server = null;

let todosTestLocal = function(name, f) {
  test(name, async function(assert) {
    await visit("/todos/infinite");
    
    await f(assert);
  });
};

let todosTestRemote = function(name, f) {
  test(name, async function(assert) {
    await visit("/todos/infinite-remote");
    
    await f(assert);
  });
};

let runTests = function(todosTest) {
  todosTest("smoke", function(assert) {
    hasTodos(assert,10);
  });

  todosTest("next page", async function(assert) {
    hasTodos(assert,10);

    await click(".infinite .next a");
    assert.equal(findAll('.infinite .todo').length,20);
  });
};

module('Acceptance - Infinite Pagination Local', function(hooks) {
  setupApplicationTest(hooks);
  
  hooks.beforeEach(function() {
    server = pretenderServer();
  });

  hooks.afterEach(function() {
    server.shutdown();
  });

  runTests(todosTestLocal);
});

module('Acceptance - Infinite Pagination Remote', function(hooks) {
  setupApplicationTest(hooks);
  
  hooks.beforeEach(function() {
    server = pretenderServer();
  });

  hooks.afterEach(function() {
    server.shutdown();
  });

  runTests(todosTestRemote);
});

