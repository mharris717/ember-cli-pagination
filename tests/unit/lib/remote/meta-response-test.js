import Ember from 'ember';
import { test, moduleFor } from 'ember-qunit';
import { ChangeMeta } from 'ember-cli-pagination/remote/mapping';
import Validate from 'ember-cli-pagination/validate';

//moduleFor("sup 123");

test("smoke", function(assert) {
  var meta = {total_pages: 4};
  var s = ChangeMeta.create({meta: meta});
  var newMeta = s.make();
  assert.deepEqual(newMeta,meta);
});

test("mapped total_pages", function(assert) {
  var meta = {num_pages: 4};
  var paramMapping = {total_pages: "num_pages"};
  var s = ChangeMeta.create({meta: meta, paramMapping: paramMapping});

  var newMeta = s.make();
  assert.deepEqual(newMeta,{total_pages: 4});
});

test("no total_pages causes error", function(assert) {
  var meta = {a: 4};
  var s = ChangeMeta.create({meta: meta});

  s.make();
  assert.equal(Validate.getLastInternalError(),"no total_pages in meta response");
});
