import Ember from 'ember';
import Mapping from 'ember-cli-pagination/remote/mapping';
import Validate from 'ember-cli-pagination/validate';

var ChangeMeta = Mapping.ChangeMeta;

module("change-meta");

test("smoke", function() {
  var meta = {total_pages: 4};
  var s = ChangeMeta.create({meta: meta});
  var newMeta = s.make();
  deepEqual(newMeta,meta);
});

test("mapped total_pages", function() {
  var meta = {num_pages: 4};
  var paramMapping = {total_pages: "num_pages"};
  var s = ChangeMeta.create({meta: meta, paramMapping: paramMapping});

  var newMeta = s.make();
  deepEqual(newMeta,{total_pages: 4});
});

test("no total_pages causes error", function() {
  var meta = {a: 4};
  var s = ChangeMeta.create({meta: meta});

  s.make();
  equal(Validate.getLastInternalError(),"no total_pages in meta response");
});
