import Ember from 'ember';
import { test } from 'ember-qunit';
import Util from 'ember-cli-pagination/util';

// module("TruncatePages");

test("normal values", function(assert) {
  function isPresent(val) {
    assert.equal(Util.isBlank(val),false);
  }

  function isBlank(val) {
    assert.equal(Util.isBlank(val),true);
  }

  isPresent(1);
  isPresent(5);
  isPresent("abc");
  isPresent(0);

  isBlank("");
  isBlank(null);
  isBlank(undefined);
});