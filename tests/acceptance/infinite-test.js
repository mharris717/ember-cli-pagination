import { click, findAll, visit } from '@ember/test-helpers';
import { hasTodos } from '../helpers/assertions';
import { test } from 'qunit';
import pretenderServer from '../helpers/pretender-server';
import moduleForAcceptance from '../helpers/module-for-acceptance';

let server = null;

let todosTestLocal = function(name, f) {
  test(name, function(assert) {
    visit("/todos/infinite").then(function() {
      f(assert);
    });
  });
};

let todosTestRemote = function(name, f) {
  test(name, function(assert) {
    visit("/todos/infinite-remote").then(function() {
      f(assert);
    });
  });
};

let runTests = function(todosTest) {
  todosTest("smoke", function(assert) {
    hasTodos(assert,10);
  });

  todosTest("next page", async function(assert) {
    assert.expect(2);
    hasTodos(assert,10);

    await click(".infinite .next a");
    assert.equal(findAll('.infinite .todo').length,20);
  });
};

moduleForAcceptance('Acceptance - Infinite Pagination Local', function(hooks) {
  hooks.beforeEach(function() {
    server = pretenderServer();
  });

  hooks.afterEach(function() {
    server.shutdown();
  });

  runTests(todosTestLocal);
});

moduleForAcceptance('Acceptance - Infinite Pagination Remote', function(hooks) {
  hooks.beforeEach(function() {
    server = pretenderServer();
  });

  hooks.afterEach(function() {
    server.shutdown();
  });

  runTests(todosTestRemote);
});

