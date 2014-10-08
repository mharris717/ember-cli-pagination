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

Ember.Test.registerAsyncHelper('hasActivePage', function(app, num, context) {
  var i = 0;
  findWithAssert(".pagination li.page-number", context).each(function() {
    var li = $(this);
    var active = num - 1 === i;
    equal(li.hasClass('active'), active, "Has active page");
    i += 1;
  });
});

var hasButtons = function(ops) {
  for (var name in ops) {
    var present = ops[name];

    if(present) {
      equal(find(".pagination ." + name + ".enabled-arrow").length, 1);
    } else {
      equal(find(".pagination ." + name + ".disabled").length, 1);
    }
  }
};

var hasTodos = function(l) {
  equal(find("table tr.todo").length, l);
};

var hasPages = function(l) {
  equal(find(".pagination li.page-number").length, l);
};

var clickPage = function(i) {
  if (i === "prev" || i === "next") {
    click(".pagination ." + i + " a");
  } else {
    click(".pagination li.page-number:eq(" + (i - 1) + ") a");
  }
};

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
