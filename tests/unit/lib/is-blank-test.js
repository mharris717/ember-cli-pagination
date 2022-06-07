import { test } from 'qunit';
import Util from 'ember-cli-pagination/util';

// module("TruncatePages");

test('normal values', function (assert) {
  assert.expect(2);
  function isPresent(val) {
    assert.false(Util.isBlank(val));
  }

  function isBlank(val) {
    assert.true(Util.isBlank(val));
  }

  isPresent(1);
  isPresent(5);
  isPresent('abc');
  isPresent(0);

  isBlank('');
  isBlank(null);
  isBlank(undefined);
});
