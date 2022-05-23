import { fillIn, find, findAll, visit } from '@ember/test-helpers';
import { hasPages, hasTodo, clickPage } from '../helpers/assertions';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import pretenderServer from '../helpers/pretender-server';

let server = null;

module('Acceptance | Pagination Remote Sorted', function(hooks) {
  setupApplicationTest(hooks);
  
  hooks.beforeEach(function() {
    server = pretenderServer();
  });

  hooks.afterEach(function() {
    server.shutdown();
  });

  // the sortByField and page params allow you to pass in starting values
  // that will be query params on the url when page is first visited
  let todosTest = function(name, f, sortByField, page) {
    test(name, async function(assert) {
      var url = "/todos/remote-sorted";
      if (sortByField) {
        url += "?sortByField="+sortByField;
      }
      if (page) {
        var c = sortByField ? "&" : "?";
        url += c+"page="+page;
      }
      
      await visit(url);
      await f(assert);
    });
  };

  todosTest("smoke", function(assert) {
    assert.dom(".pagination").exists({ count: 1 });
    hasPages(assert,4);
    hasTodo(assert,0,"Clean Gutters 0");
    hasTodo(assert,1,"Make Dinner 0");
  });

  todosTest("page 2 respects sort", function(assert) {
    hasTodo(assert,0,"Clean Gutters 9");
  },"name",2);

  todosTest("change page respects sort", async function(assert) {
    hasTodo(assert,0,"Clean Gutters 0");
    await clickPage("next");
    hasTodo(assert,0,"Clean Gutters 9");
    hasTodo(assert,1,"Make Dinner 0");
  },"name");

  todosTest("smoke sorted", function(assert) {
    assert.dom(".pagination").exists({ count: 1 });
    hasPages(assert,4);

    hasTodo(assert,0,"Clean Gutters 0");
    hasTodo(assert,1,"Clean Gutters 1");

    assert.dom("#sortByField input").hasValue("name");
  },"name");

  todosTest("change to sorted", async function(assert) {
    assert.dom(".pagination").exists({ count: 1 });
    hasPages(assert,4);
    hasTodo(assert,0,"Clean Gutters 0");
    hasTodo(assert,1,"Make Dinner 0");

    await fillIn("#sortByField input","name");
    
    hasTodo(assert,1,"Clean Gutters 1");
  });
});
