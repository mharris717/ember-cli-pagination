/* global hasTodos */
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import pretenderServer from '../helpers/pretender-server';

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

  todosTest("next page", function(assert) {
    assert.expect(2);
    hasTodos(assert,10);

    click(".infinite .next a");
    andThen(function() {
      assert.equal(find('.infinite .todo').length,20);
    });
  });
};

moduleForAcceptance('Acceptance - Infinite Pagination Local', {
  beforeEach() {
    server = pretenderServer();
  },
  afterEach() {
    server.shutdown();
  }
});

runTests(todosTestLocal);

moduleForAcceptance('Acceptance - Infinite Pagination Remote', {
  beforeEach() {
    server = pretenderServer();
  },
  afterEach() {
    server.shutdown();
  }
});
runTests(todosTestRemote);

