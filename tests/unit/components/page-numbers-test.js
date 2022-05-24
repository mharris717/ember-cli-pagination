import { A } from '@ember/array';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import PagedArray from 'ember-cli-pagination/local/paged-array';
import { findAll, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('page-numbers', function (hooks) {
  //setupTest(hooks);
  setupRenderingTest(hooks);

  var renderTest = function (name, ops, f) {
    test(name, async function (assert) {
      this.set('content', ops.content);

      await render(hbs`{{component 'page-numbers' content=content}}`);

      await f.call(this, assert, ops);
    });
  };

  var paramTest = function (name, ops, f) {
    test(name, function (assert) {
      var subject = this.owner.factoryFor('component:page-numbers').create();

      run(function () {
        Object.keys(ops).forEach(function (key) {
          var value = ops[key];
          subject.set(key, value);
        });
      });

      f.call(this, subject, assert, ops);
    });
  };

  test('hasPages', function (assert) {
    assert.expect(2);
    var s = this.owner.factoryFor('component:page-numbers').create();

    run(function () {
      s.set('content', { totalPages: 1 });
    });
    assert.false(s.get('hasPages'));

    run(function () {
      s.set('content', { totalPages: 2 });
    });
    assert.true(s.get('hasPages'));
  });

  test('canStepBackward', function (assert) {
    var s = this.owner.factoryFor('component:page-numbers').create();
    run(function () {
      s.set('content', { page: 1 });
    });
    assert.false(s.get('canStepBackward'));
  });

  paramTest(
    'first page',
    { content: { page: 1, totalPages: 10 } },
    function (s, assert) {
      assert.equal(s.get('canStepBackward'), false);
      assert.equal(s.get('canStepForward'), true);
    }
  );

  paramTest(
    'last page page',
    { content: { page: 10, totalPages: 10 } },
    function (s, assert) {
      assert.equal(s.get('canStepBackward'), true);
      assert.equal(s.get('canStepForward'), false);
    }
  );

  paramTest(
    'middle page',
    { content: { page: 5, totalPages: 10 } },
    function (s, assert) {
      assert.equal(s.get('canStepBackward'), true);
      assert.equal(s.get('canStepForward'), true);
    }
  );

  paramTest(
    'only one page',
    { content: { page: 1, totalPages: 1 } },
    function (s, assert) {
      assert.equal(s.get('canStepBackward'), false);
      assert.equal(s.get('canStepForward'), false);
    }
  );

  var makePagedArray = function (list) {
    list = A(list);

    return PagedArray.create({ content: list, perPage: 2, page: 1 });
  };

  paramTest(
    'create with content',
    { content: makePagedArray([1, 2, 3, 4, 5]) },
    function (s, assert, ops) {
      assert.equal(s.get('totalPages'), 3);
      assert.equal(ops.content.get('totalPages'), 3);
    }
  );

  paramTest(
    'create with content - changing array.content changes component',
    { content: makePagedArray([1, 2, 3, 4, 5]) },
    function (s, assert, ops) {
      assert.equal(s.get('totalPages'), 3);
      run(function () {
        ops.content.content.pushObjects([6, 7]);
      });
      assert.equal(s.get('totalPages'), 4);
    }
  );

  paramTest(
    'create with content - changing page changes content value',
    { content: makePagedArray([1, 2, 3, 4, 5]) },
    function (s, assert, ops) {
      assert.equal(s.get('totalPages'), 3);
      run(function () {
        ops.content.set('page', 2);
      });
      assert.equal(s.get('currentPage'), 2);
    }
  );

  renderTest(
    'template smoke',
    { content: makePagedArray([1, 2, 3, 4, 5]) },
    function (assert) {
      assert.dom('.page-number').exists({ count: 3 });
      assert.dom('.prev.disabled').exists({ count: 1 });
      assert.dom('.next.enabled-arrow').exists({ count: 1 });
    }
  );

  renderTest(
    'arrows and pages in right order',
    { content: makePagedArray([1, 2, 3, 4, 5]) },
    function (assert) {
      var pageItems = findAll('ul.pagination li');
      assert.equal(pageItems.length, 5);

      assert.dom(pageItems[0]).hasClass('prev');
      assert.dom(pageItems[1]).hasText(1);
      assert.dom(pageItems[2]).hasText(2);
      assert.dom(pageItems[3]).hasText(3);
      assert.dom(pageItems[4]).hasClass('next');
    }
  );

  paramTest(
    'truncation',
    { content: { page: 2, totalPages: 10 }, numPagesToShow: 5 },
    function (s, assert) {
      var pages = s.get('pageItems').map(function (obj) {
        return obj.page;
      });

      assert.deepEqual(pages, [1, 2, 3, 4, 5]);
    }
  );

  paramTest(
    'truncation with showFL = true',
    { content: { page: 2, totalPages: 10 }, numPagesToShow: 5, showFL: true },
    function (s, assert) {
      var pages = s.get('pageItems').map(function (obj) {
        return obj.page;
      });

      assert.deepEqual(pages, [1, 2, 3, 4, 5, 6, 10]);
    }
  );

  paramTest(
    'pageClicked sends default event',
    { content: makePagedArray([1, 2, 3, 4, 5]) },
    function (s, assert) {
      var actionCounter = 0;
      var clickedPage = null;
      var containingObject = {
        doThing: function (n) {
          actionCounter++;
          clickedPage = n;
        },
      };
      s.set('action', (arg) => containingObject.doThing(arg));
      run(function () {
        s.send('pageClicked', 2);
      });
      assert.equal(s.get('currentPage'), 2);
      assert.equal(actionCounter, 1, 'works with function/action');
      assert.equal(clickedPage, 2, 'works with function/action');
    }
  );

  paramTest(
    'incrementPage sends default event',
    { content: makePagedArray([1, 2, 3, 4, 5]) },
    function (s, assert) {
      var actionCounter = 0;
      var clickedPage = null;
      var containingObject = {
        doThing: function (n) {
          actionCounter++;
          clickedPage = n;
        },
      };

      s.set('targetObject', containingObject);
      s.set('action', (arg) => containingObject.doThing(arg));
      assert.equal(s.get('totalPages'), 3);
      run(function () {
        s.send('incrementPage', 1);
      });
      assert.equal(s.get('currentPage'), 2);
      assert.equal(actionCounter, 1);
      assert.equal(clickedPage, 2);
    }
  );

  paramTest(
    'invalid incrementPage does not send default event',
    { content: makePagedArray([1, 2, 3, 4, 5]) },
    function (s, assert) {
      var actionCounter = 0;
      var containingObject = {
        doThing() {
          actionCounter++;
        },
      };

      s.set('action', () => containingObject.doThing());
      run(function () {
        s.send('incrementPage', -1);
      });
      assert.equal(s.get('currentPage'), 1);
      assert.equal(actionCounter, 0);
    }
  );

  paramTest(
    'invalid page send invalidPage component action',
    { content: makePagedArray([1, 2, 3, 4, 5]) },
    function (s, assert) {
      var actionCounter = 0;
      var pageEvent = null;
      var containingObject = {
        doThing: function (n) {
          actionCounter++;
          pageEvent = n;
        },
      };

      s.set('invalidPageAction', (arg) => containingObject.doThing(arg));
      run(function () {
        s.get('content').set('page', 99);
      });
      assert.equal(pageEvent && pageEvent.page, 99);
      assert.equal(actionCounter, 1);
      assert.equal(s.get('totalPages'), 3);
    }
  );
  /*
   */
});
