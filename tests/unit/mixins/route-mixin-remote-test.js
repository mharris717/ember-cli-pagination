import Ember from 'ember';
import { test } from 'ember-qunit';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';
import Util from 'ember-cli-pagination/util';
import toArray from '../../helpers/to-array';
import equalArray from '../../helpers/equal-array';
import MockStore from '../../helpers/mock-store';

module("Remote Route Mixin");

var Promise = Ember.RSVP.Promise;

test("thing", function() {
  var store = MockStore.create();

  var Something = Ember.Object.extend(RouteMixin, {});
  var something = Something.create({store: store});

  something.findPaged("todo",{name: "Adam"});
  var findArgs = store.get('findArgs');

  console.debug(findArgs);
  equal(findArgs.length,1);
  equal(findArgs[0].modelName,"todo");
  equal(findArgs[0].params.name,"Adam");
});