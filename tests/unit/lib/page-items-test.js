import { run } from '@ember/runloop';
import { test } from 'qunit';
import PageItems from 'ember-cli-pagination/lib/page-items';

var paramTest = function (name, ops, f) {
  test(name, function (assert) {
    assert.expect(1);
    var subject = null;

    run(function () {
      subject = PageItems.create(ops);
    });

    f(subject, assert);
  });
};

paramTest('smoke', { currentPage: 2, totalPages: 4 }, function (s, assert) {
  assert.expect(3);
  assert.strictEqual(s.get('pageItems').length, 4);
  assert.deepEqual(s.get('pageItems')[0], {
    page: 1,
    current: false,
    dots: false,
  });
  assert.deepEqual(s.get('pageItems')[1], {
    page: 2,
    current: true,
    dots: false,
  });
});

paramTest(
  'truncated',
  { currentPage: 15, totalPages: 50, truncatePages: true, numPagesToShow: 10 },
  function (s, assert) {
    assert.expect(2);
    assert.strictEqual(s.get('pageItems').length, 10);
    assert.deepEqual(s.get('pageItems')[0], {
      page: 10,
      current: false,
      dots: false,
    });
  }
);

paramTest(
  'dots',
  {
    currentPage: 15,
    totalPages: 50,
    truncatePages: true,
    numPagesToShow: 10,
    showFL: true,
  },
  function (s, assert) {
    assert.expect(3);
    assert.strictEqual(s.get('pageItems').length, 12);
    assert.deepEqual(s.get('pageItems')[0], {
      page: 1,
      current: false,
      dots: false,
    });
    assert.deepEqual(s.get('pageItems')[1], {
      page: 10,
      current: false,
      dots: true,
    });
  }
);
