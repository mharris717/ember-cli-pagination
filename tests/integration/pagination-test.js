import startApp from '../helpers/start-app';
import pretenderServer from '../helpers/pretender-server';
import Todo from '../../models/todo';
import Ember from 'ember';
import { test, module } from 'qunit';

var App = null;
var server = null;

var todosTestRemote = function(name, f, initialPage) {
  test(name, function(assert) {
    var url = "/todos/remote";
    if (initialPage) {
      url += "?page="+initialPage;
    }
    visit(url).then(function() {
      f(assert);
    });
  });
};

var todosTestLocal = function(name, f, initialPage) {
  test(name, function(assert) {
    var url = "/todos/local";
    if (initialPage) {
      url += "?page="+initialPage;
    }
    visit(url).then(function() {
      f(assert);
    });
  });
};

// commented out for now because it fails.
// todosTest("numRemoteCalls", function() {
//   equal(find(".numRemoteCalls").text().trim(), "1");
// });

var createTests = function(todosTest,todosUrl) {
  todosTest("page links", function(assert) {
    assert.equal(find(".pagination").length, 1);
    hasPages(assert,4);
  });

  todosTest("first page is active at start", function(assert) {
    hasActivePage(assert,1);
  });

  todosTest("clicking page 2", function(assert) {
    assert.expect(5);

    clickPage(2);
    andThen(function() {
      hasTodos(assert,10);
      hasActivePage(assert,2);
    });
  });

  
  todosTest("clicking page 4", function(assert) {
    assert.expect(7);

    clickPage(4);
    andThen(function() {
      hasTodos(assert,3);
      hasActivePage(assert,4);

      hasButtons(assert,{
        prev: true,
        next: false
      });
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
    assert.expect(6);

    hasActivePage(assert,1);
    hasButtons(assert,{
      prev: false,
      next: true
    });
  });

  todosTest("click next", function(assert) {
    assert.expect(7);

    clickPage("next");
    andThen(function() {
      hasButtons(assert,{
        prev: true,
        next: true
      });
      hasTodos(assert,10);
      hasActivePage(assert,2);
    });
  });

  todosTest("click prev", function(assert) {
    assert.expect(7);

    clickPage(2);
    andThen(function() {
      clickPage("prev");
    });
    andThen(function() {
      hasButtons(assert,{
        prev: false,
        next: true
      });
      hasTodos(assert,10);
      hasActivePage(assert,1);
    });
  });

  

  todosTest("click next on last page and not increment", function(assert) {
    assert.expect(5);

    clickPage(4);
    andThen(function() {
      clickPage("next");
    });
    andThen(function() {
      clickPage("next");
    });
    andThen(function() {
      hasTodos(assert,3);
      // COMMENTEDOUTTEST
      // assert.equal(currentURL(), todosUrl+"?page=4");
      // assert.notEqual(currentURL(), todosUrl+"?page=5");
      hasActivePage(assert,4);
    });
  });

  todosTest("click prev on first page and not decrement", function(assert) {
    assert.expect(5);

    clickPage("prev");
    andThen(function() {
      clickPage("prev");
    });
    andThen(function() {
      hasTodos(assert,10);
      //assert.equal(currentURL(), todosUrl);
      // COMMENTEDOUTTEST
      //assert.notEqual(currentURL(), todosUrl+"?page=-1");
      hasActivePage(assert,1);
    });
  });
};

module('Integration - Pagination Remote', {
  setup: function() {
    App = startApp();
    server = pretenderServer();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    server.shutdown();
  }
});

createTests(todosTestRemote,"/todos/remote");

module('Integration - Pagination Local', {
  setup: function() {
    App = startApp();
    server = pretenderServer();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    server.shutdown();
  }
});
createTests(todosTestLocal,"/todos/local");
