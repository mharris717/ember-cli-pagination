/* global hasPages, hasTodo, clickPage */
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import pretenderServer from '../helpers/pretender-server';
import Ember from 'ember';

let server = null;

moduleForAcceptance('Acceptance | Pagination Remote Sorted', {
  beforeEach() {
    server = pretenderServer();
  },
  afterEach() {
    server.shutdown();
  }
});

// the sortByField and page params allow you to pass in starting values
// that will be query params on the url when page is first visited
let todosTest = function(name, f, sortByField, page) {
  test(name, function(assert) {
    var url = "/todos/remote-sorted";
    if (sortByField) {
      url += "?sortByField="+sortByField;
    }
    if (page) {
      var c = sortByField ? "&" : "?";
      url += c+"page="+page;
    }
    visit(url).then(function() {
      f(assert);
    });
  });
};

todosTest("smoke", function(assert) {
  assert.equal(find(".pagination").length, 1);
  hasPages(assert,4);
  hasTodo(assert,0,"Clean Gutters 0");
  hasTodo(assert,1,"Make Dinner 0");
});

todosTest("page 2 respects sort", function(assert) {
  hasTodo(assert,0,"Clean Gutters 9");
},"name",2);

todosTest("change page respects sort", function(assert) {
  hasTodo(assert,0,"Clean Gutters 0");
  clickPage("next");
  andThen(function() {
    hasTodo(assert,0,"Clean Gutters 9");
    hasTodo(assert,1,"Make Dinner 0");
  });
},"name");

todosTest("smoke sorted", function(assert) {
  assert.equal(find(".pagination").length, 1);
  hasPages(assert,4);

  hasTodo(assert,0,"Clean Gutters 0");
  hasTodo(assert,1,"Clean Gutters 1");

  assert.equal(find("#sortByField input").val(),"name");
},"name");

todosTest("change to sorted", function(assert) {
  assert.equal(find(".pagination").length, 1);
  hasPages(assert,4);
  hasTodo(assert,0,"Clean Gutters 0");
  hasTodo(assert,1,"Make Dinner 0");

  Ember.run(function() {
    fillIn("#sortByField input","name");
  });
  andThen(function() {
    hasTodo(assert,1,"Clean Gutters 1");
  });
});
