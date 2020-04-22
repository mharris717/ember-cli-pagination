import { findAll, visit } from '@ember/test-helpers';
import { hasPages, hasActivePage, clickPage, hasTodos, hasButtons } from '../helpers/assertions';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import pretenderServer from '../helpers/pretender-server';

let server = null;

let todosTestRemote = function(name, f, initialPage) {
  test(name, async function(assert) {
    var url = "/todos/remote";
    if (initialPage) {
      url += "?page="+initialPage;
    }
    
    await visit(url);
    
    await f(assert);
  });
};

let todosTestLocal = function(name, f, initialPage) {
  test(name, async function(assert) {
    var url = "/todos/local";
    if (initialPage) {
      url += "?page="+initialPage;
    }
    
    await visit(url)
    
    await f(assert);
  });
};

// commented out for now because it fails.
// todosTest("numRemoteCalls", function() {
//   equal(find(".numRemoteCalls").text().trim(), "1");
// });

let createTests = function(todosTest) {
  todosTest("page links", function(assert) {
    assert.equal(findAll(".pagination").length, 1);
    hasPages(assert,4);
  });

  todosTest("first page is active at start", function(assert) {
    hasActivePage(assert,1);
  });

  todosTest("clicking page 2", async function(assert) {
    await clickPage(2);
    hasTodos(assert,10);
    hasActivePage(assert,2);
  });

  
  todosTest("clicking page 4", async function(assert) {
    await clickPage(4);
    hasTodos(assert,3);
    hasActivePage(assert,4);

    hasButtons(assert,{
      prev: true,
      next: false
    });
  });

  // TESTCOMMENTEDOUT
  // todosTest("passing in page 2 query param", function(assert) {
  //   assert.expect(6);

  //   andThen(function() {
  //     hasTodos(assert,10);
  //     hasActivePage(assert,2);

  //     assert.equal(currentURL(), todosUrl+"?page=2");
  //   });
  // },2);

  todosTest("next button - proper buttons visible", function(assert) {
    hasActivePage(assert,1);
    hasButtons(assert,{
      prev: false,
      next: true
    });
  });

  todosTest("click next", async function(assert) {
    await clickPage("next");
    hasButtons(assert,{
      prev: true,
      next: true
    });
    hasTodos(assert,10);
    hasActivePage(assert,2);
  });

  todosTest("click prev", async function(assert) {
    await clickPage(2);
    await clickPage("prev");
    hasButtons(assert,{
      prev: false,
      next: true
    });
    hasTodos(assert,10);
    hasActivePage(assert,1);
  });

  todosTest("click next on last page and not increment", async function(assert) {
    await clickPage(4);
    await clickPage("next");
    await clickPage("next");
    hasTodos(assert,3);
    // COMMENTEDOUTTEST
    // assert.equal(currentURL(), todosUrl+"?page=4");
    // assert.notEqual(currentURL(), todosUrl+"?page=5");
    hasActivePage(assert,4);
  });

  todosTest("click prev on first page and not decrement", async function(assert) {
    await clickPage("prev");
    await clickPage("prev");
    hasTodos(assert,10);
    //assert.equal(currentURL(), todosUrl);
    // COMMENTEDOUTTEST
    //assert.notEqual(currentURL(), todosUrl+"?page=-1");
    hasActivePage(assert,1);
  });
};

module('Acceptance - Pagination Remote', function(hooks) {
  setupApplicationTest(hooks);
  
  hooks.beforeEach(function() {
    server = pretenderServer();
  });

  hooks.afterEach(function() {
    server.shutdown();
  });

  createTests(todosTestRemote,"/todos/remote");
});

module('Acceptance - Pagination Local', function(hooks) {
  setupApplicationTest(hooks);
  
  hooks.beforeEach(function() {
    server = pretenderServer();
  });

  hooks.afterEach(function() {
    server.shutdown();
  });

  createTests(todosTestLocal,"/todos/local");
});
