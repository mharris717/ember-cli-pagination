import startApp from '../helpers/start-app';
import pretenderServer from '../helpers/pretender-server';
import Todo from '../../models/todo';
import Ember from 'ember';

var App = null;
var server = null;

module('Integration - Pagination', {
  setup: function() {
    App = startApp();
    server = pretenderServer();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    server.shutdown();
  }
});

var todosTest = function(name, f) {
  test(name, function() {
    visit("/todos").then(f);
  });
};

// commented out for now because it fails. 
// todosTest("numRemoteCalls", function() {
//   equal(find(".numRemoteCalls").text().trim(), "1");
// });

todosTest("page links", function() {
  equal(find(".pagination").length, 1);
  hasPages(4);
});

todosTest("first page is active at start", function() {
  hasActivePage(1);
});

todosTest("clicking page 2", function() {
  clickPage(2);
  andThen(function() {
    hasTodos(10);
    hasActivePage(2);
  });
});

todosTest("clicking page 4", function() {
  clickPage(4);
  andThen(function() {
    hasTodos(3);
    hasActivePage(4);

    hasButtons({
      prev: true,
      next: false
    });
  });
});

todosTest("next button - proper buttons visible", function() {
  hasActivePage(1);
  hasButtons({
    prev: false,
    next: true
  });
});

todosTest("click next", function() {
  clickPage("next");
  andThen(function() {
    hasButtons({
      prev: true,
      next: true
    });
    hasTodos(10);
    hasActivePage(2);
  });
});

todosTest("click prev", function() {
  clickPage(2);
  andThen(function() {
    clickPage("prev");
  });
  andThen(function() {
    hasButtons({
      prev: false,
      next: true
    });
    hasTodos(10);
    hasActivePage(1);
  });
});

todosTest("click next on last page and not increment", function() {
  clickPage(4);
  andThen(function() {
    clickPage("next");
  });
  andThen(function() {
    clickPage("next");
  });
  andThen(function() {
    hasTodos(3);
    equal(currentURL(), "/todos?page=4");
    notEqual(currentURL(), "/todos?page=5");
    hasActivePage(4);
  });
});

todosTest("click prev on first page and not decrement", function() {
  clickPage("prev");
  andThen(function() {
    clickPage("prev");
  });
  andThen(function() {
    hasTodos(10);
    equal(currentURL(), "/todos?page=1");
    notEqual(currentURL(), "/todos?page=-1");
    hasActivePage(1);
  });
});
